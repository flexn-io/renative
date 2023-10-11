import { RnvContext, RootProjectSchema, logSuccess } from '@rnv/core';
import { zodToJsonSchema } from 'zod-to-json-schema';
import path from 'path';
import fs from 'fs';

export const generateSchema = async (c: RnvContext) => {
    const jsonSchema = zodToJsonSchema(RootProjectSchema, 'mySchema');
    jsonSchema['$schema'] = 'http://json-schema.org/draft-04/schema#';

    const destPath = path.join(c.paths.project.dir, '.rnv/schema/renative.project.json');
    fs.writeFileSync(destPath, JSON.stringify(jsonSchema, null, 2));

    logSuccess('Sucessfully exported renative.project.json schema');
};
