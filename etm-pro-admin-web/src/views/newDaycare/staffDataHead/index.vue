<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div class="dataHead">
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/stuNumber.png" alt="">
                <div class="dataName">员工总数</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ staffInfo.employeeCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careStuNumber.png" alt="">
                <div class="dataName">幼儿园员工数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ staffInfo.kindergartenEmployeeCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/payout.png" alt="">
                <div class="dataName">托育员工数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ staffInfo.nurserySchoolEmployeeCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/toddlerRate.png" alt="">
                <div class="dataName">男员工数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ staffInfo.manEmployeeCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careRate.png" alt="">
                <div class="dataName">女员工数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ staffInfo.womanEmployeeCount }}</div>
              </div>
            </div>
          </div>
        </div>
        <div slot="body">
          <etm-table-page :columns="columns" :data="tableData" @currentChange="currentChange">
            <etm-table-tool-bar slot="tool">
              <div style="display: flex">
                <etm-screen-tab
                  v-model="quickScreening"
                  :options="searchItems"
                  @change="screenTabChange"
                />
                <div class="card">
                  <div class="card">
                    <span>园所：</span>
                    <el-cascader
                      v-model="value"
                      :props="{ checkStrictly: true }"
                      :options="options"
                      clearable
                      @change="handleChange"
                    />
                  </div>
                </div>
              </div>
            </etm-table-tool-bar>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/01/28 10:13
 */
import { queryOrganization, queryStaffInfo, queryStaffList } from '@/api/newDaycare/childDataHead'
import { parseTime } from '@/utils'
import { queryAreaInfoByAreaId } from '@/api/base/base'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      quickScreening: null,
      staffInfo: {},
      searchItems: [
        {
          name: '全部园所',
          value: null
        },
        {
          name: '幼儿园',
          value: 'kindergarten'
        }, {
          name: '托育园',
          value: 'nurserySchool'
        }
      ],
      tableData: {
        content: [
          {}
        ]
      },
      columns: [
        {
          label: '员工姓名',
          prop: 'employeeRecordName'
        },
        {
          label: '所在校区',
          prop: 'enterpriseName'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '出生日期',
          prop: 'birthday'
        },
        {
          label: '岗位',
          prop: 'positionName'
        },
        {
          label: '学历',
          prop: 'educationText'
        },
        {
          label: '入职时间',
          prop: 'entryTime'
        },
        {
          label: '入职时长',
          prop: 'entryDate'
        },
        {
          label: '户口所在地',
          prop: 'areaCode'
        },
        {
          label: '手机号码',
          prop: 'telephone'
        }
      ],
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
      value: null,
      options: [],
      areaName: null,
      enterpriseId: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getOrganization()
  },
  mounted() {
    this.init()
  },
  methods: {
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    init() {
      this.queryInfo()
      this.queryList()
    },
    // 获取员工信息
    queryInfo() {
      queryStaffInfo().then(res => {
        console.log(res, '获取员工信息')
        this.staffInfo = res.data
      })
    },
    // 获取员工列表
    queryList() {
      // const params = {}
      const params = Object.assign({
        areaName: this.areaName,
        enterpriseId: this.enterpriseId
      }, this.pageInfo)
      if (this.selectType === 'kindergarten') {
        params.kindergarten = true
      } else if (this.selectType === 'nurserySchool') {
        params.nurserySchool = true
      }
      queryStaffList(params).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(v => {
          v.gender = v.gender === null ? '--' : v.gender === 'MALE' ? '男' : '女'
          v.entryTime = (v.entryTime && parseTime(v.entryTime, '{y}-{m}-{d}')) || null
          v.birthday = (v.birthday && parseTime(v.birthday, '{y}-{m}-{d}')) || null
          v.educationText = this.eductionEnum[v.education]
          if (v.areaCode) {
            queryAreaInfoByAreaId({ areaId: v.areaCode }).then(row => {
              // console.log(row.data)
              v.areaCode = row.data.provinceName + '.' + row.data.cityName
              // console.log(v.areaCode)
            })
          }
        })
      })
    },
    screenTabChange(selectType) {
      this.selectType = selectType
      this.queryList()
    },
    getOrganization() {
      queryOrganization().then(res => {
        console.log(res.data)
        this.options = res.data
        this.options.forEach(v => {
          v.label = v.areaName
          v.value = null
          v.sonOrganizationVOList.forEach(i => {
            i.label = i.organizationName
            i.value = i.sonOrganizationId
          })
          v.children = v.sonOrganizationVOList
        })
      })
    },
    handleChange(e) {
      this.enterpriseId = e[1] || null
      this.areaName = e[0] || null
      this.pageInfo.pageNum = 1
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    .dataHead {
      display: flex;
      padding: 10px 5px 22px 5px;
      width: 100%;
      justify-content: space-between;

      .dataSon {
        //display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 24px;
        .top{
          display: flex;
          align-content: center;
          justify-content: center;
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }

        .dataNumber {
          font-size: 21px;
          font-weight: bold;
          color: #222222;
          text-align: center;
        }

        .dataName {
          //margin-top: 3px;
          font-size: 14px;
          font-weight: 400;
          color: #555555;
        }
      }

      .dataSon:last-child {
        margin-right: 0;
      }
    }

    .card {
      display: flex;
      margin-left: 68px;
    }

    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
