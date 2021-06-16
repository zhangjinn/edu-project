<template>
  <div class="myRecipes-wrap">
    <!--我的食谱 -->
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" />
            智能配餐
          </el-button>
          <el-button type="primary">
            <!--推荐食谱-->
          </el-button>
        </div>
      </etm-table-tool-bar>

      <el-table-column
        slot="right"
        label="操作"
      >
        <template>
          <etm-text @click="handleEdit">
            编辑食谱
          </etm-text>
          <etm-text
            type="danger"
            @click="removeRecipe"
          >
            删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-pop
      :visible="isShowAddPopup"
      pop="complex"
      title="添加带量食谱"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseAdd"
      @cancel="popCloseAdd"
      @confirm="popConfirmAdd"
    >
      <div class="popContent">
        <add
          v-if="isShowAddPopup"
          ref="childPopForm"
        />
      </div>
    </etm-pop>
  </div>
</template>

<script>
/**
 * myRecipes create by Administrator
 * createTime 2021/3/11 15:42
 */
import add from './components/add'
export default {
  name: 'MyRecipes',
  components: { add },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tableData: {
        content: [
          { gradeName: '111' }
        ]
      },
      columns: [ // 表格的列表头传值
        {
          label: '食谱封面',
          prop: 'gradeName'
        },
        {
          label: '食谱名次/周次',
          prop: 'gradeName'
        },
        {
          label: '录入日期',
          prop: 'gradeName'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      isShowEditPopup: false,
      isShowAddPopup: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    currentChange () {
      this.init()
    },
    handleEdit () {
      this.switchToRecipe()
    },
    handleAdd () {
      this.isShowAddPopup = true
    },
    switchToRecipe () {
      this.$router.push({
        path: '/ewdaycare_dietManagement_editMyRecipes'
      })
    },
    removeRecipe () {

    },
    popConfirmAdd () {
      this.isShowAddPopup = false
    },
    popCloseAdd () {
      this.isShowAddPopup = false
    }

  }
}
</script>
<style lang="scss" scoped></style>
