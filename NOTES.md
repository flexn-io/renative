


LOAD FILES TO MEMORY (MIGHT TAKE SEVERAL ROUNDS?)

generate abstract runtime definitions
generate all injections

CREATE ABSTRACT CONTEXT INFO


GENERATE / COPY NEW FILES

copy over template files (.tpl files to be injected )



rnv


@rnv/cli
@rnv/core
@rnv/sdk-tizen
@rnv/sdk-webos
@rnv/sdk-apple



import { executeRnv } from '@rnv/core'

await executeRnv({ 
    commandAsString: 'rnv run -p ios', 
    commandAsObject: {
        command: 'run',
    },
    cwd: '',
    errorHandler: async ({}) => {
        return true;
    },
    inputHandler: async ({}) => {

    },
    logger: ({}) => {

    } 
});


- make build hooks typescript (with autocomplete)
- split rnv into cli & core
- move sdkManger to separate sdk packages
- rethink templateFile injection system
- renative.json: engines.engine-rn.platforms.ios.template.ignoreFiles: []
- merge engine-rn + tvos + macos????


