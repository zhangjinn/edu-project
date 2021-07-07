<template>
  <div class="assignChild-wrap">
    <etm-form ref="assignChild" :model="assignForm" type="dialog" :rules="assignRules">
      <el-form-item label="分配批次号" prop="batchNumber">
        <el-input v-model="assignForm.batchNumber" />
      </el-form-item>
      <el-form-item label="已选中学员数" prop="selectedNum">
        <el-input v-model="assignForm.selectedNum" disabled />
      </el-form-item>
      <el-form-item label="待分配学员数" prop="waitingNum">
        <el-input v-model="assignForm.waitingNum" disabled />
      </el-form-item>
      <el-form-item label="分配跟进人员" prop="followId">
        <div style="display: flex;justify-content: space-between;margin-bottom: 24px;">
          <el-select v-model="assignForm.followId" filterable @change="handleSelectFollower">
            <el-option v-for="(follow) of followers" :key="follow.value" :label="follow.label" :value="follow.value" />
          </el-select>
          <el-button type="primary" @click="handleAssign">平均分配</el-button>
        </div>
        <etm-table :data="assignForm.tableData">
          <el-table-column slot="left" label="跟进人员" prop="label" />
          <el-table-column slot="left" label="分配数量">
            <template v-slot="{row}">
              <el-input v-model="row.number" @change="handleNumberChange(row)" />
            </template>
          </el-table-column>
          <el-table-column slot="left" label="操作">
            <template v-slot="{row}">
              <etm-text type="danger" @click="removeFollow(row)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table>
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import { createBatchNumber } from '@/utils/base'
import { unique } from '@/utils/arrUtils'
import { createAssignChild } from '@/api/newDaycare/childManage'
import baseMixin from '@/layout/mixin/baseMixin'

/**
 * assignChild create by haijinsha
 * createTime 2020/8/27 22:12
 */
export default {
  name: 'AssignChild',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    selected: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      assignForm: {
        batchNumber: '',
        selectedNum: this.selected.length,
        waitingNum: '',
        tableData: []
      },
      assignRules: {
        batchNumber: { required: true, message: '请输入批次号', trigger: 'blur' }
      },
      followers: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.handleAssignChild()
  },
  methods: {
    // 分配学员
    handleAssignChild() {
      queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
        this.followers = this.convertDataToOptions(res.data, 'name', 'id')
      })
      this.assignForm.batchNumber = createBatchNumber()
      this.computeChildNumber()
    },
    // 选跟进人
    handleSelectFollower(e) {
      const find = this.followers.find(item => item.value === e)
      this.assignForm.tableData.push({ ...find, number: '0' })
      this.assignForm.tableData = unique(this.assignForm.tableData, 'label')
      this.computeChildNumber()

      this.assignForm.followId = ''
    },
    // 计算分配人数
    computeChildNumber() {
      this.assignForm.selectedNum = this.selected.length

      const num = this.assignForm.tableData.reduce((result, current) => {
        return result + parseInt(current.number)
      }, 0)
      this.assignForm.waitingNum = this.assignForm.selectedNum - num < 0 ? 0 : this.assignForm.selectedNum - num
    },
    /**
     * 输入学员数时计算可分配数量,当大于可分配数量时计算最多可分配数量
     */
    handleNumberChange(row) {
      const total = this.assignForm.tableData.reduce((result, curr) => {
        return result + parseInt(curr.number)
      }, 0)
      this.computeChildNumber()
      if (total > this.assignForm.selectedNum) {
        row.number = 0
        const total = this.assignForm.tableData.reduce((result, curr) => {
          return result + parseInt(curr.number)
        }, 0)
        row.number = this.assignForm.selectedNum - total
      }
    },
    // 删除跟进人
    removeFollow(row) {
      this.assignForm.tableData.splice(this.assignForm.tableData.findIndex(item => item.label === row.label), 1)
      this.computeChildNumber()
    },
    // 平均分配
    handleAssign() {
      if (!this.assignForm.tableData.length) {
        this.$message.warning('请先选择跟进人')
        return
      }
      const avg = Math.floor(this.assignForm.selectedNum / this.assignForm.tableData.length)
      this.assignForm.tableData.forEach((item, index) => {
        item.number = avg
      })

      const sheng = this.assignForm.selectedNum - this.assignForm.tableData.length * avg
      if (sheng > 0) {
        for (let i = 0; i < sheng; i++) {
          this.assignForm.tableData[i].number = this.assignForm.tableData[i].number + 1
        }
      }

      // const last = this.assignForm.waitingNum % this.assignForm.tableData.length
      // this.assignForm.tableData[0].number += last
      this.computeChildNumber()
    },
    // 分配学员
    submitAssignChild() {
      this.$refs.assignChild.$children[0].validate(valid => {
        if (!valid) {
          return false
        }
        const { batchNumber: batchNo, tableData: followerList } = this.assignForm
        const childIdList = this.selected.map(item => item.id)
        const followerResult = followerList.map(item => {
          item.followerId = item.value
          return item
        })
        createAssignChild({ batchNo, followerList: followerResult, childIdList }).then(res => {
          this.$message.success('操作成功')
          this.assignChildVisible = false
          this.assignForm.tableData = []
          this.assignForm.followId = ''
          this.$emit('success')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .assignChild-wrap {

  }
</style>
