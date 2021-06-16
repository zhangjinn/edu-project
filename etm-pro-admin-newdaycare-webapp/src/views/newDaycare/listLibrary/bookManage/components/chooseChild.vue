<template>
  <div class="chooseChild-wrap">
    <etm-pop
      :visible="showPop"
      pop="big"
      title="选择学员"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @open="queryChild"
      @close="handleCancel"
    >
      <etm-tool-bar
        :value="formData"
        @search="queryChild"
      />
      <etm-table
        :data="tableData"
        :columns="columns"
      >
        <template slot="right">
          <el-table-column
            show-overflow-tooltip
            prop="typeList"
            label="学员类型"
          >
            <template slot-scope="{row}">
              <div>{{ row.typeList.join('、') || '--' }}</div>
            </template>
          </el-table-column>
        </template>
        <template slot="right">
          <el-table-column
            prop="op"
            label="操作"
          >
            <template slot-scope="{row}">
              <etm-text
                type="primary"
                @click="handelChoose(row)"
              >
                选择
              </etm-text>
            </template>
          </el-table-column>
        </template>
      </etm-table>
    </etm-pop>
  </div>
</template>

<script>
/**
   * chooseChild create by 油麦菜
   * createTime 2021/1/21 9:53
   */
import {
  queryDealChild
} from '@/api/newDaycare/listLibrary'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'ChooseChild',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    showPop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: [
        {
          type: 'input',
          value: '',
          label: '学员姓名',
          prop: 'childName',
          props: {
            placeholder: '请输入学员姓名'
          }
        }
      ],
      tableData: [],
      columns: [
        {
          prop: 'childName',
          label: '学员姓名'
        },
        {
          prop: 'parentName',
          label: '联系人姓名'
        },
        {
          prop: 'telephone',
          label: '联系人电话'
        },
        {
          prop: 'age',
          label: '年龄'
        },
        {
          prop: 'gender',
          label: '性别'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    queryChild () {
      const childName = this.getObjectByProp('childName').value
      queryDealChild({ childName }).then(res => {
        res.data.forEach(item => {
          item.typeList = item.typeList.map(type => this.switchType(type))
        })
        this.tableData = res.data
      })
    },
    switchType (type) {
      switch (type) {
        case 'TEACH':
          return '早教学员'
        case 'CARE':
          return '托育学员'
        case 'GUARD':
          return '幼儿园学员'
      }
    },
    handleCancel () {
      this.resetData()
      this.$emit('update:showPop', false)
    },
    handelChoose (row) {
      this.$emit('chooseChildInfo', row)
      this.handleCancel()
    },
    resetData () {
      this.tableData = []
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
