<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          v-model="currentTab"
          setting
          @setting="setting"
        >
          <el-tab-pane
            label="公海"
            name="publicPool"
          >
            <!--<etm-screen-tab v-if="searchItems.length" :category-list="searchItems" title="快捷筛选" @change="searchChange" />-->
            <search-field
              category="CHILD_POOL"
              @query="query"
              @change="fieldChange"
            />
          </el-tab-pane>
          <!--<el-tab-pane label="已成交学员" name="SOLD">-->
          <!--  <etm-tool-bar v-model="formData" @search="handleSearch" />-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="历史学员" name="SOLD1">-->
          <!--  <etm-tool-bar v-model="formData" @search="handleSearch" />-->
          <!--</el-tab-pane>-->
        </etm-tabs>
      </div>

      <div slot="body">
        <template v-if="currentTab === 'publicPool'">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            index-type="index"
            selection
            border
            @currentChange="currentChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              slot="left"
              label="学员姓名"
              fixed="left"
              width="100"
            >
              <template v-slot="{row}">
                <etm-text
                  type="primary"
                  @click="handleRowClick(row)"
                >
                  {{ row.name }}
                </etm-text>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              fixed="right"
              width="100"
              label="操作"
            >
              <template v-slot="{row}">
                <etm-text
                  type="primary"
                  @click="handleFollow(row)"
                >
                  领取
                </etm-text>
                <!--<etm-text type="primary" @click="handleCall(row)">打电话</etm-text>-->
                <!--<etm-text type="primary" @click="handleSms(row)">发短信</etm-text>-->
                <!--<el-dropdown :hide-on-click="false">-->
                <!--  <etm-text type="primary">更多<i class="el-icon-arrow-down el-icon&#45;&#45;right" /></etm-text>-->
                <!--  <el-dropdown-menu slot="dropdown">-->
                <!--    <el-dropdown-item @click.native="handleTry(row)">试听</el-dropdown-item>-->
                <!--    <el-dropdown-item @click.native="handleBooking(row)">预收订金</el-dropdown-item>-->
                <!--    <el-dropdown-item @click.native="handleSignUp(row)">签约</el-dropdown-item>-->
                <!--  </el-dropdown-menu>-->
                <!--</el-dropdown>-->
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </div>

      <!--学员详情-->
      <etm-drawer
        :visible.sync="childDetail.visible"
        type="big"
      >
        <etm-layout-split
          v-if="childDetail.visible"
          :left-styles="{minWidth: '560px', maxWidth: '560px'}"
          :styles="{height: '100vh'}"
          class="child-info-box"
        >
          <div
            slot="left"
            class="left"
          >
            <child-logs :child-id="childDetail.childId" />
          </div>
          <div
            slot="right"
            class="right"
          >
            <child-info
              :child-id="childDetail.childId"
              :category="currentTab"
              @update="update"
            />
          </div>
        </etm-layout-split>
      </etm-drawer>
    </etm-layout-split>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { uploadFile } from '@/api/base'
import { createPullDownChild, queryChildList } from '@/api/newDaycare/childManage'
import { parseTime } from '@/utils'
import SearchField from '@/views/newDaycare/childManage/myChild/components/searchField'
import axios from 'axios'
import ChildLogs from '@/views/newDaycare/childManage/myChild/components/childLogs'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API

/**
 * index create by haijinsha
 * createTime 2020/8/25 10:11
 */
const recycleType = {
  UNSOLD: '未成交回收',
  AUTONOMOUS: '自主放弃',
  NOT_FOLLOWED: '未跟进回收'
}
export default {
  name: 'Index',
  components: { ChildInfo, ChildLogs, SearchField },
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      currentTab: 'publicPool',
      uploadFile: uploadFile,
      searchItems: [],
      // 快捷筛选
      quickScreening: null,
      fieldList: [],
      formData: [],
      columns: [
        {
          label: '联系人姓名',
          prop: 'parentName',
          fixed: 'left'
        },
        {
          label: '联系人电话',
          prop: 'parentPhone',
          fixed: 'left'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age',
          width: '130'
        },
        {
          label: '学员状态',
          prop: 'statusName'
        },
        {
          label: '学员来源',
          prop: 'sourceName'
        },
        {
          label: '重要程度',
          prop: 'importanceName'
        },
        {
          label: '回收类型',
          prop: 'recycleType'
        },
        {
          label: '放弃人',
          prop: 'waiverName'
        },
        {
          label: '放弃时间',
          prop: 'waivingTime',
          width: '180',
          sortable: true,
          sortBy: 'waivingTime'
        }
      ],
      tableData: { content: [] },
      // TODO 添加学员
      addChildVisible: false,
      // TODO 分配学员
      assignChildVisible: false,

      // 跟进人员
      followers: [],
      // 已选中的学员
      selected: [],
      childDetail: {
        visible: false,
        activeTab: 'follow',
        childId: ''
      },
      // 市场人员
      markers: [],
      batchImportData: {
        visible: false
      },
      followData: {
        visible: false
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryChildList({
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        quickScreening: this.quickScreening,
        category: 'CHILD_POOL',
        fieldList: this.fieldList
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.createTime = parseTime(item.createTime, '')
          item.waivingTime = parseTime(item.waivingTime, '')
          item.parentName = item.parentName && item.parentName.split(',')[0]
          item.parentPhone = item.parentPhone && item.parentPhone.split(',')[0]
          item.recycleType = recycleType[item.recycleType]
        })
      })
    },
    // 搜索条件
    handleSearch () {

    },
    // 应用设置
    setting () {
      this.$router.push({ name: 'newdaycare_childcareSetting' })
    },
    // 快捷条件
    query (data) {
      this.fieldList = data
      this.pageInfo.pageNum = 1
      this.init()
    },
    fieldChange (data) {
      this.searchItems = data.map(item => {
        return {
          name: item.value,
          value: item.key
        }
      })
      this.searchItems.unshift({
        name: '全部',
        value: null
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.currenrQuery)
    },
    // 表格多选
    handleSelectionChange (e) {
      this.selected = e
    },
    // 学员详情
    handleRowClick (row) {
      console.log(row)
      this.childDetail.visible = true
      this.childDetail.childId = row.id
    },
    update () {
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1
      }
      this.init()
    },
    handleFollow (row) {
      createPullDownChild({ childId: row.id }).then(res => {
        this.$message.success('操作成功')
        this.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    margin-top: 16px;

  }
</style>
