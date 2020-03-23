import http from 'http'
import path from 'path'
import next from '../next'
import { setPagesDir } from '../../lib/find-pages-dir'

export default async function start(
  serverOptions: any,
  port?: number,
  hostname?: string,
  pagesDir?: string,
) {
  const app = next({
    ...serverOptions,
    customServer: false,
  })

  pagesDir && setPagesDir(path.join(serverOptions.dir, pagesDir));
  const srv = http.createServer(app.getRequestHandler())
  await new Promise((resolve, reject) => {
    // This code catches EADDRINUSE error if the port is already in use
    srv.on('error', reject)
    srv.on('listening', () => resolve())
    srv.listen(port, hostname)
  })
  // It's up to caller to run `app.prepare()`, so it can notify that the server
  // is listening before starting any intensive operations.
  return app
}
