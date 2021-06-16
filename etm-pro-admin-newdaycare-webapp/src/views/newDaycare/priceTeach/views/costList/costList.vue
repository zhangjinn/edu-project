<template>
  <div class="cost-wrap">
    <etm-table
      :columns="columns"
      :data="tableData"
      :cell-class-name="cellClassNameMethod"
      border
    >
      <etm-table-tool-bar slot="tool">
        <el-button
          slot="right"
          v-has="{authId: 'daycare.cost.create'}"
          type="primary"
          @click="addArticle"
        >
          <i class="el-icon-plus" />&nbsp;&nbsp;添加费用
        </el-button>
      </etm-table-tool-bar>

      <el-table-column
        slot="left"
        fixed="left"
        label="费用名称"
        width="160"
      >
        <template slot-scope="scoped">
          <etm-text
            type="primary"
            @click.stop="articleDetail(scoped.row)"
          >
            {{ scoped.row.priceName }}
          </etm-text>
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        label="状态"
        prop="status"
      >
        <template slot-scope="scoped">
          <etm-status
            :type="scoped.row.enable ? 'active' : 'inactive'"
          >
            {{ scoped.row.status }}
          </etm-status>
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        fixed="right"
        label="操作"
        width="120"
      >
        <template v-slot="row">
          <etm-text
            v-has="{authId: 'daycare.cost.update'}"
            type="primary"
            @click="edit(row.row, true)"
          >
            编辑
          </etm-text>
          <etm-text
            v-has="{authId: 'daycare.cost.remove'}"
            type="danger"
            @click="remove(row.row)"
          >
            删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table>
    <!--添加弹框-->
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="添加费用"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="popConfirmEdit"
      @cancel="showPop = false"
    >
      <edit
        v-if="showPop && drawerType==='add'"
        ref="childPopForm"
        :type="drawerType"
      />
    </etm-pop>
    <!--详情/编辑抽屉-->
    <etm-drawer
      :visible.sync="drawerVisible"
      :before-close="before"
    >
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
              @click="cancelArticleDetail"
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
              v-has="{authId: 'daycare.cost.update'}"
              plain
              size="mini"
              @click="edit"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail
            v-if="drawerVisible && drawerType==='detail' && articleId"
            :item-id="articleId"
          />
          <edit
            v-if="drawerVisible && drawerType==='edit' && articleId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="articleId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
/**
 * costList create by Administrator
 * createTime 2020/08/31 14:41
 */
import baseMixin from '@/layout/mixin/baseMixin'
import edit from '@/views/newDaycare/priceTeach/views/costList/edit'
import detail from '@/views/newDaycare/priceTeach/views/costList/detail'
import { createCost, queryCostList, updateCost, removeCost } from '@/api/newDaycare/materialPriceManage'
import { parseTime } from '@/utils'

export default {
  name: 'CostList',
  components: {
    edit,
    detail
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    priceType: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      drawerPath: false,
      drawerType: 'add',
      drawerVisible: false,
      drawerTitle: '费用详情',
      showPop: false,
      popType: 'complex',
      columns: [
        { label: '单价', prop: 'price', align: 'right', sortable: true, sortBy: 'price' },
        { label: '修改时间', prop: 'updateTime', sortable: true, sortBy: 'updateTime' }
      ],
      tableData: [
        {
          genre: '教材',
          purchasePrices: '50.00',
          unitPrice: '280.00',
          time: '2020',
          status: '开启',
          articleName: '斯蒂芬',
          id: '2'
        }
      ],
      articleId: null
    }
  },
  computed: {},
  watch: {
    priceType: {
      handler () {
        // console.log(this.priceType)
        this.pageInfo.pageNum = 1
        this.init()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // console.log(this.priceType.priceName)
      queryCostList({ priceName: this.priceType.priceName }).then(res => {
        // console.log(res)
        this.tableData = res.data
        this.tableData.forEach(item => {
          item.updateTime = parseTime(item.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
          if (item.enable === true) {
            item.status = '开启'
          } else {
            item.status = '关闭'
          }
        })
      })
    },
    cellClassNameMethod ({ row, columnIndex }) {
      if (columnIndex === 3) { // 状态栏
        if (row.status === '开启') {
          return 'enabled'
        }
        if (row.status === '关闭') {
          return 'disabled'
        }
      }
    },
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },
    edit (row, drawerPath) {
      this.drawerPath = drawerPath
      // console.log(row)
      if (row.priceId) {
        this.articleId = row.priceId
      }
      this.drawerType = 'edit'
      this.drawerTitle = '修改费用详情'
      this.drawerVisible = true
    },
    remove (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除物品？',
        content: row.priceName,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeCost({ priceId: row.priceId }).then(res => {
            this.init()
            this.$message.success('操作成功')
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    articleDetail (row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.priceId) {
        this.articleId = row.priceId
      }
      this.drawerType = 'detail'
      this.drawerTitle = '费用详情'
      this.drawerVisible = true
    },
    cancelArticleDetail (row, drawerPath = false) {
      if (this.drawerPath) {
        this.drawerVisible = false
      } else {
        this.articleDetail(row, drawerPath)
      }
    },
    addArticle () {
      this.showPop = true
      this.drawerType = 'add'
    },
    popConfirmEdit () {
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
          formData.price = Number(formData.price)
          const param = {
            priceName: formData.priceName,
            image: imageList,
            enable: enable,
            price: formData.price,
            details: formData.details
          }
          // console.log(param)
          if (this.drawerType === 'add') {
            createCost({
              priceName: param.priceName,
              image: param.image,
              enable: param.enable,
              price: param.price,
              details: param.details
            }).then((res) => {
              this.showPop = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            updateCost({
              priceId: this.articleId,
              priceName: param.priceName,
              image: param.image,
              enable: param.enable,
              price: param.price,
              details: param.details
            }).then((res) => {
              this.showPop = false
              this.$message({
                message: '已保存',
                type: 'success'
              })
              // this.drawerVisible = false
              this.drawerType = 'detail'
              this.reset()
            })
          }
        }
      })
    },
    // 关闭抽屉
    before (done) {
      setTimeout(() => {
        done()
      }, 50)
    }
  }
}
</script>
<style lang="scss" scoped>
.cost-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }

  ::v-deep .el-table {
    .enabled {
      color: #67c23a;
    }

    .disabled {
      color: #999;
    }
  }
}
</style>
