<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane label="托育费用">
              <etm-tool-bar v-model="formData" @search="handleSearch" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            border
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button slot="right" type="primary" @click="addArticle">
                  <i class="el-icon-plus" />&nbsp;&nbsp;添加托育费用
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="right" fixed="right" label="操作" width="220">
              <template v-slot="row">
                <etm-text type="primary" @click="update(row.row)">编辑</etm-text>
                <etm-text v-if="!row.row.type" type="danger" @click="del(row.row)">删除</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
        <etm-pop
          :visible="showPop"
          :pop="popType"
          title="添加收费项目"
          confirm-btn="确定"
          cancel-btn="取消"
          @open="showPop = true"
          @close="showPop = false"
          @confirm="popConfirmEdit"
          @cancel="showPop = false"
        >
          <edit v-if="showPop && drawerType==='add'" ref="childPopForm" :type="drawerType" />
        </etm-pop>
        <!--详情/编辑抽屉-->
        <etm-drawer :visible.sync="drawerVisible" :before-close="before">
          <etm-layout-split line>
            <etm-title :title="drawerTitle" border size="big">
              <template v-if="drawerVisible && drawerType==='edit'" slot="tool">
                <el-button plain size="mini" @click="drawerVisible=false">取消</el-button>
                <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
              </template>
            </etm-title>
            <div class="drawerBody">
              <detail v-if="drawerVisible && drawerType==='detail' && articleId" :item-id="articleId" />
              <edit
                v-if="drawerVisible && drawerType==='edit' && articleId"
                ref="childPopForm"
                :type="drawerType"
                :item-id="articleId"
              />
            </div>

          </etm-layout-split>
        </etm-drawer>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/12/03 15:38
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryPrice, createPrice, updatePrice, removePrice } from '@/api/newDaycare/priceCare'
import edit from '@/views/newDaycare/priceCare/edit'

export default {
  name: 'Index',
  components: { edit },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      showPop: false,
      popType: 'simple',
      drawerVisible: false,
      drawerTitle: '编辑托育费用',
      articleId: null,
      formData: [
        {
          label: '费用名称',
          type: 'input',
          prop: 'PriceName',
          value: '',
          props: {
            placeholder: '请输入费用名称'
          }
        }
      ],
      tableData: {},
      columns: [
        {
          label: '费用名称',
          prop: 'name'
        },
        {
          label: '收费方式',
          prop: 'priceMethod'
        },
        {
          label: '费用',
          prop: 'cost'
        },
        {
          label: '状态',
          prop: 'open'
        }
      ],
      priceMethod: {
        'WEEK': '周期收费',
        'ONCE': '一次性收费'
      }
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
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    init() {
      const name = this.getObjectByProp('PriceName', this.formData).value
      queryPrice({
        name: name || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(v => {
          v.priceMethod = this.priceMethod[v.chargingMethod]
          v.open = v.type ? '开启' : '关闭'
          v.cost = v.cost.toFixed(2)
        })
        // console.log(this.tableData.content)
      })
    },
    addArticle() {
      this.showPop = true
      this.drawerType = 'add'
    },
    reset() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    handleSearch() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    update(row) {
      if (row.id) {
        this.articleId = row.id
      }
      this.drawerType = 'edit'
      this.drawerVisible = true
    },
    del(row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除该条记录？',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          removePrice({ caPriceId: row.id }).then(() => {
            this.reset()
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    addPrice() {
      this.showPop = false
    },
    // 关闭抽屉
    before(done) {
      setTimeout(() => {
        done()
      }, 50)
    },
    popConfirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
          const priceMethod = {
            '1': 'WEEK',
            '2': 'ONCE'
          }
          if (this.drawerType === 'edit') {
            updatePrice({
              caPriceId: this.articleId,
              name: formData.priceName,
              chargingMethod: priceMethod[formData.enable],
              cost: formData.price,
              type: formData.open
            }).then(() => {
              this.drawerVisible = false
              this.reset()
            })
          } else {
            createPrice({
              name: formData.priceName,
              chargingMethod: priceMethod[formData.enable],
              cost: formData.price,
              type: formData.open
            }).then(() => {
              this.showPop = false
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
