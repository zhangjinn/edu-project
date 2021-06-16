<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane
            label="班级日程"
            name="clazzRecipesLibrary"
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
        <etm-table
          v-fixedHead
          :data="tableData"
        >
          <etm-table-tool-bar slot="tool">
            <etm-field-label label="班级数量">
              {{ classesNumber }}
            </etm-field-label>
            <div slot="right">
              <span
                class="period"
              >选择时间段</span>
              <weekPeriod
                ref="weekPeriod"
                @handleChange="handleChange"
              />
              <el-button
                type="primary"
                @click="handleBatchAddRecipes"
              >
                <i class="el-icon-plus" /> 批量添加日程
              </el-button>
              <el-button
                type="primary"
                @click="popSettingVisible = true"
              >
                <i class="el-icon-setting" /> 班级设置
              </el-button>
            </div>
          </etm-table-tool-bar>

          <el-table-column
            v-for="(col, index) of columns"
            :key="index"
            :prop="col.prop"
            :fixed="col.fixed"
            :width="col.prop==='name'?'200px':null"
            min-width="200px"
          >
            <template slot="header">
              <div class="tableHeaderCell">
                {{ col.label }}
              </div>
            </template>

            <template v-slot="scoped">
              <div class="clazzRecipesCell">
                <div v-if="col.prop==='name'">
                  <span class="name">{{ scoped.row.name }}</span>
                </div>
                <div
                  v-else
                  class="clazzRecipesInfo"
                >
                  <cellList
                    v-if="scoped.row[col.prop] && Object.keys(scoped.row[col.prop]).length !== 0"
                    type="scheduleList"
                    :data="scoped.row[col.prop]"
                    @handleDelete="handleDelete(scoped.row[col.prop])"
                    @handleEdit="handleEdit(scoped.row.id, col, scoped.row[col.prop])"
                    @handleDetail="handleDetail(scoped.row.id, scoped.row.name, col, scoped.row[col.prop])"
                  />

                  <EtmCellAddBtn
                    v-else
                    @click.native.stop="handleAddRecipes( scoped.row.id, col )"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
        </etm-table>
      </template>
    </etm-layout-split>

    <!--选择日程-->
    <etm-pop
      :visible="popChooseScheduleVisible"
      pop="big"
      title="选择日程"
      confirm-btn="使用该日程"
      cancel-btn="取消"
      append-to-body
      @close="popChooseScheduleVisible = false"
      @cancel="popChooseScheduleVisible = false"
      @confirm="popChooseScheduleConfirm"
    >
      <div>
        <chooseSchedule
          v-if="popChooseScheduleVisible"
          ref="popChooseSchedule"
        />
      </div>
    </etm-pop>

    <!--批量添加日程-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="批量添加日程"
      confirm-btn="确定"
      cancel-btn="取消"
      append-to-body
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <etm-form
          v-if="popVisible"
          ref="form"
          :model="form"
          type="dialog"
        >
          <el-form-item
            label="选择日程"
            prop="schedule"
            :rules="formValidate.nullValueRule(true,'请选择日程')"
          >
            <el-tag
              v-if="form.schedule"
              closable
              @close="closeTag"
            >
              {{ form.schedule }}
            </el-tag>
            <el-button
              v-else
              type="primary"
              @click="popChooseScheduleVisible = true"
            >
              选择日程
            </el-button>
          </el-form-item>
          <el-form-item
            label="选择周次"
            prop="startDate"
            :rules="formValidate.nullValueRule(true,'请选择周次')"
          >
            <weekPeriod
              ref="weekPeriodPop"
              @handleInit="handleChangePop"
              @handleChange="handleChangePop"
            />
          </el-form-item>
          <el-form-item
            label="使用班级"
            prop="clazz"
            :rules="formValidate.nullValueRule(true,'请选择使用班级',trigger = ['blur', 'change'], 'array')"
          >
            <el-select
              v-model="form.clazz"
              filterable
              multiple
              placeholder="请选择使用班级"
            >
              <el-option
                v-for="item in clazzOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>

    <!--班级设置-->
    <etm-pop
      :visible="popSettingVisible"
      pop="complex"
      title="班级设置"
      confirm-btn="确定"
      cancel-btn="取消"
      append-to-body
      @close="popSettingVisible = false"
      @cancel="popSettingVisible = false"
      @confirm="popSettingConfirm"
    >
      <div>
        <clazzSetting
          v-if="popSettingVisible"
          ref="popSetting"
        />
      </div>
    </etm-pop>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import weekPeriod from '@/views/standardcare/listEdu/clazzRecipesCare/components/weekPeriod'
