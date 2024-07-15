import { chalk, getContext } from '@rnv/core';
import execa from 'execa';
import fs, { mkdirSync } from 'fs';
import os from 'os';
import path from 'path';

type GitLogItem = {
    hash: string;
    date: string;
    subjectLine: string;
    committerName: string;
    committerEmailName: string;
};

type Difference = {
    diff: string;
    diffStat: string;
    patch: string;
    ourGitLog: GitLogItem[];
    incGitLog: GitLogItem[];
};

type OverridePaths = { ourPath: string; incPath: string }[];

type Override = {
    pluginName: string;
    version?: string;
    paths: OverridePaths;
    ourPluginPath: string;
    incomingPluginPath: string;
    ourUsedVersion?: string;
} & (
    | { kind: 'matching' }
    | {
          kind: 'different';
          difference: Difference;
      }
    | {
          kind: 'new';
          difference: Difference;
          matchesOurVersions?: (string | undefined)[];
      }
);

const getKeyPress = (): Promise<string> => {
    return new Promise((resolve) => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once('data', (data) => {
            process.stdin.pause();
            process.stdin.setRawMode(false);
            resolve(data.toString());
        });
    });
};

const getGitLog = (paths: string[]): GitLogItem[] =>
    paths
        .flatMap((p) =>
            fs.existsSync(p)
                ? execa
                      .sync(
                          'git',
                          [
                              'log',
                              '--follow',
                              '--color=always',
                              '--pretty=tformat:%h\t%cs\t%cN\t%cL\t%s%d',
                              '--',
                              path.basename(p),
                          ],
                          { cwd: path.dirname(p), reject: false }
                      )
                      .stdout.split('\n')
                : []
        )
        .filter((l) => l)
        .map((l) => {
            const r = l.match(/(.*?)\t(.*?)\t(.*?)\t(.*?)\t(.*)/);
            if (!r || r.length < 6) throw new Error('Failed to parse git log');
            return { hash: r[1], date: r[2], committerName: r[3], committerEmailName: r[4], subjectLine: r[5] };
        })
        .filter((log, i, logs) => logs.findIndex((other) => other.hash === log.hash) === i)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

const formatGitLog = (items: GitLogItem[]) =>
    items
        .map(
            (l) =>
                `${chalk().gray(l.hash)} ${chalk().gray(l.date)} ${l.subjectLine}, ${
                    /[A-Z][0-9]{7}/.test(l.committerName) ? l.committerEmailName : l.committerName
                }`
        )
        .join('\n');

const getDifference = (paths: OverridePaths): Difference | undefined => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-diff'));
    const tmpOur = path.join(tmpDir, 'our');
    const tmpInc = path.join(tmpDir, 'inc');
    mkdirSync(tmpOur);
    mkdirSync(tmpInc);
    for (const { ourPath, incPath } of paths) {
        if (fs.existsSync(ourPath)) fs.cpSync(ourPath, path.join(tmpOur, path.basename(ourPath)), { recursive: true });
        if (fs.existsSync(incPath)) fs.cpSync(incPath, path.join(tmpInc, path.basename(incPath)), { recursive: true });
    }

    const patchOutput = execa.sync(
        'diff',
        [
            '--recursive',
            '--unified',
            '--new-file',
            '--ignore-space-change',
            '--text',
            path.basename(tmpOur),
            path.basename(tmpInc),
        ],
        { cwd: tmpDir, reject: false }
    );
    if (patchOutput.exitCode > 1) throw new Error(patchOutput.stderr);
    if (patchOutput.exitCode === 0) {
        fs.rmSync(tmpDir, { recursive: true });
        return;
    }

    const diffOutput = execa.sync(
        'diff',
        [
            '--recursive',
            '--unified',
            '--new-file',
            '--ignore-space-change',
            '--report-identical-files',
            '--color=always',
            path.basename(tmpOur),
            path.basename(tmpInc),
        ],
        { cwd: tmpDir, reject: false }
    );
    if (diffOutput.exitCode > 1) throw new Error(diffOutput.stderr);

    const diffStat = execa
        .sync(
            'git',
            [
                'diff',
                '--no-index',
                '--ignore-space-change',
                `--stat=${process.stdout.columns || 80}`,
                '--stat-graph-width=10',
                '--color=always',
                path.basename(tmpOur),
                path.basename(tmpInc),
            ],
            { cwd: tmpDir, reject: false }
        )
        .stdout.split('\n')
        .map((line, i, arr) => (i === arr.length - 1 ? chalk().gray(line.slice(1)) : line.slice(1)))
        .join('\n');

    fs.rmSync(tmpDir, { recursive: true });

    return {
        diff: diffOutput.stdout,
        patch: patchOutput.stdout,
        diffStat,
        ourGitLog: getGitLog(paths.map((p) => p.ourPath)),
        incGitLog: getGitLog(paths.map((p) => p.incPath)),
    };
};

