import { ZodFileSchema, ZodSharedSchema, getContext, logSuccess } from '@rnv/core';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export const generateSchema = async () => {
    const {
        zodConfigFilePlugin,
        zodConfigFilePrivate,
        zodConfigFileProject,
        zodConfigFileTemplate,
        zodConfigFileTemplates,
        zodConfigFileWorkspace,
        zodConfigFileIntergation,
        zodConfigFileApp,
        zodConfigFileLocal,
        zodConfigFileEngine,
        zodConfigFileRoot,
    } = ZodFileSchema;
    // LEGACY
    _generateSchemaFile({ schema: zodConfigFileProject, schemaId: 'rnv.project' });
    _generateSchemaFile({ schema: zodConfigFileApp, schemaId: 'rnv.app' });
    _generateSchemaFile({ schema: zodConfigFileLocal, schemaId: 'rnv.local' });
    _generateSchemaFile({ schema: zodConfigFileEngine, schemaId: 'rnv.engine' });
    _generateSchemaFile({ schema: zodConfigFileWorkspace, schemaId: 'rnv.workspace' });
    _generateSchemaFile({ schema: zodConfigFileTemplate, schemaId: 'rnv.template' });
    _generateSchemaFile({ schema: zodConfigFilePrivate, schemaId: 'rnv.private' });
    _generateSchemaFile({ schema: zodConfigFilePlugin, schemaId: 'rnv.plugin' });
    _generateSchemaFile({ schema: zodConfigFileTemplates, schemaId: 'rnv.templates' });
    _generateSchemaFile({ schema: zodConfigFileIntergation, schemaId: 'rnv.integration' });
    // CURRENT
    _generateSchemaFile({ schema: zodConfigFileRoot, schemaId: 'renative-1.0.schema' });

    logSuccess('Sucessfully exported renative.project.json schema');
};

const _generateSchemaFile = (opts: { schema: z.ZodObject<any>; schemaId: string }) => {
    const { schema, schemaId } = opts;
    const ctx = getContext();
    const jsonSchema: any = zodToJsonSchema(schema, {
        name: schemaId,
        definitions: {
            ...ZodSharedSchema,
        },
    });
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
