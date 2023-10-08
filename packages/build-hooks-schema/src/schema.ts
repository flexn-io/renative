import { RnvContext, getRenativeJsonSchema } from '@rnv/core';

import path from 'path';
import fs from 'fs';

export const generateSchema = async (c: RnvContext) => {
    const schema: Record<string, any> = getRenativeJsonSchema();
    schema['$schema'] = 'http://json-schema.org/draft-04/schema#';

    const destPath = path.join(c.paths.project.dir, 'packages/core/schemas/renative.json');

    fs.writeFileSync(destPath, JSON.stringify(schema, null, 2));
};
