import { RewriteFrames } from '@sentry/integrations';
import { machineIdSync } from 'node-machine-id';
import axios from 'axios';
import os from 'os';
import path from 'path';

import { RnvPlatform, getContext, logRaw } from '@rnv/core';
//@ts-ignore
import pkg from '../package.json';
import { REDASH_KEY, REDASH_URL, SENTRY_ENDPOINT } from './constants';

// deal with useless duplicate errors on sentry because of different error texts
const sanitizeError = (err: string) => {
    if (err) {
        if (err.includes('file if your SDK path is correct.')) {
            return err.toLowerCase().split('. check your ')[0];
        }
        if (err.includes('AppConfig error - ')) {
            return err.split(' - ')[0];
        }
    }

    return err;
};

class Redash {
    captureEvent(e: object) {
        const defaultProps = {
            fingerprint: machineIdSync(),
            os: os.platform(),
            //TODO: this points to telemetry version. migrate to universal RNV version (@rnv/core)
            rnvVersion: pkg.version,
        };
        return axios
            .post(
                REDASH_URL,
                { ...e, ...defaultProps },
                {
                    headers: {
                        'x-api-key': REDASH_KEY,
                    },
                }
            )
            .catch(() => true);
    }
}

export class AnalyticsCls {
    errorFixer: any;
    knowItAll: Redash | null;

    constructor() {
        this.errorFixer = null;
        this.knowItAll = null;
    }

    get isAnalyticsEnabled() {
        const c = getContext();
        return !c.files.dotRnv?.config?.workspace?.disableTelemetry && c.process.env.RNV_TELEMETRY_DISABLED !== '1';
    }

    initialize() {
        if (this.isAnalyticsEnabled) {
            // ERROR HANDLING
            // eslint-disable-next-line global-require
            this.errorFixer = require('@sentry/node');

            this.errorFixer.init({
                dsn: SENTRY_ENDPOINT,
                release: `rnv@${pkg.version}`,
                integrations: [
                    new RewriteFrames({
                        root: '/',
                        iteratee: (frame: any) => {
                            if (
                                frame.filename.includes(`rnv${path.sep}dist${path.sep}`) ||
                                frame.filename.includes(`rnv${path.sep}src${path.sep}`)
                            ) {
                                if (frame.filename.includes(`rnv${path.sep}dist${path.sep}`)) {
                                    frame.filename = frame.filename.split(`rnv${path.sep}dist${path.sep}`)[1];
                                } else {
                                    frame.filename = frame.filename.split(`rnv${path.sep}src${path.sep}`)[1];
                                }
                            } else if (frame.filename.includes(`${path.sep}node_modules${path.sep}`)) {
                                frame.filename = `node_modules/${
                                    frame.filename.split(`${path.sep}node_modules${path.sep}`)[1]
                                }`;
                            }
                            return frame;
                        },
                    }),
                ],
            });

            // EVENT HANDLING
            this.knowItAll = new Redash();
        }
    }

    captureException(e: unknown, context: { tags?: object; extra?: object } = {}) {
        if (this.isAnalyticsEnabled && this.errorFixer) {
            this.errorFixer.withScope((scope: any) => {
                const { extra = {}, tags = {} } = context;
                scope.setTags({ ...tags, os: os.platform() });
                scope.setExtras({ ...extra, fingerprint: machineIdSync() });
                const c = getContext();
                if (c.program.opts().telemetryDebug) {
                    logRaw(`TELEMETRY EXCEPTION PAYLOAD:
    ${e}
                    `);
                } else {
                    if (e instanceof Error) {
                        this.errorFixer.captureException(e);
                    } else if (typeof e === 'string') {
                        this.errorFixer.captureException(new Error(sanitizeError(e)));
                    }
                }
            });
        }
    }

    async captureEvent(e: { type: string; platform?: RnvPlatform; template?: string; platforms?: Array<string> }) {
        const c = getContext();
        if (this.isAnalyticsEnabled && this.knowItAll) {
            if (c.program.opts().telemetryDebug) {
                logRaw(`TELEMETRY EVENT PAYLOAD:
${JSON.stringify(e, null, 2)}
                `);
            } else {
                return this.knowItAll.captureEvent(e);
            }
        }
        return true;
    }

    teardown() {
        return new Promise<void>((resolve) => {
            if (this.isAnalyticsEnabled && this.errorFixer) {
                const client = this.errorFixer.getCurrentHub().getClient();
                if (client) {
                    return client.close(2000).then(resolve);
                }
                return resolve();
            }
            return resolve();
        });
    }
}

const Telemetry = new AnalyticsCls();

export { Telemetry };
