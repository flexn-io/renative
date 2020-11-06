import { FileUtils } from 'rnv';
import path from 'path';
import fs from 'fs';

export const updateMdFilesPlatforms = async (c) => {
    const docsPath = path.join(c.paths.project.dir, '../../docs/platforms');

    fs.readdirSync(docsPath).forEach((dir) => {
        const docFilePath = path.join(docsPath, dir);
        if (!dir.startsWith('overview')) {
            const platform = dir.replace('.md', '');
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

const _getExtensionContent = () => {
    const out = 'Extenstions are defined via engines';


    return out;
};
