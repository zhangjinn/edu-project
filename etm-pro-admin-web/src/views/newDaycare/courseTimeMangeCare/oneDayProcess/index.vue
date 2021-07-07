<template>
  <div class="courseManage">

    <etm-table-tool-bar slot="tool">
      <el-button slot="right" v-has="{authId : tabsList[tabsIndex[tabs]].addAuthId}" type="primary" @click.stop="handleAdd">
        <i class="el-icon-plus" />&nbsp;&nbsp;添加日程内容
      </el-button>
    </etm-table-tool-bar>

    <etm-table-page
      index
      :data="tableData"
      @currentChange="currentChange"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        slot="left"
        :label="column.label"
        :prop="column.prop"
        :align="column.align"
      >
        <template slot-scope="scope">
          <a v-if="column._link" @click.stop="showDetail(column, scope)">{{ scope.row[column.prop] }}</a>
          <a
            v-for="(item, index) in scope.row[column.prop]"
            v-else-if="column._array"
            :key="index"
            @click.stop="showItemDetail(item.type, item.id)"
          ><span v-if="index !== 0">, </span>{{ item.name }}</a>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        label="操作"
      >
        <template slot-scope="scoped">
          <etm-text v-has="{authId : tabsList[tabsIndex[tabs]].editAuthId}" type="primary" @click.stop="handleEdit(scoped)">编辑</etm-text>
          <etm-text v-has="{authId : tabsList[tabsIndex[tabs]].delAuthId}" type="danger" @click.stop="handleDelete(scoped)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <etm-pop
      :visible="showPop"
      :pop="staticObj.popType"
      :title="staticObj.popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <component
        :is="staticObj.popComponent"
        ref="pop"
        :timestamp="timestamp"
        :show-last="false"
        :type-list="typeList"
      />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      :type="staticObj.drawerType[drawerState]"
    >
      <etm-layout-split v-if="showDrawer">
        <etm-title :show-line="false" border size="big">
          {{ staticObj.drawerTitle[drawerState] }}
          <template slot="tool">
            <el-button
              v-if="drawerState === 'detail' || drawerState === 'itemDetail'"
              v-has="{authId : tabsList[tabsIndex[tabs]].editAuthId}"
              plain
              size="mini"
              @click.stop="handleDrawerEdit"
            >编辑
            </el-button>
            <el-button v-show="drawerState === 'edit'" plain size="mini" @click.stop="handleDrawerCancel">取消</el-button>
            <el-button
              v-show="drawerState === 'edit'"
              type="primary"
              size="mini"
              @click.stop="handleDrawerSave"
            >保存
            </el-button>
          </template>
        </etm-title>
        <component
          :is="staticObj.drawerComponent[drawerState]"
          ref="drawer"
          :type-list="typeList"
        />
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import oneDayProcessPopForm from './popForm/oneDayProcess'
import oneDayProcessDrawerForm from './drawerForm/oneDayProcess'

import transferDate from '@/utils/date'
import {
  createOneDayProcess,
  queryOneDayProcessListByPage,
  removeOneDayProcess,
  updateOneDayProcess,
  queryResolveDel,
  removeSchedule
} from '@/api/newDaycare/courseManage'
import {
  queryDaycareGenerationList
} from '@/api/newDaycare/recipesManage'
import baseMixin from '@/layout/mixin/baseMixin'

