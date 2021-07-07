<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right" class="btnBox">
          <el-button v-has="{authId: 'guardcare.food.create'}" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加菜肴</el-button>
          <!--          <el-button v-has="{authId: 'guardcare.food.import'}" type="primary" @click="handleImport">导入菜肴</el-button>-->
        </div>
      </etm-table-tool-bar>

      <el-table-column
        slot="left"
        fixed="left"
        label="菜肴图片"
        :min-width="120"
      >
        <template v-slot="scoped">
          <div class="name-box">
            <div class="img-left">
              <img v-if="scoped.row.cover && scoped.row.cover!=='--'" :src="scoped.row.cover" alt="">
              <img v-else :src="defaultCover" alt="">
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        slot="left"
        fixed="left"
        label="菜肴名称"
        :min-width="120"
      >
        <template v-slot="scoped">
          <etm-text type="primary" @click="handleDetail(scoped.row)">{{ scoped.row.foodName }}</etm-text>
        </template>
      </el-table-column>

      <el-table-column slot="right" fixed="right" label="操作" :min-width="120">
        <template v-slot="scoped">
          <etm-text v-if="!scoped.row.defaultItem" type="primary" @click="handleEdit(scoped.row)">编辑</etm-text>
          <etm-text v-if="!scoped.row.defaultItem" type="danger" @click="handleDelete(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>

    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit v-if="popVisible && drawerType==='add'" ref="childPopForm" :type="drawerType" />
        <importPop v-if="popVisible && drawerType==='import'" ref="childPopImport" />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big">
          <template v-if="drawerVisible && drawerType==='edit'" slot="tool">
            <el-button plain size="mini" @click="drawerVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="popConfirm">保存</el-button>
          </template>
          <template v-if="drawerVisible && drawerType==='detail'" slot="tool">
            <el-button v-if="!defaultItem" v-has="{authId: 'guardcare.food.update'}" plain size="mini" @click="handleEdit">编辑</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail v-if="drawerVisible && drawerType==='detail' && foodId" :item-id="foodId" />
          <edit v-if="drawerVisible && drawerType==='edit' && foodId" ref="childPopForm" :type="drawerType" :item-id="foodId" />
        </div>

      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import edit from './edit'
import detail from './detail'
import importPop from './import'
import {
  getFood,
  postFood,
  putFood,
  delFood,
  postImportFood
} from '@/api/newDaycare/recipesGuardManage'

export default {
  name: 'PriceTable',
  components: {
    edit,
    detail,
    importPop
  },
  mixins: [baseMixin],
  data() {
    return {
      popVisible: false,
      popTitle: '添加菜肴',
      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '菜肴详情',
      defaultItem: false,
      defaultCover: require('@/assets/images/daycare/book-cover.png'),
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '菜肴类型',
          prop: 'foodTypeName'
        },
        {
          label: '来源',
          prop: 'source'
        },
        {
          label: '能量（千卡）',
          prop: 'energy'
        },
        {
          label: '蛋白质（克）',
          prop: 'protein'
        },
        {
          label: '脂肪（克）',
          prop: 'fat'
        },
        {
          label: '碳水化合物（克）',
          prop: 'carbohydrate'
        }
      ],
      flag: false,
      foodId: null // 物品id

    }
  },

  methods: {

    sourceName(val) {
      switch (val) {
        case 'SYSTEM':
          return '系统'
        case 'ORGANIZATION_DISTRIBUTION':
          return '集团分发'
        case 'CUSTOM':
          return '自定义'
      }
    },
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
      const param = {
        foodName: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        foodTypeId: this.getValueByProp('type', this.formData) ? this.getValueByProp('type', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      getFood(param).then((res) => {
        const { data } = res
        this.tableData = data
        this.tableData.content.map((val) => {
          if (val.imageList.length) {
            val.cover = val.imageList[0].url
          }
          val.source = this.sourceName(val.source)
        })
      })
    },

    handleAdd() {
      this.foodId = null
      this.drawerType = 'add'
      this.popTitle = '添加菜肴'
      this.popVisible = true
    },

    handleEdit(row) {
      if (row.foodId) {
        this.foodId = row.foodId
      }
      this.drawerType = 'edit'
      this.drawerTitle = '编辑菜肴'
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
          this.foodId = row.foodId
          delFood(this.foodId).then((res) => {
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
      if (row.foodId) {
        this.foodId = row.foodId
      }
      this.defaultItem = row.defaultItem
      this.drawerType = 'detail'
      this.drawerTitle = '菜肴详情'
      this.drawerVisible = true
    },

    // 弹窗确定
    popConfirm() {
      if (this.drawerType === 'import') {
        const file = this.$refs['childPopImport'].fileList
        if (file.length <= 0) {
          this.$message.warning('请选择文件')
        } else {
          if (this.flag) return
          this.flag = true
          postImportFood({ file: file[0] }).then(res => {
            this.popVisible = false
            this.$message.success('操作成功')
            this.reset()
            this.flag = false
          }).catch(() => {
            this.flag = false
          })
        }
      } else {
        this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
          if (valid) {
            const formData = this.$refs['childPopForm'].form
            console.log(formData)
            const imageList = []
            const foodIngredientsList = []
            let enable = false

            if (formData.coverSrcKey.length > 0) {
              formData.coverSrcKey.forEach((val) => {
                imageList.push({
                  url: val
                })
              })
            }

            if (formData.ingredientsList.length > 0) {
              formData.ingredientsList.forEach((val) => {
                foodIngredientsList.push({
                  ingredientsId: val.ingredientsId,
                  weight: val.ingredientsWeight
                })
              })
            }

            if (formData.enable === '1') {
              enable = true
            }
            const param = {
              foodName: formData.dishName,
              typeId: formData.dishType,
              description: formData.ingredients,
              imageList: imageList,
              enable: enable,
              foodIngredientsList: foodIngredientsList
            }
            if (this.drawerType === 'add') {
              postFood(param).then((res) => {
                this.popVisible = false
                this.$message({
                  message: '已添加',
                  type: 'success'
                })
                this.reset()
              })
            } else if (this.drawerType === 'edit') {
              putFood(param, this.foodId).then((res) => {
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
    },

    // 导入菜肴
    handleImport() {
      this.foodId = null
      this.drawerType = 'import'
      this.popTitle = '导入菜肴'
      this.popVisible = true
    }

  }
}
</script>

<style scoped lang="scss">
.btnBox{
  display: flex;
}
.name-box {
  display: flex;
  .img-left {
    width: 94px;
    height: 60px;
    flex-shrink: 0;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

}
</style>
