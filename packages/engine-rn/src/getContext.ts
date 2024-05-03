import { getContext as _getContext } from '@rnv/core';
import type { GetContext } from '.';
// re-export the original getContext with newly decorated type
export const getContext = _getContext as GetContext;

// THIS IS INTENTIONAL ERROR TO CATCH ACCIDENTAL ANYFICATIONS
// @ts-expect-error
console.log(getContext().program.opts().UNTYPED);
