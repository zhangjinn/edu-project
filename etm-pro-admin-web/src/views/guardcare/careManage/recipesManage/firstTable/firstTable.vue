<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button v-has="{authId: 'guardcare.recipes.create'}" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加食谱</el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="周次">
        <template v-slot="scoped">
          <etm-text v-if="!hasAuthOfBool('guardcare.recipes.query')" type="normal">{{ scoped.row.weekName }}</etm-text>
          <etm-text v-else type="primary" @click="handleEdit(scoped.row)">{{ scoped.row.weekName }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="scoped">
          <etm-text v-has="{authId: 'guardcare.recipes.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加食谱"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <add v-if="popVisibleEdit" ref="childPopForm" />
      </div>
    </etm-pop>
  </div>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import add from './add'

import {
  getWeekRecipe,
  postWeekRecipe,
  delWeekRecipe
} from '@/api/guardcare/careManage/recipesManage'
export default {
  name: 'MaterialTable',
  components: {
    add
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
          label: '适用年级',
          prop: 'gradeName'
        }
      ],

      weekRecipeId: null

    }
  },
  computed: {
    semesterId() {
      return this.$store.state.guardcareRecipesManage.semesterId
    }

  },

  methods: {
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
      const param1 = {
        gradeId: this.getValueByProp('grade', this.formData) ? this.getValueByProp('grade', this.formData) : null,
        courseTermId: this.getValueByProp('semester', this.formData) ? this.getValueByProp('semester', this.formData) : null,
        weekId: this.getValueByProp('week', this.formData) ? this.getValueByProp('week', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getWeekRecipe(param1).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((val) => {
          const gradeName = []
          const gradeId = []
          val.gradeList.map((v) => {
            gradeName.push(v.gradeName)
            gradeId.push(v.gradeId)
          })
          val.gradeName = gradeName.toString()
          val.gradeId = gradeId.toString()
        })
      })
    },

    // 添加
    handleAdd() {
      this.weekRecipeId = null
      this.popVisibleEdit = true
    },

    // 删除
    handleDelete(row) {
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.weekRecipeId = row.weekRecipeId
          delWeekRecipe(this.weekRecipeId).then((res) => {
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
      this.$store.commit('guardcareRecipesManage/set_week_id', row.weekId)
      this.$store.commit('guardcareRecipesManage/set_week_name', row.weekName)
      this.$store.commit('guardcareRecipesManage/set_grade_id', row.gradeId)
      this.$store.commit('guardcareRecipesManage/set_grade_name', row.gradeName)
      this.switchToWeekRecipe()
    },

    // 跳转至周食谱页
    switchToWeekRecipe() {
      const weekId = this.$store.state.guardcareRecipesManage.weekId
      const weekName = this.$store.state.guardcareRecipesManage.weekName
      const gradeId = this.$store.state.guardcareRecipesManage.gradeId
      const gradeName = this.$store.state.guardcareRecipesManage.gradeName
      this.$router.push({
        path: '/guardcareSettings/guardcare_recipeEdit',
        query: {
          weekRecipeId: this.weekRecipeId,
          semesterId: this.semesterId,
          weekId: weekId,
          weekName: weekName,
          gradeId: gradeId,
          gradeName: gradeName

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
            courseTermId: formData.semester,
            weekId: formData.week,
            gradeIdList: formData.grade
          }
          postWeekRecipe(param).then((res) => {
            const { data } = res
            this.popVisibleEdit = false
            this.weekRecipeId = data.weekRecipeId

            this.switchToWeekRecipe()
          })
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
</style>
