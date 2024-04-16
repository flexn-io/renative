// THIS IS INTENTIONAL ERROR TO CATCH ACCIDENTAL ANYFICATIONS

import { getContext as getContextCore } from '@rnv/core';
import { getContext } from './getContext';

// Extended context must provide original options
console.log(getContext().program.opts().appConfigID);

// Extended context must not provide unknown options
// @ts-expect-error
console.log(getContext().program.opts().UNTYPED);

// Extended context must provide newly defined options
console.log(getContext().program.opts().gitEnabled);

// Core context must provide original options
console.log(getContextCore().program.opts().appConfigID);

// Core context must not provide unknown options
// @ts-expect-error
console.log(getContextCore().program.opts().UNTYPED);

// Core context must not provide options available only in extended context
// @ts-expect-error
console.log(getContextCore().program.opts().gitEnabled);
