<template>
  <div>
    <etm-table-page
      :data="tableData"
      :columns="[]"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div
          slot="right"
          class="btnBox"
        >
          <el-button
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" />&nbsp;&nbsp;添加食材
          </el-button>
        </div>
      </etm-table-tool-bar>

      <el-table-column
        slot="left"
        fixed="left"
        label="食材名称"
        :min-width="120"
      >
        <template v-slot="scoped">
          <etm-text
            type="primary"
            @click="handleDetail(scoped.row)"
          >
            {{ scoped.row.name }}
          </etm-text>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(column,index) in columns"
        :key="index"
        :label="column.label"
        :prop="column.prop"
        :fixed="column.fixed"
        :min-width="column.minWidth"
      >
        <template v-if="column.secondary">
          <el-table-column
            v-for="col in column.secondary"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :min-width="col.minWidth"
          />
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        fixed="right"
        label="操作"
        :min-width="120"
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

    <!--添加弹框-->
    <etm-pop
      :visible="popVisible"
      pop="big"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit
          v-if="popVisible && popType==='add'"
          ref="childPopForm"
          :type="popType"
        />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title
          :title="popTitle"
          border
          size="big"
        >
          <template
            v-if="drawerVisible && popType==='edit'"
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
            v-if="drawerVisible && popType==='detail'"
            slot="tool"
          >
            <el-button
              v-has="{authId: 'guardcare.food.update'}"
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
            v-if="drawerVisible && popType==='detail' && ingredientsId"
            :item-id="ingredientsId"
          />
          <edit
            v-if="drawerVisible && popType==='edit' && ingredientsId"
            ref="childPopForm"
            :type="popType"
            :item-id="ingredientsId"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import edit from './edit'
import detail from './detail'
import { queryIngredients, addIngredients, updateIngredients, removeIngredients } from '@/api/newDaycare/recipesGuardManage'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Index',
  components: {
    edit,
    detail
  },
  mixins: [baseMixin],
  data () {
    return {
      popVisible: false,
      popTitle: '添加食材',
      popType: 'add',
      drawerVisible: false,
      ingredientsId: null,
      formData: [],
      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '别名',
          prop: 'alias',
          fixed: 'left',
          minWidth: 120
        },
        {
          label: '食材类型',
          prop: 'typeName',
          fixed: 'left',
          minWidth: 120
        },
        {
          label: '营养素（每百克食材所含营养素）',
          secondary: [
            {
              label: '能量（Kcal）',
              prop: 'energy',
              minWidth: 130
            }, {
              label: '脂肪（g）',
              prop: 'fat',
              minWidth: 130
            }, {
              label: '蛋白质（g）',
              prop: 'protein',
              minWidth: 130
            }, {
              label: '膳食纤维（g）',
              prop: 'dietaryFiber',
              minWidth: 130
            }, {
              label: '碳水化合物（g）',
              prop: 'carbohydrate',
              minWidth: 130
            }
          ]
        },
        {
          label: '维生素（每百克食材所含维生素）',
          secondary: [
            {
              label: '维生素A（ug）',
              prop: 'vitaminA',
              minWidth: 130
            }, {
              label: '胡萝卜素（ug）',
              prop: 'carotene',
              minWidth: 130
            }, {
              label: '维生素B1（mg）',
              prop: 'vitaminB1',
              minWidth: 130
            }, {
              label: '维生素B2（mg）',
              prop: 'vitaminB2',
              minWidth: 130
            }, {
              label: '维生素B3（mg）',
              prop: 'vitaminB3',
              minWidth: 130
            }, {
              label: '维生素C（mg）',
              prop: 'vitaminC',
              minWidth: 130
            }, {
              label: '维生素E（mg）',
              prop: 'vitaminE',
              minWidth: 130
            }
          ]
        },
        {
          label: '矿物质（每百克食材所含矿物质）',
          secondary: [
            {
              label: '钙（mg）',
              prop: 'calcium',
              minWidth: 100
            }, {
              label: '磷（mg）',
              prop: 'phosphorus',
              minWidth: 100
            }, {
              label: '钾（mg）',
              prop: 'potassium',
              minWidth: 100
            }, {
              label: '钠（mg）',
              prop: 'sodium',
              minWidth: 100
            }, {
              label: '镁（mg）',
              prop: 'magnesium',
              minWidth: 100
            }, {
              label: '铁（mg）',
              prop: 'iron',
              minWidth: 100
            }, {
              label: '锌（mg）',
              prop: 'zinc',
              minWidth: 100
            }, {
              label: '硒（mg）',
              prop: 'selenium',
              minWidth: 100
            }, {
              label: '铜（mg）',
              prop: 'copper',
              minWidth: 100
            }, {
              label: '锰（mg）',
              prop: 'manganese',
              minWidth: 100
            }, {
              label: '碘（mg）',
              prop: 'iodine',
              minWidth: 100
            }
          ]
        }
      ]
    }
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },

    // 重置
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    },

    // 获取列表
    init () {
      const param = {
        name: this.getValueByProp('name', this.formData) ? this.getValueByProp('name', this.formData) : null,
        typeId: this.getValueByProp('type', this.formData) ? this.getValueByProp('type', this.formData) : null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      queryIngredients(param).then((res) => {
        const { data } = res
        this.tableData = data
      })
    },

    handleAdd () {
      this.popTitle = '添加食材'
      this.popType = 'add'
      this.popVisible = true
    },

    handleDetail (row) {
      this.ingredientsId = row.id
      this.popTitle = '食材详情'
      this.popType = 'detail'
      this.drawerVisible = true
    },

    handleEdit (row) {
      if (row.id) {
        this.ingredientsId = row.id
      }
      this.popTitle = '编辑食材'
      this.popType = 'edit'
      this.drawerVisible = true
    },

    handleDelete (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '是否确定删除该食材？该食材相关信息将被清除，无法撤回！',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeIngredients({
            foodIngredientsId: row.id
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

    popConfirm () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form

          const param = {
            name: formData.name,
            alias: formData.alias,
            typeId: formData.typeId,
            energy: formData.energy,
            fat: formData.fat,
            protein: formData.protein,
            dietaryFiber: formData.dietaryFiber,
            carbohydrate: formData.carbohydrate,
            vitaminA: formData.vitaminA,
            carotene: formData.carotene,
            vitaminB1: formData.vitaminB1,
            vitaminB2: formData.vitaminB2,
            vitaminB3: formData.vitaminB3,
            vitaminC: formData.vitaminC,
            vitaminE: formData.vitaminE,
            calcium: formData.calcium,
            phosphorus: formData.phosphorus,
            potassium: formData.potassium,
            sodium: formData.sodium,
            magnesium: formData.magnesium,
            iron: formData.iron,
            zinc: formData.zinc,
            selenium: formData.selenium,
            copper: formData.copper,
            manganese: formData.manganese,
            iodine: formData.iodine
          }
          if (this.popType === 'add') {
            addIngredients(param).then((res) => {
              this.popVisible = false
              this.$message({
                message: '已添加',
                type: 'success'
              })
              this.reset()
            })
          } else if (this.popType === 'edit') {
            param.foodIngredientsId = this.ingredientsId
            updateIngredients(param).then((res) => {
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

<style scoped>

</style>
