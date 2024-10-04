// SANITY TESTS FOR TYPED CONTEXTS
/* 
eslint-disable @typescript-eslint/no-unused-vars 
*/

import { createRnvModule } from '../modules/creators';
import { createRnvEngine } from '../engines/creators';
import { GetContextType } from '../context/types';
import { createTask, createTaskOptionsPreset } from '../tasks/creators';
import { RnvTaskOptions } from '../tasks/taskOptions';
import { getContext } from '../context/provider';

const preset1 = createTaskOptionsPreset({
    withSet1: [{ key: 'preset1Key1', description: '' }, RnvTaskOptions.reset],
});

// core context must not provide unknown options
// @ts-expect-error
console.log(preset1.UNTYPED);

// must provide new options
console.log(preset1.withSet1);

const preset2 = createTaskOptionsPreset({
    withSet2: [RnvTaskOptions.reset, RnvTaskOptions.resetHard],
});

// core context must not provide unknown options
// @ts-expect-error
console.log(preset2.UNTYPED);

// must provide new options
console.log(preset2.withSet2);

const task1 = createTask({
    description: '',
    task: 'test',
    fn: async ({ ctx }) => {
        // engine context must provide original options
        console.log(ctx.program.opts().appConfigID);
        // must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
        // must provide new options
        console.log(ctx.program.opts().preset1Key1);
        // must provide new options
        console.log(ctx.program.opts().reset);
    },
    options: preset1.withSet1(),
});

const task2 = createTask({
    description: '',
    task: 'test',
    fn: async ({ ctx }) => {
        // must provide original options
        console.log(ctx.program.opts().appConfigID);
        // must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
    },
});

const task3 = createTask({
    description: '',
    task: 'test',
    fn: async ({ ctx }) => {
        // must provide original options
        console.log(ctx.program.opts().appConfigID);
        // must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
        // must provide new options
        console.log(ctx.program.opts().task3Key1);
    },
    options: [{ key: 'task3Key1', description: '' }],
});

const options1 = [{ key: 'options1Key1', description: '' }] as const;

const task4 = createTask({
    description: '',
    task: 'test',
    fn: async ({ ctx }) => {
        // must provide original options
        console.log(ctx.program.opts().appConfigID);
        // must not provide unknown options
        // @ts-expect-error
        console.log(ctx.program.opts().UNTYPED);
    },
    options: [...options1],
});

const task5 = createTask({
    task: 'task1',
    description: '',
    options: preset2.withSet2(),
});

const task6 = createTask({
    task: 'task',
    description: '',
    options: [{ key: 'key1', description: '' }],
});

const module1 = createRnvModule({
    tasks: [
        task1,
        task2,
        {
            key: 'selfReferenceTest',
            description: '',
            task: 'selfReferenceTest',
            options: [{ key: 'selfOpt', description: '' }],
            fn: async ({ ctx }) => {
                console.log(ctx.program.opts().preset1Key1);
                console.log(ctx.program.opts().selfOpt);
                // @ts-expect-error
                console.log(ctx.program.opts().UNTYPED);
            },
        },
    ],
    name: '',
    type: 'internal',
    contextPayload: {
        foo1: 'bar',
    } as { foo1: string },
});
type GCModule1 = GetContextType<typeof module1.getContext>;
const gcModule1 = getContext as GCModule1;

// must provide original options
console.log(gcModule1().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcModule1().program.opts().UNTYPED);

// must provide new options inherited from task
console.log(gcModule1().program.opts().preset1Key1);

// must provide new payload props inherited from module
console.log(gcModule1().payload.foo1);

// must not provide unknown props in payload
// @ts-expect-error
console.log(gcEngine3().payload.UNTYPED);

const module2 = createRnvModule({
    tasks: [],
    name: '',
    type: 'internal',
});
type GCModule2 = GetContextType<typeof module2.getContext>;
const gcModule2 = getContext as GCModule2;

// must provide original options
console.log(gcModule2().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcModule2().program.opts().UNTYPED);

// must not provide unknown props in payload
// @ts-expect-error
console.log(gcEngine2().payload.UNTYPED);

const module3 = createRnvModule({
    tasks: [task3, task4, task5, task6],
    name: '',
    type: 'internal',
    contextPayload: {
        foo3: 'bar',
    } as { foo3: string },
});
type GCModule3 = GetContextType<typeof module3.getContext>;
const gcModule3 = getContext as GCModule3;

// must provide original options
console.log(gcModule3().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcModule3().program.opts().UNTYPED);

// must provide new options inherited from task
console.log(gcModule3().program.opts().key1);

