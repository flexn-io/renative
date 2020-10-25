import Ajv from 'ajv';
import { SCHEMAS_RENATIVE_JSON } from './schemaRenativeJson';
import { SCHEMAS_RUNTIME_OBJECT } from './schemaRuntimeObject';


const ajvRenativeJson = new Ajv({ schemas: SCHEMAS_RENATIVE_JSON, allErrors: true, allowUnionTypes: true });
const ajvRuntimeObject = new Ajv({ schemas: SCHEMAS_RUNTIME_OBJECT, allErrors: true, allowUnionTypes: true });

export const getRenativeJsonSchema = () => SCHEMAS_RENATIVE_JSON[0];
export const validateRenativeJsonSchema = (cObj) => {
    const valid = ajvRenativeJson.validate(SCHEMAS_RENATIVE_JSON[0], cObj);
    return [valid, ajvRenativeJson];
};

export const getRuntimeObjectSchema = () => SCHEMAS_RUNTIME_OBJECT[0];
export const validateRuntimeObjectSchema = (cObj) => {
    const valid = ajvRuntimeObject.validate(SCHEMAS_RUNTIME_OBJECT[0], cObj);
    return [valid, ajvRuntimeObject];
};
