// THIS IS INTENTIONAL ERROR TO CATCH ACCIDENTAL ANYFICATIONS

import { RnvTaskOptions, createTask, getContext as getContextCore } from '@rnv/core';
import { getContext } from './getContext';

// engine context must provide original options
console.log(getContext().program.opts().appConfigID);

// engine context must not provide unknown options
// @ts-expect-error
console.log(getContext().program.opts().UNTYPED);

// engine context must provide defined options extended from module
console.log(getContext().program.opts().resetAdb);

// core context must provide original options
console.log(getContextCore().program.opts().appConfigID);

// core context must not provide unknown options
// @ts-expect-error
console.log(getContextCore().program.opts().UNTYPED);

// TODO core context must not provide options available only in extended context
// //@ts-expect-error
// console.log(getContextCore().program.opts().resetAdb);

const withX = [{ key: 'foo', description: 'bar' }] as const;

const RnvTaskOptionPresets4 = {
    withConfigure: [{ key: 'foo', description: 'bar' }, RnvTaskOptions.reset] as const,
};

createTask({
    description: 'TEST',
    task: 'test',
    fn: async ({ ctx }) => {
        // engine context must provide original options
        console.log(ctx.program.opts().appConfigID);
        // core context must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
    },
    options: [...withX],
});

export const RnvTaskOptionPresets3 = {
    withConfigure: [RnvTaskOptions.reset, RnvTaskOptions.resetHard] as const,
};

createTask({
    description: 'TEST',
    task: 'test',
    fn: async ({ ctx }) => {
        // engine context must provide original options
        console.log(ctx.program.opts().appConfigID);
        // core context must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
    },
    options: [...RnvTaskOptionPresets4.withConfigure],
});

createTask({
    description: 'TEST',
    task: 'test',
    fn: async ({ ctx }) => {
        // engine context must provide original options
        console.log(ctx.program.opts().appConfigID);
        // core context must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
    },
});

createTask({
    description: 'TEST',
    task: 'test',
    fn: async ({ ctx }) => {
        // engine context must provide original options
        console.log(ctx.program.opts().appConfigID);
        // core context must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
    },
    options: [{ key: 'foo', description: 'bar' }],
});
