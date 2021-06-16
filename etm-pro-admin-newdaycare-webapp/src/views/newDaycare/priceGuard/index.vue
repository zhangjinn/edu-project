<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <template slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
            setting
            @setting="setting"
          >
            <el-tab-pane
              label="费用管理"
              name="price"
            >
              <etm-tool-bar
                v-model="searchData"
                @search="search"
                @reset="reset"
              />
            </el-tab-pane>
          </etm-tabs>
        </template>
        <template slot="body">
          <etm-table-page
            :data="tableData"
            :columns="columns"
            :index="true"
            :stripe="false"
            :span-method="objectSpanMethod"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <el-button
                slot="right"
                type="primary"
                @click="handleAdd"
              >
                <i class="el-icon-plus" />&nbsp;&nbsp;添加费用标准
              </el-button>
            </etm-table-tool-bar>
            <el-table-column
              slot="left"
              label="收费科目"
              prop="name"
            />
            <el-table-column
              slot="left"
              label="费用标准"
            >
              <template v-slot="scoped">
                <etm-text
                  type="primary"
                  @click="handleDetail(scoped.row)"
                >
                  {{ scoped.row.materialPriceStandardName }}
                </etm-text>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              align="right"
              label="售卖单价"
            >
              <template v-slot="scoped">
                <span>{{ formatMoney(scoped.row.price) + (scoped.row.property === 'once' ? '元/笔' : '元/月') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="使用状态"
            >
              <template v-slot="scoped">
                <el-switch
                  v-model="scoped.row.enable"
                  @change="switchChange(scoped.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="操作"
            >
              <template v-slot="scoped">
                <etm-text
                  type="primary"
                  @click="handleEdit(scoped.row)"
                >
                  编辑
                </etm-text>
                <etm-text
                  type="danger"
                  @click="handleDelete(scoped.row)"
                >
                  删除
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </etm-layout-split>
    </etm-main-body>
    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加费用"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <edit
          v-if="popVisibleEdit && drawerType==='add'"
          ref="childPopForm"
          :form-data="formData"
        />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title
          :title="drawerTitle"
          border
          size="big"
        >
          <template
            v-if="drawerVisible && drawerType==='edit'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="closeDrawer"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="popConfirmEdit"
            >
              保存
            </el-button>
          </template>
          <template
            v-if="drawerVisible && drawerType==='detail'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="handleEdit"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail
            v-if="drawerVisible && drawerType==='detail' && materialPriceStandardId"
            :standard-id="materialPriceStandardId"
          />
          <edit
            v-if="drawerVisible && drawerType==='edit' && materialPriceStandardId"
            ref="childPopForm"
            :form-data="formData"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import edit from './component/edit'
import detail from './component/detail'
import {
  queryPriceStandardList, createPriceStandard, removePriceStandard, updatePriceStandard, queryPriceStandardById
} from '@/api/newDaycare/priceGuard'

/**
 * index create by Administrator
 * createTime 2021/1/15 13:54
 */
export default {
  name: 'Index',
  components: {
    edit,
    detail
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      activeName: 'price',
      searchData: [
        {
          label: '费用',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入费用'
          }
        },
        {
          label: '使用状态',
          type: 'select',
          prop: 'enable',
          value: null,
          props: {
            placeholder: '请选择使用状态'
          },
          options: [
            {
              value: 'true',
              label: '启用'
            }, {
              value: 'false',
              label: '停用'
            }
          ]
        }
      ],
      popVisibleEdit: false,
      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '费用标准详情',
      formData: {},
      // 表格数据
      searchInfo: {},
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      },
      columns: [],
      rowNum: [],
      materialPriceStandardId: null // 物品id
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
    setting () {
      this.$router.push({ path: '/newdaycare_priceGuardcare_setting' })
    },
    search (value) {
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'enable') {
          searchInfo[item.prop] = JSON.parse(item.value)
        } else {
          searchInfo[item.prop] = item.value
        }
      })
      this.searchInfo = searchInfo
      this.init()
    },
    reset () {
      this.searchInfo = {}
      this.pageNum = 1
      this.init()
    },
    currentChange (pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.init()
    },
    // 获取列表
    init () {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryPriceStandardList(param).then((res) => {
        const { data } = res
        const tableData = JSON.parse(JSON.stringify(res.data))
        tableData.content = []
        this.rowNum = []
        data.content.forEach(item => {
          this.rowNum.push(item.standardList.length)
          item.standardList.forEach(list => {
            const data = {
              id: item.id,
              name: item.name,
              property: item.property,
              materialPriceStandardId: list.id,
              materialPriceStandardName: list.name,
              materialPriceId: list.materialPriceId,
              price: list.price,
              enable: list.enable
            }
            tableData.content.push(data)
          })
        })
        this.tableData = tableData
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (column.property === 'name') {
        let num = 0
        let flag = false
        for (let i = 0; i < this.rowNum.length; i++) {
          if (rowIndex === this.addNum(i - 1)) {
            num = i
            flag = true
          }
        }
        if (flag) {
          return {
            rowspan: this.rowNum[num],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    addNum (index) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      this.rowNum.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },

    handleAdd () {
      this.materialPriceStandardId = null
      this.formData = {
        enable: true
      }
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    handleEdit (row) {
      if (row.materialPriceStandardId) {
        this.materialPriceStandardId = row.materialPriceStandardId
      }
      const param = {
        materialPriceStandardId: this.materialPriceStandardId
      }
      queryPriceStandardById(param).then(res => {
        const { data } = res
        this.formData = {
          materialPriceId: data.materialPriceId,
          name: data.name,
          id: data.id,
          price: data.price,
          enable: data.enable
        }
        this.drawerType = 'edit'
        this.drawerTitle = '编辑费用标准'
        this.drawerVisible = true
      })
    },

    // 状态改变
    switchChange (row) {
      const param = {
        materialPriceStandardId: row.materialPriceStandardId,
        materialPriceId: row.id,
        name: row.materialPriceStandardName,
        price: row.price,
        enable: row.enable
      }
      updatePriceStandard(param).then(() => {
        this.reset()
      })
    },

    // 删除
    handleDelete (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removePriceStandard({ materialPriceStandardId: row.materialPriceStandardId }).then(() => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.reset()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 详情
    handleDetail (row) {
      this.materialPriceStandardId = row.materialPriceStandardId
      this.drawerType = 'detail'
      this.drawerTitle = '费用标准详情'
      this.drawerVisible = true
    },
    closeDrawer () {
      this.drawerVisible = false
    },

    // 弹窗关闭
    popCloseEdit () {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            materialPriceId: this.formData.materialPriceId,
            name: this.formData.name,
            price: this.formData.price,
            enable: this.formData.enable
          }
          if (this.drawerType === 'add') {
            createPriceStandard(param).then(() => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            param.materialPriceStandardId = this.materialPriceStandardId
            updatePriceStandard(param).then(() => {
              this.drawerVisible = false
              this.$message({
                message: '已修改',
                type: 'success'
              })
              this.reset()
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
