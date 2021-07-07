<template>
  <div class="table">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      index
      @currentChange="currentChange"
    >
      <el-table-column slot="left" label="幼儿姓名" fixed="left" width="120">
        <template slot-scope="scoped">
          <a @click="showDetail(scoped.row)">{{ scoped.row.childName }}</a>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="性别" width="90">
        <template slot-scope="scoped">
          <span>{{ transferGender(scoped.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="入托日期" width="150">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.enrollmentTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="退园时间" width="150">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.leavingDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="退园原因" width="120">
        <template slot-scope="scoped">
          <span>{{ transferReason(scoped.row.outReason) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作" fixed="right" width="120">
        <template slot-scope="scoped">
          <etm-text v-has="{authId: 'guardcare.childSettled.create'}" type="primary" @click="enterAgain(scoped.row)">
            重新入园
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="simple"
      title="重新入园"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :model="formData" :rules="rule" type="dialog">
        <el-form-item label="幼儿姓名">
          <span>{{ childInfo.childName }}</span>
        </el-form-item>
        <el-form-item label="选择班级" prop="clazzValue">
          <etm-clazz-cascader @change="getClazz" />
        </el-form-item>
        <el-form-item prop="enrollmentTime">
          <span slot="label">
            <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">
              <span>入托日期<i class="iconfont iconquestion-circle" /></span>
              <div slot="content" style="color: #999999">
                入托当日即开始计算考勤，<br>
                请如实填写，有了考勤记录<br>
                后不能修改。
              </div>
            </el-tooltip>
          </span>
          <el-date-picker
            v-model="formData.enrollmentTime"
            type="date"
            placeholder="请选择入托日期"
            :clearable="false"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      type="big"
    >
      <detail
        :child-id="childId"
        :drawer-page="drawerPage"
      />
    </etm-drawer>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { childEnter, getLeaveChildList } from '@/api/guardcare/childManage/childManage'
import detail from '../../component/detail'
import EtmClazzCascader from '@/components/EtmClazzCascader'

export default {
  components: {
    detail,
    EtmClazzCascader
  },
  props: {
    searchInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
        {
          label: '家长姓名',
          prop: 'parentName'
        },
        {
          label: '联系电话',
          prop: 'telephone'
        },
        {
          label: '班级',
          prop: 'clazzName'
        }
      ],
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      },
      showPop: false,
      childInfo: {},
      formData: {},
      rule: {
        clazzValue: [{
          required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value || !value.length) {
              callback(new Error('班级不能为空'))
            } else {
              callback()
            }
          }
        }],
        enrollmentTime: [{ required: true, message: '入托日期不能为空', trigger: 'change' }]
      },
      showDrawer: false,
      childId: '',
      drawerPage: ''
    }
  },
  watch: {
    searchInfo: {
      handler() {
        this.pageNum = 1
        this.getList()
      },
      deep: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getClazz(value) {
      this.formData.clazzValue = value
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList() {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      getLeaveChildList(param).then(res => {
        this.tableData = res.data
      })
    },
    transferGender(data) {
      switch (data) {
        case 'MALE':
          return '男'
        case 'FEMALE':
          return '女'
        default:
          return data
      }
    },
    transferReason(data) {
      switch (data) {
        case 'GRADUATION':
          return '毕业退园'
        case 'TRANSFER':
          return '转校退园'
        case 'OTHER':
          return '其他原因'
        default:
          return data
      }
    },
    transferDate(date) {
      if (!isNaN(date)) {
        return parseTime(date, '{y}-{m}-{d}')
      } else {
        return date
      }
    },
    showDetail(row) {
      this.childId = row.childId
      this.drawerPage = 'leaveDetail'
      this.showDrawer = true
    },
    enterAgain(row) {
      this.childInfo = row
      this.formData = {
        clazzValue: []
      }
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            childIdList: [],
            clazzId: this.formData.clazzValue[1],
            enrollmentTime: parseTime(this.formData.enrollmentTime, '{y}-{m}-{d}')
          }
          param.childIdList.push(this.childInfo.childId)
          childEnter(param).then(() => {
            this.$message.success('入园成功')
            this.showPop = false
            this.getList()
          })
        }
      })
    },
    handlePopCancel() {
      this.showPop = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-cascader {
  width: 100%;
}
</style>
