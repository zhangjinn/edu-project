<template>
  <div>
    <etm-table-page
      :columns="columns"
      :data="tableData"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button v-if="treasureBook.enable" type="primary" @click.stop="openBook">
            {{ treasureBook.treasuredBookName }}
          </el-button>
          <el-button type="primary" @click="handleAdd">
            <i v-has="{authId: 'daycare.recipes.create'}" class="el-icon-plus" />&nbsp;&nbsp;添加食谱
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="周食谱">
        <template v-slot="scoped">
          <etm-text type="primary" @click="handleEdit(scoped.row)">{{ scoped.row.weekName }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="适用年龄段">
        <template v-slot="scoped">
          <!--          <p>{{ scoped.row.startAge + '岁至' + scoped.row.endAge + '岁' }}</p>-->
          <p>{{ scoped.row.generationName }}</p>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="scoped">
          <etm-text
            v-has="{authId:'daycare.recipes.remove'}"
            type="danger"
            @click="handleDelete(scoped.row)"
          >删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      cancel-btn="取消"
      confirm-btn="确定"
      pop="complex"
      title="添加食谱"
      @cancel="popCloseEdit"
      @close="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <add v-if="popVisibleEdit" ref="childPopForm" />
      </div>
    </etm-pop>
    <treasure-book :show-book="showBook" :book-data="treasureBook" @close="closeBook" />
  </div>

</template>

<script>
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import etmPop from '@/layout/main/EtmPop'
import add from './add'

import {
  createDaycareWeekRecipe,
  queryDaycareWeekRecipeList,
  removeDaycareWeekRecipe
} from '@/api/newDaycare/recipesManage'
import TreasureBook from '@/components/TreasuredBook'
import { queryTreasuredBook } from '@/api/base/treasuredBook'

export default {
  name: 'MaterialTable',
  components: {
    etmPop,
    add,
    TreasureBook
  },
  mixins: [baseMixin],
  data() {
    return {
      popVisibleEdit: false,
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '录入时间',
          prop: 'createDate',
          formatter(row, columns, val) {
            if (val) {
              return parseTime(val, '{y}-{m}-{d}')
            } else {
              return ''
            }
          }
        },
        {
          label: '备注',
          prop: 'remarks'
        }
      ],

      weekRecipeId: null,
      treasureBook: {},
      showBook: false

    }
  },
  created() {
    this.getTreasureBook()
  },
  methods: {
    getTreasureBook() {
      const param = {
        coding: 'shipuguanli'
      }
      queryTreasuredBook(param).then(res => {
        this.treasureBook = res.data
      })
    },
    openBook() {
      this.showBook = true
    },
    closeBook() {
      this.showBook = false
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset() {
      this.pageInfo.pageNum = 1
      this.init()
    },

    // 获取列表
    init() {
      // const generation = (this.getValueByProp('generation', this.formData) ? this.getValueByProp('generation', this.formData) : '').split('_')
      // const startAge = generation[0] || null
      // const endAge = generation[1] || null
      const generationId = this.getValueByProp('generationId', this.formData) ? this.getValueByProp('generationId', this.formData) : null
      const weekName = this.getValueByProp('week', this.formData) ? this.getDateWeek(this.getValueByProp('week', this.formData)) : null
      const param = {
        weekName,
        generationId,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }

      queryDaycareWeekRecipeList(param).then((res) => {
        const { data } = res
        // console.log('res', res)
        this.tableData = data
      })
    },

    // 添加
    handleAdd() {
      this.weekRecipeId = null
      this.popVisibleEdit = true
    },

    // 删除
    handleDelete(row) {
      console.log(row)
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该食谱？',
        // html: `<p>${row.weekName}</p><p>${row.startAge}岁至${row.endAge}岁</p>`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          // this.weekRecipeId = row.weekRecipeId
          removeDaycareWeekRecipe(row.weekRecipeId).then(() => {
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

    // 编辑食谱
    handleEdit(row) {
      this.weekRecipeId = row.weekRecipeId
      this.switchToWeekRecipe(row)
    },

    // 跳转至周食谱页
    switchToWeekRecipe(row) {
      this.$router.push({
        path: '/newdaycare_recipes/recipeEdit',
        query: {
          weekRecipeId: row.weekRecipeId,
          // startAge: row.startAge,
          // endAge: row.endAge,
          generationId: row.generationId,
          generationName: row.generationName,
          weekName: row.weekName,
          startDate: parseTime(row.startDate, '{y}-{m}-{d}'),
          endDate: parseTime(row.endDate, '{y}-{m}-{d}')
        }
      })
    },

    // 弹窗关闭
    popCloseEdit() {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form

          const param = {
            remarks: formData.remarks,
            weekName: this.getDateWeek(formData.weekName),
            startDate: formData.startDate,
            endDate: formData.endDate,
            generationId: formData.generationId,
            timeQuantumIdList: formData.meals
            // startAge: generation[0],
            // endAge: generation[1]
          }
          createDaycareWeekRecipe(param).then((res) => {
            const { data } = res
            this.popVisibleEdit = false
            this.weekRecipeId = data.weekRecipeId
            this.$message.success('新增成功')
            // this.switchToWeekRecipe({})
            this.init()
          })
        }
      })
    },
    getDateWeek(val) {
      if (!val) return
      const date = new Date(val)
      let firstDay = new Date(date.getFullYear(), 0, 1)
      const dayOfWeek = firstDay.getDay()
      let spendDay = 1
      if (dayOfWeek !== 0) spendDay = 7 - dayOfWeek + 1
      firstDay = new Date(date.getFullYear(), 0, 1 + spendDay)
      const d = Math.ceil((date.valueOf() - firstDay.valueOf()) / 86400000)
      const week = Math.ceil(d / 7) + 1
      const day = date.getDay()
      const startTimeNum = date.getTime() - (day - 1) * 86400000
      const endTimeNum = date.getTime() + (7 - day) * 86400000
      // const startTimeNum = date.valueOf() - (date.getDay() - 1) * 86400000
      // const endTimeNum = date.valueOf() + (7 - date.getDay()) * 86400000
      // const startTimeNum = date.valueOf() - (6 - spendDay) * 86400000
      // const endTimeNum = date.valueOf() + spendDay * 86400000
      const startDate = parseTime(startTimeNum, '{y}-{m}-{d}')
      const endDate = parseTime(endTimeNum, '{y}-{m}-{d}')
      // console.log(startDate + '至' + endDate + ' ' + week + '周')
      return startDate + '至' + endDate + ' ' + week + '周'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
