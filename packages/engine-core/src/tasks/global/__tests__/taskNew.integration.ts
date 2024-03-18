import { execa } from 'execa';

// TODO: This file should contain RNV new tests, this should be moved after POC

test('--version should return a valid version', async () => {
    const { stdout, stderr } = await execa(`npx`, ['rnv', '--version']);
    expect(stdout).toMatch(
        // trust me, it is a valid semver regex
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
    );
    expect(stderr).toBe('');
});
