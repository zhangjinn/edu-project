<template>
  <div class="editChild">
    <div class="search">
      <el-input
        v-model="childName"
        placeholder="请输入幼儿姓名搜索"
        prefix-icon="el-icon-search"
        @blur="search"
      />
    </div>
    <etm-table
      ref="multipleTable"
      :columns="columns"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        slot="left"
        type="selection"
      />
    </etm-table>
  </div>
</template>

<script>

// import { getChildIn } from '@/api/guardcare/edu/scheduleManage'
import { getChildIn } from '@/api/newDaycare/listEduGuardScheduleManage'
export default {
  name: 'MaterialTable',
  props: {
    selectIds: {
      type: Array,
      default () {
        return []
      }
    },
    specialCourseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      childName: null,
      // 表格数据
      tableData: [],
      columns: [ // 表格的列表头传值
        {
          label: '姓名',
          prop: 'childName'
        },
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '班级',
          prop: 'clazzName'
        }

      ],
      multipleSelection: []

    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      const param = {
        childName: this.childName,
        specialCourseId: this.specialCourseId
      }
      getChildIn(param).then((res) => {
        this.tableData = res.data
        this.tableData.map((val) => {
          val.gender = val.gender === 'MALE' ? '男' : '女'
        })
        this.$nextTick(() => {
          this.toggleSelection([this.tableData[1], this.tableData[2]])
        })
      })
    },
    search () {
      this.init()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log('handleSelectionChange')
      console.log(this.multipleSelection)
    },
    toggleSelection () {
      this.tableData.map((row) => {
        if (this.selectIds && this.selectIds.length > 0 && this.selectIds.includes(row.childId)) {
          this.$refs.multipleTable.$children[0].toggleRowSelection(row)
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.search {
  margin-bottom: 16px;
}
</style>
