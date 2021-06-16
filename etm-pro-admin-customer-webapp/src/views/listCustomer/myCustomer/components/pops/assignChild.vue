<template>
  <div class="assignCustomers">
    <etm-pop
      title="分配客户"
      cancel-btn="取消"
      pop="complex"
      :visible="isShow"
      @cancel="cancel"
      @close="cancel"
      @confirm="confirm"
    >
      <etm-form
        ref="form"
        :model="assignForm"
        type="dialog"
      >
        <el-form-item
          label="批次号"
          required
        >
          <el-input
            v-model="assignForm.batchNumber"
            placeholder="请输入批次号"
          />
        </el-form-item>
        <el-form-item label="分配方式">
          <el-radio-group
            v-model="assignForm.assignWay"
            @change="changeAssignWay"
          >
            <el-radio
              v-for="val in assignWayList"
              :key="val.value"
              :label="val.value"
            >
              {{ val.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider />
        <div class="assignTargetContent">
          <div class="assignTargetLeft">
            <div class="assignSourceText">
              <div>
                {{ assignForm.assignWay | assignWayFilter }}分配
              </div>
              <div
                v-if="assignForm.assignWay === 'AVERAGE'"
                class="selectCustomer"
              >
                <span>已选<span>{{ assignForm.assignTarget.length }}</span>个</span>
              </div>
            </div>
            <div class="assignSource">
              <el-tree
                ref="tree"
                :props="props"
                :load="loadNode"
                lazy
                node-key="id"
                check-strictly
                show-checkbox
                @check-change="handleCheckChange"
                @node-click="handleNodeClickOrg"
              />
            </div>
          </div>
          <div class="assignTargetRight">
            <div class="assignTargetText">
              <div>
                <etm-label>分配给</etm-label>
              </div>
              <div
                v-if="assignForm.assignWay === 'AVERAGE'"
                class="assignedCustomer"
              >
                <span>已分配<span><span
                  class="assignedNum"
                >{{ hasAssignedNum }}</span>/{{ (selectedCustomerRow || []).length }}</span>个</span>
              </div>
            </div>

            <ul
              v-if="assignForm.assignWay === 'AVERAGE'"
              class="assignTarget"
            >
              <li
                v-for="(item,index) in assignForm.assignTarget"
                :key="index"
              >
                <span> {{ item.assignName }} </span>
                <el-input
                  v-model="item.assignNumber"
                  placeholder="请输入分配数量"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  @change="computedAssignNum"
                />
              </li>
            </ul>
            <ul
              v-else
              class="assignTarget"
            >
              <li
                v-for="(item,index) in assignForm.assignTarget"
                :key="index"
              >
                <span> {{ item.assignName }} </span>
              </li>
            </ul>
          </div>
        </div>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import { getCurrentOrganizationId } from '@/utils/auth'
import formValidate from '@/utils/rules'
import etmLabel from '@/components/EtmLabel'
import { validNumber } from '@/utils/validate'
import { assignCustomer } from '@/api/customer2'
import {
  queryOrgDepartment,
  queryOrgEmployee
} from '@/api/base/base'
import { createBatchNumber } from '@/utils/base'

export default {
  name: 'AssignChild',
  components: { etmLabel },
  filters: {},
  mixins: [],
  props: {
    selectedCustomerRow: {
      type: Array,
      default () {
        return []
      }
    },
    tableData: {
      type: Object,
      default () {
        return {
          content: []
        }
      }
    }
  },
  data () {
    return {
      isShow: false,
      formValidate,
      multipleLimit: 0,
      // 分配客户表单数据
      assignForm: {
        assignWay: 'AVERAGE',
        assignTarget: [],
        batchNumber: ''
      },
      hasAssignedNum: 0, // 平均分配时已分配的人员
      // 分配客户-分配方式列表
      assignWayList: [
        { value: 'AVERAGE', label: '自由分配' },
        { value: 'APPEND', label: '追加分配' },
        { value: 'REDO', label: '重新分配' }
      ],
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },

      assignCustomerList: [], // 需要分配客户列表
      assignCustomerNumber: 0, // 需要分配客户人数
      // selectedCustomerRow: '', // 选中的当前客户列表里的一条数据
      organizationId: ''
    }
  },
  computed: {},
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.assignForm.batchNumber = createBatchNumber()
        }
      }
    }
  },
  created () {
    // this.selectedCustomerRow = getSelectedCustomerRow()
    this.organizationId = getCurrentOrganizationId()
  },
  mounted () {
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
      this.$refs.form.$children[0].resetFields()
      this.assignForm = {
        assignWay: 'AVERAGE',
        assignTarget: [],
        batchNumber: ''
      }
    },
    cancel () {
      this.hide()
    },
    confirm () {
      this.sureAssign()
    },
    // 市场人员
    loadNode (node, resolve) {
      const that = this
      const arr = []
      let orgId = ''
      if (node.level === 0) {
        orgId = that.organizationId
        that.getRootOrgTreeLists(orgId, arr, resolve, 'root')
      } else {
        const oId = node.data.organizationId
        that.getRootOrgTreeLists(oId, arr, resolve)
      }
    },
    getRootOrgTreeLists (orgId, arr, resolve, root) {
      const param = {
        id: orgId
      }
      queryOrgDepartment(param).then((response) => {
        const result = response.data
        if (result.length > 0) { // 如果该层下存在组织
          result.forEach(v => {
            arr.push({
              name: v.name,
              value: v.id,
              organizationId: v.id,
              isOrg: true,
              disabled: true
              // leaf: false // 表明是叶子节点
            })
          })
        }
        const paramEmployee = {
          id: orgId
        }
        queryOrgEmployee(paramEmployee).then((res) => {
          const empData = res.data
          if (empData.length > 0) { // 如果该层下存在员工
            empData.forEach(v => {
              arr.push({
                name: v.name,
                value: v.id,
                employeeId: v.id,
                isOrg: false,
                leaf: true // 表明是叶子节点
              })
            })
          }
          resolve(arr)
        })
      })
    },

    // 选择的分配目标人员
    handleCheckChange (data, checked, indeterminate) {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      this.assignForm.assignTarget = []
      checkedNodes.forEach((val, index) => {
        this.assignForm.assignTarget.push({
          assignName: val.name,
          assignNumber: '',
          employeeId: val.employeeId
        })
      })
    },
    handleNodeClickOrg (data, node, $event) {
      // console.log(data)
    },
    // 计算已分配的人员数量
    computedAssignNum () {
      this.hasAssignedNum = 0
      this.assignForm.assignTarget.forEach((val, index) => {
        this.hasAssignedNum += Number(val.assignNumber)
      })
    },

    // 确定分配方案
    sureAssign () {
      if (this.assignForm.assignWay === '') {
        this.$message.warning('请选择分配方式')
        return false
      } else if (this.assignForm.batchNumber === '') {
        this.$message.warning('请输入批次号')
        return false
      } else if (!validNumber(this.assignForm.batchNumber)) {
        this.$message.warning('批次号需要输入数字类型')
        return false
      } else if (this.assignForm.assignTarget.length === 0) {
        this.$message.warning('请选择分配目标')
        return false
      }
      if (this.assignForm.assignWay === 'AVERAGE') {
        if (this.hasAssignedNum === 0) {
          this.$message.warning('请输入分配数量')
          return false
        }
        if (this.hasAssignedNum > this.selectedCustomerRow.length) {
          this.$message.warning('分配数量超出选择客户数量')
          return false
        }
      }

      // 传入分配客户接口数据
      const customerIdsArrary = []
      const employeeIdsArrary = []

      this.assignForm.assignTarget.forEach((item, index) => {
        const employeeId = item.employeeId
        employeeIdsArrary.push(parseInt(employeeId))
      })
      this.selectedCustomerRow.forEach((item, index) => {
        const customerId = item.id
        customerIdsArrary.push(parseInt(customerId))
      })

      const obj = {}
      this.assignForm.assignTarget.forEach((val, index) => {
        if (this.assignForm.assignWay === 'AVERAGE') {
          const num = val.assignNumber === '' ? 0 : Number(val.assignNumber)
          obj[employeeIdsArrary[index]] = num
        } else {
          obj[employeeIdsArrary[index]] = this.selectedCustomerRow.length
        }
      })

      const param = {
        customerIds: customerIdsArrary,
        employeeIds: employeeIdsArrary,
        assignType: this.assignForm.assignWay,
        employeeIdsAndCount: obj,
        batchCode: this.assignForm.batchNumber
      }

      assignCustomer(param).then((e) => {
        this.$message({
          message: '分配成功',
          type: 'success'
        })
        this.hide()
        this.$emit('update')
      })
    },

    // 客户分配方式改变时触发事件
    changeAssignWay () {
      this.$refs.tree.setCheckedKeys([])
      this.$refs.tree.setCheckedNodes([])
    }
  }
}
</script>
<style lang="scss" scoped>
.assignCustomers {
  font-size: 14px;
  font-weight: 400;
}
form {
  ::v-deep .el-form-item {
    margin-bottom: 10px;

    .el-input, .el-select, .el-cascader {
      width: 100%;
    }
  }

  ::v-deep .el-divider--horizontal {
    margin: 0;
  }

  .assignTargetContent {
    display: flex;

    .assignTargetLeft, .assignTargetRight {
      flex: 1;
    }

    ul {
      margin: 0;
      list-style-type: none;
      padding: 0 12px 0 24px;
      border-left: 1px solid $color-divide;
      height: 170px;
      overflow-y: auto;

      li {
        height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        i {
          font-size: 18px;
          cursor: pointer;
        }

        &::v-deep .el-input {
          width: 100px;

          .el-input__inner {
            text-align: right;
            padding: 0;
            border: none;
          }
        }
      }
    }

    .assignTargetLeft {
      .assignSourceText {
        padding: 16px 0;
        display: flex;
        justify-content: space-between;

        .selectCustomer {
          margin-right: 7px;
        }
      }

      .assignSource {
        height: 170px;
        overflow-y: auto;
      }
    }

    .assignTargetRight {
      .assignTargetText {
        padding: 16px 0 16px 24px;
        display: flex;
        justify-content: space-between;

        .assignedCustomer {
          margin-right: 7px;

          .assignedNum {
            @include etm-color();
          }
        }
      }
    }
  }
}
</style>
