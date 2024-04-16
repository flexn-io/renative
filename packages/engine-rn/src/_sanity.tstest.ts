// THIS IS INTENTIONAL ERROR TO CATCH ACCIDENTAL ANYFICATIONS

import { getContext as getContextCore } from '@rnv/core';
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
