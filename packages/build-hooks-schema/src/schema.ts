import {
    zodRootAppSchema,
    zodRootEngineSchema,
    zodRootLocalSchema,
    zodRootPluginSchema,
    zodRootPrivateSchema,
    zodRootProjectSchema,
    zodRootTemplateSchema,
    zodRootTemplatesSchema,
    zodRootWorkspaceSchema,
    getContext,
    logSuccess,
    zodRootIntegrationSchema,
} from '@rnv/core';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export const generateSchema = async () => {
    _generateSchemaFile({ schema: zodRootProjectSchema, schemaId: 'rnv.project' });
    _generateSchemaFile({ schema: zodRootAppSchema, schemaId: 'rnv.app' });
    _generateSchemaFile({ schema: zodRootLocalSchema, schemaId: 'rnv.local' });
    _generateSchemaFile({ schema: zodRootEngineSchema, schemaId: 'rnv.engine' });
    _generateSchemaFile({ schema: zodRootWorkspaceSchema, schemaId: 'rnv.workspace' });
    _generateSchemaFile({ schema: zodRootTemplateSchema, schemaId: 'rnv.template' });
    _generateSchemaFile({ schema: zodRootPrivateSchema, schemaId: 'rnv.private' });
    _generateSchemaFile({ schema: zodRootPluginSchema, schemaId: 'rnv.plugin' });
    _generateSchemaFile({ schema: zodRootTemplatesSchema, schemaId: 'rnv.templates' });
    _generateSchemaFile({ schema: zodRootIntegrationSchema, schemaId: 'rnv.integration' });

    logSuccess('Sucessfully exported renative.project.json schema');
};

const _generateSchemaFile = (opts: { schema: z.ZodObject<any>; schemaId: string }) => {
    const { schema, schemaId } = opts;
    const ctx = getContext();
    const jsonSchema: any = zodToJsonSchema(schema, schemaId);
    jsonSchema['$schema'] = 'http://json-schema.org/draft-04/schema#';

    jsonSchema.definitions[schemaId].properties['$schema'] = {
        type: 'string',
        description: 'schema definition',
    };

    const destFolder = path.join(ctx.paths.project.dir, `packages/core/jsonSchema`);
    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
    }
    const destPath = path.join(destFolder, `${schemaId}.json`);
    fs.writeFileSync(destPath, JSON.stringify(jsonSchema, null, 2));

    const destFolder2 = path.join(ctx.paths.project.dir, `.rnv/schema`);
    if (!fs.existsSync(destFolder2)) {
        fs.mkdirSync(destFolder2, { recursive: true });
    }
    const destPath2 = path.join(destFolder2, `${schemaId}.json`);

    fs.writeFileSync(destPath2, JSON.stringify(jsonSchema, null, 2));
};
