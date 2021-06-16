<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          v-model="activeName"
          setting
          @setting="setting"
        >
          <el-tab-pane
            label="产品目录"
            name="productCenter"
          >
            <etm-tool-bar
              v-model="formData"
              @search="reset"
              @reset="resetSearch"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <el-button
              slot="right"
              type="primary"
              @click="handleAdd"
            >
              <i class="el-icon-plus" />&nbsp;&nbsp;添加产品
            </el-button>
          </etm-table-tool-bar>

          <el-table-column
            label="产品图"
            width="120px"
            fixed
            show-overflow-tooltip
          >
            <template v-slot="scoped">
              <div class="name-box">
                <div class="img-left">
                  <img
                    v-if="scoped.row.cover && scoped.row.cover!=='--'"
                    :src="scoped.row.cover"
                    alt=""
                  >
                  <img
                    v-else
                    :src="recipeDefaultCover"
                    alt=""
                  >
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="产品名称"
            fixed
          >
            <template v-slot="scoped">
              <etm-text
                type="primary"
                @click="handleDetail(scoped.row)"
              >
                {{ scoped.row.productName }}
              </etm-text>
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            label="状态"
          >
            <template v-slot="scoped">
              <etm-status
                v-if="scoped.row.status"
                type="active"
              >
                启用
              </etm-status>
              <etm-status
                v-else
                type="inactive"
              >
                禁用
              </etm-status>
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

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      title="添加产品"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit
          v-if="popVisible && drawerType==='add'"
          ref="childPopForm"
          :type="drawerType"
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
              @click="drawerVisible = false"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="popConfirm"
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
            v-if="drawerVisible && drawerType==='detail' && productId"
            :item-id="productId"
          />
          <edit
            v-if="drawerVisible && drawerType==='edit' && productId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="productId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import detail from './detail'
import { parseTime } from '@/utils'
import {
  queryProductList,
  addProduct,
  updateProduct,
  removeProduct,
  queryProductTypeList
} from '@/api/listSource/productCenter'
export default {
  name: 'Index',
  components: {
    edit,
    detail
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'productCenter',
      popVisible: false,

      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '费用详情',

      formData: [
        {
          label: '产品名称',
          type: 'input',
          prop: 'productName',
          value: null,
          props: {
            placeholder: '请输入产品名称'
          }
        },
        {
          label: '产品类型',
          type: 'select',
          prop: 'productType',
          value: null,
          props: {
            placeholder: '请选择产品类型'
          },
          options: []
        }
      ],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '类型',
          prop: 'productTypeName'
        },
        {
          label: '采购单价',
          prop: 'purchasePrices'
        },
        {
          label: '销售单价',
          prop: 'unitPrice'
        },
        {
          label: '修改时间',
          prop: 'updateDate'
        }
      ],
      productId: null,
      recipeDefaultCover: require('@/assets/images/book-cover.png')

    }
  },
  created () {
    this.queryProductTypeData()
    this.init()
  },

  methods: {
    setting () {
      this.$router.push({ path: '/customer_productCenterSetting' })
    },
    resetSearch () {
      this.formData.forEach((item, index) => {
        item.value = null
      })
      this.reset()
    },
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 查询场所类型列表
    queryProductTypeData () {
      queryProductTypeList().then((res) => {
        this.formData[1].options = this.convertDataToOptions(res.data, 'productTypeName', 'productTypeId')
      })
    },

    // 获取列表
    init () {
      const param1 = {
        name: this.getValueByProp('productName', this.formData) ? this.getValueByProp('productName', this.formData) : null,
        productTypeId: this.getValueByProp('productType', this.formData) ? this.getValueByProp('productType', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      queryProductList(param1).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content = data.content.map((item) => {
          item.updateDate = parseTime(item.updateDate, '{y}-{m}-{d}')
          return item
        })
      })
    },

    // 添加
    handleAdd () {
      this.productId = null
      this.drawerType = 'add'
      this.popVisible = true
    },

    // 修改
    handleEdit (row) {
      if (row.id) {
        this.productId = row.id
      }
      this.drawerType = 'edit'
      this.drawerTitle = '修改产品'
      this.drawerVisible = true
    },

    // 详情
    handleDetail (row) {
      if (row.id) {
        this.productId = row.id
      }
      this.drawerType = 'detail'
      this.drawerTitle = '产品详情'
      this.drawerVisible = true
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
          removeProduct({
            productId: row.id
          }).then((res) => {
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

    // 弹窗确定
    popConfirm () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form
          const imageList = []
          let enable = false
          if (formData.previewSrcKey.length > 0) {
            formData.previewSrcKey.map((val) => {
              imageList.push({
                url: val
              })
            })
          }

          if (formData.enable === '1') {
            enable = true
          }
          const param = {
            cover: formData.coverSrcKey[0],
            name: formData.productName,
            productTypeId: formData.productType,
            unitPrice: parseFloat(formData.unitPrice),
            purchasePrices: parseFloat(formData.purchasePrices),
            unit: formData.unit,
            details: formData.productDesc,
            imageList: imageList,
            status: enable
          }

          if (this.drawerType === 'add') {
            addProduct(param).then((res) => {
              this.popVisible = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            param.productId = this.productId
            param.id = this.productId
            updateProduct(param).then((res) => {
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

<style scoped lang="scss">
.name-box {
  display: flex;

  .img-left {
    border-radius: 4px;
    flex-shrink: 0;
    height: 60px;
    width: 94px;

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }

}
</style>
