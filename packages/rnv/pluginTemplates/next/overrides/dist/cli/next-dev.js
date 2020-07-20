#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.nextDev=void 0;var _path=require("path");var _index=_interopRequireDefault(require("next/dist/compiled/arg/index.js"));var _fs=require("fs");var _startServer=_interopRequireDefault(require("../server/lib/start-server"));var _utils=require("../server/lib/utils");var _output=require("../build/output");var _findPagesDir=require("../lib/find-pages-dir");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const nextDev=argv=>{const args=(0,_index.default)({// Types
'--help':Boolean,'--port':Number,'--hostname':String,'--pagesDir':String,// Aliases
'-h':'--help','-p':'--port','-H':'--hostname'},{argv});if(args['--help']){// tslint:disable-next-line
console.log(`
      Description
        Starts the application in development mode (hot-code reloading, error
        reporting, etc)

      Usage
        $ next dev <dir> -p <port number>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application
        --help, -h      Displays this message
        --pagesDir      Location of pages dir
    `);process.exit(0);}const dir=(0,_path.resolve)('.');if(args['--pagesDir'])(0,_findPagesDir.setPagesDir)(_path.join(dir,args['--pagesDir']));// Check if pages dir exists and warn if not
if(!(0,_fs.existsSync)(dir)){(0,_utils.printAndExit)(`> No such directory exists as the project root: ${dir}`);}const port=args['--port']||3000;const appUrl=`http://${args['--hostname']||'localhost'}:${port}`;(0,_output.startedDevelopmentServer)(appUrl);(0,_startServer.default)({dir,dev:true,isNextDevCommand:true},port,args['--hostname']).then(async app=>{await app.prepare();}).catch(err=>{if(err.code==='EADDRINUSE'){let errorMessage=`Port ${port} is already in use.`;const pkgAppPath=require('next/dist/compiled/find-up').sync('package.json',{cwd:dir});const appPackage=require(pkgAppPath);if(appPackage.scripts){const nextScript=Object.entries(appPackage.scripts).find(scriptLine=>scriptLine[1]==='next');if(nextScript){errorMessage+=`\nUse \`npm run ${nextScript[0]} -- -p <some other port>\`.`;}}// tslint:disable-next-line
console.error(errorMessage);}else{// tslint:disable-next-line
console.error(err);}process.nextTick(()=>process.exit(1));});};exports.nextDev=nextDev;
//# sourceMappingURL=next-dev.js.map