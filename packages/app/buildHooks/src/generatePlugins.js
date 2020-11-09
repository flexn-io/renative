import { FileUtils, Constants } from 'rnv';
import path from 'path';

export const generatePlugins = async (c) => {
    let out = `---
id: overview
title: Plugins Overview
sidebar_label: Plugins Overview
---
`;
    const temps = FileUtils.readObjectSync(
        c.paths.rnv.pluginTemplates.config
    );
    const ptk = Object.keys(temps.pluginTemplates).sort();
    ptk.forEach((key) => {
        const plugin = temps.pluginTemplates[key];
        const npm = plugin.version
            ? `Npm: https://www.npmjs.com/package/${key}`
            : '';
        const version = plugin.version
            ? `Version: \`${plugin.version}\``
            : '';
        const platforms = Object.keys(plugin)
            .map(v => (Constants.SUPPORTED_PLATFORMS.includes(v) ? v : null))
            .filter(v => v);
        const supPlats = platforms.length
            ? platforms
            : Constants.SUPPORTED_PLATFORMS;
        const deprecated = plugin.deprecated
            ? `> ${plugin.deprecated}`
            : '';
        const props = plugin.props
            ? `Props: ${Object.keys(plugin.props).map(v => `\`${v}\``)}`
            : '';

        out += `\n\n## ${key}
${deprecated}

${version}

Platforms: ${supPlats.map(v => `\`${v}\``)}

${props}

${npm}

Installation:

\`\`\`
rnv plugin add ${key}
\`\`\`
`;
    });

    FileUtils.writeFileSync(
        path.join(c.paths.project.dir, '../../docs/plugins/overview.md'),
        out
    );
};
