<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div class="dataHead">
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/stuNumber.png"
                  alt=""
                >
                <div class="dataName">
                  员工总数
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ staffInfo.employeeCount || 0 }}
                </div>
              </div>
            </div>
            <div
              v-if="staffInfo.topOrganization"
              class="dataSon"
            >
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/careClassNumber.png"
                  alt=""
                >
                <div class="dataName">
                  总部员工数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ staffInfo.hqEmployeeCount || 0 }}
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/careStuNumber.png"
                  alt=""
                >
                <div class="dataName">
                  幼儿园员工数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ staffInfo.kindergartenEmployeeCount || 0 }}
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/payout.png"
                  alt=""
                >
                <div class="dataName">
                  托育园员工数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ staffInfo.nurserySchoolEmployeeCount || 0 }}
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/toddlerRate.png"
                  alt=""
                >
                <div class="dataName">
                  男员工数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ staffInfo.manEmployeeCount || 0 }}
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/careRate.png"
                  alt=""
                >
                <div class="dataName">
                  女员工数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ staffInfo.womanEmployeeCount || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="body">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div style="display: flex;">
                <!--<etm-screen-tab-->
                <!--  v-model="quickScreening"-->
                <!--  :options="searchItems"-->
                <!--  @change="screenTabChange"-->
                <!--/>-->
                <swiperTabScreen
                  v-model="quickScreening"
                  :tab-list="searchItems"
                  @change="screenTabChange"
                />
                <div class="card">
                  <div class="card">
                    <span>园所：</span>
                    <el-select
                      v-model="classroomValue"
                      filterable
                      placeholder="请选择园所"
                      @change="handleChangeClassRoom"
                    >
                      <el-option
                        v-for="item in classroomList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <!--<el-cascader-->
                    <!--  v-model="value"-->
                    <!--  :props="{ checkStrictly: true }"-->
                    <!--  :options="options"-->
                    <!--  clearable-->
                    <!--  @change="handleChange"-->
                    <!--/>-->
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
import { queryStaffInfo, queryStaffList, querySearchItemList, queryClassRoomList } from '@/api/newDaycare/childDataHead'
import { parseTime } from '@/utils'
import { queryAreaInfoByAreaId } from '@/api/base/base'
import swiperTabScreen from './components/swiperTabScreen'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'Index',
  components: { swiperTabScreen },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      quickScreening: null,
      staffInfo: {},
      classroomList: [],
      searchItems: [
        {
          name: '全部',
          value: null
        }
        // {
        //   name: '幼儿园',
        //   value: 'kindergarten'
        // }, {
        //   name: '托育园',
        //   value: 'nurserySchool'
        // },
        // {
        //   name: '幼儿园',
        //   value: 'kindergarten'
        // }, {
        //   name: '托育园',
        //   value: 'nurserySchool'
        // },
        // {
        //   name: '幼儿园',
        //   value: 'kindergarten'
        // },
        // {
        //   name: '托育园',
        //   value: 'nurserySchool'
        // },
        // {
        //   name: '幼儿园',
        //   value: 'kindergarten'
        // },
        // {
        //   name: '托育园',
        //   value: 'nurserySchool'
        // },
        // {
        //   name: '幼儿园',
        //   value: 'kindergarten'
        // },
        // {
        //   name: '托育园',
        //   value: 'nurserySchool'
        // }
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
          prop: 'enterpriseName',
          width: '210'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age',
          width: '168',
          sortable: true,
          sortMethod (a, b) {
            const ageReg = /\d+(?=岁)/
            const monthReg = /\d+(?=个月)/
            const dayReg = /\d+(?=天)/

            const aAge = a.age.match(ageReg) ? +a.age.match(ageReg)[0] : 0
            const aMonth = a.age.match(monthReg) ? +a.age.match(monthReg)[0] : 0
            const aDay = a.age.match(dayReg) ? +a.age.match(dayReg)[0] : 0

            const bAge = b.age.match(ageReg) ? +b.age.match(ageReg)[0] : 0
            const bMonth = b.age.match(monthReg) ? +b.age.match(monthReg)[0] : 0
            const bDay = b.age.match(dayReg) ? +b.age.match(dayReg)[0] : 0

            return (aAge * 100 + aMonth * 10 + aDay * 1) - (bAge * 100 + bMonth * 10 + bDay)
          }
        },
        {
          label: '出生日期',
          prop: 'birthday',
          sortable: true,
          sortMethod (a, b) {
            const valueA = +a.birthday.replace(/-/g, '')
            const valueB = +b.birthday.replace(/-/g, '')
            const compareA = Number.isNaN(valueA) ? 0 : valueA
            const compareB = Number.isNaN(valueB) ? 0 : valueB
            return compareA - compareB
          }
        },
        {
          label: '岗位',
          prop: 'positionName',
          width: '120'
        },
        {
          label: '学历',
          prop: 'educationText'
        },
        {
          label: '入职时间',
          prop: 'entryTime',
          sortable: true,
          sortMethod (a, b) {
            const valueA = +a.entryTime.replace(/-/g, '')
            const valueB = +b.entryTime.replace(/-/g, '')
            const compareA = Number.isNaN(valueA) ? 0 : valueA
            const compareB = Number.isNaN(valueB) ? 0 : valueB
            return compareA - compareB
          }
        },
        {
          label: '入职时长',
          prop: 'entryDate',
          sortable: true,
          sortMethod (a, b) {
            const yearReg = /\d+(?=年)/
            const monthReg = /\d+(?=个月)/
            const dayReg = /\d+(?=天)/

            const aYear = a.entryDate.match(yearReg) ? +a.entryDate.match(yearReg)[0] : 0
            const aMonth = a.entryDate.match(monthReg) ? +a.entryDate.match(monthReg)[0] : 0
            const aDay = a.entryDate.match(dayReg) ? +a.entryDate.match(dayReg)[0] : 0

            const bYear = b.entryDate.match(yearReg) ? +b.entryDate.match(yearReg)[0] : 0
            const bMonth = b.entryDate.match(monthReg) ? +b.entryDate.match(monthReg)[0] : 0
            const bDay = b.entryDate.match(dayReg) ? +b.entryDate.match(dayReg)[0] : 0

            return (aYear * 100 + aMonth * 10 + aDay * 1) - (bYear * 100 + bMonth * 10 + bDay)
          }
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
      classroomValue: null,
      options: [],
      areaName: null,
      enterpriseId: null,
      areaHeadquartersOrganizationId: ''
    }
  },
  computed: {},
  watch: {},
  async created () {
    await this.getSearchItemList()
  },
  mounted () {
    this.getClassRoomList()
    this.init()
  },
  methods: {
    // 获取左侧园所信息列表
    getSearchItemList () {
      querySearchItemList().then(res => {
        if (res.data) {
          res.data.forEach(item => {
            item.name = item.areaName
            item.value = item.areaHeadquartersOrganizationId
          })
          this.searchItems = this.searchItems.concat(res.data)
        }
        console.log(this.searchItems, 'searchItem')
        this.quickScreening = this.searchItems[0].value
        this.areaName = this.searchItems[0].name
        this.areaHeadquartersOrganizationId = this.searchItems[0].value
      })
    },
    // 获取右侧园所信息列表
    getClassRoomList () {
      const params = {}
      params.areaHeadquartersOrganizationId = this.areaHeadquartersOrganizationId
      queryClassRoomList(params).then(res => {
        this.classroomList = res.data
        if (res.data) {
          this.classroomList = this.convertDataToOptions(res.data, 'organizationName', 'sonOrganizationId')
        }
      })
    },
    // 处理园所改变事件
    handleChangeClassRoom (e) {
      this.enterpriseId = e
      this.queryList()
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    init () {
      this.queryInfo()
      this.queryList()
    },
    // 获取员工信息
    queryInfo () {
      queryStaffInfo().then(res => {
        this.staffInfo = res.data
      })
    },
    // 获取员工列表
    queryList () {
      const params = Object.assign({
        areaId: this.areaHeadquartersOrganizationId,
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
              v.areaCode = row.data.provinceName + '.' + row.data.cityName
            })
          }
        })
      })
    },
    screenTabChange (selectType) {
      this.classroomValue = null
      this.enterpriseId = undefined
      this.selectType = selectType
      this.areaHeadquartersOrganizationId = selectType
      this.getClassRoomList()
      this.queryList()
    },
    handleChange (e) {
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
    position: relative;

    .dataHead {
      display: flex;
      justify-content: space-between;
      padding: 10px 5px 22px;
      width: 100%;

      .dataSon {
        align-items: center;
        //display: flex;
        justify-content: center;
        margin-right: 24px;

        .top {
          align-content: center;
          display: flex;
          justify-content: center;
        }

        img {
          height: 20px;
          margin-right: 6px;
          width: 20px;
        }

        .dataNumber {
          color: #222;
          font-size: 21px;
          font-weight: bold;
          text-align: center;
        }

        .dataName {
          color: #555;
          //margin-top: 3px;
          font-size: 14px;
          font-weight: 400;
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