const getOverrideVersions = (pluginPath: string) =>
    fs.existsSync(pluginPath)
        ? Array.from(new Set(fs.readdirSync(pluginPath).map((name) => name.match(/@(.*?)(?:\.json)?$/)?.[1])))
        : undefined;

const diffPluginOverrides = ({
    ourOverridesPath,
    incomingOverridesPath,
    pluginName,
}: {
    ourOverridesPath: string;
    incomingOverridesPath: string;
    pluginName: string;
}): Override[] => {
    const ourPluginPath = path.join(ourOverridesPath, pluginName);
    const incomingPluginPath = path.join(incomingOverridesPath, pluginName);
    const ourVersions = getOverrideVersions(ourPluginPath);
    const incomingVersions = getOverrideVersions(incomingPluginPath);

    const getOverridePaths = ({
        ourVersion,
        incomingVersion,
    }: {
        ourVersion?: string;
        incomingVersion?: string;
    }): OverridePaths => {
        const fns: ((p: string, v?: string) => string)[] = [
            (p, v) => path.join(p, v ? `overrides@${v}` : `overrides`),
            (p, v) => path.join(p, v ? `overrides@${v}.json` : `overrides.json`),
            (p, v) => path.join(p, v ? `builds@${v}` : `builds`),
        ];
        return fns.map((f) => ({
            ourPath: f(ourPluginPath, ourVersion),
            incPath: f(incomingPluginPath, incomingVersion),
        }));
    };

    return (
        incomingVersions?.map((incomingVersion) => {
            const paths = getOverridePaths({ ourVersion: incomingVersion, incomingVersion });
            const difference = getDifference(paths);
            const findMatchingVersions = () =>
                ourVersions?.filter((ourVersion) =>
                    getOverridePaths({ ourVersion, incomingVersion }).every(
                        ({ ourPath, incPath }) =>
                            (!fs.existsSync(ourPath) && !fs.existsSync(incPath)) ||
                            execa.sync(
                                'diff',
                                [
                                    '--recursive',
                                    '--unified',
                                    '--new-file',
                                    '--text',
                                    '--ignore-space-change',
                                    ourPath,
                                    incPath,
                                ],
                                { reject: false }
                            ).exitCode === 0
                    )
                );
            return {
                pluginName,
                incomingVersion,
                paths,
                ourPluginPath,
                incomingPluginPath,
                ourUsedVersion: getContext().files.scopedConfigTemplates['rnv']?.pluginTemplates?.[pluginName]?.version,
                ...(difference && !paths.some(({ ourPath }) => fs.existsSync(ourPath))
                    ? { kind: 'new', difference, matchesOurVersions: findMatchingVersions() }
                    : difference
                    ? { kind: 'different', difference }
                    : { kind: 'matching' }),
            };
        }) ?? []
    );
};

const getOverrideSummary = (ov: Override) => {
    let headline = `${ov.pluginName}${ov.version ? `@${ov.version}` : ''} ${ov.kind}`;
    if (ov.kind === 'new') {
        headline = chalk().bold.green(headline);
        if (ov.matchesOurVersions?.length) {
            headline = `${headline}, but same as our ${ov.matchesOurVersions
                .map((ourVersion) => (ourVersion ? `@${ourVersion}` : 'versionless'))
                .join(', ')}`;
        }
    } else if (ov.kind === 'different') {
        headline = chalk().bold.magenta(headline);
    } else if (ov.kind === 'matching') {
        headline = chalk().bold(headline);
    }
    const difference = ov.kind === 'matching' ? undefined : ov.difference;
    return [
        headline,
        difference?.diffStat,
        difference?.incGitLog.length && formatGitLog(difference.incGitLog),
        ov.kind !== 'matching' &&
            chalk().gray(
                ov.ourUsedVersion ? `We're using version ${ov.ourUsedVersion}` : 'We seem to not be using this'
            ),
        difference?.ourGitLog.length && formatGitLog(difference.ourGitLog),
    ]
        .filter((i) => i)
        .join('\n');
};

