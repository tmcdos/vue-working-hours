'use strict';
const path = require('path');
const pk = require('./package.json');

module.exports =
{
  devServer:
  {
    port: 8080,
    client:
    {
      overlay:
      {
        errors: true,
        warnings: true
      },
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production' ? 'error' : false,
  css:
  {
    sourceMap: process.env.NODE_ENV === 'development',
    /*
    loaderOptions:
    {
      postcss:
      {
        config:
        {
          // without this Webpack complains that there is no PostCSS config inside the Vuetify/dist folder
          path: path.resolve(__dirname, '.postcssrc.js'),
        }
      },
    }
    */
  },
  productionSourceMap: true,
  configureWebpack: config =>
  {
    let parent;
    let dir = path.resolve(__dirname);
    const parsed = path.parse(dir);
    while (parsed.root !== dir)
    {
      dir = path.dirname(dir);
      parent = dir + (parsed.root !== dir ? path.sep : '') + 'node_modules';
      config.resolve.modules.push(parent);
      config.resolveLoader.modules.push(parent);
    }

    config.devtool = process.env.NODE_ENV === 'development' ? 'inline-source-map' : false; // other modes often break hot-reload and/or breakpoints
    if (!config.performance) config.performance = {};
    config.performance.hints = false;
  },
  chainWebpack: config =>
  {
    config.resolve.symlinks(false);
    config.resolve.alias.set('src', path.resolve(__dirname, 'src'));

    // !!!!!!! -- https://github.com/vuejs/vue-cli/issues/2978#issuecomment-441426094
    config.output.devtoolModuleFilenameTemplate(info =>
    {
      const resPath = path.normalize(info.resourcePath).split(path.sep).join('/');
      const isVue = resPath.match(/\.vue$/) && resPath.match(/^src/);
      //const isScript = info.query.match(/type=script/);
      //const hasModuleId = info.moduleId !== '';
      const isGenerated = info.allLoaders;

      const generated = `webpack-generated:///${resPath}?${info.hash}`;
      const vuesource = `vue-source:///${resPath}`;

      return isVue && !isGenerated ? vuesource : generated;
    });
    config.output.devtoolFallbackModuleFilenameTemplate('webpack:///[resource-path]?[hash]');

    // plugin options must be wrapped inside Array - otherwise error "non-callable @@iterator"
    if (process.env.NODE_ENV === 'development')
    {
      config.plugin('stylelintVue')
        .use(require('stylelint-webpack-plugin'),
          [
            {
              context: path.resolve(__dirname, 'src'),
              configFile: path.resolve(__dirname, 'stylelint.config.js'),
              files: '**/*.{vue,css,scss}',
              globbyOptions: { extension: false }, // IVO GELOV - otherwise "fastGlob" does not find anything if the folder contains brace(s)
              quiet: false,
              emitErrors: true
            }
          ]);
    }

    return config;
  }
};
