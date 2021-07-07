<template>
  <div class="staffOn-table-wrap">
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <etm-table-digit :data="storeDetailTipData" />
      </etm-table-tool-bar>
      <template slot="left">
        <el-table-column prop="photo" label="员工照片" width="130px" fixed show-overflow-tooltip>
          <template v-slot="scoped">
            <img v-if="scoped.row.avatar && scoped.row.avatar!== '--'" style="width: 100px;height: 100px;border-radius: 4px;" :src="scoped.row.avatar">
            <img v-else style="width: 100px;height: 100px;border-radius: 4px;" src="@/assets/images/newDaycare/photo.png">
          </template>
        </el-table-column>
        <el-table-column slot="left" label="员工姓名">
          <template v-slot="scoped">
            <etm-text type="primary" @click="handleDetail(scoped.row.employeeRecordId)">{{ scoped.row.employeeRecordName }}</etm-text>
          </template>
        </el-table-column>
      </template>
    </etm-table-page>

    <etm-drawer :visible.sync="isShowEditPopup" type="big">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big">
          <template v-if="isShowEditPopup" slot="tool">
            <el-button plain size="mini" @click="popCloseEdit">取消</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="isShowEditPopup" :employee-record-id="employeeRecordId" :employee-detail-data="employeeDetailData" />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
/**
 * staffOn-table create by Administrator
 * createTime 2021/1/28 10:27
 */
import EtmTableDigit from '@/components/EtmTableDigit'
import { queryStaffDetail, queryStaffList } from '@/api/newDaycare/staffFile'
import { parseTime } from '@/utils'
import detail from '../components/drawer/detail'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryAreaInfoByAreaId } from '@/api/base/base'

export default {
  name: 'StaffOnTable',
  components: {
    EtmTableDigit,
    detail
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    storeDetailTipData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isShowEditPopup: false,
      drawerType: 'edit',
      drawerTitle: '员工详情',
      employeeDetailData: {},
      employeeRecordId: undefined,
      tableData: {
        content: []
      },
      formData: [],
      eductionEnum: {
        primary_school: '小学',
        junior_high_school: '初中',
        high_school: '高中',
        technical_secondary_school: '中专',
        college: '大专',
        undergraduate: '本科',
        graduate_student: '研究生',
        doctoral: '博士',
        postdoctoral: '博士后'
      },
      columns: [
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '岗位',
          prop: 'positionName'
        },
        {
          label: '学历',
          prop: 'education'
        },
        {
          label: '入职时间',
          prop: 'entryTime'
        },
        {
          label: '入职时长',
          prop: 'entryDay'
        },
        {
          label: '户口所在地',
          prop: 'areaText'
        },
        {
          label: '手机号码',
          prop: 'telephone'
        },
        {
          label: '离职日期',
          prop: 'resignDate'
        },
        {
          label: '离职原因',
          prop: 'resignName'
        },
        {
          label: '备注',
          prop: 'remarks'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(this.formData, 'formdata')
      const params = Object.assign({
        resignStatus: true, // 在职状态
        employeeName: this.getValueByProp('employeeName', this.formData) ? this.getValueByProp('employeeName', this.formData) : '',
        telephone: this.getValueByProp('telephone', this.formData) ? this.getValueByProp('telephone', this.formData) : '',
        positionId: this.getValueByProp('positionId', this.formData) ? this.getValueByProp('positionId', this.formData) : ''
      }, this.search, this.pageInfo)
      console.log(params, 'params')
      queryStaffList(params).then(res => {
        this.tableData = res.data
        const result = res.data['content']
        result.forEach((cur, index) => {
          result[index].gender = cur.gender === null ? '--' : cur.gender === 'MALE' ? '男' : '女'
          result[index].entryTime = parseTime(cur.entryTime, '{y}-{m}-{d}')
          result[index].resignDate = parseTime(cur.resignDate, '{y}-{m}-{d}')
          result[index].education = this.eductionEnum[cur.education]
          if (cur.areaCode) {
            queryAreaInfoByAreaId({ areaId: cur.areaCode }).then(area => {
              // console.log(row.data)
              result[index].areaText = area.data.provinceName + '-' + area.data.cityName
              // console.log(v.areaCode)
            })
          } else {
            result[index].areaText = '--'
          }
        })
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    // 添加员工档案
    handleAdd() {
      console.log('111')
      this.isShowAddPopup = true
    },
    // 确认添加员工
    popConfirmAdd() {
      this.isShowAddPopup = false
    },
    // 取消添加员工
    popCloseAdd() {
      this.isShowAddPopup = false
    },
    // 确认编辑员工
    popConfirmEdit() {
      this.isShowEditPopup = false
    },
    popCloseEdit() {
      this.isShowEditPopup = false
    },
    // 详情处理
    async handleDetail(employeeRecordId) {
      await queryStaffDetail({ employeeRecordId }).then(res => {
        this.employeeDetailData = res.data
      })
      this.isShowEditPopup = true
      this.drawerType = 'detail'
      this.drawerTitle = '员工详情'
    }
  }
}
</script>
<style lang="scss" scoped>
  .staffOn-table-wrap {

  }
</style>
