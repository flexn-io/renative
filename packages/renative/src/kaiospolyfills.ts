if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth?: number) {
        'use strict';

        // If no depth is specified, default to 1
        if (depth === undefined) {
            depth = 1;
        }

        // Recursively reduce sub-arrays to the specified depth
        const flatten = function (arr: any, depth: number) {
            // If depth is 0, return the array as-is
            if (depth < 1) {
                return arr.slice();
            }

            // Otherwise, concatenate into the parent array
            return arr.reduce(function (acc: any, val: any) {
                return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
            }, []);
        };

        return flatten(this, depth);
    };
}
