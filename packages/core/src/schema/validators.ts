import { zodConfigFileProject } from './configFiles/project';

export const validateRenativeProjectSchema = (inputJson: unknown) => {
    return zodConfigFileProject.safeParse(inputJson);
};
