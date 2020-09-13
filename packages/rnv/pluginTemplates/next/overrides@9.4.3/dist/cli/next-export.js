#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.nextExport=void 0;var _path=require("path");var _fs=require("fs");var _index=_interopRequireDefault(require("next/dist/compiled/arg/index.js"));var _export=_interopRequireDefault(require("../export"));var _utils=require("../server/lib/utils");var _findPagesDir=require("../lib/find-pages-dir");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const nextExport=argv=>{const args=(0,_index.default)({// Types
'--help':Boolean,'--silent':Boolean,'--outdir':String,'--threads':Number,'--pagesDir':String,// Aliases
'-h':'--help','-s':'--silent','-o':'--outdir'},{argv});if(args['--help']){// tslint:disable-next-line
console.log(`
      Description
        Exports the application for production deployment

      Usage
        $ next export [options] <dir>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        -h - list this help
        -o - set the output dir (defaults to 'out')
        -s - do not print any messages to console
        --pagesDir      Location of pages dir
    `);process.exit(0);}const dir=(0,_path.resolve)('.');const destDir=(0,_path.resolve)(args._[0]||'.');if(args['--pagesDir'])(0,_findPagesDir.setPagesDir)((0,_path.join)(dir,args['--pagesDir']));// Check if pages dir exists and warn if not
if(!(0,_fs.existsSync)(dir)){(0,_utils.printAndExit)(`> No such directory exists as the project root: ${dir}`);}const options={silent:args['--silent']||false,threads:args['--threads'],outdir:args['--outdir']?(0,_path.resolve)(args['--outdir']):(0,_path.join)(dir,'out')};(0,_export.default)(dir,options,null,destDir).then(()=>{(0,_utils.printAndExit)('Export successful',0);}).catch(err=>{(0,_utils.printAndExit)(err);});};exports.nextExport=nextExport;
//# sourceMappingURL=next-export.js.map