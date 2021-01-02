/* eslint-disable @typescript-eslint/no-var-requires */
import { Job } from './entity/job';
const devConfig = require('./config/dev.js');
const prodConfig = require('./config/prod.js');

// Select database config depending on the current environment
let baseConfig = devConfig;
if (process.env.TARGET_ENV === 'beta' || process.env.TARGET_ENV === 'release') {
    baseConfig = prodConfig;
}

// Add entities to the config, we need to add them here because this file is the one compiled, the base 'ormconfig.js'
//  must not have any other dependencies
export = {
    ...baseConfig,
    entities: [Job]
};
