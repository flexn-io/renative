import { RootProjectSchema } from './configFiles/project';

export const validateRenativeProjectSchema = (inputJson: any) => {
    return RootProjectSchema.safeParse(inputJson);
};
