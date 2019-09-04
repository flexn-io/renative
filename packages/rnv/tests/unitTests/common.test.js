import { parseErrorMessage } from '../../src/common';

const test = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas magna nunc, 
aliquam et orci et, ultrices consectetur leo. Curabitur ultricies maximus nibh, 
a lobortis nibh pretium accumsan. Maecenas quis augue volutpat, eleifend neque sed, 
imperdiet lacus. Maecenas diam ipsum, vestibulum id sem et, ultricies fermentum felis. 
Maecenas bibendum mi nec arcu ultricies iaculis. Curabitur odio orci, laoreet sit amet quam non, 
cursus scelerisque ante. In non justo sed odio pharetra viverra. Mauris consequat quis ligula non placerat. 
Praesent consectetur rutrum erat vitae luctus.

Mauris at maximus tellus. Morbi ut orci id est ullamcorper mattis. Nulla nisi arcu, 
finibus eget vestibulum id, pulvinar nec est. Ut sed varius turpis, eu finibus ipsum. 
Donec vulputate, est non sodales rutrum, turpis felis egestas quam, vel porttitor ex est nec metus. 
Cras hendrerit viverra nulla quis tristique. Aliquam erat volutpat. In quis mauris auctor, viverra tellus eu, 
elementum ipsum. Vestibulum ex nibh, efficitur quis vulputate nec, bibendum quis erat. Maecenas vel leo vitae 
nisl pellentesque porta. Aenean at nisi et est eleifend gravida a nec neque. Suspendisse consectetur, risus 
eget interdum accumsan, augue ex porta velit, eget tincidunt nisl tortor nec augue. Duis feugiat erat libero, 
pharetra tempor risus ultrices sit amet. Nulla eu ipsum turpis.
`;

const testError = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas magna nunc, 
aliquam et orci et, Error: ultrices consectetur leo. Curabitur ultricies maximus nibh, 
a lobortis nibh pretium accumsan. Maecenas quis augue volutpat, eleifend neque sed, 
imperdiet lacus. Maecenas diam ipsum, vestibulum id sem et, ultricies fermentum felis. 
Maecenas bibendum mi nec arcu ultricies iaculis. Curabitur odio orci, laoreet sit amet quam non, 
cursus scelerisque ante. In non justo sed odio pharetra viverra. Mauris consequat quis ligula non placerat. 
Praesent consectetur rutrum erat vitae luctus.

Fatal: Mauris at maximus tellus. Morbi ut orci id est ullamcorper mattis. Nulla nisi arcu, 
finibus eget vestibulum id, pulvinar nec est. Ut sed varius turpis, eu finibus ipsum. 
Donec vulputate, est non sodales rutrum, turpis felis egestas quam, vel porttitor ex est nec metus. 
Cras hendrerit viverra nulla quis tristique. Exception: Aliquam erat volutpat. In quis mauris auctor, viverra tellus eu, 
elementum ipsum. Vestibulum ex nibh, efficitur quis vulputate nec, bibendum quis erat. Maecenas vel leo vitae 
nisl pellentesque porta. Aenean at nisi et est eleifend gravida a nec neque. Suspendisse consectetur, risus 
eget interdum accumsan, augue ex porta velit, eget tincidunt nisl tortor nec augue. [!] Duis feugiat erat libero, 
pharetra tempor risus ultrices sit amet. Nulla eu ipsum turpis.
`;

const limitedErrorResult = 'Error: ult... Fatal: Mau... Exception:... [!] Duis f...';

const errorResult = `Error: ultrices consectetur leo. Curabitur ultricies maximus nibh, 
a lobortis nibh pretium accumsan. Maecenas quis augue volutpat, eleifend neque sed, 
imperdiet lacus. Maecenas diam ipsum, vestibulum id sem et, ultricies fermentum felis. 
Maecenas bibendum mi nec arcu ultricies iaculis. Curabitur odio orci, laoreet sit amet quam non, 
cursus scelerisque ante. In non justo sed odio pharetra viver... Fatal: Mauris at maximus tellus. Morbi ut orci id est ullamcorper mattis. Nulla nisi arcu, 
finibus eget vestibulum id, pulvinar nec est. Ut sed varius turpis, eu finibus ipsum. 
Donec vulputate, est non sodales rutrum, turpis felis egestas quam, vel porttitor ex est nec metus. 
Cras hendrerit viverra nulla quis tristique. Exception: Aliquam erat volutpat. In quis mauris auctor, viverra tellus eu,... Exception: Aliquam erat volutpat. In quis mauris auctor, viverra tellus eu, 
elementum ipsum. Vestibulum ex nibh, efficitur quis vulputate nec, bibendum quis erat. Maecenas vel leo vitae 
nisl pellentesque porta. Aenean at nisi et est eleifend gravida a nec neque. Suspendisse consectetur, risus 
eget interdum accumsan, augue ex porta velit, eget tincidunt nisl tortor nec augue. [!] Duis feugiat er... [!] Duis feugiat erat libero, 
pharetra tempor risus ultrices sit amet. Nulla eu ipsum turpis.
`;

describe('Testing common functions', () => {
    it('should return correct error', async () => {
        expect(parseErrorMessage(testError, 400)).toEqual(errorResult);
    });

    it('should return no error', () => {
        expect(parseErrorMessage(test, 400)).toEqual(false);
    });

    it('should return 10 character error length', () => {
        expect(parseErrorMessage(testError, 10)).toEqual(limitedErrorResult);
    });
});
