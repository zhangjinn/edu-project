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
                  学员总数
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.childCount || 0 }}
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
                  托育园学员数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.nurserySchoolChildCount || 0 }}
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
                  幼儿园学员数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.kindergartenChildCount || 0 }}
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
                  幼儿园满员率
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.kindergartenFullProbability || 0 }}%
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
                  托育园满园率
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.nurserySchoolFullProbability || 0 }}%
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/careChild.png"
                  alt=""
                >
                <div class="dataName">
                  幼儿园学员/员工比例
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.kindergartenNumber || 0 }}
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/toddlerChild.png"
                  alt=""
                >
                <div class="dataName">
                  托育园学员/员工比例
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ formData.nurserySchoolNumber || 0 }}
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
import swiperTabScreen from '@/views/newDaycare/staffDataHead/components/swiperTabScreen'
import {
  queryMessage,
  queryChildMessage,
  querySearchItemList,
  queryClassRoomList
} from '@/api/newDaycare/childDataHead'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { queryAreaInfoByAreaId } from '@/api/base/base'
export default {
  name: 'Index',
  components: { swiperTabScreen },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      quickScreening: null,
      classroomList: [],
      classroomValue: null,
      areaHeadquartersOrganizationId: null,
      searchItems: [
        // {
        //   name: '全部园所',
        //   value: null
        // },
        // {
        //   name: '幼儿园',
        //   value: 'toddler'
        // }, {
        //   name: '托育园',
        //   value: 'care'
        // },
        {
          name: '全部',
          value: null
        }
      ],
      tableData: {
        content: [
          {}
        ]
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'childName'
        },
        {
          label: '所在校区',
          prop: 'schoolName',
          width: '210'
        },
        {
          label: '性别',
          prop: 'genderEnum'
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
          label: '班级',
          prop: 'clazzName',
          width: '120'
        },
        {
          label: '入园时间',
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
          label: '户口所在地',
          prop: 'areaCode'
        },
        {
          label: '家长姓名',
          prop: 'parentName'
        },
        {
          label: '关系',
          prop: 'relationshipName'
        },
        {
          label: '手机号码',
          prop: 'telephone'
        }
      ],
      value: null,
      options: [],
      formData: {},
      areaName: null,
      enterpriseId: null,
      nurserySchool: null,
      kindergarten: null
    }
  },
  computed: {},
  watch: {},
  async created () {
    await this.getSearchItemList()
  },
  mounted () {
    this.getClassRoomList()
    this.getChildMsg()
    this.init()
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    init () {
      queryChildMessage({
        areaId: this.areaHeadquartersOrganizationId,
        enterpriseId: this.enterpriseId,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(v => {
          v.genderEnum = v.genderEnum === 'MALE' ? '男' : '女'
          v.entryTime = (v.entryTime && parseTime(v.entryTime, '{y}-{m}-{d}')) || null
          v.birthday = (v.birthday && parseTime(v.birthday, '{y}-{m}-{d}')) || null
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
    // 处理园所改变事件
    handleChangeClassRoom (e) {
      this.enterpriseId = e
      this.init()
    },
    screenTabChange (selectType) {
      console.log(selectType, 'type')
      this.classroomValue = null
      this.enterpriseId = undefined
      this.selectType = selectType
      this.areaHeadquartersOrganizationId = selectType
      this.getClassRoomList()
      this.init()
    },
    // getOrganization () {
    //   queryOrganization().then(res => {
    //     // console.log(res.data)
    //     this.options = res.data
    //     this.options.forEach(v => {
    //       v.label = v.areaName
    //       v.value = v.areaName
    //       v.sonOrganizationVOList.forEach(i => {
    //         i.label = i.organizationName
    //         i.value = i.sonOrganizationId
    //       })
    //       v.children = v.sonOrganizationVOList
    //     })
    //   })
    // },
    handleChange (e) {
      // console.log(e)
      this.enterpriseId = e[1] || null
      this.areaName = e[0] || null
      this.pageInfo.pageNum = 1
      this.init()
    },
    getChildMsg () {
      queryMessage().then(res => {
        // console.log(res.data)
        this.formData = res.data
      })
    },
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
        this.classroomList = this.classroomList.length ? this.convertDataToOptions(res.data, 'organizationName', 'sonOrganizationId') : []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
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
