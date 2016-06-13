<template>
  <div class="el-pagination">
  </div>
</template>

<style>
  .el-pagination {
    padding: 2px 5px;
    background: #fff;
    color: #475669;
  }


  .el-pagination span {
    padding: 0 6px;
  }

  .el-pagination span,
  .el-pagination button {
    display: inline-block;
    font-size: 14px;
    min-width: 26px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
  }

  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    background: center center no-repeat;
    background-size: 16px;
    border: 1px solid #d3dce6;
    cursor: pointer;
  }

  .el-pagination .btn-prev {
    border-radius: 3px 0 0 3px;
    border-right: 0;
    background-image: svg-load('assets/left.svg', fill=#99a9bf, stroke=#99a9bf);
  }

  .el-pagination .btn-next {
    border-radius: 0 3px 3px 0;
    border-left: 0;
    background-image: svg-load('assets/right.svg', fill=#99a9bf, stroke=#99a9bf);
  }

  .el-pagination button {
    border: none;
    padding: 0 6px;
    background: transparent;
  }

  .el-pagination button:focus {
    outline: none;
  }

  .el-pagination button.disabled {
    color: #bbb;
    background-color: #d3dce6;
    cursor: default;
  }

  .el-pagination select {
    min-height: 28px;
    height: 28px;
    width: 50px;
    background: transparent;
    border: 1px solid #ddd;
    vertical-align: top;
  }

  .el-pagination-total {
  }

  .el-pagination-rightwrapper {
    float: right;
  }

  .el-pagination-editor {
    border: 1px solid #e5e6e7;
    border-radius: 3px;
    line-height: 18px;
    padding: 4px 2px;
    width: 30px;
    text-align: center;
    margin: 0 3px;
    box-sizing: border-box;
    transition: border 0.3s;
  }

  .el-pagination-editor:focus {
    outline: none;
    border-color: #1ab394;
  }
</style>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import Pager from './pager.vue';

  var TEMPLATE_MAP = {
    prev: '<span is="prev"></span>',
    jumper: '<span is="jumper"></span>',
    pager: '<span is="pager" :current-page.sync="currentPage" :page-count.sync="pageCount"></span>',
    next: '<span is="next"></span>',
    sizes: '<span is="sizes"></span>',
    slot: '<slot></slot>',
    total: '<span is="total"></span>'
  };

  export default {
    props: {
      pageSize: {
        type: Number,
        default: 10
      },

      total: {
        type: Number,
        default: 0
      },

      currentPage: {
        type: Number,
        default: 1
      },

      layout: {
        default: 'prev, pager, next, jumper, slot, ->, total'
      },

      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 30, 40, 50, 100];
        }
      }
    },

    components: {
      Prev: {
        template: '<button class="btn-prev" :class="{ disabled: $parent.currentPage <= 1 }" @click="$parent.prev()"></button>'
      },

      Next: {
        template: '<button class="btn-next" @click="$parent.next()" :class="{ disabled: $parent.currentPage === $parent.pageCount }"></button>'
      },

      Sizes: {
        template: '<select v-model="$parent.pageSize"><option v-for="item in $parent.pageSizes" value="{{item}}">{{item}}</option></select>'
      },

      Jumper: {
        data() {
          return {
            oldValue: null
          };
        },

        methods: {
          handleFocus(event) {
            this.oldValue = event.target.value;
          },

          handleChange(event) {
            const target = event.target;
            if (target.value !== this.oldValue && Number(target.value) === this.$parent.currentPage) {
              this.$parent.$emit('current-change', this.$parent.currentPage);
            }

            this.oldValue = null;
          }
        },

        template: `<span>前往<input class="el-pagination-editor"
          v-model="$parent.currentPage"
          @change="handleChange($event)"
          @focus="handleFocus($event)" style="width: 30px;" number lazy />
          页</span>`
      },

      Total: {
        template: '<span class="el-pagination-total">共 {{$parent.total}} 条</span>'
      },

      Pager
    },

    methods: {
      prev() {
        const oldPage = this.currentPage;
        const newVal = this.currentPage - 1;
        this.currentPage = this.getValidCurrentPage(newVal);

        if (this.currentPage !== oldPage) {
          this.$emit('current-change', this.currentPage);
        }
      },

      next() {
        const oldPage = this.currentPage;
        const newVal = this.currentPage + 1;
        this.currentPage = this.getValidCurrentPage(newVal);

        if (this.currentPage !== oldPage) {
          this.$emit('current-change', this.currentPage);
        }
      },

      first() {
        const oldPage = this.currentPage;
        const newVal = 1;
        this.currentPage = this.getValidCurrentPage(newVal);

        if (this.currentPage !== oldPage) {
          this.$emit('current-change', this.currentPage);
        }
      },

      last() {
        const oldPage = this.currentPage;
        const newVal = this.pageCount;
        this.currentPage = this.getValidCurrentPage(newVal);

        if (this.currentPage !== oldPage) {
          this.$emit('current-change', this.currentPage);
        }
      },

      getValidCurrentPage(value) {
        value = parseInt(value, 10);

        var resetValue;
        if (value < 1) {
          resetValue = this.pageCount > 0 ? 1 : 0;
        } else if (value > this.pageCount) {
          resetValue = this.pageCount;
        }

        if (resetValue === undefined && isNaN(value)) {
          value = this.pageCount > 0 ? 1 : 0;
        }

        return resetValue === undefined ? value : resetValue;
      }
    },

    created() {
      this.$options._linkerCachable = false;
      let template = '<div class="el-pagination">';
      const layout = this.$options.layout || this.layout || '';

      const components = layout.split(',').map((item) => item.trim());

      let haveRightWrapper = false;

      components.forEach((component) => {
        if (component === '->') {
          haveRightWrapper = true;
          template += '<div class="el-pagination-rightwrapper">';
        } else {
          if (!TEMPLATE_MAP[component]) {
            console.warn('layout component not resolved:' + component);
          }
          template += TEMPLATE_MAP[component] || '';
        }
      });

      if (haveRightWrapper) {
        template += '</div>';
      }
      template += '</div>';

      this.$options.template = template;
    },

    computed: {
      pageCount() {
        return Math.ceil(this.total / this.pageSize);
      },

      startRecordIndex() {
        const result = (this.currentPage - 1) * this.pageSize + 1;
        return result > 0 ? result : 0;
      },

      endRecordIndex() {
        const result = this.currentPage * this.pageSize;
        return result > this.total ? this.total : result;
      }
    },

    watch: {
      pageCount(newVal) {
        if (newVal > 0 && this.currentPage === 0) {
          this.currentPage = 1;
        } else if (this.currentPage > newVal) {
          this.currentPage = newVal;
        }
      },

      currentPage(newVal, oldVal) {
        newVal = parseInt(newVal, 10);

        if (isNaN(newVal)) {
          newVal = oldVal || 1;
        } else {
          newVal = this.getValidCurrentPage(newVal);
        }

        if (newVal !== undefined) {
          Vue.nextTick(() => {
            this.currentPage = newVal;
          });
        }
      }
    },

    ready() {
      this.currentPage = this.getValidCurrentPage(this.currentPage);
    }
  };
</script>