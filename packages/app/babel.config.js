// const cleanAliases = require('./platforms/common/pathAliases');

// const resolve = require('resolve');

// console.log('babel.config.js is being sourced')

// function doResolve(aPath) {
//     return resolve
//         .sync(aPath, {
//             packageFilter: (pkg) => {
//                 pkg.main = 'package.json';
//                 return pkg;
//             },
//             extensions: ['.js', '.json']
//         })
//         .replace(/\/package.json$/, '');
// }

// const aliasedPackages = ['@babel/runtime'].reduce((acc, aPackage) => {
//     acc[aPackage] = doResolve(aPackage);
//     return acc;
// });

// console.log('aliasedPackages :', aliasedPackages);

// module.exports = {
//     presets: ['module:metro-react-native-babel-preset'],
//     plugins: [
//         [
//             require.resolve('babel-plugin-module-resolver'),
//             {
//                 // root: ['.'],
//                 alias: aliasedPackages
//             }
//         ]
//     ]
// };

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
};
