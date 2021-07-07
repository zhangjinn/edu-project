<template>
  <div class="notAttendance-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      border
      @currentChange="currentChange"
    >
      <el-table-column slot="left" fixed="left" label="学员姓名" width="220">
        <template slot-scope="scoped">
          <etm-text type="primary" @click.stop="handleRowClick(scoped.row)">{{ scoped.row.childName }}</etm-text>
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="操作" width="220">
        <template v-slot="row">
          <etm-text v-has="{authId: 'daycare.attendanceCare.updateBatch'}" type="primary" @click="handleEdit(row.row)">修改考勤</etm-text>
          <etm-text @click="handleDel(row.row)">
            撤销考勤
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <!--  操作考勤  -->
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="考勤"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="attend"
      @cancel="showPop = false"
    >
      <etm-form ref="form" :model="form" type="dialog">
        <el-form-item
          label="考勤状态"
          prop="parent"
          :rules="formValidate.nullValueRule(true,'请选择接送人')"
        >
          <span>已离园</span>
        </el-form-item>
        <el-form-item
          label="接送人"
          prop="parent"
          :rules="formValidate.nullValueRule(true,'请选择接送人')"
        >
          <el-select v-model="form.parent" placeholder="接送人">
            <el-option
              v-for="item in danceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </etm-form>
    </etm-pop>
    <!--学员详情-->
    <etm-drawer
      :visible.sync="childDetail.visible"
      type="big"
    >
      <etm-layout-split
        v-if="childDetail.visible"
        :left-styles="{minWidth: '560px', maxWidth: '560px'}"
        :styles="{height: '100vh'}"
        class="child-info-box"
      >
        <div slot="left" class="left">
          <child-logs :child-id="childDetail.childId" />
        </div>
        <div slot="right" class="right">
          <child-info :child-id="childDetail.childId" :category="currentTab" @update="update" />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
/**
 * LeaveSchool create by Administrator
 * createTime 2020/09/08 15:46
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryAttendanceCare, queryParent, updateAttendanceCare, updateCare } from '@/api/newDaycare/attendanceCare'
import { parseTime } from '@/utils'
import ChildLogs from '@/views/newDaycare/childManage/myChild/components/childLogs'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'

export default {
  name: 'LeaveSchool',
  components: { ChildInfo, ChildLogs },
  filters: {},
  mixins: [baseMixin],
  props: {
    leaveSearch: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      formValidate,
      showPop: false,
      addPop: false,
      popType: 'simple',
      allType: 'complex',
      currentTab: 'DEAL',
      childDetail: {
        visible: false,
        activeTab: 'follow',
        childId: ''
      },
      stuID: '',
      options: [],
      danceOptions: [],
      form: {
        parent: null
      },
      columns: [
        { label: '所在班级', prop: 'clazzName' },
        { label: '班主任', prop: 'headTeacherName' },
        { label: '接送人', prop: 'parent' }
      ],
      tableData: {
        content: [
          {}
        ]
      }
    }
  },
  computed: {},
  watch: {
    leaveSearch: {
      handler() {
        this.pageInfo.pageNum = 1
        this.init()
        // console.log(this.leaveSearch)
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    currentChange(pageNum, pageSize) {
      // console.log(pageNum,pageSize)
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    init() {
      queryAttendanceCare({
        type: 'OUT_SCHOOL',
        childName: (this.leaveSearch.childName) || null,
        clazzName: (this.leaveSearch.clazzName) || null,
        date: this.leaveSearch.date || parseTime(new Date(), '{y}-{m}-{d}'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res.data)
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.date = ''
          item.parent = ''
          item.date = parseTime(item.courseDate, '{y}-{m}-{d}' + '(星期' + '{a}' + ') ')
          item.parent = item.parentName + ' (' + item.relationshipName + ')'
          if (item.status === 'OUT_SCHOOL') {
            item.status = '已离园'
          } else if (item.status === 'ABSENT_FROM_WORK') {
            item.status = '缺勤'
          } else {
            item.status = '请假'
          }
        })
      })
    },
    handleEdit(row) {
      this.stuID = row.caAattendanceId
      this.danceOptions = []
      queryParent({ childId: row.childId }).then(res => {
        res.data.forEach(item => {
          this.danceOptions.push({
            label: item.parentName + ' (' + item.relationshipName + ')',
            value: item.personRelationId
          })
        })
      })
      this.form.parent = row.personRelationId
      this.showPop = true
    },
    attend() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(this.form))
          // console.log(formData)
          this.showPop = false
          this.$refs['form'].$children[0].resetFields()
          updateAttendanceCare({
            caAattendanceIdList: [this.stuID],
            status: 'OUT_SCHOOL',
            parentId: formData.parent
          }).then(res => {
            this.showPop = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$refs['form'].$children[0].resetFields()
            this.init()
          })
        }
      })
    },
    handleRowClick(row) {
      this.childDetail.visible = true
      this.childDetail.childId = row.childId
    },
    update() {
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1
      }
      this.init()
      const childId = this.childDetail.childId
      this.childDetail.childId = ''
      setTimeout(() => {
        this.childDetail.childId = childId
      }, 16)
    },
    handleDel(row) {
      this.$etmTip.init({
        type: 'warn',
        title: '撤销考勤',
        content: '是否撤销考勤',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          updateCare({ caAattendanceId: row.caAattendanceId }).then(() => {
            this.$etmTip.close()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.init()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
.notAttendance-wrap {
  ::v-deep .EtmDrawer-wrap {
    .EtmLayoutSplit-wrap {
      .layout-left {
        margin-right: 8px;
      }
    }
  }
}
</style>
