import { ZodFileSchema, ZodSharedSchema, getContext, logSuccess } from '@rnv/core';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export const generateSchema = async () => {
    const {
        // zodConfigFilePlugin,
        // zodConfigFilePrivate,
        // zodConfigFileProject,
        // zodConfigFileTemplate,
        // zodConfigFileTemplates,
        // zodConfigFileWorkspace,
        // zodConfigFileIntegration,
        // zodConfigFileApp,
        // zodConfigFileLocal,
        // zodConfigFileEngine,
        zodConfigFileRoot,
    } = ZodFileSchema;
    // LEGACY
    // _generateSchemaFile({ schema: zodConfigFileProject, schemaId: 'rnv.project' });
    // _generateSchemaFile({ schema: zodConfigFileApp, schemaId: 'rnv.app' });
    // _generateSchemaFile({ schema: zodConfigFileLocal, schemaId: 'rnv.local' });
    // _generateSchemaFile({ schema: zodConfigFileEngine, schemaId: 'rnv.engine' });
    // _generateSchemaFile({ schema: zodConfigFileWorkspace, schemaId: 'rnv.workspace' });
    // _generateSchemaFile({ schema: zodConfigFileTemplate, schemaId: 'rnv.template' });
    // _generateSchemaFile({ schema: zodConfigFilePrivate, schemaId: 'rnv.private' });
    // _generateSchemaFile({ schema: zodConfigFilePlugin, schemaId: 'rnv.plugin' });
    // _generateSchemaFile({ schema: zodConfigFileTemplates, schemaId: 'rnv.templates' });
    // _generateSchemaFile({ schema: zodConfigFileIntegration, schemaId: 'rnv.integration' });
    // CURRENT
    const definitions: Record<string, any> = {};
    Object.values(ZodSharedSchema).forEach((val) => {
        const v: any = val;
        Object.keys(val).forEach((key) => {
            definitions[key] = v[key];
        });
    });
    _generateSchemaFile({ schema: zodConfigFileRoot, schemaId: 'renative-1.0.schema', definitions });

    logSuccess('Sucessfully exported renative.project.json schema');
};

// This is just to speed up the process of generating schema files as rnv does this on every run per project
const SCHEMA_DEST_DIRS = [
    '.rnv/schema',
    'packages/core/jsonSchema',
    'packages/app-harness/.rnv/schema',
    'packages/template-starter/.rnv/schema',
];

const _generateSchemaFile = (opts: {
    schema: z.ZodObject<any>;
    schemaId: string;
    definitions?: Record<string, any>;
}) => {
    const { schema, schemaId, definitions } = opts;
    const ctx = getContext();

    const jsonSchema: any = zodToJsonSchema(schema, {
        name: schemaId,
        definitions: definitions || {},
    });
    jsonSchema['$schema'] = 'http://json-schema.org/draft-04/schema#';

    jsonSchema.definitions[schemaId].properties['$schema'] = {
        type: 'string',
        description: 'schema definition',
    };

    SCHEMA_DEST_DIRS.forEach((destDir) => {
        const destFolder = path.join(ctx.paths.project.dir, destDir);
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        const destPath = path.join(destFolder, `${schemaId}.json`);
        fs.writeFileSync(destPath, JSON.stringify(jsonSchema, null, 2));
    });
};
