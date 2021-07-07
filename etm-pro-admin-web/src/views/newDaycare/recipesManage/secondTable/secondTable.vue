<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right" class="btnBox">
          <el-button v-if="treasureBook.enable" type="primary" @click.stop="openBook">
            {{ treasureBook.treasuredBookName }}
          </el-button>
          <el-button v-has="{authId: 'daycare.food.create'}" type="primary" @click="handleAdd"><i class="el-icon-plus" />&nbsp;&nbsp;添加菜肴
          </el-button>
          <!--          <el-button type="primary" @click="handleImport">导入菜肴</el-button>-->
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="菜肴名称">
        <template v-slot="scoped">
          <etm-text v-has="{authId: 'daycare.food.query'}" type="primary" @click="handleDetail(scoped.row)">
            {{ scoped.row.foodName }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template v-slot="scoped">
          <etm-text v-has="{authId: 'daycare.food.update'}" type="primary" @click="handleEdit(scoped.row)">编辑</etm-text>
          <etm-text v-has="{authId: 'daycare.food.remove'}" type="danger" @click="handleDelete(scoped.row)">删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <edit v-if="popVisibleEdit && drawerType==='add'" ref="childPopForm" :type="drawerType" />
        <!--        <importPop v-if="popVisibleEdit && drawerType==='import'" ref="childPopImport" />-->
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
          <detail v-if="drawerVisible && drawerType==='detail' && foodId" :item-id="foodId" />
          <edit
            v-if="drawerVisible && drawerType==='edit' && foodId"
            ref="childPopForm"
            :type="drawerType"
            :item-id="foodId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
    <treasure-book :show-book="showBook" :book-data="treasureBook" @close="closeBook" />
  </div>

</template>

<script>
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import etmPop from '@/layout/main/EtmPop'
import edit from './edit'
import detail from './detail'
import {
  createDaycareDishes,
  queryDaycareDishesList,
  removeDaycareDishes,
  updateDaycareDishes
} from '@/api/newDaycare/recipesManage'
import TreasureBook from '@/components/TreasuredBook'
import { queryTreasuredBook } from '@/api/base/treasuredBook'

export default {
  name: 'PriceTable',
  components: {
    etmPop,
    edit,
    detail,
    TreasureBook
    // importPop
  },
  mixins: [baseMixin],
  props: {
    option: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      popVisibleEdit: false,
      popTitle: '添加菜肴',
      drawerVisible: false,
      drawerType: 'detail',
      drawerTitle: '菜肴详情',
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        // {
        //   label: '菜肴名称',
        //   prop: 'foodName',
        //   align: 'left'
        // },
        {
          label: '类型',
          prop: 'foodTypeName',
          // formatter: (row, column, val) => {
          //   // console.log('option', this.option, val)
          //   const foodTypeName = (this.option.find(v => v.foodTypeId === val) || {}).foodTypeName
          //   return foodTypeName || ''
          // },
          align: 'left'
        },
        {
          label: '食材用量',
          prop: 'description',
          align: 'left'
        },
        {
          label: '录入时间',
          prop: 'createTime',
          align: 'left',
          formatter(row) {
            if (row.createTime) {
              return parseTime(row.createTime)
            } else {
              return row.createTime
            }
          }
        },
        {
          label: '是否开启',
          prop: 'enable',
          formatter: (row, column, val) => {
            if (val) {
              return '是'
            } else {
              return '否'
            }
          },
          align: 'left'
        }
      ],
      flag: false,
      foodId: null, // 物品id
      treasureBook: {},
      showBook: false

    }
  },
  created() {
    this.getTreasureBook()
  },
  methods: {
    getTreasureBook() {
      const param = {
        coding: 'shipuguanli'
      }
      queryTreasuredBook(param).then(res => {
        this.treasureBook = res.data
      })
    },
    openBook() {
      this.showBook = true
    },
    closeBook() {
      this.showBook = false
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
        foodName: this.getValueByProp('foodName', this.formData) ? this.getValueByProp('foodName', this.formData) : null,
        typeId: this.getValueByProp('typeId', this.formData) ? this.getValueByProp('typeId', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      queryDaycareDishesList(param).then((res) => {
        // console.log('param', res)
        const { data } = res
        this.tableData = data
        // this.tableData.content.map((val) => {
        //   val.createTime = val.createTime ? parseTime(val.createTime, '{y}-{m}-{d}') : ''
        // })
      })
    },

    handleAdd() {
      this.foodId = null
      this.drawerType = 'add'
      this.popTitle = '添加菜肴'
      this.popVisibleEdit = true
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
          removeDaycareDishes(this.foodId).then(() => {
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
      this.drawerType = 'detail'
      this.drawerTitle = '菜肴详情'
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
          const image = (formData.previewSrcKey || []).map((v, i) => {
            return { name: i + Date.now() + formData.foodName, url: v }
          })
          const param = {
            foodName: formData.foodName,
            typeId: formData.typeId,
            description: formData.description,
            image,
            enable: formData.enable
          }
          if (this.drawerType === 'add') {
            createDaycareDishes(param).then(() => {
              this.popVisibleEdit = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.drawerType === 'edit') {
            updateDaycareDishes({ ...param, foodId: this.foodId }).then(() => {
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
      // if (this.drawerType === 'import') {
      // const file = this.$refs['childPopImport'].fileList
      // if (file.length <= 0) {
      //   this.$message.warning('请选择文件')
      // } else {
      //   if (this.flag) return
      //   this.flag = true
      //   postImportFood({ file: file[0] }).then(res => {
      //     this.popVisibleEdit = false
      //     this.$message.success('操作成功')
      //     this.reset()
      //     this.flag = false
      //   }).catch(() => {
      //     this.flag = false
      //   })
      // }
      // } else {
      //   this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
      //     if (valid) {
      //       const formData = this.$refs['childPopForm'].form
      //
      //       const param = {
      //         foodName: formData.dishName,
      //         typeId: formData.dishType,
      //         description: formData.ingredients
      //       }
      //       if (this.drawerType === 'add') {
      //         createDaycareDishes(param).then((res) => {
      //           this.popVisibleEdit = false
      //           this.$message({
      //             message: '已添加',
      //             type: 'success'
      //           })
      //           this.reset()
      //         })
      //       } else if (this.drawerType === 'edit') {
      //         updateDaycareDishes(param, this.foodId).then((res) => {
      //           this.drawerVisible = false
      //           this.$message({
      //             message: '已修改',
      //             type: 'success'
      //           })
      //           this.reset()
      //         })
      //       }
      //     }
      //   })
      // }
    }

    // // 导入菜肴
    // handleImport() {
    //   this.foodId = null
    //   this.drawerType = 'import'
    //   this.popTitle = '导入菜肴'
    //   this.popVisibleEdit = true
    // }

  }
}
</script>

<style scoped lang="scss">
.btnBox {
  display: flex;
}
</style>
