<template>
  <div class="quickPop-wrap">
    <div class="fixedBox" :style="{height: fixedHeight + 'px'}">
      <div ref="selectBox" class="selectBox">
        <div class="title">请选择快捷操作</div>
        <div class="selectCount">
          <span class="labeltext">已选：</span>
          <span class="errorNumber">{{ selectData.length }}</span>
          <span class="mainNumber">/8</span>
        </div>
        <div v-if="selectData.length" class="selectItem">
          <el-tag
            v-for="(data, index) in selectData"
            :key="index"
            size="medium"
            closable
            @close="reduceMenu(data)"
          >{{ data.name }}
          </el-tag>
        </div>
        <div v-else class="noSelect">
          无快捷操作
        </div>
      </div>
    </div>
    <div class="menuBox">
      <div v-for="(item, index) in menuData" :key="index" class="menuList">
        <div class="top">
          <div class="title">{{ item.name }}</div>
          <div>
            <i v-if="collapseActive.includes(item.id)" class="el-icon-arrow-down" @click="packUp(item.id)" />
            <i v-else class="el-icon-arrow-up" @click="unfold(item.id)" />
          </div>
        </div>
        <el-collapse v-model="collapseActive">
          <el-collapse-item :name="item.id">
            <div class="list">
              <div
                v-for="(data, i) in item.data"
                :key="i"
                class="menu"
                :class="selectResult.includes(data.name) ? 'isActive' : ''"
                @click="addMenu(data)"
              >{{ data.name }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>

</template>

<script>/**
 * quickPop create by Administrator
 * createTime 2020/9/23 17:47
 */

export default {
  name: 'QuickPop',
  components: {},
  filters: {},
  mixins: [],
  props: {
    selectData: {
      type: Array,
      default() {
        return []
      }
    },
    menuData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectResult: [],
      collapseActive: [],
      fixedHeight: 130
    }
  },
  computed: {},
  watch: {
    selectData: {
      handler() {
        this.$nextTick(() => {
          this.fixedHeight = this.$refs.selectBox.offsetHeight
          setTimeout(() => {
            this.fixedHeight = this.$refs.selectBox.offsetHeight
          }, 500)
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.selectData.forEach(item => {
      this.selectResult.push(item.name)
    })
    this.menuData.forEach(item => {
      this.collapseActive.push(item.id)
    })
  },
  methods: {
    packUp(id) {
      const index = this.collapseActive.indexOf(id)
      this.collapseActive.splice(index, 1)
    },
    unfold(id) {
      this.collapseActive.push(id)
    },
    reduceMenu(data) {
      this.selectData.forEach((item, index) => {
        if (item.name === data.name) {
          this.selectData.splice(index, 1)
          this.selectResult.splice(this.selectResult.indexOf(data.name), 1)
          return
        }
      })
    },
    addMenu(data) {
      if (this.selectResult.includes(data.name)) {
        this.selectData.forEach((item, index) => {
          if (item.name === data.name) {
            this.selectData.splice(index, 1)
            this.selectResult.splice(this.selectResult.indexOf(data.name), 1)
            return
          }
        })
      } else {
        if (this.selectData.length < 8) {
          this.selectData.push(data)
          this.selectResult.push(data.name)
        } else {
          this.$message.warning('最多可设置8个快捷操作')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.quickPop-wrap {

  .selectBox {
    position: absolute;
    top: 79px;
    left: 24px;
    right: 24px;
    padding-bottom: 8px;
    @include bgc_white();
    border-bottom: 1px solid #F2F2F2;

    .title {
      padding-bottom: 16px;
      font-size: 16px;
      @include c_title_color();
    }

    .selectCount {
      display: flex;
      padding-bottom: 12px;

      .labeltext {
        @include c_secondary_color();
      }

      .errorNumber {
        @include c_error_color();
      }

      .mainNumber {
        @include c_title_color();
      }
    }

    .selectItem {
      display: flex;
      flex-wrap: wrap;

      .el-tag {
        margin: 0 16px 16px 0;
        height: 32px;
        line-height: 30px;
        font-size: 14px;
      }
    }

    .noSelect {
      height: 48px;
      line-height: 48px;
      @include c_secondary_color();
    }
  }

  .menuBox {
    .menuList {
      .top {
        display: flex;
        justify-content: space-between;
        padding: 24px 0 16px;
        border-bottom: 1px solid #F2F2F2;

        .title {
          font-size: 16px;
          @include c_title_color();
        }

        .el-icon-arrow-down, .el-icon-arrow-up {
          @include c_secondary_color();
          cursor: pointer;

          &:hover {
            @include c_main_color();
          }
        }
      }

      ::v-deep .el-collapse {
        border: none;

        .el-collapse-item__header {
          display: none;
        }

        .el-collapse-item__wrap {
          border: none;

          .el-collapse-item__content {
            padding: 0;
          }
        }
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        padding-top: 8px;

        .menu {
          padding: 0 15px;
          margin: 16px 16px 0 0;
          height: 32px;
          line-height: 32px;
          @include c_text_color();
          @include bgc_white();
          border: 1px solid $divide-color;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            @include etm-color();
            @include etm-bdc();
          }

          &.isActive {
            color: $white !important;
            @include bgc_main_color();
            @include bc_main_color();

            &:hover {
              opacity: .8;
            }
          }
        }
      }
    }
  }
}
</style>
