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
                  园所总数
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ form.schoolCount || 0 }}
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
                  幼儿园数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ form.kindergartenCount || 0 }}
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
                  托育园数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ form.nurserySchoolCount || 0 }}
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
                  班级总数
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ form.clazzCount || 0 }}
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
                  托育园班级数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ form.nurserySchoolClazzCount || 0 }}
                </div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img
                  src="../../../assets/images/newDaycare/careClassNumber.png"
                  alt=""
                >
                <div class="dataName">
                  幼儿园班级数量
                </div>
              </div>
              <div class="showData">
                <div class="dataNumber">
                  {{ form.kindergartenClazzCount || 0 }}
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
import baseMixin from '@/layout/mixin/baseMixin'
import swiperTabScreen from '@/views/newDaycare/staffDataHead/components/swiperTabScreen'
import { queryAreaInfoByAreaId } from '@/api/base/base'
// import { queryOrganization } from '@/api/newDaycare/childDataHead'
import { queryMessage, querySchoolMessagePage } from '@/api/newDaycare/firmDataHead'
import { queryClassRoomList, querySearchItemList } from '@/api/newDaycare/childDataHead'
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
        {
          name: '全部',
          value: null
        }
      ],
      tableData: {},
      columns: [
        {
          label: '校区名称',
          prop: 'enterpriseName'
        },
        {
          label: '所属大区',
          prop: 'areaName'
        },
        {
          label: '所属省份',
          prop: 'areaCode'
        },
        {
          label: '场地年租金',
          prop: 'annualRent',
          sortable: true,
          sortBy: 'annualRent'
        },
        {
          label: '员工数',
          prop: 'employeeNumber',
          sortable: true,
          sortBy: 'employeeNumber'
        },
        {
          label: '学员数',
          prop: 'childNumber',
          sortable: true,
          sortBy: 'childNumber'
        },
        {
          label: '满园数',
          prop: 'fullNumber',
          sortable: true,
          sortBy: 'fullNumber'
        },
        {
          label: '满园率',
          prop: 'fullProbability',
          sortable: true,
          sortBy: 'fullProbability'
        }
      ],
      value: null,
      options: [],
      form: {},
      areaName: null,
      enterpriseId: null
    }
  },
  computed: {},
  watch: {},
  async created () {
    await this.getSearchItemList()
  },
  mounted () {
    this.getClassRoomList()
    this.getMsg()
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
      querySchoolMessagePage({
        areaId: this.areaHeadquartersOrganizationId,
        enterpriseId: this.enterpriseId,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        const { data } = res
        this.tableData = data
        this.tableData.content.forEach(v => {
          v.fullProbability = v.fullProbability + '%'
          if (v.areaCode) {
            queryAreaInfoByAreaId({ areaId: v.areaCode }).then(row => {
              // console.log(row.data)
              v.areaCode = row.data.provinceName
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
    getMsg () {
      queryMessage().then(res => {
        // console.log(res.data)
        this.form = res.data
      })
    },
    handleChange (e) {
      // console.log(e)
      this.enterpriseId = e[1] || null
      this.areaName = e[0] || null
      this.pageInfo.pageNum = 1
      this.init()
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
