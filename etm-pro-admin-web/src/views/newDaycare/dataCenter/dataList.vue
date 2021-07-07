<template>
  <div class="dataList-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs ref="tabs" v-model="activeName">
            <el-tab-pane
              label="早教园"
              name="teach"
            >
              <etm-tool-bar v-model="searchForm" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
            <el-tab-pane label="托育园" name="care">
              <etm-tool-bar v-model="searchForm" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <div v-if="activeName === 'teach'">
            <etm-table-page
              :columns="columns"
              :data="teachTableData"
              selection
              @currentChange="currentChange"
            >
              <el-table-column slot="left" label="logo">
                <template slot-scope="scoped">
                  <div class="logo">
                    <img v-if="scoped.row.logo" :src="scoped.row.logo">
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="机构名称" prop="organizationName" />
              <el-table-column slot="right" label="所属省份" prop="areaName" />
              <el-table-column slot="right" label="总收入（元）" align="right" prop="teachDataVO.incomeAmount" />
              <el-table-column slot="right" label="新增签单数" prop="teachDataVO.newSigningQuantity" />
              <el-table-column slot="right" label="总会员（人）" prop="teachDataVO.childQuantity" />
              <el-table-column slot="right" label="意向学员（人）" prop="teachDataVO.intentionChildQuantity" />
            </etm-table-page>
          </div>
          <div v-else-if="activeName === 'care'">
            <etm-table-page
              :columns="columns"
              :data="careTableData"
              selection
              @currentChange="currentChange"
            >
              <el-table-column slot="left" label="logo">
                <template slot-scope="scoped">
                  <div class="logo">
                    <img v-if="scoped.row.logo" :src="scoped.row.logo">
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="left" label="机构名称" prop="organizationName" />
              <el-table-column slot="right" label="所属省份" prop="areaName" />
              <el-table-column slot="right" label="总收入（元）" align="right" prop="careDataVO.incomeAmount" />
              <el-table-column slot="right" label="新增入托（人）" prop="careDataVO.newSigningChildQuantity" />
              <el-table-column slot="right" label="总入托（人）" prop="careDataVO.inBookChildQuantity" />
              <el-table-column slot="right" label="剩余托位（人）" prop="careDataVO.remainPosition" />
            </etm-table-page>
          </div>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>/**
 * dataList create by Administrator
 * createTime 2020/12/1 15:33
 */

import { queryAreaListByCode } from '@/api/base/base'
import { queryCareTableData, queryTeachTableData } from '@/api/newDaycare/dataCenter'

export default {
  name: 'DataList',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'teach',
      searchForm: [
        {
          label: '机构名称',
          type: 'input',
          prop: 'orgName',
          value: '',
          props: {
            placeholder: '请输入机构名称'
          }
        },
        {
          label: '所属省份',
          type: 'select',
          prop: 'areaCode',
          value: '',
          props: {
            placeholder: '请选择省份'
          },
          options: []
        },
        {
          label: '日期',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            clearable: false
          }
        }
      ],
      searchInfo: {},
      startDate: '',
      endDate: '',
      pageNum: 1,
      pageSize: 10,
      teachTableData: {
        content: []
      },
      careTableData: {
        content: []
      },
      columns: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.startDate = this.$route.query.startDate
    this.endDate = this.$route.query.endDate
    this.searchForm[2].value = [this.startDate, this.endDate]
    this.getProvince()
    this.getList()
  },
  activated() {
    this.activeName = this.$route.query.type
    const startDate = this.$route.query.startDate
    const endDate = this.$route.query.endDate
    if (startDate !== this.startDate || endDate !== this.endDate) {
      this.startDate = startDate
      this.endDate = endDate
      this.searchForm[2].value = [this.startDate, this.endDate]
      this.getList()
    }
  },
  mounted() {
  },
  methods: {
    getProvince() {
      queryAreaListByCode({}).then(res => {
        const data = res.data
        const list = []
        data.forEach(item => {
          list.push({
            value: item.code,
            label: item.name
          })
        })
        this.searchForm[1].options = list
      })
    },
    handleSearch(value) {
      value.forEach(item => {
        if (item.prop === 'date') {
          this.startDate = item.value[0]
          this.endDate = item.value[1]
        } else {
          this.searchInfo[item.prop] = item.value
        }
      })
      this.getList()
    },
    reset() {
      this.searchInfo = {}
      this.pageNum = 1
      this.getList()
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryTeachTableData(param).then(res => {
        this.teachTableData = res.data
      })
      queryCareTableData(param).then(res => {
        this.careTableData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dataList-wrap {
  .logo {
    width: 100px;
    height: 54px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
