<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          v-model="activeName"
          :setting="true"
          @setting="setting"
        >
          <el-tab-pane
            label="日程库"
            name="scheduleLibrary"
          >
            <etm-tool-bar
              v-model="formData"
              @search="search()"
              @reset="resetSearch"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          :index="true"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <el-button
              slot="right"
              type="primary"
              @click="addSchedule"
            >
              <i class="el-icon-plus" />&nbsp;&nbsp;添加日程
            </el-button>
          </etm-table-tool-bar>

          <template slot="left">
            <el-table-column
              prop="scheduleName"
              label="名称"
              width="200px"
              fixed
              show-overflow-tooltip
            >
              <template v-slot="scoped">
                <div class="schedule-name">
                  <div class="img-left">
                    <img
                      v-if="scoped.row.coverUrl && scoped.row.coverUrl!=='--'"
                      :src="scoped.row.coverUrl"
                      alt=""
                    >
                    <img
                      v-else
                      :src="scheduleDefaultCover"
                      alt=""
                      @click="handleEditSchedule(scoped.row)"
                    >
                  </div>
                  <div class="info-right">
                    <etm-text
                      type="primary"
                      @click="handleEditSchedule(scoped.row)"
                    >
                      {{ scoped.row.name }}
                    </etm-text>
                    <div class="author">
                      {{ scoped.row.label }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>

          <el-table-column
            slot="right"
            label="操作"
          >
            <template v-slot="scoped">
              <etm-text
                type="primary"
                @click="handleEditSchedule(scoped.row)"
              >
                编辑日程
              </etm-text>
              <etm-text
                type="primary"
                @click="handleEdit(scoped.row)"
              >
                编辑信息
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
      </template>
    </etm-layout-split>

    <!--添加日程弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="添加日程"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <edit
          v-if="popVisible && proType==='add'"
          ref="childPopForm"
          :type="proType"
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
            v-if="drawerVisible && proType==='edit'"
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
              @click="popConfirmEdit"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <edit
            v-if="drawerVisible && proType==='edit' && scheduleId"
            ref="childPopForm"
            :type="proType"
            :item-id="scheduleId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils/index'
import edit from './edit'
import {
  queryLabelList,
  queryWeekScheduleTemplateList,
  addWeekScheduleTemplate,
  updateWeekScheduleTemplate,
  removeWeekScheduleTemplate
} from '@/api/standardcare/listFeatures/scheduleManage'
export default {
  name: 'Index',
  components: {
    edit
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'scheduleLibrary',
      formData: [
        {
          label: '日程名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入日程名称'
          }
        },
        {
          label: '标签',
          type: 'select',
          prop: 'tag',
          value: [],
          props: {
            filterable: true,
            multiple: true,
            placeholder: '请选择标签'
          },
          options: []
        }
      ],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '录入日期',
          prop: 'createTime',
          align: 'left'
        },
        {
          label: '备注',
          prop: 'mark',
          align: 'left'
        }
      ],
      scheduleDefaultCover: require('@/assets/images/book-cover.png'),
      popVisible: false,
      drawerVisible: false,
      proType: 'detail',
      drawerTitle: '费用详情',
      scheduleId: null

    }
  },
  created () {
    this.queryLabelOptions()
    this.init()
  },
  activated () {

  },
  methods: {
    setting () {
      this.$router.push({ path: '/standardcare_scheduleManageSetting' })
    },
    search () {
      this.reset()
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
        name: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        labelId: this.getValueByProp('tag', this.formData) ? this.getValueByProp('tag', this.formData).join(',') : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      queryWeekScheduleTemplateList(param1).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((val) => {
          val.createTime = parseTime(val.createTime, '{y}-{m}-{d}')
        })
      })
    },

    // 标签列表
    queryLabelOptions () {
      queryLabelList().then(res => {
        if (res.data) {
          this.formData[1].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    // 添加日程
    addSchedule () {
      this.scheduleId = null
      this.proType = 'add'
      this.popVisible = true
    },

    // 编辑日程
    handleEditSchedule (row) {
      this.scheduleId = row.id
      this.$router.push({
        path: '/standardcare_scheduleDetail',
        query: {
          scheduleId: this.scheduleId,
          scheduleName: row.name
        }
      })
    },

    // 编辑信息
    handleEdit (row) {
      if (row.id) {
        this.scheduleId = row.id
      }
      this.proType = 'edit'
      this.drawerTitle = '修改日程'
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
          removeWeekScheduleTemplate({
            weekScheduleTemplateId: row.id
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
    popConfirmEdit () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form
          let imageList = ''
          if (formData.previewSrcKey.length > 0) {
            formData.previewSrcKey.map((val) => {
              imageList = val
            })
          }
          const param = {
            weekScheduleTemplateName: formData.name,
            labelIdList: formData.tags,
            coverUrl: imageList,
            mark: formData.remarks,
            bgcolor: formData.color
          }
          if (this.proType === 'add') {
            addWeekScheduleTemplate(param).then((res) => {
              this.popVisible = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.proType === 'edit') {
            param.weekScheduleTemplateId = this.scheduleId
            updateWeekScheduleTemplate(param).then((res) => {
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
.main-wrap {
  ::v-deep.el-table__row {
    td:nth-child(2) {
      padding: 17px 0;

      .cell {
        padding-left: 17px;
      }

      .schedule-name {
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
    }
  }

}

.popContent {
  padding-top: 10px;
}
</style>
