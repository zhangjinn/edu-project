<template>
  <div class="article-wrap">
    <etm-table-page :columns="columns" :data="tableData" border @currentChange="currentChange">
      <etm-table-tool-bar slot="tool">
        <el-button slot="right" v-has="{authId: 'daycare.material.create'}" type="primary" @click="addArticle"><i
          class="el-icon-plus"
        />&nbsp;&nbsp;添加物品
        </el-button>
        <!--        <el-button slot="right" type="primary">新增推荐教材教具</el-button>-->
      </etm-table-tool-bar>
      <el-table-column slot="left" fixed="left" label="物品名称" width="160">
        <template slot-scope="scoped">
          <etm-text type="primary" @click.stop="articleDetail(scoped.row)">{{ scoped.row.materialName }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="操作" width="120">
        <template v-slot="row">
          <etm-text v-has="{authId: 'daycare.material.update'}" type="primary" @click="handleEdit(row.row)">编辑</etm-text>
          <etm-text v-has="{authId: 'daycare.material.remove'}" type="danger" @click="remove(row.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <!--添加弹框-->
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="添加物品"
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
            <el-button plain size="mini" @click="articleDetail">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'daycare.material.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
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
  </div>

</template>

<script>
/**
 * article create by Administrator
 * createTime 2020/08/31 14:41
 */
import baseMixin from '@/layout/mixin/baseMixin'
import edit from '@/views/newDaycare/priceTeach/views/articleList/edit'
import detail from '@/views/newDaycare/priceTeach/views/articleList/detail'
import { queryItemList, createArticle, removeArticle, updateArticle } from '@/api/newDaycare/materialPriceManage'
import { parseTime } from '@/utils'

export default {
  name: 'ArticleList',
  components: {
    edit,
    detail
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    itemType: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      drawerType: 'add',
      drawerVisible: false,
      drawerTitle: '物品详情',
      showPop: false,
      popType: 'complex',
      columns: [
        { label: '类型', prop: 'materialTypeName' },
        { label: '采购单价', prop: 'purchasePrice', align: 'right' },
        { label: '销售单价', prop: 'price', align: 'right' },
        { label: '修改时间', prop: 'updateTime' },
        { label: '状态', prop: 'status' }
      ],
      tableData: {},
      articleId: null
    }
  },
  computed: {},
  watch: {
    itemType: {
      handler() {
        this.pageInfo.pageNum = 1
        this.init()
      },
      deep: true
    }
  },
  created() {
    // console.log(this.itemType)
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryItemList({
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        name: this.itemType.name,
        materialTypeId: this.itemType.materialTypeId
      }).then(res => {
        this.tableData = res.data
        // console.log(res.data)
        this.tableData.content.forEach(item => {
          item.updateTime = parseTime(item.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
          if (item.enable === true) {
            item.status = '开启'
          } else {
            item.status = '关闭'
          }
        })
      })
    },
    reset() {
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange(pageNum, pageSize) {
      // console.log(pageNum, pageSize)
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    handleEdit(row) {
      if (row.materialId) {
        this.articleId = row.materialId
      }
      this.drawerType = 'edit'
      this.drawerTitle = '修改物品详情'
      this.drawerVisible = true
    },
    remove(row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除物品？',
        content: row.materialName,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeArticle({ materialId: row.materialId }).then(res => {
            this.$message.success('操作成功')
            this.init()
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    articleDetail(row) {
      if (row.materialId) {
        this.articleId = row.materialId
      }
      this.drawerType = 'detail'
      this.drawerTitle = '物品详情'
      this.drawerVisible = true
    },
    addArticle() {
      this.showPop = true
      this.drawerType = 'add'
    },
    popConfirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
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
          formData.purchasePrice = Number(formData.purchasePrice)
          const param = {
            materialName: formData.materialName,
            imageList: imageList,
            enable: enable,
            materialTypeId: formData.materialTypeId,
            price: formData.price,
            company: formData.company,
            purchasePrice: formData.purchasePrice,
            details: formData.details
          }
          if (this.drawerType === 'add') {
            createArticle({
              materialName: param.materialName,
              imageList: param.imageList,
              enable: param.enable,
              materialTypeId: param.materialTypeId,
              price: param.price,
              company: param.company,
              purchasePrice: param.purchasePrice,
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
            updateArticle({
              materialId: this.articleId,
              materialName: param.materialName,
              imageList: param.imageList,
              enable: param.enable,
              materialTypeId: param.materialTypeId,
              price: param.price,
              company: param.company,
              purchasePrice: param.purchasePrice,
              details: param.details
            }).then((res) => {
              this.showPop = false
              this.$message({
                message: '已保存',
                type: 'success'
              })
              this.drawerVisible = false
              this.reset()
            })
          }
        }
      })
    },
    // 关闭抽屉
    before(done) {
      setTimeout(() => {
        done()
      }, 50)
    }
  }
}
</script>
<style lang="scss" scoped>
.article-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
