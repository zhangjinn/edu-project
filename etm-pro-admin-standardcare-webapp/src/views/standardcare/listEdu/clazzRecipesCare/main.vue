<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane
            label="班级食谱"
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
                <i class="el-icon-plus" /> 批量添加食谱
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
                    type="recipesList"
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

    <!--选择食谱-->
    <etm-pop
      :visible="popChooseRecipesVisible"
      pop="big"
      title="选择食谱"
      confirm-btn="使用该食谱"
      cancel-btn="取消"
      append-to-body
      @close="popChooseRecipesVisible = false"
      @cancel="popChooseRecipesVisible = false"
      @confirm="popChooseRecipesConfirm"
    >
      <div>
        <chooseRecipes
          v-if="popChooseRecipesVisible"
          ref="popChooseRecipes"
        />
      </div>
    </etm-pop>

    <!--批量添加食谱-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="批量添加食谱"
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
            label="选择食谱"
            prop="recipes"
            :rules="formValidate.nullValueRule(true,'请选择食谱')"
          >
            <el-tag
              v-if="form.recipes"
              closable
              @close="closeTag"
            >
              {{ form.recipes }}
            </el-tag>
            <el-button
              v-else
              type="primary"
              @click="popChooseRecipesVisible = true"
            >
              选择食谱
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
import clazzSetting from '@/views/standardcare/settings/clazzRecipesCareSetting/tabsItem/clazz'
import chooseRecipes from './chooseRecipes'
import cellList from './cellList'

import {
  queryWeekRecipesList,
  addWeekRecipes,
  updateWeekRecipes,
  removeWeekRecipes,
  careClazzSetting,
  queryCareClazz,
  queryCareClazzType
} from '@/api/standardcare/clazzRecipesCare'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    cellList,
    EtmCellAddBtn,
    chooseRecipes,
    weekPeriod,
    clazzSetting
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      popChooseRecipesVisible: false,
      popVisible: false,
      popSettingVisible: false,
      proType: 'detail',
      activeName: 'clazzRecipesLibrary',
      formData: [
        {
          label: '班级类型',
          type: 'select',
          prop: 'type',
          value: '',
          props: {
            filterable: true,
            placeholder: '请选择班级类型'
          },
          options: []
        },
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
        recipes: '',
        recipesId: '',
        startDate: '',
        endDate: '',
        clazz: []
      },
      clazzOptions: [],
      classesNumber: 0,
      startDate: '',
      endDate: '',
      clazzRecipesRowId: null,
      clazzRecipesColInfo: {},
      chooseRecipesId: null
    }
  },
  created () {
    this.getClazzType()
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
        clazzTypeId: this.getValueByProp('type', this.formData) ? this.getValueByProp('type', this.formData) : null,
        clazzName: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.columns = []
      this.tableData = []
      queryWeekRecipesList(param1).then((res) => {
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
        this.classesNumber = data.weekRecipesInfoList.length
        data.weekRecipesInfoList.forEach((item, index) => {
          item.weekCareRecipesInfo.id = item.clazzId
          item.weekCareRecipesInfo.name = item.clazzName
          this.tableData.push(item.weekCareRecipesInfo)
        })
      })
    },
    getClazzType () {
      queryCareClazzType({
        paged: false
      }).then((res) => {
        this.formData[0].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 批量添加食谱
    handleBatchAddRecipes () {
      this.clazzRecipesRowId = null
      this.proType = 'batchAdd'
      this.popVisible = true
      this.form = {
        recipes: '',
        recipesId: '',
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

    // 添加食谱
    handleAddRecipes (rowId, col) {
      this.clazzRecipesRowId = rowId
      this.clazzRecipesColInfo = col
      this.proType = 'add'
      this.popChooseRecipesVisible = true
    },

    // 编辑食谱
    handleEdit (rowId, col, cell) {
      this.clazzRecipesRowId = rowId
      this.clazzRecipesColInfo = col
      this.proType = 'edit'
      this.popChooseRecipesVisible = true
    },

    // 食谱详情
    handleDetail (rowId, rowName, col, cell) {
      this.clazzRecipesRowId = rowId
      this.clazzRecipesColInfo = col
      this.$router.push({
        path: '/standardcare_clazzRecipesDetail',
        query: {
          clazzId: this.clazzRecipesRowId,
          clazzName: rowName,
          recipesName: cell.name,
          weekStartDate: parseTime(this.clazzRecipesColInfo.startDate, '{y}-{m}-{d}')
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
          removeWeekRecipes({
            id: cell.id
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
      this.form.recipes = ''
      this.form.recipesId = ''
    },
    handleChangePop (val) {
      this.form.startDate = val.value1
      this.form.endDate = val.value2
    },

    // 确认选择食谱
    popChooseRecipesConfirm () {
      const chooseInfo = this.$refs.popChooseRecipes.chooseRecipesCurrentValue
      this.chooseRecipesId = chooseInfo.id

      if (this.proType === 'add') {
        const params = {
          clazzIdList: [this.clazzRecipesRowId],
          recipesId: this.chooseRecipesId,
          startDate: this.clazzRecipesColInfo.startDate,
          endDate: this.clazzRecipesColInfo.endDate
        }
        addWeekRecipes(params).then(() => {
          this.$message.success('已添加')
          this.popChooseRecipesVisible = false
          this.init()
        })
      } else if (this.proType === 'batchAdd') {
        this.form.recipes = chooseInfo.name
        this.form.recipesId = this.chooseRecipesId
        this.popChooseRecipesVisible = false
      } else if (this.proType === 'edit') {
        const params = {
          clazzId: this.clazzRecipesRowId,
          recipesId: this.chooseRecipesId,
          startDate: this.clazzRecipesColInfo.startDate,
          endDate: this.clazzRecipesColInfo.endDate
        }
        updateWeekRecipes(params).then(() => {
          this.$message.success('已更换')
          this.popChooseRecipesVisible = false
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
            recipesId: formData.recipesId,
            startDate: formData.startDate,
            endDate: formData.endDate
          }
          addWeekRecipes(params).then(() => {
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
