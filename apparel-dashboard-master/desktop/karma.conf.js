// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine-jquery', 'jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      // require('karma-phantomjs-launcher'),
      require('karma-jasmine-jquery') 
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // customLaunchers: {
    //   ChromeHeadless: {
    //     base: 'Chrome',
    //     flags: [
    //       '--headless',
    //       '--disable-gpu',
    //       '--remote-debugging-port=9222',
    //     ],
    //   }
    // },
    browsers: ['Chrome'],//'Chrome', 'PhantomJS'
    singleRun: false
  });
};