const columnsList = {
  oneDayProcess: [
    {
      label: '日程内容名称',
      prop: 'name',
      _link: true
    },
    {
      label: '修改时间',
      prop: 'modifyTime'
    },
    {
      label: '状态',
      prop: 'state'
    }
  ]
}
const staticList = {
  oneDayProcess: {
    popTitle: '添加日程内容',
    title: '日程',
    popType: 'complex',
    popComponent: oneDayProcessPopForm,
    drawerType: {
      detail: 'small',
      edit: 'small'
    },
    drawerTitle: {
      detail: '日程内容详情',
      edit: '日程内容编辑'
    },
    drawerComponent: {
      detail: oneDayProcessDrawerForm,
      edit: oneDayProcessPopForm
    }
  }

}
const idList = {
  // earlyCourse: 'teCourseId',
  // nurseCourse: 'caeCourseId',
  oneDayProcess: 'caeScheduleId'
  // earlySet: 'caeCoursePackageId',
  // nurseSet: 'caeCoursePackageId'
}
export default {
  mixins: [baseMixin],
  props: {
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      timestamp: new Date().getTime(),
      tabs: 'oneDayProcess', // 标识当前处于哪一个tabs下 earlyCourse
      comType: '',
      itemPop: false,
      tabsIndex: {
        'oneDayProcess': 0
      },
      tabsList: [ // 每一个tabs的label文本、标识、筛选条件
        {
          label: '托育一日流程',
          name: 'oneDayProcess',
          authId: 'daycare.schedule.queryBatch',
          addAuthId: 'daycare.schedule.create',
          editAuthId: 'daycare.schedule.update',
          delAuthId: 'daycare.schedule.remove',
          filters: [
            {
              type: 'input',
              label: '日程名称',
              props: {
                placeholder: '请输入日程名称'
              },
              value: ''
            }
          ]
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        content: []
      },
      queryObj: null, // 查询表格内容时候的筛选条件
      activeRow: null, // 点击表格中的编辑、删除或可点击的文本按钮时候，缓存当前行的相关信息
      nurseCourseTypeList: [], // 托育课程的课程类型列表
      nurseCourseTime: [],
      earlyCourseTypeList: [], // 早教课程的课程类型列表
      showPop: false,
      showDrawer: false,
      drawerState: '' // 显示详情还是编辑表单
    }
  },
  computed: {
    columns() {
      return columnsList[this.tabs]
    },
    staticObj() {
      return staticList[this.tabs]
    },
    typeList() {
      if (this.tabs === 'earlyCourse') {
        return this.earlyCourseTypeList
      } else if (this.tabs === 'nurseCourse') {
        return this.nurseCourseTypeList
      } else {
        return null
      }
    }
  },
  watch: {
    props: {
      immediate: true,
      deep: true,
      handler(n) {
        this.refreshTableData(n.caeScheduleName)
      }
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    handleDrawerCancel() {
      this.showDrawer = false
      if (this.$refs.drawer['cancelCache']) {
        this.$refs.drawer.cancelCache()
      }
    },
    showItemDetail(type, id) {
      if (type === 'COURSE_TYPE') {
        return
      }

      if (this.tabs === 'earlySet' && type === 'CAE_COURSE') {
        type = 'CAE_COURSE2'
      }

      this.itemPop = true
      this.comType = type

      this.$nextTick(() => {
        this.$refs['itemPop'].getData(id)
      })
    },
    toSetting() {
      this.$router.push('/newdaycare_courseManageSetting')
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData(caeScheduleName = '') { // 获取表格内容的方法
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      options = Object.assign({}, options, { caeScheduleName })

      queryOneDayProcessListByPage(options).then(res => {
        const { data } = res
        data.content.forEach(v => {
          v.name = v.caeScheduleName
          v.modifyTime = transferDate(v.updateTime).time
          v.state = v.enable ? '开启' : '关闭'
        })
        this.tableData = data
      }).catch(err => {
        console.log(err)
      })
    },
    confirmQuery(arr) { // 查询按钮点击事件
      if (['earlyCourse', 'nurseCourse'].indexOf(this.tabs) !== -1) {
        if (arr.length) {
          const obj = {}
          arr.forEach(v => {
            if (v.type === 'select') {
              console.log(v)
              if (v['prop'] && v['prop'] !== '') {
                obj[v.prop] = v.value
              } else {
                obj.courseTypeId = v.value
              }
            }
            if (v.type === 'input') {
              obj.courseName = v.value
            }
          })
          this.queryObj = obj
        }
      } else if (this.tabs === 'oneDayProcess') {
        if (arr.length) {
          this.queryObj = {
            caeScheduleName: arr[0].value
          }
        }
      } else {
        if (arr.length) {
          this.queryObj = {
            courseName: arr[0].value
          }
        }
      }
      this.refreshTableData()
    },
    resetQuery() { // 重置按钮点击事件
      this.queryObj = null
      this.refreshTableData()
    },
    updateNurseCourseTypeList() { // 查询托育课程类型列表
      // queryNurseCourseTypeList().then(res => {
      //   const { data } = res
      //   this.nurseCourseTypeList = []
      //   data.forEach(v => {
      //     this.nurseCourseTypeList.push({
      //       label: v.caeCourseTypeName,
      //       value: v.caeCourseTypeId
      //     })
      //   })
      //   this.tabsList[1].filters[1].options = this.nurseCourseTypeList
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    updateNurseCourseTime() {
      queryDaycareGenerationList().then(res => {
        const { data } = res
        this.nurseCourseTime = []
        data.forEach(v => {
          this.nurseCourseTime.push({
            label: v.generationName,
            value: v.generationId
          })
        })
        this.tabsList[1].filters[2].options = this.nurseCourseTime
      }).catch(err => {
        console.log(err)
      })
    },
    updateEarlyCourseTypeList() { // 查询早教课程类型列表
      // queryEarlyCourseTypeList().then(res => {
      //   const { data } = res
      //   this.earlyCourseTypeList = []
      //   data.forEach(v => {
      //     this.earlyCourseTypeList.push({
      //       label: v.teCourseTypeName,
      //       value: v.teCourseTypeId
      //     })
      //   })
      //   this.tabsList[0].filters[1].options = this.earlyCourseTypeList
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    showDetail(c, s) { // 表格页可点击字段（名称、商品）
      if (['earlySet', 'nurseSet'].indexOf(this.tabs) !== -1 && c.prop === 'goods') {
        this.drawerState = 'itemDetail'
      } else {
        this.drawerState = 'detail'
      }
      this.activeRow = s.row
      this.showDrawer = true
      this.$nextTick(() => {
        this.$refs.drawer.getData(s.row[idList[this.tabs]])
      })
    },
    handleEdit(s) { // 表格页操作栏的编辑按钮事件
      this.drawerState = 'edit'
      this.activeRow = s.row
      this.showDrawer = true
      this.$nextTick(() => {
        this.$refs.drawer.getData(s.row[idList[this.tabs]]) // 触发弹窗组件的getData事件，获取详情内容
      })
    },
    handleDelete(s) { // 表格页操作栏的删除按钮事件
      this.activeRow = s.row
      // console.log(this.tabs)
      const type = {
        'oneDayProcess': '日程内容'
      }
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除' + type[this.tabs] + '?',
        // content: '删除后不能撤销，请确认',
        content: `${s.row.teCourseName || s.row.name || s.row.caeScheduleName || s.row.caeCoursePackageName}`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: this.handleTipConfirm,
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleAdd() {
      this.timestamp = new Date().getTime()
      this.handlePopOpen()
    },
    handlePopOpen() {
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
      this.$refs.pop.resetForm()
    },
    handlePopConfirm() { // 新增
      this.$refs.pop.$refs.form.$children[0].validate(valid => {
        if (valid) {
          createOneDayProcess(this.createSubmitData(this.$refs.pop.formData)).then(res => {
            this.handlePopClose()
            this.$refs.pop.resetForm()
            this.$message.success('添加成功')
            this.refreshTableData()
          }).catch(err => {
            this.handlePopClose()
            this.$message.error('添加失败，请重试')
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    handleTipConfirm() { // 删除
      const id = this.activeRow.caeScheduleId
      const that = this
      queryResolveDel(id).then(res => {
        if (res.data) {
          this.$etmTip.close()
          this.$etmTip.init({
            type: 'error',
            title: '确认要删除日程内容?',
            // content: '删除后不能撤销，请确认',
            content: `该日程内容有关联其他信息，是否确认删除？`,
            confirmBtn: '删除',
            cancelBtn: '取消',
            confirm() {
              removeSchedule(id).then(res => {
                that.$etmTip.close()
                that.$message.success('删除成功')
                that.refreshTableData()
              })
            },
            cancel: () => {
              that.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
          removeOneDayProcess(id).then(res => {
            this.$etmTip.close()
            this.$message.success('删除成功')
            this.refreshTableData()
          })
        }
      })
    },
    handleDrawerSave() { // 侧边弹窗的保存按钮点击事件
      this.$refs.drawer.$refs.form.$children[0].validate(valid => {
        if (valid) {
          updateOneDayProcess(this.activeRow.caeScheduleId, this.createSubmitData(this.$refs.drawer.formData)).then(res => {
            this.showDrawer = false
            this.$message.success('修改成功')
            this.refreshTableData()
            if (this.$refs.drawer['cancelCache']) {
              this.$refs.drawer.cancelCache()
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handleDrawerEdit() { // 侧边弹窗的编辑按钮点击事件
      this.handleEdit({ row: this.activeRow })
    },
    createSubmitData(src) { // 将表格数据转换成符合接口格式的数据
      const image = []
      Array.isArray(src.previewSrcKey) && src.previewSrcKey.forEach((v, i) => {
        image.push({
          name: i + Date.now() + 'oneDayProcess',
          url: v
        })
      })
      return {
        caeScheduleName: src.name,
        introduction: src.description,
        enable: src.isOpen,
        image
      }
    }
  }
}
</script>

<style scoped lang="scss">
.courseManage {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }

}
</style>
