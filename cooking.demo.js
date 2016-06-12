var path = require('path');
var cooking = require('cooking');
var templatePath = './example/index.dev.html';

if (process.env.NODE_ENV === 'production') {
  templatePath = './example/index.html';
}

cooking.set({
  use: 'vue',
  entry: './example/entry.js',
  dist: './example/build',
  template: templatePath,
  devServer: {
    publicPath: '/',
    port: 8101
  },
  publicPath: '/el-pagination/',
  extends: ['vue', 'lint']
})

cooking.add('loader.md', {
  test: /\.md$/,
  loaders: ['vue-html-loader', 'highlight-loader', 'markdown-loader']
});
cooking.add('resolveLoader.root', [process.env.ELEMENT_TOOLBOX]);
cooking.add('vue.autoprefixer', false);

if (process.env.NODE_ENV === 'production') {
  cooking.add('externals', {
    vue:  'Vue'
  });
}

module.exports = cooking.resolve();
