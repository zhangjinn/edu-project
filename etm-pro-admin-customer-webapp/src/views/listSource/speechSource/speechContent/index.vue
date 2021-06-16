<template>
  <div class="main-wrap">
    <etm-layout-split>
      <etm-table-page
        :data="tableData"
        :columns="columns"
        @currentChange="currentChange"
      >
        <etm-table-tool-bar
          slot="tool"
          v-model="formData"
        >
          <div class="search-box">
            <etm-tool-bar
              v-model="formData"
              query-btn="搜索"
              @search="reset"
              @reset="resetSearch"
            />
          </div>

          <el-button
            slot="right"
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" />&nbsp;&nbsp;添加话术内容
          </el-button>
        </etm-table-tool-bar>

        <el-table-column
          slot="right"
          label="操作"
        >
          <template v-slot="scoped">
            <etm-text
              type="primary"
              @click="handleEdit(scoped.row)"
            >
              编辑
            </etm-text>
            <etm-text
              type="danger"
              @click="handleDelete(scoped.row)"
            >
              删除
            </etm-text>
          </template>
        </el-table-column>
      </etm-table-page>
    </etm-layout-split>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="添加话术内容"
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
            v-if="drawerVisible && drawerType==='edit' && speechContentId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="speechContentId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import { parseTime } from '@/utils'
import {
  querySpeechContentList,
  addSpeechContent,
  updateSpeechContent,
  removeSpeechContent
} from '@/api/listSource/speechSource'
export default {
  name: 'Index',
  components: {
    edit
  },
  mixins: [baseMixin],
  data () {
    return {
      popVisible: false,
      drawerVisible: false,
      drawerType: 'add',
      drawerTitle: '修改话术内容',

      formData: [
        {
          label: '使用场合',
          type: 'input',
          prop: 'useOccasion',
          value: null,
          props: {
            placeholder: '请输入搜索内容'
          }
        }
      ],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '使用场合',
          prop: 'situation'
        },
        {
          label: '话术内容',
          prop: 'content'
        },
        {
          label: '登记时间',
          prop: 'signTime'
        },
        {
          label: '登记人',
          prop: 'signPerson'
        }
      ],
      speechId: null,
      speechContentId: null

    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.name === 'customer_speechContent') {
          this.speechId = parseInt(val.query.speechId)
          console.log(this.speechId)
          this.init()
        }
      },
      // 深度观察监听
      immediate: true,
      deep: true
    }
  },

  methods: {
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
        templateId: this.speechId,
        situation: this.getValueByProp('useOccasion', this.formData) ? this.getValueByProp('useOccasion', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      querySpeechContentList(param1).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((item) => {
          item.signTime = parseTime(item.signTime, '{y}-{m}-{d}')
        })
      })
    },

    // 添加
    handleAdd () {
      this.speechContentId = null
      this.drawerType = 'add'
      this.popVisible = true
    },

    // 修改
    handleEdit (row) {
      if (row.id) {
        this.speechContentId = row.id
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
          removeSpeechContent({
            speechContentId: row.id
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
            addSpeechContent({
              templateId: this.speechId,
              situation: formData.useOccasion,
              content: formData.templateDesc
            }).then((res) => {
              this.popVisible = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            updateSpeechContent({
              templateId: this.speechId,
              situation: formData.useOccasion,
              content: formData.templateDesc,
              speechContentId: this.speechContentId
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
.search-box {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>
