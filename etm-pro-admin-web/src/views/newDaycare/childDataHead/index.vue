<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div class="dataHead">
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/stuNumber.png" alt="">
                <div class="dataName">学员总数</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.childCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careStuNumber.png" alt="">
                <div class="dataName">托育园学员数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.nurserySchoolChildCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/payout.png" alt="">
                <div class="dataName">幼儿园学员数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.kindergartenChildCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/toddlerRate.png" alt="">
                <div class="dataName">幼儿园满员率</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.kindergartenFullProbability }}%</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careRate.png" alt="">
                <div class="dataName">托育园满园率</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.nurserySchoolFullProbability }}%</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careChild.png" alt="">
                <div class="dataName">幼儿园学员/员工</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.kindergartenNumber }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/toddlerChild.png" alt="">
                <div class="dataName">托育园学员/员工</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ formData.nurserySchoolNumber }}</div>
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
import { queryOrganization, queryMessage, queryChild_message } from '@/api/newDaycare/childDataHead'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { queryAreaInfoByAreaId } from '@/api/base/base'
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      quickScreening: null,
      searchItems: [
        {
          name: '全部园所',
          value: null
        },
        {
          name: '幼儿园',
          value: 'toddler'
        }, {
          name: '托育园',
          value: 'care'
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
          prop: 'schoolName'
        },
        {
          label: '性别',
          prop: 'genderEnum'
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
          label: '班级',
          prop: 'clazzName'
        },
        {
          label: '入园时间',
          prop: 'entryTime'
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
  created() {
    this.getOrganization()
    this.getChildMsg()
    this.init()
  },
  mounted() {
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
      queryChild_message({
        areaName: this.areaName,
        enterpriseId: this.enterpriseId,
        kindergarten: this.kindergarten,
        nurserySchool: this.nurserySchool,
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
    screenTabChange(val) {
      // console.log(val)
      if (val === 'toddler') {
        this.kindergarten = true
        this.nurserySchool = null
      } else if (val === 'care') {
        this.nurserySchool = true
        this.kindergarten = null
      } else {
        this.nurserySchool = null
        this.kindergarten = null
      }
      this.pageInfo.pageNum = 1
      this.init()
    },
    getOrganization() {
      queryOrganization().then(res => {
        // console.log(res.data)
        this.options = res.data
        this.options.forEach(v => {
          v.label = v.areaName
          v.value = v.areaName
          v.sonOrganizationVOList.forEach(i => {
            i.label = i.organizationName
            i.value = i.sonOrganizationId
          })
          v.children = v.sonOrganizationVOList
        })
      })
    },
    handleChange(e) {
      // console.log(e)
      this.enterpriseId = e[1] || null
      this.areaName = e[0] || null
      this.pageInfo.pageNum = 1
      this.init()
    },
    getChildMsg() {
      queryMessage().then(res => {
        // console.log(res.data)
        this.formData = res.data
      })
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
