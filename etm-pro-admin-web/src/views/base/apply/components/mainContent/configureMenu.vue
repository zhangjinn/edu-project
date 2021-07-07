<template>

  <div class="treeCol">
    <div class="myApplyHeader">
      <div class="headerText">配置菜单
        <tool-tip :content="'配置菜单的内容同步后会与左侧导航栏显示的<br/>内容保持一致，点击同步菜单后才会进行同<br/>步的操作'" :placement="'right'" />
      </div>
      <div class="saveBtn">
        <el-button class="filter-item" type="primary" @click="complete">同步菜单</el-button>
      </div>
    </div>
    <el-row :gutter="16" class="treeWidth">
      <el-col :span="12" class="menuPc">
        <div class="treeTop">
          <div class="treeTest"><span>电脑端</span></div>
          <draggable
            class="fileGroup"
            tag="el-collapse"
            :list="routeList"
            :component-data="collapseComponentData"
            group="people2"
            @change="log3"
          >
            <template v-if="item.type==='PC'">
              <el-collapse-item
                v-for="item in routeList"
                :key="item.id"
                :name="item.name"
                :data-id="item.id"
                class="listItem"
                icon="el-icon-edit"
                :disabled="item.editShow"
              >
                <template slot="title">
                  <div class="collapseName">
                    {{ item.name }}
                  </div>
                  <span v-if="!item.editShow" class="icon">
                    <i class="el-icon-edit-outline" @click="fileEdit(item)" />
                    <i class="el-icon-error" @click="fileDelete(item)" />
                  </span>
                  <div v-if="item.editShow">
                    <el-form
                      ref="visibleForm"
                      :model="item"
                      :rules="rules"
                      class="editForm"
                      @submit.native.prevent
                    >
                      <el-form-item prop="name">
                        <el-input
                          v-model="item.name"
                          v-focus
                          maxlength="6"
                          class="el-col-12"
                          @blur="editHide(item, 'visibleForm')"
                          @keyup.enter.native="onEdit(item,'visibleForm')"
                          @input="change($event)"
                        />
                      </el-form-item>
                    </el-form>
                  </div>

                </template>
                <draggable
                  class="listGroup"
                  :list="item.apps"
                  group="people"
                  @add="onAdd"
                  @change="log2"
                >
                  <div v-for="(element, idx) in item.apps" :key="idx" class="appItem">
                    {{ element.app.appName }}
                    <span class="icons">
                      <i class="el-icon-error" @click="applyDelete(element)" />
                    </span>
                  </div>
                </draggable>

              </el-collapse-item>
            </template>

            <div
              slot="footer"
              key="footer"
              class="btGroup"
              role="group"
              aria-label="Basic example"
            >
              <el-button class="filter-item" type="primary" icon="el-icon-folder-add" @click="fileAdd">添加文件夹</el-button>

            </div>
          </draggable>
        </div>
      </el-col>
      <el-col :span="12" class="menuMob">
        <div class="treeTop">
          <div class="treeTest"><span>移动端</span></div>
          <div class="fileMobile">

            <el-row v-for="(element, index) in routeList" :key="index">
              <template v-if="element.type==='MOBILE'">
                <div class="fileMobName">{{ element.name }}</div>
                <el-col
                  v-for="(data, id) in element.apps"
                  :key="id"
                  :span="24"
                  class="dragItem"
                >
                  <div class="fileBody">
                    <div class="dragBox">
                      <div class="drawIcon">
                        <i :class="data.app.icon" />
                      </div>
                      <div class="dragText">
                        <p>{{ data.app.appName }}</p>
                      </div>
                      <span class="mobileDel">
                        <i class="el-icon-error" @click="applyDelete(data)" />
                      </span>
                    </div>
                  </div>
                </el-col>
              </template>

            </el-row>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>

</template>

<script>
import draggable from 'vuedraggable'
import toolTip from '@/components/Tooltip/index'

