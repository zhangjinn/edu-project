<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane
            label="话术库"
            name="speechSource"
          >
            <etm-tool-bar
              v-model="formData"
              @search="reset"
              @reset="resetSearch"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <div class="content-wrapper">
          <div class="tool">
            <el-button
              slot="right"
              type="primary"
              @click="handleAdd"
            >
              <i class="el-icon-plus" />&nbsp;&nbsp;添加话术模板
            </el-button>
          </div>
          <div class="list">
            <ul v-if="speechLists.length">
              <li
                v-for="(speech, index) in speechLists"
                :key="index"
              >
                <el-image
                  :src="speech.url"
                  fit="cover"
                  @click="setting(speech)"
                >
                  <div
                    slot="placeholder"
                    class="image-slot"
                  >
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
                <div
                  class="name"
                  @click="setting(speech)"
                >
                  {{ speech.name }}
                </div>
                <div class="desc">
                  {{ speech.detail }}
                </div>
                <div class="bottom">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(speech)"
                  >
                    删除
                  </el-button>
                  <el-button
                    type="text"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(speech)"
                  >
                    编辑
                  </el-button>
                </div>
              </li>
            </ul>
            <div v-else>
              <etm-empty />
            </div>
          </div>
        </div>
      </template>
    </etm-layout-split>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="添加话术模板"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit
          v-if="popVisible && drawerType==='add'"
          ref="childPopForm"
          :type="drawerType"
        />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title
          :title="drawerTitle"
          border
          size="big"
        >
          <template
            v-if="drawerVisible && drawerType==='edit'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="drawerVisible = false"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="popConfirm"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <edit
            v-if="drawerVisible && drawerType==='edit' && speechId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="speechId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import {
  querySpeechTemplateList,
  addSpeechTemplate,
  updateSpeechTemplate,
  removeSpeechTemplate
} from '@/api/listSource/speechSource'
export default {
  name: 'Index',
  components: {
    edit
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'speechSource',
      popVisible: false,

      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '编辑话术模板',

      formData: [
        {
          label: '模板名称',
          type: 'input',
          prop: 'templateName',
          value: null,
          props: {
            placeholder: '请输入模板名称'
          }
        }
      ],

      speechLists: [],
      speechId: null

    }
  },
  created () {
    this.init()
  },

  methods: {
    setting (row) {
      this.$router.push({
        path: '/customer_speechContent',
        query: {
          speechId: row.id
        }
      })
    },
    resetSearch () {
      this.formData.forEach((item, index) => {
        item.value = null
      })
      this.reset()
    },
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 获取列表
    init () {
      const param1 = {
        name: this.getValueByProp('templateName', this.formData) ? this.getValueByProp('templateName', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      querySpeechTemplateList(param1).then((res) => {
        const { data } = res
        this.speechLists = data
      })
    },

    // 添加
    handleAdd () {
      this.speechId = null
      this.drawerType = 'add'
      this.popVisible = true
    },

    // 修改
    handleEdit (row) {
      if (row.id) {
        this.speechId = row.id
      }
      this.drawerType = 'edit'
      this.drawerVisible = true
    },

    // 删除
    handleDelete (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeSpeechTemplate({
            speechTemplateId: row.id
          }).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.reset()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 弹窗确定
    popConfirm () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form

          if (this.drawerType === 'add') {
            addSpeechTemplate({
              url: formData.coverSrcKey[0],
              name: formData.templateName,
              detail: formData.templateDesc
            }).then((res) => {
              this.popVisible = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            updateSpeechTemplate({
              url: formData.coverSrcKey[0],
              name: formData.templateName,
              detail: formData.templateDesc,
              speechTemplateId: this.speechId
            }).then((res) => {
              this.drawerVisible = false
              this.$message({
                message: '已修改',
                type: 'success'
              })
              this.reset()
            })
          }
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.name-box {
  display: flex;

  .img-left {
    border-radius: 4px;
    flex-shrink: 0;
    height: 60px;
    margin-right: 17px;
    width: 94px;

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }

  .info-right {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .author {
      color: #999;
      text-align: start;
    }
  }
}

.content-wrapper {
  .tool {
    text-align: right;
  }

  .list {
    padding-bottom: 16px;
    padding-top: 16px;

    ul {
      display: flex;
      flex-wrap: wrap;
      margin: -12px;

      li {
        border: 1px solid $color-control;
        border-radius: 4px;
        font-size: 14px;
        margin: 12px;
        padding: 16px;
        width: 214px;

        .el-image {
          cursor: pointer;
          height: 135px;
          width: 100%;
        }

        .name {
          @include etm-color();
          cursor: pointer;
          margin-top: 8px;
        }

        .desc {
          //box-orient: vertical;
          //color: $secondary-color;
          //display: box;
          //-webkit-line-clamp: 2;
          //overflow: hidden;
        }

        .bottom {
          display: flex;
          justify-content: flex-end;
        }

        .el-button--text {
          color: $color-disabled;
          padding-bottom: 0;

          &:hover {
            @include etm-color();
          }
        }

        .el-button--text+.el-button--text {
          margin-left: 16px;
        }

        &:hover {
          @include etm-bdc();
        }
      }
    }

  }

}

</style>
