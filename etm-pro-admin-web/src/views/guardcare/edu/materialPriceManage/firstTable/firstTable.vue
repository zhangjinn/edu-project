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
          <el-button v-has="{authId: 'guardcare.material.create'}" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加物品</el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="物品名称">
        <template v-slot="scoped">
          <etm-text v-if="!hasAuthOfBool('guardcare.material.query')" type="normal">{{ scoped.row.materialName }}</etm-text>
          <etm-text v-else type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.materialName }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="scoped">
          <etm-text v-has="{authId: 'guardcare.material.update'}" type="primary" @click="handleEdit(scoped.row, true)">编辑</etm-text>
          <etm-text v-has="{authId: 'guardcare.material.remove'}" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      title="添加物品"
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
            <el-button v-has="{authId: 'guardcare.material.query'}" plain size="mini" @click="cancelDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirmEdit">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-has="{authId: 'guardcare.material.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && materialId" :item-id="materialId" />
          <edit v-if="drawerVisible && drawerType==='edit' && materialId" ref="childPopForm" :type="drawerType" :item-id="materialId" />
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
  getMaterial,
  postMaterial,
  putMaterial,
  delMaterial
} from '@/api/guardcare/edu/materialPriceManage'
export default {
  name: 'MaterialTable',
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
      drawerTitle: '物品详情',
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '物品编码',
          prop: 'code'
        },
        {
          label: '物品类型',
          prop: 'materialTypeName'
        },
        {
          label: '单位',
          prop: 'unit'
        },
        {
          label: '库存数',
          prop: 'stock'
        },
        {
          label: '采购价(元)',
          prop: 'purchasePrice',
          align: 'right'
        },
        {
          label: '销售价(元)',
          prop: 'sellPrice',
          align: 'right'
        }
      ],
      materialId: null // 物品id

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
      const param1 = {
        name: this.getValueByProp('materialName', this.formData) ? this.getValueByProp('materialName', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getMaterial(param1).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },

    // 添加
    handleAdd() {
      this.materialId = null
      this.drawerType = 'add'
      this.popVisibleEdit = true
    },
    cancelDrawer() {
      if (this.drawerPath) {
        this.drawerVisible = false
        return
      }
      this.drawerType = 'detail'
    },
    // 修改
    handleEdit(row, drawerPath = false) {
      this.drawerPath = drawerPath
      if (row.materialId) {
        this.materialId = row.materialId
      }
      this.drawerTitle = '编辑物品'
      this.drawerType = 'edit'
      this.drawerVisible = true
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
          this.materialId = row.materialId
          delMaterial(this.materialId).then((res) => {
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
      if (row.materialId) {
        this.materialId = row.materialId
      }
      this.drawerTitle = '物品详情'
      this.drawerType = 'detail'
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
          // console.log(formData)
          const imageList = []
          if (formData.previewSrcKey.length > 0) {
            formData.previewSrcKey.map((val) => {
              imageList.push({
                url: val
              })
            })
          }
          const param = {
            code: null,
            materialName: formData.name,
            materialTypeId: formData.type,
            unit: formData.unit,
            reserve: formData.reserve,
            detail: formData.desc,
            imageList: imageList,
            purchasePrice: formData.purchasePrice,
            sellPrice: formData.sellingPrice
          }

          if (this.drawerType === 'add') {
            postMaterial(param).then((res) => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            putMaterial(param, this.materialId).then((res) => {
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