export default {
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  },
  components: {
    draggable,
    toolTip
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['listApply', 'applyVal', 'routeList'],
  data() {
    return {
      activeNames: [1],
      collapseComponentData: {
        on: {
          input: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { min: 1, max: 6, message: '文件名长度最长为6个字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      board: this.applyVal,
      clone: ''
    }
  },
  created() {
  },
  methods: {
    inputChanged(val) {
      this.activeNames = val
    },
    fileAdd() {
      this.$emit('treeadd')
    },
    fileEdit(data) {
      console.log(data)
      this.$emit('treedit', data)
    },
    fileDelete(data) {
      this.$emit('treedelete', data)
    },
    applyDelete(data) {
      this.$emit('appdeleted', data)
    },
    log2(evt) {
      // window.console.log('子文件夹交换',evt);
    },
    log3(evt) {
      console.log(evt)
      // window.console.log('文件交换',evt);
    },
    onEdit(res, val) {
      this.$refs[val][0].validate((valid) => {
        if (valid) {
          this.$emit('keyupEnter', res)
        }
      })
    },
    editHide(res, val) {
      this.$refs[val][0].validate((valid) => {
        if (valid) {
          this.$emit('treeHide', res)
        }
      })
    },
    onAdd(evt) {
      console.log(evt)
    },
    complete() {
      this.$emit('handelComplete')
    },
    change(e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "src/styles/variables";
  @import "src/styles/mixin";

  $theme-hover-color: rgba(255, 144, 145, 0.15);
  .treeCol {
    position: relative;
    height: 100%;
    padding: 16px;
    @include border-radius(4px);
    @include bgc_white();
    font-size: $title-font-size;
    .treeWidth {
      height: 100%;
      .treeTop {
        height: 90%;
        @include bc_borderColorBase();
        box-shadow:0px 2px 9px 1px rgba(190,195,206,0.3);
        padding: 16px 0 5px;
        @include border-radius(4px);
        &>>>.el-collapse-item__header {
          padding-left: 14px;
        }
        &>>>.el-collapse-item__header {
          height: 42px;
          line-height: 42px;
          @include c_colorTextRegular();
        }
        &>>>.el-collapse-item__content {
          padding-bottom: 8px;
        }
        &>>>.el-form-item__content {
          line-height: 30px
        }
        &>>>.el-input__inner {
          height: 30px;
        }

        .fileMobile {
          overflow: auto;
          height: 90%;
        }

      }
      .fileMobName {
        margin-top: 12px;
        margin-bottom: 12px;
        padding-left: 16px;
      }
      .menuMob {
        .dragItem {
          cursor: pointer;
          padding-left: 20px;
          line-height: 1;
          .dragBox {
            position: relative;
            .drawIcon {
              position: relative;
              width: 16px;
              height: 16px;
              margin-right: 3px;
              border-radius: 50%;
              background-color: rgb(50, 150, 250);
              line-height: 1;
              color: #fff;
              float: left;
              i {
               margin-right: 8px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                font-size: 10px;
              }
            }
            .dragText {
              @include c_colorTextRegular();
            }
          }

          .treeTest {
            position: relative;
            margin-bottom: 50px;

            span {
              display: inline-block;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);

              &:before {
                content: '';
                @include bgc_themeColor();
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: relative;
                margin-right: 4px;

              }
            }
          }

          .mobileDel {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            display: none;
            font-size: 16px;
          }

          &:hover {
            background-color: $theme-hover-color;
            @include c_themeColorOne();

            .mobileDel {
              display: block;
            }
          }
        }
      }
    }

    & > > > .el-icon-arrow-right:before {
      content: '\e791' !important;
    }

    .fileGroup {
      height: 90%;
      overflow: auto;
      .listItem {
        position: relative;
        font-size: $title-font-size;

        & > > > div[role='button'] {
          border-bottom: 0;
          background-color: rgba(0, 0, 0, 0);

          .collapseName {
            flex: 1 0 90%;
            order: 1;
            font-size: $title-font-size;
          }

          .icon {
            display: none;
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 16px;
            .el-icon-edit-outline {
              margin-right: 8px;
            }
          }

          &:hover {
            background-color: $theme-hover-color;
            @include c_themeColorOne();

            .icon {
              display: block;
              .el-icon-edit-outline {
                color:  #909399;
              }
            }
          }

        }

        & > > > .el-collapse-item__wrap {
          background: rgba(0, 0, 0, 0);
        }

        .editForm {
          position: absolute;
          width: 65%;
          top: 5px;
          left: 27px;
          z-index: 99;

          .el-input {
            width: 100%;
          }
        }

        .listGroup {
          font-size: $title-font-size;
          cursor: pointer;
          .appItem {
            position: relative;

            @include c_colorTextRegular();
            padding:5px 0 5px 47px;
            .icons {
              display: none;
              position: absolute;
              top: 5px;
              right: 10px;
              font-size: 16px;
            }

            &:hover {
              background-color: $theme-hover-color;
              @include c_themeColorOne();

              .icons {
                display: block;
              }
            }
          }
        }
      }

      .btGroup {
        margin-top: 30px;
        text-align: center;
      }
    }

    & > > > .el-collapse {
      border: 0px;
    }

    .fileGroup::-webkit-scrollbar {
      display: none
    }

    .treeTest {
      width: 100%;
      height: 28px;
      padding-left: 16px;
      position: relative;

      span {
        display: inline-block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &:before {
          content: '';
          @include bgc_themeColor();
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: relative;
          margin-right: 8px;

        }
      }
    }

    .filter-item {
      text-align: right;
    }

    .myApplyHeader {
      margin-bottom: 16px;
      @include flex();
      .headerText {
        line-height: 33px;
      }
    }
  }

</style>
