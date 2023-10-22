import { RootProjectSchema } from './configFiles/project';

export const validateRenativeProjectSchema = (inputJson: unknown) => {
    return RootProjectSchema.safeParse(inputJson);
};
