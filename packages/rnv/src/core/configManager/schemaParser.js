import Ajv from 'ajv';
import { SCHEMAS, schemaRoot } from './configSchema';


const ajv = new Ajv({ schemas: SCHEMAS, allErrors: true, allowUnionTypes: true });

ajv.addKeyword('docs', {
    // type: 'object',
    // compile() {
    //     return true;
    // }
});


export const validateSchema = (cObj) => {
    const valid = ajv.validate(schemaRoot, cObj);
    return [valid, ajv];
};
