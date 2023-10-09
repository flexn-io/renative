import { RootProjectSchema } from './configRootProject';

export const validateRenativeProjectSchema = (inputJson: any) => {
    return RootProjectSchema.safeParse(inputJson);
};
