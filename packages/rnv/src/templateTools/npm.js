import { executeAsync } from '../exec';
import { logError, generateOptions } from '../common';

const DEFAULT_TEMPLATES = [
    'renative-template-hello-world',
    'renative-template-blank',
    'renative-template-kitchen-sink'
];

const listTemplates = () => new Promise((resolve, reject) => {
    console.log('KDJHDJKDH');
    resolve();
});

const addTemplate = () => new Promise((resolve, reject) => {
    console.log('KDJHDJKDH');

    executeAsync('npm', ['install', 'renative-template-hello-world', '--save-dev'])
        // .then(() => cleanNodeModules(c))
        .then(() => {
            console.log('AKJALKJALAKJAL');
            resolve();
        })
        .catch(error => logError(error));
    // resolve();
});


const getTemplateOptions = () => generateOptions(DEFAULT_TEMPLATES);

export { listTemplates, addTemplate, getTemplateOptions };
