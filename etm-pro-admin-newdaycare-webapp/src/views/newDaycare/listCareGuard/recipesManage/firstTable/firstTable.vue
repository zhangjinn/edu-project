<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <span>{{ semesterName }}</span>
        <el-button
          slot="right"
          v-has="{authId: 'guardcare.recipes.create'}"
          type="primary"
          @click="handleAdd"
        >
          <i class="el-icon-plus" />&nbsp;&nbsp;添加食谱
        </el-button>
      </etm-table-tool-bar>
      <el-table-column
        slot="left"
        label="周次"
      >
        <template v-slot="scoped">
          <etm-text
            v-if="!hasAuthOfBool('guardcare.recipes.query')"
            type="normal"
          >
            {{ scoped.row.weekName }}
          </etm-text>
          <etm-text
            v-else
            type="primary"
            @click="handleEdit(scoped.row)"
          >
            {{ scoped.row.weekName }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
      >
        <template v-slot="scoped">
          <etm-text
            v-has="{authId: 'guardcare.recipes.remove'}"
            type="danger"
            @click="handleDelete(scoped.row)"
          >
            删除
          </etm-text>
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
        <add
          v-if="popVisibleEdit"
          ref="childPopForm"
          :semester-id="semesterId"
        />
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
} from '@/api/newDaycare/recipesGuardManage'
export default {
  name: 'MaterialTable',
  components: {
    add
  },
  mixins: [baseMixin],
  data () {
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

      weekRecipeId: null, // 周食谱id
      semesterId: null, // 学期id
      semesterName: null, // 周次id
      weekId: null,
      weekName: null,
      gradeId: null,
      gradeName: null
    }
  },

  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },

    // 获取列表
    init () {
      this.semesterId = this.getValueByProp('semester', this.formData) ? this.getValueByProp('semester', this.formData) : null
      this.semesterName = this.formData[1].options.find(val => val.value === this.semesterId).label
      // this.$store.commit('guardcareRecipesManage/set_semester_id', this.semesterId)

      const param1 = {
        gradeId: this.getValueByProp('grade', this.formData) ? this.getValueByProp('grade', this.formData) : null,
        courseTermId: this.semesterId,
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
    handleAdd () {
      this.weekRecipeId = null
      this.popVisibleEdit = true
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
    handleEdit (row) {
      this.weekRecipeId = row.weekRecipeId
      this.weekId = row.weekId
      this.weekName = row.weekName
      this.gradeId = row.gradeId
      this.gradeName = row.gradeName
      this.switchToWeekRecipe()
    },

    // 跳转至周食谱页
    switchToWeekRecipe () {
      this.$router.push({
        path: '/recipesGuardEdit',
        query: {
          weekRecipeId: this.weekRecipeId,
          semesterId: this.semesterId,
          weekId: this.weekId,
          weekName: this.weekName,
          gradeId: this.gradeId,
          gradeName: this.gradeName
        }
      })
    },

    // 弹窗关闭
    popCloseEdit () {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form
          this.semesterId = formData.semester
          this.weekId = formData.week
          this.weekName = formData.weekName
          this.gradeId = formData.grades.toString()
          this.gradeName = formData.gradeNames.toString()
          const param = {
            courseTermId: this.semesterId,
            weekId: this.weekId,
            gradeIdList: formData.grades
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
