const ElPagination = require('./component');

module.exports = {
  ElPagination,
  install(Vue) {
    Vue.component('el-pagination', ElPagination);
  }
};