import EtmCellAddBtn from '@/components/EtmWeeklyCalendar/components/EtmCellAddBtn'
import clazzSetting from '@/views/standardcare/settings/clazzScheduleCareSetting/tabsItem/clazz'
import chooseSchedule from './chooseSchedule'
import cellList from './cellList'

import {
  queryWeekScheduleList,
  addWeekSchedule,
  updateWeekSchedule,
  removeWeekSchedule,
  careClazzSetting,
  queryCareClazz
} from '@/api/standardcare/clazzScheduleCare'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    cellList,
    EtmCellAddBtn,
    chooseSchedule,
    weekPeriod,
    clazzSetting
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      popChooseScheduleVisible: false,
      popVisible: false,
      popSettingVisible: false,
      proType: 'detail',
      activeName: 'clazzRecipesLibrary',
      formData: [
        {
          label: '班级名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入班级名称'
          }
        }
      ],

      // 表格数据
      tableData: [],
      columns: [],
      form: {
        schedule: '',
        scheduleId: '',
        startDate: '',
        endDate: '',
        clazz: []
      },
      clazzOptions: [],
      classesNumber: 0,
      startDate: '',
      endDate: '',
      clazzScheduleRowId: null,
      clazzScheduleColInfo: {},
      chooseScheduleId: null,
      oldWeekScheduleId: null
    }
  },
  created () {
    this.$nextTick(function () {
      this.init()
    })
  },

  methods: {

    search () {
      this.init()
    },
    resetSearch () {
      this.formData.forEach((item, index) => {
        item.value = null
      })
      this.init()
    },

    // 日期改变
    handleChange () {
      this.init()
    },

    // 获取列表
    init () {
      this.startDate = this.$refs.weekPeriod.weekValue1
      this.endDate = this.$refs.weekPeriod.weekValue2
      const param1 = {
        name: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        startData: this.startDate,
        endData: this.endDate
      }
      this.columns = []
      this.tableData = []
      queryWeekScheduleList(param1).then((res) => {
        const { data } = res

        this.columns.push({
          label: '班级名称',
          prop: 'name',
          fixed: 'left'
        })
        const header = data.weekInfos
        header.forEach((item, index) => {
          const obj = {}
          obj.prop = `${item.weekNumber}`
          obj.label = `${item.year}年 ${item.weekNumber}周 \n ${parseTime(item.startDate, '{m}-{d}')} 至 ${parseTime(item.endDate, '{m}-{d}')}`
          obj.startDate = parseTime(item.startDate, '{y}-{m}-{d}')
          obj.endDate = parseTime(item.endDate, '{y}-{m}-{d}')
          obj.weekNumber = item.weekNumber
          obj.year = item.year
          this.columns.push(obj)
        })
        this.classesNumber = data.weekScheduleInfoList.length
        data.weekScheduleInfoList.forEach((item, index) => {
          item.weekScheduleInfo.id = item.id
          item.weekScheduleInfo.name = item.name
          this.tableData.push(item.weekScheduleInfo)
        })
      })
    },

    // 批量添加日程
    handleBatchAddRecipes () {
      this.clazzScheduleRowId = null
      this.proType = 'batchAdd'
      this.popVisible = true
      this.form = {
        schedule: '',
        scheduleId: '',
        startDate: '',
        endDate: '',
        clazz: []
      }
      queryCareClazz({
        pageNum: 1,
        pageSize: 100000
      }).then((res) => {
        this.clazzOptions = this.convertDataToOptions(res.data.content, 'clazzName', 'clazzId')
      })
    },

    // 添加日程
    handleAddRecipes (rowId, col) {
      this.clazzScheduleRowId = rowId
      this.clazzScheduleColInfo = col
      this.proType = 'add'
      this.popChooseScheduleVisible = true
    },

    // 编辑日程
    handleEdit (rowId, col, cell) {
      this.clazzScheduleRowId = rowId
      this.clazzScheduleColInfo = col
      this.oldWeekScheduleId = cell.id
      this.proType = 'edit'
      this.popChooseScheduleVisible = true
    },

    // 日程详情
    handleDetail (rowId, rowName, col, cell) {
      this.clazzScheduleRowId = rowId
      this.clazzScheduleColInfo = col
      this.oldWeekScheduleId = cell.id
      this.$router.push({
        path: '/standardcare_clazzScheduleDetail',
        query: {
          clazzId: this.clazzScheduleRowId,
          clazzName: rowName,
          scheduleName: cell.name,
          weekStartDate: parseTime(this.clazzScheduleColInfo.startDate, '{y}-{m}-{d}')
        }
      })
    },

    // 删除
    handleDelete (cell) {
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
          removeWeekSchedule({
            weekScheduleId: cell.id
          }).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.init()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    closeTag () {
      this.form.schedule = ''
      this.form.scheduleId = ''
    },
    handleChangePop (val) {
      this.form.startDate = val.value1
      this.form.endDate = val.value2
    },

    // 确认选择日程
    popChooseScheduleConfirm () {
      const chooseInfo = this.$refs.popChooseSchedule.chooseScheduleCurrentValue
      this.chooseScheduleId = chooseInfo.id

      if (this.proType === 'add') {
        const params = {
          clazzIdList: [this.clazzScheduleRowId],
          templateId: this.chooseScheduleId,
          startDate: this.clazzScheduleColInfo.startDate,
          endDate: this.clazzScheduleColInfo.endDate
        }
        addWeekSchedule(params).then(() => {
          this.$message.success('已添加')
          this.popChooseScheduleVisible = false
          this.init()
        })
      } else if (this.proType === 'batchAdd') {
        this.form.schedule = chooseInfo.name
        this.form.scheduleId = this.chooseScheduleId
        this.popChooseScheduleVisible = false
      } else if (this.proType === 'edit') {
        const params = {
          oldWeekScheduleId: this.oldWeekScheduleId,
          clazzIdList: [this.clazzScheduleRowId],
          templateId: this.chooseScheduleId,
          startDate: this.clazzScheduleColInfo.startDate,
          endDate: this.clazzScheduleColInfo.endDate
        }
        updateWeekSchedule(params).then(() => {
          this.$message.success('已更换')
          this.popChooseScheduleVisible = false
          this.init()
        })
      }
    },

    // 确认批量添加
    popConfirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.form
          const params = {
            clazzIdList: formData.clazz,
            templateId: formData.scheduleId,
            startDate: formData.startDate,
            endDate: formData.endDate
          }
          addWeekSchedule(params).then(() => {
            this.$message.success('已添加')
            this.popVisible = false
            this.init()
          })
        }
      })
    },

    // 确认班级设置
    popSettingConfirm () {
      const listArray = this.$refs.popSetting.listArray
      const clazzIdList = []
      if (listArray.length) {
        listArray.map(item => {
          item.checkedClazz.map(id => {
            clazzIdList.push(id)
          })
        })
      }
      careClazzSetting({
        clazzIdList: clazzIdList
      }).then((res) => {
        this.$message.success('设置成功')
        this.popSettingVisible = false
        this.init()
      })
    }

  }
}
</script>

<style scoped lang="scss">
.main-wrap {
  .period {
    margin-right: 8px;
  }

  ::v-deep .EtmFieldLabel-wrap {
    padding-bottom: 0;
  }

  ::v-deep .EtmLayoutSplit-wrap {
    .layout-body {
      padding-bottom: 16px;
    }
  }
}

::v-deep.tableHeaderCell {
  text-align: center;
  white-space: pre;
}

</style>
