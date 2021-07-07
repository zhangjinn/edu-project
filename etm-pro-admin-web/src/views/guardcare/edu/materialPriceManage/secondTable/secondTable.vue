<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      :index="true"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button v-has="{authId: 'guardcare.cost.create'}" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加费用</el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="费用名称">
        <template v-slot="scoped">
          <etm-text v-if="!hasAuthOfBool('guardcare.cost.query')" type="normal">{{ scoped.row.materialPriceName }}</etm-text>
          <etm-text v-else type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.materialPriceName }}</etm-text>
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
          <etm-text v-has="{authId: 'guardcare.cost.update'}" type="primary" @click="handleEdit(scoped.row, true)">编辑</etm-text>
          <etm-text v-has="{authId: 'guardcare.cost.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

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
            <el-button v-has="{authId: 'guardcare.cost.query'}" plain size="mini" @click="cancelDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'guardcare.cost.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
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
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import detail from './detail'
import {
  getMaterialPrice,
  postMaterialPrice,
  putMaterialPrice,
  delMaterialPrice
} from '@/api/guardcare/edu/materialPriceManage'
export default {
  name: 'PriceTable',
  components: {
    edit,
    detail
  },
  mixins: [baseMixin],
  data() {
    return {
      drawerPath: false,
      popVisibleEdit: false,
      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '费用详情',
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '售卖单价(元)',
          prop: 'sellPrice',
          align: 'right'
        }
      ],
      materialPriceId: null // 物品id

    }
  },

  methods: {
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset() {
      this.pageInfo.pageNum = 1
      this.init()
    },

    // 获取列表
    init() {
      let enable = this.getValueByProp('status', this.formData)
      if (enable === '1') {
        enable = true
      } else if (enable === '2') {
        enable = false
      }
      const param2 = {
        name: this.getValueByProp('priceName', this.formData),
        enable: enable,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getMaterialPrice(param2).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },

    handleAdd() {
      this.materialPriceId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },

    handleEdit(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.materialPriceId) {
        this.materialPriceId = row.materialPriceId
      }
      this.drawerType = 'edit'
      this.drawerTitle = '编辑费用'
      this.drawerVisible = true
    },

    // 状态改变
    switchChange(row) {
      console.log(row)
      if (row.materialPriceId) {
        this.materialPriceId = row.materialPriceId
      }
      const param = {
        materialPriceName: row.name,
        sellPrice: row.sellPrice,
        property: row.property,
        enable: row.enable
      }
      putMaterialPrice(param, this.materialPriceId).then((res) => {
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
          delMaterialPrice(this.materialPriceId).then((res) => {
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
      this.drawerPath = false
      if (row.materialPriceId) {
        this.materialPriceId = row.materialPriceId
      }
      this.drawerType = 'detail'
      this.drawerTitle = '费用详情'
      this.drawerVisible = true
    },
    cancelDrawer() {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.drawerType = 'detail'
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

          let enable = false
          if (formData.enable === '1') {
            enable = true
          }
          const param = {
            materialPriceName: formData.name,
            sellPrice: formData.sellPrice,
            property: formData.property,
            enable: enable
          }

          if (this.drawerType === 'add') {
            postMaterialPrice(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            putMaterialPrice(param, this.materialPriceId).then((res) => {
              // this.drawerVisible = false
              this.drawerType = 'detail'
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

</style>
