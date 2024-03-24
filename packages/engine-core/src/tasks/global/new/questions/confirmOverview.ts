import type { NewProjectData } from '../types';
import { generateProjectOverview } from '../projectGenerator';

const Question = async (data: NewProjectData) => {
    // const c = getContext();
    // const { ci } = c.program;
    generateProjectOverview(data);
    // if (!ci) {
    //     const { confirm } = await inquirerPrompt({
    //         type: 'confirm',
    //         name: 'confirm',
    //         message: `\n${data.confirmString}\nIs all this correct?`,
    //     });

    //     if (!confirm) {
    //         // TOOD: this should reset the whole process
    //         return;
    //     }
    // }
};

export default Question;
