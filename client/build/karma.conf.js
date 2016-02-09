import { argv } from 'yargs';
import config from '../config';
import webpackConfig from './webpack.config';
import _debug from 'debug';

const debug = _debug('app:karma');
debug('Create configuration.');

const karmaConfig = {
  basePath: '../', // project root in relation to bin/karma.js
  files: [
    './node_modules/phantomjs-polyfill/bind-polyfill.js',
    {
      pattern: `./${config.dir_test}/test-bundler.js`,
      watched: false,
      served: true,
      included: true
    }
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha', 'chai-sinon', 'chai-as-promised', 'chai'],
  preprocessors: {
    [`${config.dir_test}/test-bundler.js`]: ['webpack', 'sourcemap']
  },
  reporters: ['mocha'],
  browsers: ['PhantomJS'],
  webpack: {
    devtool: 'inline-source-map',
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins,
    module: {
      loaders: webpackConfig.module.loaders
    },
    sassLoader: webpackConfig.sassLoader,
    externals: {
      'react/lib/ReactContext': 'window'
    }
  },
  webpackMiddleware: {
    noInfo: true
  },
  coverageReporter: {
    reporters: config.coverage_reporters
  }
};

if (config.coverage_enabled) {
  karmaConfig.reporters.push('coverage');
  karmaConfig.webpack.module.preLoaders = [{
    test: /\.(js|jsx)$/,
    include: new RegExp(config.dir_client),
    loader: 'isparta',
    exclude: /node_modules/
  }];
}

export default (cfg) => cfg.set(karmaConfig);