// must provide new options inherited from task
console.log(gcModule3().program.opts().task3Key1);

// must provide new options inherited from task
console.log(gcModule3().program.opts().options1Key1);

// must provide new options inherited from task
console.log(gcModule3().program.opts().resetHard);

// must provide new payload props inherited from module
console.log(gcModule3().payload.foo3);

// must not provide unknown props in payload
// @ts-expect-error
console.log(gcEngine3().payload.UNTYPED);

const engine1 = createRnvEngine({
    tasks: [task1, task2, task3, task4, task5, task6],
    config: {
        engine: {
            engineExtension: 'js',
            name: 'test',
            npm: {},
            overview: '',
            platforms: {},
            plugins: {},
            custom: {},
        },
    },
    platforms: {},
});
type GCEngine1 = GetContextType<typeof engine1.getContext>;
const gcEngine1 = getContext as GCEngine1;

// must provide original options
console.log(gcEngine1().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcEngine1().program.opts().UNTYPED);

// must provide new options inherited from task
console.log(gcEngine1().program.opts().key1);

// must provide new options inherited from task
console.log(gcEngine1().program.opts().task3Key1);

// must provide new options inherited from task
console.log(gcEngine1().program.opts().options1Key1);

// must provide new options inherited from task
console.log(gcEngine1().program.opts().resetHard);

// must provide new options inherited from task
console.log(gcEngine1().program.opts().preset1Key1);

const engine2 = createRnvEngine({
    tasks: [],
    config: {
        engine: {
            engineExtension: 'js',
            name: 'test',
            npm: {},
            overview: '',
            platforms: {},
            plugins: {},
            custom: {},
        },
    },
    platforms: {},
});
type GCEngine2 = GetContextType<typeof engine2.getContext>;
const gcEngine2 = getContext as GCEngine2;

// must provide original options
console.log(gcEngine2().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcEngine2().program.opts().UNTYPED);

// must not provide unknown props in payload
// @ts-expect-error
console.log(gcEngine2().payload.UNTYPED);

const engine3 = createRnvEngine({
    extendModules: [module1, module3],
    tasks: [],
    config: {
        engine: {
            engineExtension: 'js',
            name: 'test',
            npm: {},
            overview: '',
            platforms: {},
            plugins: {},
            custom: {},
        },
    },
    platforms: {},
});
type GCEngine3 = GetContextType<typeof engine3.getContext>;
const gcEngine3 = getContext as GCEngine3;

// must provide original options
console.log(gcEngine3().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcEngine3().program.opts().UNTYPED);

// must provide new options inherited from task
console.log(gcEngine3().program.opts().key1);

// must provide new options inherited from task
console.log(gcEngine3().program.opts().task3Key1);

// must provide new options inherited from task
console.log(gcEngine3().program.opts().preset1Key1);

// must provide new payload props inherited from module
console.log(gcEngine3().payload.foo1);

// must provide new payload props inherited from module
console.log(gcEngine3().payload.foo3);

// must not provide unknown props in payload
// @ts-expect-error
console.log(gcEngine3().payload.UNTYPED);

const engine4 = createRnvEngine({
    extendModules: [module1, module2, module3],
    tasks: [task2, task3, task4, task5, task6],
    config: {
        engine: {
            engineExtension: 'js',
            name: 'test',
            npm: {},
            overview: '',
            platforms: {},
            plugins: {},
            custom: {},
        },
    },
    platforms: {},
});
type GCEngine4 = GetContextType<typeof engine4.getContext>;
const gcEngine4 = getContext as GCEngine4;

// must provide original options
console.log(gcEngine4().program.opts<string>().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(gcEngine4().program.opts().UNTYPED);

// must provide new options inherited from task
console.log(gcEngine4().program.opts().key1);

// must provide new options inherited from task
console.log(gcEngine4().program.opts<boolean>().task3Key1);

// must provide new options inherited from task
console.log(gcEngine4().program.opts().options1Key1);

// must provide new options inherited from task
console.log(gcEngine4().program.opts().resetHard);

// must provide new options inherited from task
console.log(gcEngine4().program.opts().preset1Key1);

// must provide new payload props inherited from module
console.log(gcEngine4().payload.foo1);

// must provide new payload props inherited from module
console.log(gcEngine4().payload.foo3);

// must not provide unknown props in payload
// @ts-expect-error
console.log(gcEngine4().payload.UNTYPED);

// ===============================================

// must provide original options
console.log(getContext().program.opts().appConfigID);

// must not provide unknown options
// @ts-expect-error
console.log(getContext().program.opts().UNTYPED);
