var test = require('ava');
var Vue = require('vue');
var ElPagination = require('../dist/index.js');

test('el-pagination', t => {
  t.truthy(ElPagination.install);
});
