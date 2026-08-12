import { Config } from '@stencil/core';

export const config: Config = {
    namespace:         'stencil-context',
    outputTargets:     [
        {
            type:          'dist',
            esmLoaderPath: '../loader',
        },
        {
            type:          'www',
            serviceWorker: null,
        },
    ],
    globalScript:      'src/global.ts',
    excludeComponents: ['consume-example', 'provide-example', 'app-example'],
    buildDist:         true,
};
