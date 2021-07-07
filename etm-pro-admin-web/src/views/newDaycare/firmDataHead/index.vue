<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div class="dataHead">
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/stuNumber.png" alt="">
                <div class="dataName">园所总数</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ form.schoolCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/payout.png" alt="">
                <div class="dataName">幼儿园数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ form.kindergartenCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careStuNumber.png" alt="">
                <div class="dataName">托育园数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ form.nurserySchoolCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/toddlerRate.png" alt="">
                <div class="dataName">班级总数</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ form.clazzCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careRate.png" alt="">
                <div class="dataName">托育园班级数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ form.nurserySchoolClazzCount }}</div>
              </div>
            </div>
            <div class="dataSon">
              <div class="top">
                <img src="../../../assets/images/newDaycare/careClassNumber.png" alt="">
                <div class="dataName">幼儿园班级数量</div>
              </div>
              <div class="showData">
                <div class="dataNumber">{{ form.kindergartenClazzCount }}</div>
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
import baseMixin from '@/layout/mixin/baseMixin'
import { queryAreaInfoByAreaId } from '@/api/base/base'
import { queryOrganization } from '@/api/newDaycare/childDataHead'
import { queryMessage, querySchool_message_page } from '@/api/newDaycare/firmDataHead'
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
          prop: 'annualRent'
        },
        {
          label: '员工数',
          prop: 'employeeNumber'
        },
        {
          label: '学员数',
          prop: 'childNumber'
        },
        {
          label: '满园数',
          prop: 'fullNumber'
        },
        {
          label: '满园率',
          prop: 'fullProbability'
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
  created() {
    this.getOrganization()
    this.getMsg()
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
      querySchool_message_page({
        areaName: this.areaName,
        enterpriseId: this.enterpriseId,
        kindergarten: this.kindergarten,
        nurserySchool: this.nurserySchool,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
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
    screenTabChange(val) {
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
    getMsg() {
      queryMessage().then(res => {
        // console.log(res.data)
        this.form = res.data
      })
    },
    handleChange(e) {
      console.log(e)
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
