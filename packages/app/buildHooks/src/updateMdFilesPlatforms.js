import { FileUtils } from 'rnv';
import path from 'path';
import fs from 'fs';

export const updateMdFilesPlatforms = async (c) => {
    const docsPath = path.join(c.paths.project.dir, '../../docs');

    fs.readdirSync(docsPath).forEach((dir) => {
        const docFilePath = path.join(docsPath, dir);
        if (dir.startsWith('platform-')) {
            const platform = dir.replace('platform-', '').replace('.md', '');
            const extContent = _getExtensionContent(c, platform);

            const fileContent = fs.readFileSync(docFilePath).toString();

            const regEx = /<!--EXTENSION_SUPPORT_START-->([\s\S]*?)<!--EXTENSION_SUPPORT_END-->/g;
            const fixedFile = fileContent.replace(regEx, `<!--EXTENSION_SUPPORT_START-->

${extContent}
<!--EXTENSION_SUPPORT_END-->`);

            FileUtils.writeFileSync(
                docFilePath,
                fixedFile
            );
        }
    });

    return true;
};

const _getExtensionContent = (c, platform) => {
    let out = '';
    const p = c.runtime.enginePlatforms[platform]?.PLATFORMS[platform];
    if (p.sourceExts) {
        let i = 1;
        // out += `\n\n-------${platform}---------\n\n`;
        out += `| Extension | Type    | Priority  |
| --------- | --------- | :-------: |\n`;
        const factors = p.sourceExts.factors || [];
        const platforms = p.sourceExts.platforms || [];
        const fallbacks = p.sourceExts.fallbacks || [];
        // const merged = [...factors, ...platforms, ...fallbacks];
        factors.forEach((v) => {
            out += `| \`${v}\` | \`form factor\` | ${i} |\n`;
            i++;
        });
        platforms.forEach((v) => {
            out += `| \`${v}\` | \`platform\` | ${i} |\n`;
            i++;
        });
        fallbacks.forEach((v) => {
            out += `| \`${v}\` | \`fallback\` | ${i} |\n`;
            i++;
        });
    }

    return out;
};
