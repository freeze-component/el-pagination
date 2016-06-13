<template>
  <ul @click="onPagerClick($event)" class="el-pager">
    <li :class="{ active: currentPage === 1 }" v-if="pageCount > 0" class="number">1</li>
    <li class="ellipsis btn-quickprev" v-if="showPrevMore"></li>
    <li v-for="pager in pagers" :class="{ active: $parent.currentPage === pager }" class="number">{{ pager }}</li>
    <li class="ellipsis btn-quicknext" v-if="showNextMore"></li>
    <li :class="{ active: currentPage === pageCount }" class="number" v-if="pageCount > 1">{{ pageCount }}</li>
  </ul>
</template>

<style>
  .el-pager {
    user-select: none;
    list-style: none;
    display: inline-block;
    vertical-align: top;
    font-size: 0;
    padding: 0;
  }

  .el-pager li {
    border: 1px solid #d3dce6;
    border-right: 0;
    background: #fff;
    vertical-align: top;
    display: inline-block;
    font-size: 14px;
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
  }

  .el-pager li:last-child {
    border-right: 1px solid #d3dce6;
  }

  .el-pager li.active + li {
    border-left: 0;
    padding-left: 1px;
  }

  .el-pager li.active {
    border-color: #20a0ff;
    background-color: #20a0ff;
    color: #fff;
    cursor: default;
  }

  .el-pager li.ellipsis {
    cursor: default;
  }

  .el-pager li.ellipsis:before {
    content: '...';
  }

  .el-pager li.btn-quickprev:hover {
    cursor: pointer;
    background: svg-load('assets/double-left.svg') center center no-repeat;
    background-size: 14px;
  }

  .el-pager li.btn-quicknext:hover {
    cursor: pointer;
    background: svg-load('assets/double-right.svg') center center no-repeat;
    background-size: 14px;
  }

  .el-pager li.ellipsis:hover:before {
    content: ' ';
  }
</style>

<script type="text/ecmascript-6">
  export default {
    name: 'ElPager',

    props: {
      currentPage: {
        type: Number
      },
      pageCount: {
        type: Number
      }
    },

    methods: {
      onPagerClick(event) {
        const target = event.target;
        if (target.tagName === 'UL') {
          return;
        }

        let newPage = Number(event.target.textContent);
        const pageCount = this.pageCount;
        const currentPage = this.currentPage;

        if (target.className.indexOf('ellipsis') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - 5;
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + 5;
          }
        }

        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }

          if (newPage > pageCount) {
            newPage = pageCount;
          }
        }

        this.currentPage = newPage;

        if (newPage !== currentPage) {
          this.$parent.$emit('current-change', newPage);
        }
      }
    },

    computed: {
      pagers() {
        const pagerCount = 7;

        const currentPage = Number(this.currentPage);
        const pageCount = Number(this.pageCount);

        let showPrevMore = false;
        let showNextMore = false;

        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - 2) {
            showPrevMore = true;
          }

          if (currentPage < pageCount - 2) {
            showNextMore = true;
          }
        }

        const array = [];

        if (showPrevMore && !showNextMore) {
          for (let i = pageCount - pagerCount; i < pageCount; i++) {
            array.push(i);
          }
        } else if (!showPrevMore && showNextMore) {
          for (let i = 2; i < pagerCount; i++) {
            array.push(i);
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.floor(pagerCount / 2) - 1;
          for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
            array.push(i);
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i);
          }
        }

        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;

        return array;
      }
    },

    data() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false
      };
    }
  };
</script>
