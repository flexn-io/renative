import { getContext, inquirerPrompt, isYarnInstalled, writeFileSync } from '@rnv/core';
import path from 'path';

const Question = async () => {
    if (isYarnInstalled()) return;
    const c = getContext();
    const content = 'legacy-peer-deps=true';

    const { confirmCreateNpmrc } = await inquirerPrompt({
        name: 'confirmCreateNpmrc',
        type: 'confirm',
        message: `To avoid the issue with the resolving peer dependencies .npmrc file with content: "${content}" will be added to your project`,
    });

    if (confirmCreateNpmrc) {
        const npmrcPath = path.join(c.paths.project.dir, '.npmrc');

        writeFileSync(npmrcPath, content);
    }
};

export default Question;
