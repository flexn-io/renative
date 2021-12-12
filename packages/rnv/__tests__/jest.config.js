module.exports = {
    collectCoverage: true,
    verbose: true,
    rootDir: '../',
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: [
        './__tests__/setupTests.js'
    ]
};
