export const generateOptions = (inputData, isMultiChoice = false, mapping, renderMethod) => {
    let asString = '';
    const valuesAsObject = {};
    const valuesAsArray = [];
    const keysAsObject = {};
    const keysAsArray = [];
    const isArray = Array.isArray(inputData);

    const output = {
        pick: (v, defaultOption) => new Promise((resolve, reject) => {
            let selectedOptions = [];
            const pickedOpt = v || defaultOption;
            if (isMultiChoice) {
                const wrongOptions = [];
                if (pickedOpt) {
                    const choiceArr = v.split(',');
                    choiceArr.forEach((choice) => {
                        let selectedOption = choice;
                        if (isNaN(choice)) {
                            selectedOption = choice;
                        } else {
                            selectedOption = keysAsArray[choice - 1];
                        }
                        selectedOptions.push(selectedOption);
                        if (!valuesAsObject[selectedOption]) {
                            wrongOptions.push(choice);
                        }
                    });
                } else {
                    selectedOptions = keysAsArray;
                }
                if (wrongOptions.length) {
                    reject(`${highlight(wrongOptions.join(','))} ...Really?! 🙈`);
                } else {
                    output.selectedOptions = selectedOptions;
                    resolve(selectedOptions);
                }
            } else {
                let selectedOption = pickedOpt;
                if (isNaN(pickedOpt)) {
                    selectedOption = pickedOpt;
                } else {
                    selectedOption = keysAsArray[v - 1];
                }
                if (!valuesAsObject[selectedOption]) {
                    reject(`${highlight(pickedOpt)} ...Really?! 🙈`);
                } else {
                    output.selectedOption = selectedOption;
                    resolve(selectedOption);
                }
            }
        })
    };
    const renderer = renderMethod || _generateOptionString;
    if (isArray) {
        inputData.map((v, i) => {
            asString += renderer(i, v, mapping, v);
            valuesAsArray.push(v);
            if (!mapping) keysAsArray.push(v);
            if (!mapping) valuesAsObject[v] = v;
        });
    } else {
        let i = 0;
        for (const k in inputData) {
            const v = inputData[k];
            asString += renderer(i, v, mapping, k);
            keysAsArray.push(k);
            keysAsObject[k] = true;
            valuesAsObject[k] = v;
            valuesAsArray.push(v);
            i++;
        }
    }
    output.keysAsArray = keysAsArray;
    output.valuesAsArray = valuesAsArray;
    output.keysAsObject = keysAsObject;
    output.valuesAsObject = valuesAsObject;
    output.asString = asString;
    return output;
};

const _generateOptionString = (i, obj, mapping, defaultVal) => `-[${highlight(i + 1)}] ${highlight(mapping ? '' : defaultVal)} \n`;

let _currentQuestion;

export const askQuestion = (question, obj, key) => new Promise((resolve, reject) => {
    if (!_currentQuestion) {
        _currentQuestion = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    _currentQuestion.question(getQuestion(question), (v) => {
        if (obj && key) obj[key] = v;
        resolve(v === '' ? null : v);
    });
});

export const finishQuestion = () => new Promise((resolve, reject) => {
    _currentQuestion.close();
    _currentQuestion = null;
});
