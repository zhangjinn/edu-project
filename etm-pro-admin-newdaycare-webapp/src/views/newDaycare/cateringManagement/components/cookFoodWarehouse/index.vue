<template>
  <div class="index-wrap">
    <!--人群管理-->
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
            添加菜肴
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column
        slot="right"
        label="操作"
      >
        <template>
          <etm-text @click="handleEdit">
            编辑
          </etm-text>
          <etm-text
            type="danger"
            @click="handleRemove"
          >
            删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-pop
      :visible="isShowAddPopup"
      pop="complex"
      title="添加人群"
      confirm-btn="确定"
      cancel-btn="取消"
      @cancel="handleCancel"
      @confirm="handleConfirm"
    >
      <add v-if="isShowAddPopup" />
    </etm-pop>

    <etm-drawer
      :visible.sync="isShowEditDrawer"
    >
      <edit v-if="isShowEditDrawer" />
    </etm-drawer>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/3/22 13:46
 */
import add from './components/add'
import edit from './components/edit'

export default {
  name: 'Index',
  components: { add, edit },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      isShowAddPopup: false,
      isShowEditDrawer: false,
      columns: [
        // {
        //   label: '人群名称',
        //   prop: 'name'
        // },
        {
          label: '菜肴名称',
          prop: 'foodName'
        },
        {
          label: '菜肴类型',
          prop: 'alias'
        },
        {
          label: '来源',
          prop: 'useStatus'
        },
        {
          label: '能量（Kcal）',
          prop: 'energy'
        },
        {
          label: '蛋白质（克）',
          prop: 'energy'
        },
        {
          label: '脂肪（克）',
          prop: 'energy'
        },
        {
          label: '碳水化合物（克）',
          prop: 'energy'
        }
      ],
      tableData: {
        content: [
          { name: '111', useStatus: true }
        ]
      }
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
    handleEdit () {
      this.isShowEditDrawer = true
    },
    handleRemove () {

    },
    handleAdd () {
      this.isShowAddPopup = true
    },
    handleDetail () {

    },
    currentChange () {},
    handleCancel () {
      this.isShowAddPopup = false
    },
    handleConfirm () {
      this.isShowAddPopup = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
