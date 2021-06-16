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
            添加人群
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column
        slot="left"
        label="人群名称"
      >
        <template slot-scope="scope">
          <etm-text @click="handleDetail">
            {{ scope.row.name }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="使用状态"
      >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.useStatus" />
        </template>
      </el-table-column>
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
// import { queryPeopleGroupList } from '@/api/newDaycare/cateringManagement'
import add from './components/add'
import edit from './components/edit'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryPeopleGroupList } from '@/api/newDaycare/cateringManagement'

export default {
  name: 'Index',
  components: { add, edit },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      isShowAddPopup: false,
      isShowEditDrawer: false,
      search: {},
      formData: [],
      peopleName: '',
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        // {
        //   label: '人群名称',
        //   prop: 'name'
        // },
        {
          label: '餐别组合',
          prop: 'canbie'
        },
        {
          label: '是否清真',
          prop: 'isQz'
        },
        {
          label: '使用状态',
          prop: 'useStatus'
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
      this.peopleName = this.getValueByProp('peopleName', this.formData) ? this.getValueByProp('peopleName', this.formData) : null
      console.log(this.peopleName, 'name')
      const params = {}
      params.peopleName = this.peopleName
      queryPeopleGroupList(params).then(res => {
        console.log(res, '我是查询人群管理')
      })
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
    reset () {
      this.pageInfo.pageNum = 1
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
