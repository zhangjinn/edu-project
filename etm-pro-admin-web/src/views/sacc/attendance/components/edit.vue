<template>
  <div class="edit-wrap">
    <el-form ref="form" label-width="100px" :model="model" :rules="rules" label-position="right">
      <el-form-item label="送园: " prop="enterStatus">
        <el-radio-group v-model="model.enterStatus">
          <el-radio label="ON_TIME">准时出勤</el-radio>
          <el-radio label="BE_LATE">迟到</el-radio>
          <el-radio label="ABSENCE">缺勤&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          <el-radio label="REQUEST_FOR_LEAVE">请假</el-radio>
        </el-radio-group>
        <el-time-picker
          v-if="model.enterStatus === 'REQUEST_FOR_LEAVE'"
          v-model="model.enterStatusDescription"
          is-range
          range-separator="-"
          value-format="HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
      </el-form-item>
      <el-form-item label="签入时间: " prop="enterDate">
        <el-time-picker v-model="model.enterDate" value-format="timestamp" placeholder="请选择时间" />
      </el-form-item>
      <el-form-item label="离园: " prop="leaveStatus">
        <el-radio-group v-model="model.leaveStatus">
          <el-radio label="ON_TIME">准时离园</el-radio>
          <el-radio label="LEAVE_EARLY">早退</el-radio>
          <el-radio label="DELAY">延长签出</el-radio>
        </el-radio-group>
        <el-select
          v-if="model.leaveStatus === 'DELAY'"
          v-model="model.leaveStatusDescription"
          style="margin-left: 8px;"
          placeholder="请选择延迟时间"
        >
          <el-option
            v-for="item in optionsList"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="签出时间: " prop="leaveDate">
        <el-time-picker v-model="model.leaveDate" value-format="timestamp" placeholder="请选择时间" />
      </el-form-item>
      <el-form-item label="接送人: " prop="leaveSurrogate">
        <el-select v-model="model.leaveSurrogate" placeholder="请选择接送人">
          <el-option
            v-for="item in surrogateList"
            :key="item.name"
            :label="item.name +'-'+item.contactTypeName"
            :value="item.name +'-'+item.contactTypeName"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>/**
 *  2020/4/15 11:18
 *  haijinsha
 */
import { querySurrogateSelect } from '@/api/employee'

export default {
  name: 'EditAttendance',
  filters: {},
  mixins: [],
  props: {
    editData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      model: {
        enterStatus: '',
        enterStatusDescription: '',
        enterDate: '',
        leaveStatus: '',
        leaveStatusDescription: '',
        leaveDate: ''
      },
      optionsList: [
        {
          label: '1小时'
        },
        {
          label: '2小时'
        },
        {
          label: '3小时'
        },
        {
          label: '4小时'
        },
        {
          label: '5小时'
        }
      ],
      rules: {
        enterStatus: { required: false, message: '请选择一项', trigger: 'change' },
        leaveStatus: { required: false, message: '请选择一项', trigger: 'change' }
      },
      surrogateList: []
    }
  },
  computed: {},
  watch: {
    editData(value) {
      this.model = value
    }
  },
  created() {
    this.model = Object.assign({}, this.editData)
  },
  mounted() {
    querySurrogateSelect({ customerId: this.model.customerInfo.id }).then(res => {
      console.log(res)
      this.surrogateList = res.data
    })
  },
  methods: {
    validator() {
      return this.$refs.form.validate()
    },
    resetFields() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-wrap {

    & /deep/ .el-radio-group {
      min-width: 100px;

      .el-radio:not(:first-child) {
        margin-left: 14px;
      }
    }

    & /deep/ .el-date-editor {
      width: 250px;
    }
  }
</style>
