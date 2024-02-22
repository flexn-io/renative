// __mocks__/fs.ts
import path from 'path';
const fs: any = jest.createMockFromModule('fs');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
    mockFiles = Object.create(null);
    //@ts-expect-error
    Array.values(newMockFiles).forEach((file) => {
        const dir = path.dirname(file);

        if (!mockFiles[dir]) {
            mockFiles[dir] = [];
        }
        mockFiles[dir].push(path.basename(file));
    });
}

function readdirSync(directoryPath) {
    return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.readFileSync = () => '{}';

module.exports = fs;
