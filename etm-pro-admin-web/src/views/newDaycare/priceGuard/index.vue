<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <template slot="header">
          <etm-tabs ref="tabs" v-model="activeName" :setting="false" @setting="setting">
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
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <el-button slot="right" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加费用</el-button>
            </etm-table-tool-bar>
            <el-table-column slot="left" label="费用名称">
              <template v-slot="scoped">
                <etm-text type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.materialPriceName }}</etm-text>
              </template>
            </el-table-column>
            <el-table-column slot="left" align="right" label="售卖单价">
              <template v-slot="scoped">
                <span>{{ scoped.row.sellPrice + (scoped.row.property === 'once' ? '元/笔' : '元/月') }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="使用状态">
              <template v-slot="scoped">
                <el-switch
                  v-model="scoped.row.enable"
                  @change="switchChange(scoped.row)"
                />
              </template>
            </el-table-column>
            <el-table-column slot="right" label="操作">
              <template v-slot="scoped">
                <etm-text type="primary" @click="handleEdit(scoped.row)">编辑</etm-text>
                <etm-text type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
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
        <edit v-if="popVisibleEdit && drawerType==='add'" ref="childPopForm" :type="drawerType" />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big">
          <template v-if="drawerVisible && drawerType==='edit'" slot="tool">
            <el-button plain size="mini" @click="handleDetail">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && materialPriceId" :item-id="materialPriceId" />
          <edit v-if="drawerVisible && drawerType==='edit' && materialPriceId" ref="childPopForm" :type="drawerType" :item-id="materialPriceId" />
        </div>

      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
import edit from './component/edit'
import detail from './component/detail'
import {
  removeGuardPrice,
  queryGuardPriceList,
  createGuardPrice,
  updateGuardPrice
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
  data() {
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
              label: '已启用'
            }, {
              value: 'false',
              label: '未启用'
            }
          ]
        }
      ],
      popVisibleEdit: false,
      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '费用详情',
      formData: [],
      // 表格数据
      searchInfo: {},
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      },
      columns: [],
      materialPriceId: null // 物品id
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    setting() {
      this.$router.push({ path: '/newdaycare_priceGuardcare/setting' })
    },
    search(value) {
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
    reset() {
      this.searchInfo = {}
      this.pageNum = 1
      this.init()
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.init()
    },
    // 获取列表
    init() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryGuardPriceList(param).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },

    handleAdd() {
      this.materialPriceId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    handleEdit(row) {
      if (row.materialPriceId) {
        this.materialPriceId = row.materialPriceId
      }
      this.drawerType = 'edit'
      this.drawerTitle = '编辑费用'
      this.drawerVisible = true
    },

    // 状态改变
    switchChange(row) {
      if (row.materialPriceId) {
        this.materialPriceId = row.materialPriceId
      }
      const param = {
        materialPriceId: this.materialPriceId,
        materialPriceName: row.name,
        sellPrice: row.sellPrice,
        property: row.property,
        enable: row.enable
      }
      updateGuardPrice(param).then((res) => {
        this.reset()
      })
    },

    // 删除
    handleDelete(row) {
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.materialPriceId = row.materialPriceId
          removeGuardPrice({ materialPriceId: this.materialPriceId }).then((res) => {
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
    handleDetail(row) {
      if (row.materialPriceId) {
        this.materialPriceId = row.materialPriceId
      }
      this.drawerType = 'detail'
      this.drawerTitle = '费用详情'
      this.drawerVisible = true
    },

    // 弹窗关闭
    popCloseEdit() {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
          console.log(formData)
          const param = {
            materialPriceName: formData.name,
            sellPrice: formData.sellPrice,
            property: formData.property,
            enable: formData.enable
          }
          if (this.drawerType === 'add') {
            createGuardPrice(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            param.materialPriceId = this.materialPriceId
            updateGuardPrice(param).then((res) => {
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
.index-wrap {

}
</style>
