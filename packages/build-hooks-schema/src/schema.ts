import {
    RootAppSchema,
    RootEngineSchema,
    RootLocalSchema,
    RootPluginSchema,
    RootPrivateSchema,
    RootProjectSchema,
    RootTemplateSchema,
    RootTemplatesSchema,
    RootWorkspaceSchema,
    getContext,
    logSuccess,
    zodRootIntegrationSchema,
} from '@rnv/core';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export const generateSchema = async () => {
    _generateSchemaFile({ schema: RootProjectSchema, schemaId: 'rnv.project' });
    _generateSchemaFile({ schema: RootAppSchema, schemaId: 'rnv.app' });
    _generateSchemaFile({ schema: RootLocalSchema, schemaId: 'rnv.local' });
    _generateSchemaFile({ schema: RootEngineSchema, schemaId: 'rnv.engine' });
    _generateSchemaFile({ schema: RootWorkspaceSchema, schemaId: 'rnv.workspace' });
    _generateSchemaFile({ schema: RootTemplateSchema, schemaId: 'rnv.template' });
    _generateSchemaFile({ schema: RootPrivateSchema, schemaId: 'rnv.private' });
    _generateSchemaFile({ schema: RootPluginSchema, schemaId: 'rnv.plugin' });
    _generateSchemaFile({ schema: RootTemplatesSchema, schemaId: 'rnv.templates' });
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
