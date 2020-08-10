import { RewriteFrames } from '@sentry/integrations';
import { machineIdSync } from 'node-machine-id';
import axios from 'axios';
import os from 'os';
import path from 'path';

import Config from '../configManager/config';
import pkg from '../../../package.json';
import { REDASH_KEY, REDASH_URL } from '../constants';

// deal with useless duplicate errors on sentry because of different error texts
const sanitizeError = (err) => {
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
    captureEvent(e) {
        const defaultProps = {
            fingerprint: machineIdSync(),
            os: os.platform(),
            rnvVersion: pkg.version
        };
        return axios
            .post(
                REDASH_URL,
                { ...e, ...defaultProps },
                {
                    headers: {
                        'x-api-key': REDASH_KEY
                    }
                }
            )
            .catch(() => true);
    }
}

class Analytics {
    constructor() {
        this.errorFixer = null;
        this.knowItAll = null;
    }

    initialize() {
        if (Config.isAnalyticsEnabled) {
            // ERROR HANDLING
            // eslint-disable-next-line global-require
            this.errorFixer = require('@sentry/node');

            this.errorFixer.init({
                dsn:
                    'https://004caee3caa04c81a10f2ba31a945362@sentry.io/1795473',
                release: `rnv@${pkg.version}`,
                integrations: [
                    new RewriteFrames({
                        root: '/',
                        iteratee: (frame) => {
                            if (
                                frame.filename.includes(
                                    `rnv${path.sep}dist${path.sep}`
                                )
                                || frame.filename.includes(
                                    `rnv${path.sep}src${path.sep}`
                                )
                            ) {
                                if (
                                    frame.filename.includes(
                                        `rnv${path.sep}dist${path.sep}`
                                    )
                                ) {
                                    frame.filename = frame.filename.split(
                                        `rnv${path.sep}dist${path.sep}`
                                    )[1];
                                } else {
                                    frame.filename = frame.filename.split(
                                        `rnv${path.sep}src${path.sep}`
                                    )[1];
                                }
                            } else if (
                                frame.filename.includes(
                                    `${path.sep}node_modules${path.sep}`
                                )
                            ) {
                                frame.filename = `node_modules/${
                                    frame.filename.split(
                                        `${path.sep}node_modules${path.sep}`
                                    )[1]
                                }`;
                            }
                            return frame;
                        }
                    })
                ]
            });

            // EVENT HANDLING
            this.knowItAll = new Redash();
        }
    }

    captureException(e, context = {}) {
        if (Config.isAnalyticsEnabled && this.errorFixer) {
            this.errorFixer.withScope((scope) => {
                const { extra = {}, tags = {} } = context;
                scope.setTags({ ...tags, os: os.platform() });
                scope.setExtras({ ...extra, fingerprint: machineIdSync() });
                if (e instanceof Error) {
                    this.errorFixer.captureException(e);
                } else {
                    this.errorFixer.captureException(
                        new Error(sanitizeError(e))
                    );
                }
            });
        }
    }

    async captureEvent(e) {
        if (Config.isAnalyticsEnabled && this.knowItAll) {
            return this.knowItAll.captureEvent(e);
        }
        return true;
    }

    teardown() {
        return new Promise((resolve) => {
            if (Config.isAnalyticsEnabled && this.errorFixer) {
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

export default new Analytics();
