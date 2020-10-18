import Ajv from 'ajv';
import { SCHEMAS_RENATIVE_JSON } from './schemaRenativeJson';
import { SCHEMAS_RUNTIME_OBJECT } from './schemaRuntimeObject';


const ajvRenativeJson = new Ajv({ schemas: SCHEMAS_RENATIVE_JSON, allErrors: true, allowUnionTypes: true });
const ajvRuntimeObject = new Ajv({ schemas: SCHEMAS_RUNTIME_OBJECT, allErrors: true, allowUnionTypes: true });

const getRootSchema = () => SCHEMAS_RENATIVE_JSON[0];

const getRuntimeObjectSchema = () => SCHEMAS_RUNTIME_OBJECT[0];

export const validateSchema = (cObj) => {
    const valid = ajvRenativeJson.validate(SCHEMAS_RENATIVE_JSON[0], cObj);
    return [valid, ajvRenativeJson];
};

export const validateRuntimeObjectSchema = (cObj) => {
    const valid = ajvRuntimeObject.validate(SCHEMAS_RUNTIME_OBJECT[0], cObj);
    return [valid, ajvRuntimeObject];
};

export default {
    validateSchema,
    validateRuntimeObjectSchema,
    getRootSchema,
    getRuntimeObjectSchema
};
