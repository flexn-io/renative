import { ConfigFileTemplate, PromptParams, getContext, inquirerPrompt, logDebug } from '@rnv/core';
import lSet from 'lodash/set';
import type { NewProjectData } from '../types';

type ConfigProp = Required<Required<ConfigFileTemplate>['bootstrapConfig']>['bootstrapQuestions'][number]['configProp'];
type BootstrapQuestions = Required<Required<ConfigFileTemplate>['bootstrapConfig']>['bootstrapQuestions'];
type QuestionResults = Record<
    string,
    {
        answer: string;
        configProp: ConfigProp;
        value: string;
    }
>;

export const inquiryBootstrapQuestions = async (data: NewProjectData) => {
    const c = getContext();
    data.renativeTemplateConfigExt = {};
    const bootstrapQuestions = data.files.template.renativeTemplateConfig?.bootstrapConfig?.bootstrapQuestions || [];
    const results: QuestionResults = {};
    const providedAnswers: Record<string, any> = {};

    if (c.program.answer) {
        c.program.answer.forEach((a: string) => {
            const key = a.split('=')[0];
            let value;

            try {
                value = JSON.parse(a.split('=')[1]);
            } catch (e) {
                value = a.split('=')[1];
            }

            providedAnswers[key] = value;
        });
    }

    await interactiveQuestion(results, bootstrapQuestions, providedAnswers);

    logDebug('asnwer', JSON.stringify(results, null, 2));

    Object.keys(results).forEach((targetKey) => {
        const objValue = results[targetKey].value;

        logDebug('setting', targetKey, objValue);

        if (targetKey) {
            lSet(data.renativeTemplateConfigExt, targetKey, objValue);
        }
    });
};

const interactiveQuestion = async (
    results: QuestionResults,
    bootstrapQuestions: BootstrapQuestions,
    providedAnswers: Record<string, string>
) => {
    if (bootstrapQuestions?.length) {
        for (let i = 0; i < bootstrapQuestions.length; i++) {
            const q = bootstrapQuestions[i];
            const qKey = q?.configProp?.key || '';
            // inquirer will nest them if they look like an object
            const qKeyClean = qKey.replace('.', '__');

            const choicesObj: Record<string, any> = {};
            if (q.options) {
                q.options.forEach((opt) => {
                    choicesObj[opt.title] = opt;
                });
            }

            // answer already passed into the command line
            const answer = providedAnswers[qKey.replace('__', '.')];
            if (answer) {
                let value;
                if (typeof answer === 'string' && q.type === 'list') {
                    value = choicesObj[answer]?.value;
                } else {
                    value = answer;
                }

                results[qKey] = {
                    answer,
                    configProp: q.configProp,
                    value,
                };
            } else {
                const inqQuestion: PromptParams = {
                    name: qKeyClean,
                    type: q.type,
                    message: q.title,
                    choices: Object.keys(choicesObj),
                };
                // eslint-disable-next-line no-await-in-loop
                const result = await inquirerPrompt(inqQuestion);
                const val = q.type === 'list' ? choicesObj[result[qKeyClean]]?.value : result[qKeyClean];
                results[qKey] = {
                    answer: result[qKeyClean],
                    configProp: q.configProp,
                    value: val,
                };
            }

            if (choicesObj[results[qKey].answer]?.bootstrapQuestions) {
                // eslint-disable-next-line no-await-in-loop
                await interactiveQuestion(
                    results,
                    choicesObj[results[qKey].answer].bootstrapQuestions,
                    providedAnswers
                );
            }
        }
    }
};
