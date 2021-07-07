<template>
  <div class="custom-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
          <el-tab-pane name="order" label="客户名单">
            <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          selection
          @currentChange="currentChange"
          @selection-change="handleSelectionChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button plain :disabled="selected.length === 0" @click="importIntoCustomer">导入学员</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" label="学员姓名" fixed="left" min-width="120">
            <template slot-scope="scoped">
              <el-button type="text" @click="showChild(scoped.row.customerId)">{{ scoped.row.customerName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column slot="right" label="操作" fixed="left">
            <template slot-scope="scoped">
              <etm-text
                type="primary"
                @click="showEdit(scoped.row.customerId, true)"
              >编辑
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>

    <etm-drawer
      :visible.sync="editCustomPop"
    >
      <etm-layout-split>
        <template v-if="isEdit">
          <editCustomer :customer-detail="customerDetail" @save="save" @cancel="cancelEdit" />
        </template>
        <template v-else>
          <etm-title :show-title="false" border size="big">
            详情
            <template slot="tool">
              <template>
                <el-button plain size="mini" @click="edit">编辑</el-button>
              </template>
            </template>
          </etm-title>
          <etm-field-label label="学员姓名" type="left">{{ customerDetail.customerName }}</etm-field-label>
          <etm-field-label label="联系人姓名" type="left">{{ customerDetail.parentName }}</etm-field-label>
          <etm-field-label label="联系人电话" type="left">{{ customerDetail.parentPhone }}</etm-field-label>
          <etm-field-label label="性别" type="left">{{ customerDetail.gender === 'MALE' ? '男' : '女' }}</etm-field-label>
          <etm-field-label label="生日" type="left">{{ customerDetail.birthday | parseTime }}</etm-field-label>
          <etm-field-label label="学员来源" type="left">{{ customerDetail.sourcesName }}
          </etm-field-label>
        </template>
      </etm-layout-split>
    </etm-drawer>

  </div>

</template>

<script>

/**
 * index create by Administrator
 * createTime 2020/11/19 9:22
 */
// import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import { getCustomerOrderDetail, importCustomer, queryCustomerOrderList } from '@/api/newDaycare/customerOrder'
import editCustomer from '@/views/newDaycare/customOrder/components/editCustomer'
// import { updateChildResourceStatus } from '@/api/daycare/childManage'
// import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {
    editCustomer
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      drawerPath: false,
      isEdit: false, // 是否编辑flag
      editCustomPop: false,
      activeName: 'order',
      tableData: { content: [] },
      columns: [
        {
          label: '联系人姓名',
          width: '120',
          prop: 'parentName',
          fixed: 'left'
        }, {
          label: '联系人电话',
          width: '120',
          prop: 'parentPhone',
          fixed: 'left'
        }, {
          label: '性别',
          width: '120',
          prop: 'gender',
          fixed: 'left'
        }, {
          label: '年龄',
          width: '120',
          prop: 'age',
          fixed: 'left'
        }, {
          label: '学员来源',
          width: '120',
          prop: 'sources',
          fixed: 'left'
        },
        {
          label: '学员状态',
          width: '120',
          prop: 'status',
          fixed: 'left'
        }
      ],
      formData: [
        {
          label: '学员姓名',
          type: 'input',
          value: '',
          prop: 'customerName',
          props: {
            placeholder: '请输入学员姓名'
          }
        }, {
          label: '联系人姓名',
          type: 'input',
          value: '',
          prop: 'parentName',
          props: {
            placeholder: '请输入联系人姓名'
          }
        }, {
          label: '联系人电话',
          type: 'input',
          value: '',
          prop: 'parentPhone',
          props: {
            placeholder: '请输入联系人电话'
          }
        },
        {
          label: '学员来源',
          type: 'select',
          value: '',
          prop: 'sources',
          props: {
            placeholder: '请选择学员来源'
          },
          options: [
            {
              label: '观测',
              value: 'EVALUATION'
            }
          ]
        },
        {
          label: '学员状态',
          type: 'select',
          value: '',
          prop: 'status',
          props: {
            placeholder: '请选择学员状态'
          },
          options: [
            {
              label: '未导入',
              value: 'NOT_IMPORTED'
            }, {
              label: '已导入',
              value: 'IMPORTED'
            }
          ]
        }
      ],
      customerDetail: {},
      search: {},
      selected: [],
      selectList: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init(this.search)
  },
  methods: {
    init(search = {}) {
      const params = Object.assign({
        customerName: '',
        parentName: '',
        parentPhone: '',
        status: '',
        sources: ''
      }, search, this.pageInfo)
      queryCustomerOrderList(params).then(res => {
        // console.log(res)
        this.tableData = res.data
        const result = res.data['content']
        result.forEach((cur, index) => {
          result[index].gender = cur.gender === 'MALE' ? '男' : '女'
          result[index].status = cur.status === 'IMPORTED' ? '已导入' : '未导入'
          result[index].sources = cur.sources === 'EVALUATION' ? '观测' : '其他'
        })
        // console.log(result, 'result')
        this.tableData['content'] = result
      })
    },
    handleSearch(event) {
      const result = {}
      this.pageInfo.pageNum = 1
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      // console.log(event, 'event')
      this.init(this.search)
    },
    importIntoCustomer() {
      const idList = this.selected.map(item => item.customerId)
      const params = {}
      params.idList = idList
      importCustomer(params).then(res => {
        const { failedNumber, successNumber } = res.data
        this.$message(`导入成功数据${successNumber},导入失败数据${failedNumber}`)
        this.init()
      })
    },
    handleSelectionChange(e) {
      this.selected = e
    },
    reset() {
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.search)
    },
    showChild(id, drawerPath = false) {
      this.drawerPath = drawerPath
      this.getDetail(id)
      this.isEdit = false
      this.editCustomPop = true
      this.customerId = id
    },
    getDetail(id) {
      const params = {}
      params.customerId = id
      getCustomerOrderDetail(params).then(res => {
        const content = res.data
        for (const key in content) {
          if (key === 'sources') {
            content['sourcesName'] = content[key] === 'EVALUATION' ? '观测' : '其他'
          }
        }
        this.customerDetail = content
      })
    },
    showEdit(id, drawerPath = false) {
      this.drawerPath = drawerPath
      this.getDetail(id)
      this.isEdit = true
      this.editCustomPop = true
    },
    edit(e, drawerPath = false) {
      this.drawerPath = drawerPath
      this.isEdit = true
    },
    cancel() {
      this.isEdit = false
    },
    save() {
      // this.editCustomPop = false
      this.isEdit = false
      this.init(this.search)
    },
    cancelEdit() {
      if (this.drawerPath) {
        this.editCustomPop = false
        return
      }
      this.isEdit = false
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-wrap {
  margin-top: 16px;
}
</style>
