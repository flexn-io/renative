import {
    RootAppSchema,
    RootEngineSchema,
    RootGlobalSchema,
    RootIntegrationSchema,
    RootLocalSchema,
    RootPluginSchema,
    RootPluginsSchema,
    RootPrivateSchema,
    RootProjectSchema,
    RootTemplateSchema,
    RootTemplatesSchema,
    getContext,
    logSuccess,
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
    _generateSchemaFile({ schema: RootGlobalSchema, schemaId: 'rnv.global' });
    _generateSchemaFile({ schema: RootPluginsSchema, schemaId: 'rnv.plugins' });
    _generateSchemaFile({ schema: RootTemplateSchema, schemaId: 'rnv.template' });
    _generateSchemaFile({ schema: RootPrivateSchema, schemaId: 'rnv.private' });
    _generateSchemaFile({ schema: RootPluginSchema, schemaId: 'rnv.plugin' });
    _generateSchemaFile({ schema: RootTemplatesSchema, schemaId: 'rnv.templates' });
    _generateSchemaFile({ schema: RootIntegrationSchema, schemaId: 'rnv.integration' });

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

    const destPath = path.join(ctx.paths.project.dir, `packages/core/jsonSchema/${schemaId}.json`);
    fs.writeFileSync(destPath, JSON.stringify(jsonSchema, null, 2));

    const destPath2 = path.join(ctx.paths.project.dir, `.rnv/schema/${schemaId}.json`);
    fs.writeFileSync(destPath2, JSON.stringify(jsonSchema, null, 2));
};