const showOverrideDiff = (ov: Override) => {
    if (ov.kind === 'matching') return;
    const tempPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rnv-plugins-script-')), 'pager');
    fs.writeFileSync(tempPath, `${getOverrideSummary(ov)}\n\n${ov.difference.diff ?? ''}`);
    execa.sync('less', ['--RAW-CONTROL-CHARS', '--clear-screen', tempPath], { stdio: 'inherit' });
    fs.unlinkSync(tempPath);
};

const promptPlugin = async (ov: Override) => {
    console.clear();
    if (ov.kind === 'matching') return;
    console.log(getOverrideSummary(ov));
    showOverrideDiff(ov);
    console.log();
    for (;;) {
        process.stdout.write('[a]ccept  [v]iew  [s]kip  [q]uit ');
        const key = await getKeyPress();
        if (key === 's') {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log('Skipped');
            return;
        } else if (key === 'a') {
            fs.mkdirSync(ov.ourPluginPath, { recursive: true });
            if (ov.kind === 'new' || ov.kind === 'different') {
                const tempPath = path.join(
                    fs.mkdtempSync(path.join(os.tmpdir(), 'rnv-plugins-script-')),
                    'plugin.patch'
                );
                fs.writeFileSync(tempPath, ov.difference.patch);
                execa.sync(
                    'patch',
                    ['--version-control', 'none', '--strip', '1', '--remove-empty-files', '--input', tempPath],
                    { cwd: ov.ourPluginPath }
                );
                fs.unlinkSync(tempPath);
            }
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log('Skipped');
            return;
        } else if (key === 'v') {
            showOverrideDiff(ov);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
        } else if (key === '\x03' || key === 'q') {
            console.log();
            process.exit(0);
        } else {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
        }
    }
};

export const comparePluginOverrides = async () => {
    process.stdout.write('This may take a few seconds...');
    const ourOverridesPath = process.argv[process.argv.length - 2];
    const incomingOverridesPath = process.argv[process.argv.length - 1];
    const overrides = fs
        .readdirSync(incomingOverridesPath)
        .filter((p) => fs.statSync(path.join(incomingOverridesPath, p)).isDirectory())
        .flatMap((dir) =>
            dir.startsWith('@')
                ? fs.readdirSync(path.join(incomingOverridesPath, dir)).map((subdir) => path.join(dir, subdir))
                : dir
        )
        .flatMap((pluginName) => diffPluginOverrides({ ourOverridesPath, incomingOverridesPath, pluginName }));

    const newButMatchingOtherCount =
        overrides.filter((d: Override) => d.kind === 'new' && d.matchesOurVersions?.length).length ?? 0;
    const countsSummary = [
        `${chalk().bold(`${overrides.filter((d) => d.kind === 'matching').length ?? 0} matching`)}`,
        `${chalk().bold.magenta(`${overrides.filter((d) => d.kind === 'different').length ?? 0} different`)}`,
        `${chalk().bold.green(`${overrides.filter((d) => d.kind === 'new').length ?? 0} new`)}${
            newButMatchingOtherCount ? ` (${newButMatchingOtherCount} of which match one of our other versions)` : ''
        }`,
    ].join(' | ');
    const overrideSummaries = overrides.map((o) => getOverrideSummary(o)).join('\n\n');
    const fullSummary = `${countsSummary}\n\n${overrideSummaries}\n`;
    const tempPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rnv-plugins-script-')), 'pager');
    fs.writeFileSync(tempPath, fullSummary);
    execa.sync('less', ['--RAW-CONTROL-CHARS', '--clear-screen', '--tilde', tempPath], { stdio: 'inherit' });
    fs.unlinkSync(tempPath);
    console.clear();
    console.log(fullSummary);

    for (;;) {
        process.stdout.write('[r]eview  [q]uit ');
        const key = await getKeyPress();
        if (key === 'r') {
            for (const ov of overrides) await promptPlugin(ov);
            process.exit(0);
        } else if (key === 'q' || key === '\x03') {
            console.log();
            process.exit(0);
        } else {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
        }
    }
};
