import { zodRootProjectSchema } from './configFiles/project';

export const validateRenativeProjectSchema = (inputJson: unknown) => {
    return zodRootProjectSchema.safeParse(inputJson);
};
