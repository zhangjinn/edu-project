<template>
  <div class="courseManage">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs ref="tabs" v-model="tabs" :setting="hasAuthOfBool('daycare.course.setting')" @setting="toSetting">
          <template v-for="tab in tabsList">
            <el-tab-pane v-if="hasAuth(tab.authId, 'tabs', 'tabs')" :key="tab.name" :label="tab.label" :name="tab.name">
              <etm-tool-bar v-model="tab.filters" @search="confirmQuery" @reset="resetQuery" />
            </el-tab-pane>
          </template>

        </etm-tabs>
      </div>
      <div slot="body">
        <etm-table-tool-bar slot="tool">
          <el-button slot="right" v-has="{authId : tabsList[tabsIndex[tabs]].addAuthId}" type="primary" @click.stop="handleAdd">
            <i class="el-icon-plus" />&nbsp;&nbsp;添加{{ staticObj.title }}

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
              <etm-text v-has="{authId : tabsList[tabsIndex[tabs]].editAuthId}" type="primary" @click.stop="handleEdit({...scoped, drawerPath : true})">编辑</etm-text>
              <etm-text v-has="{authId : tabsList[tabsIndex[tabs]].delAuthId}" type="danger" @click.stop="handleDelete(scoped)">删除</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
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
        v-if="showPop"
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
    <etm-drawer :visible.sync="itemPop">
      <etm-layout-split>
        <component :is="componentType[comType]" ref="itemPop" :trigger="false" />
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>
<script>
import earlyCoursePopForm from './popForm/earlyCourse'
import nurseCoursePopForm from './popForm/nurseCourse'
import oneDayProcessPopForm from './popForm/oneDayProcess'
import earlySetPopForm from './popForm/earlySet'
import nurseSetPopForm from './popForm/nurseSet'

import articleList from '@/views/newDaycare/priceTeach/views/articleList/detail'
import costList from '@/views/newDaycare/priceTeach/views/costList/detail'

import earlyCourseDrawerForm from './drawerForm/earlyCourse'
import nurseCourseDrawerForm from './drawerForm/nurseCourse'
import oneDayProcessDrawerForm from './drawerForm/oneDayProcess'
import earlySetDrawerForm from './drawerForm/earlySet'
import nurseSetDrawerForm from './drawerForm/nurseSet'

import { parseTime } from '@/utils'
import itemDetail from './drawerForm/itemDetail'
import transferDate from '@/utils/date'
import {
  createEarlyCourse,
  createEarlyData,
  createNurseCourse,
  createNurseData,
  createOneDayProcess,
  queryEarlyCourseListByPage,
  queryEarlyCourseTypeList,
  queryEarlySetListByPage,
  queryNurseCourseListByPage,
  queryNurseCourseTypeList,
  queryNurseSetListByPage,
  queryOneDayProcessListByPage,
  removeEarly,
  removeEarlyCourse,
  removeNurse,
  removeNurseCourse,
  removeOneDayProcess,
  updateEarlay,
  updateEarlyCourse,
  updateNurse,
  updateNurseCourse,
  updateOneDayProcess
} from '@/api/newDaycare/courseManage'
import {
  queryDaycareGenerationList
} from '@/api/newDaycare/recipesManage'
import baseMixin from '@/layout/mixin/baseMixin'

const columnsList = {
  earlyCourse: [
    {
      label: '早教课程名称',
      prop: 'name',
      _link: true
    },
    {
      label: '课程类型',
      prop: 'type'
    },
    {
      label: '课程容量',
      prop: 'totalCapacity'
    },
    {
      label: '正式学位',
      prop: 'formalCapacity'
    },
    {
      label: '试听学位',
      prop: 'experienceCapacity'
    },
    {
      label: '消课课时',
      prop: 'courseTime'
    },
    {
      label: '单价',
      prop: 'unitPrice',
      align: 'right'
    },
    {
      label: '修改时间',
      prop: 'modifyTime'
    },
    {
      label: '状态',
      prop: 'state'
    }
  ],
  nurseCourse: [
    {
      label: '托育课程名称',
      prop: 'name',
      _link: true
    },
    {
      label: '托育类型',
      prop: 'type'
    },
    {
      label: '托育年龄段',
      prop: 'generationName'
    },
    {
      label: '课程容量',
      prop: 'totalCapacity'
    }, {
      label: '正式学位',
      prop: 'formalCapacity'
    },
    {
      label: '试听学位',
      prop: 'experienceCapacity'
    },
    {
      label: '消课天数',
      prop: 'courseTime'
    },
    {
      label: '单价',
      prop: 'unitPrice',
      align: 'right'
    },
    {
      label: '修改时间',
      prop: 'modifyTime'
    },
    {
      label: '状态',
      prop: 'state'
    }
  ],
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
  ],
  earlySet: [
    {
      label: '套餐名称',
      prop: 'caeCoursePackageName',
      _link: true
    },
    {
      label: '商品组合',
      prop: 'goodstype',
      _array: true
    },
    {
      label: '套餐类型',
      prop: 'type'
    },
    {
      label: '课时总计',
      prop: 'buyLessonTotal'
    },
    {
      label: '赠送课时',
      prop: 'handselLessonTotal'
    },
    {
      label: '总价',
      prop: 'totalPrice'
    },
    {
      label: '锁定签约数量',
      prop: 'modify'
    },
    {
      label: '修改时间',
      prop: 'updateTime'
    },
    {
      label: '状态',
      prop: 'enable'
    }
  ],
  nurseSet: [
    {
      label: '套餐名称',
      prop: 'caeCoursePackageName',
      _link: true
    },
    {
      label: '商品组合',
      prop: 'goodstype',
      _array: true
    },
    {
      label: '套餐类型',
      prop: 'type'
    },
    {
      label: '天数总计',
      prop: 'buyLessonTotal'
    },
    {
      label: '赠送天数',
      prop: 'handselLessonTotal'
    },
    {
      label: '总价',
      prop: 'totalPrice'
    },
    {
      label: '锁定签约数量',
      prop: 'modify'
    },
    {
      label: '修改时间',
      prop: 'updateTime'
    },
    {
      label: '状态',
      prop: 'enable'
    }
  ]
}
const staticList = {
  earlyCourse: {
    popTitle: '添加早教课程',
    title: '课程',
    popType: 'complex',
    popComponent: earlyCoursePopForm,
    drawerType: {
      detail: 'small',
      edit: 'small'
    },
    drawerTitle: {
      detail: '早教课程详情',
      edit: '早教课程编辑'
    },
    drawerComponent: {
      detail: earlyCourseDrawerForm,
      edit: earlyCoursePopForm
    }
  },
  nurseCourse: {
    popTitle: '添加托育课程',
    title: '课程',
    popType: 'complex',
    popComponent: nurseCoursePopForm,
    drawerType: {
      detail: 'small',
      edit: 'small'
    },
    drawerTitle: {
      detail: '托育课程详情',
      edit: '托育课程编辑'
    },
    drawerComponent: {
      detail: nurseCourseDrawerForm,
      edit: nurseCoursePopForm
    }
  },
  oneDayProcess: {
    popTitle: '添加托育日程内容',
    title: '日程',
    popType: 'complex',
    popComponent: oneDayProcessPopForm,
    drawerType: {
      detail: 'small',
      edit: 'small'
    },
    drawerTitle: {
      detail: '托育日程内容详情',
      edit: '托育日程内容编辑'
    },
    drawerComponent: {
      detail: oneDayProcessDrawerForm,
      edit: oneDayProcessPopForm
    }
  },
  earlySet: {
    popTitle: '添加早教套餐',
    title: '套餐',
    popType: 'big',
    popComponent: earlySetPopForm,
    drawerType: {
      detail: 'big',
      edit: 'big',
      itemDetail: 'small'
    },
    drawerTitle: {
      detail: '套餐详情',
      edit: '套餐编辑',
      itemDetail: '物品详情'
    },
    drawerComponent: {
      detail: earlySetDrawerForm,
      edit: earlySetPopForm,
      itemDetail: itemDetail
    }
  },
  nurseSet: {
    popTitle: '添加托育套餐',
    title: '套餐',
    popType: 'big',
    popComponent: nurseSetPopForm,
    drawerType: {
      detail: 'big',
      edit: 'big',
      itemDetail: 'small'
    },
    drawerTitle: {
      detail: '套餐详情',
      edit: '套餐编辑',
      itemDetail: '物品详情'
    },
    drawerComponent: {
      detail: nurseSetDrawerForm,
      edit: nurseSetPopForm,
      itemDetail: itemDetail
    }
  }
}
const idList = {
  earlyCourse: 'teCourseId',
  nurseCourse: 'caeCourseId',
  oneDayProcess: 'caeScheduleId',
  earlySet: 'caeCoursePackageId',
  nurseSet: 'caeCoursePackageId'
}
export default {
  mixins: [baseMixin],
  data() {
    return {
      drawerPath: false,
      timestamp: new Date().getTime(),
      tabs: 'earlyCourse', // 标识当前处于哪一个tabs下 earlyCourse
      comType: '',
      itemPop: false,
      componentType: {
        'GOODS': articleList,
        'PRICE': costList,
        'CAE_COURSE': nurseCourseDrawerForm,
        'CAE_COURSE2': earlyCourseDrawerForm
      },
      tabsIndex: {
        'earlyCourse': 0,
        // 'nurseCourse': 1,
        // 'oneDayProcess': 2,
        'earlySet': 1
        // 'nurseSet': 4
      },
      tabsList: [ // 每一个tabs的label文本、标识、筛选条件
        {
          label: '早教课程',
          name: 'earlyCourse',
          authId: 'daycare.courseTeach.queryBatch',
          addAuthId: 'daycare.courseTeach.create',
          editAuthId: 'daycare.courseTeach.update',
          delAuthId: 'daycare.courseTeach.remove',
          filters: [
            {
              type: 'input',
              label: '课程名称',
              props: {
                placeholder: '请输入课程名称'
              },
              value: ''
            },
            {
              type: 'select',
              label: '课程类型',
              options: [],
              value: ''
            }
          ]
        },
        // {
        //   label: '托育课程',
        //   name: 'nurseCourse',
        //   authId: 'daycare.courseCare.queryBatch',
        //   addAuthId: 'daycare.courseCare.create',
        //   editAuthId: 'daycare.courseCare.update',
        //   delAuthId: 'daycare.courseCare.remove',
        //   filters: [
        //     {
        //       type: 'input',
        //       label: '课程名称',
        //       props: {
        //         placeholder: '请输入课程名称'
        //       },
        //       value: ''
        //     },
        //     {
        //       type: 'select',
        //       label: '托育类型',
        //       options: [],
        //       value: ''
        //     },
        //     {
        //       type: 'select',
        //       label: '托育年龄段',
        //       options: [],
        //       prop: 'generationId',
        //       value: ''
        //     }
        //   ]
        // },
        // {
        //   label: '托育一日流程',
        //   name: 'oneDayProcess',
        //   authId: 'daycare.schedule.queryBatch',
        //   addAuthId: 'daycare.schedule.create',
        //   editAuthId: 'daycare.schedule.update',
        //   delAuthId: 'daycare.schedule.remove',
        //   filters: [
        //     {
        //       type: 'input',
        //       label: '日程名称',
        //       props: {
        //         placeholder: '请输入日程名称'
        //       },
        //       value: ''
        //     }
        //   ]
        // },
        {
          label: '早教套餐',
          name: 'earlySet',
          authId: 'daycare.packageTeach.queryBatch',
          addAuthId: 'daycare.packageTeach.create',
          editAuthId: 'daycare.packageTeach.update',
          delAuthId: 'daycare.packageTeach.remove',
          filters: [
            {
              type: 'input',
              label: '套餐名称',
              props: {
                placeholder: '请输入套餐名称'
              },
              value: ''
            }
          ]
        }
        // {
        //   label: '托育套餐',
        //   name: 'nurseSet',
        //   authId: 'daycare.packageCare.queryBatch',
        //   addAuthId: 'daycare.packageCare.create',
        //   editAuthId: 'daycare.packageCare.update',
        //   delAuthId: 'daycare.packageCare.remove',
        //   filters: [
        //     {
        //       type: 'input',
        //       label: '套餐名称',
        //       props: {
        //         placeholder: '请输入套餐名称'
        //       },
        //       value: ''
        //     }
        //   ]
        // }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        content: [{}]
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
    tabs: {
      handler(v) {
        this.refreshTableData()
        if (v === 'nurseCourse') {
          this.updateNurseCourseTypeList()
          this.updateNurseCourseTime()
        }
        if (v === 'earlyCourse') {
          this.updateEarlyCourseTypeList()
        }
        this.queryObj = null // 每一次切换tabs都重置筛选条件
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    handleDrawerCancel() {
      // console.log(this.drawerPath, 'ddddddd')
      if (this.drawerPath) {
        // 直接关闭
        this.showDrawer = false
        if (this.$refs.drawer['cancelCache']) {
          this.$refs.drawer.cancelCache()
        }
      } else {
        // 后退
        this.drawerState = 'detail'
        this.$nextTick(() => {
          this.$refs.drawer.getData(this.activeRow[idList[this.tabs]]) // 触发弹窗组件的getData事件，获取详情内容
        })
      }
    },
    showItemDetail(type, id) {
      if (type === 'COURSE_TYPE') {
        return
      }

      if (this.tabs === 'earlySet' && type === 'CAE_COURSE') {
        type = 'CAE_COURSE2'
      }

      console.log(type, id)
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
    refreshTableData() { // 获取表格内容的方法
      let options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.queryObj) options = Object.assign({}, options, this.queryObj)
      switch (this.tabs) {
        case 'earlyCourse':
          queryEarlyCourseListByPage(options).then(res => {
            const { data } = res
            data.content.forEach(v => {
              v.name = v.teCourseName
              v.type = v.courseTypeName
              v.courseVolumn = v.capacity
              v.courseTime = v.lesson
              v.unitPrice = v.price
              v.modifyTime = transferDate(v.updateTime).time
              v.state = v.enable ? '开启' : '关闭'
            })
            this.tableData = data
          }).catch(err => {
            console.log(err)
          })
          break
        case 'nurseCourse':
          queryNurseCourseListByPage(options).then(res => {
            const { data } = res
            data.content.forEach(v => {
              v.name = v.caeCourseName
              v.type = v.courseTypeName
              v.courseVolumn = v.capacity
              v.courseTime = v.lesson
              v.unitPrice = v.price
              v.modifyTime = transferDate(v.updateTime).time
              v.state = v.enable ? '开启' : '关闭'
            })
            this.tableData = data
          }).catch(err => {
            console.log(err)
          })
          break
        case 'oneDayProcess':
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
          break
        case 'earlySet':
          options.caeCoursePackageName = options.courseName
          queryEarlySetListByPage(options).then(res => {
            const { data } = res

            let goodsType
            data.content.forEach((cur, index) => {
              goodsType = data.content[index].caeCoursePackageItemList.map(c => {
                return {
                  name: c.goodName,
                  id: c.goodId,
                  type: c.caePackageTypeEnum
                }
              })

              data.content[index].type = '早教套餐'
              data.content[index].goodstype = goodsType
              data.content[index].modify = data.content[index].modify ? '是' : '否'
              data.content[index].enable = data.content[index].enable ? '开启' : '关闭'
              data.content[index].updateTime = parseTime(data.content[index].updateTime, '{y}-{m}-{d}')
            })
            this.tableData = data
          })
          break
        case 'nurseSet':
          options.caeCoursePackageName = options.courseName
          queryNurseSetListByPage(options).then(res => {
            const { data } = res
            let goodsType
            data.content.forEach((cur, index) => {
              goodsType = data.content[index].caeCoursePackageItemList.map(c => {
                return {
                  name: c.goodName,
                  id: c.goodId,
                  type: c.caePackageTypeEnum
                }
              })

              data.content[index].type = '托育套餐'
              data.content[index].goodstype = goodsType
              data.content[index].modify = data.content[index].modify ? '是' : '否'
              data.content[index].enable = data.content[index].enable ? '开启' : '关闭'
              data.content[index].updateTime = parseTime(data.content[index].updateTime, '{y}-{m}-{d}')
            })
            this.tableData = data
          })
      }
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
      queryNurseCourseTypeList().then(res => {
        const { data } = res
        this.nurseCourseTypeList = []
        data.forEach(v => {
          this.nurseCourseTypeList.push({
            label: v.caeCourseTypeName,
            value: v.caeCourseTypeId
          })
        })
        this.tabsList[1].filters[1].options = this.nurseCourseTypeList
      }).catch(err => {
        console.log(err)
      })
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
      queryEarlyCourseTypeList().then(res => {
        const { data } = res
        this.earlyCourseTypeList = []
        data.forEach(v => {
          this.earlyCourseTypeList.push({
            label: v.teCourseTypeName,
            value: v.teCourseTypeId
          })
        })
        this.tabsList[0].filters[1].options = this.earlyCourseTypeList
      }).catch(err => {
        console.log(err)
      })
    },
    showDetail(c, s) { // 表格页可点击字段（名称、商品）
      if (['earlySet', 'nurseSet'].indexOf(this.tabs) !== -1 && c.prop === 'goods') {
        this.drawerState = 'itemDetail'
      } else {
        this.drawerState = 'detail'
      }
      this.activeRow = s.row
      this.drawerPath = false
      this.showDrawer = true
      this.$nextTick(() => {
        this.$refs.drawer.getData(s.row[idList[this.tabs]])
      })
    },
    handleEdit(s) { // 表格页操作栏的编辑按钮事件
      this.drawerState = 'edit'
      if (s.drawerPath) {
        this.drawerPath = true
      }
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
        'earlyCourse': '早教课程',
        'nurseCourse': '托育课程',
        'oneDayProcess': '托育一日流程',
        'earlySet': '早教套餐',
        'nurseSet': '托育套餐'
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
          let p
          switch (this.tabs) {
            case 'earlyCourse':
              p = createEarlyCourse(this.createSubmitData(this.$refs.pop.formData))
              break
            case 'nurseCourse':
              p = createNurseCourse(this.createSubmitData(this.$refs.pop.formData))
              break
            case 'oneDayProcess':
              p = createOneDayProcess(this.createSubmitData(this.$refs.pop.formData))
              break
            case 'earlySet':
              // console.log(this.$refs.pop.formData)
              p = createEarlyData(this.createSubmitData({
                ...this.$refs.pop.formData,
                caeCoursePackageItemList: this.$refs.pop.templateData
              }))
              break
            case 'nurseSet':
              p = createNurseData(this.createSubmitData({
                ...this.$refs.pop.formData,
                caeCoursePackageItemList: this.$refs.pop.templateData
              }))
              break
          }
          p.then(res => {
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
      let p
      switch (this.tabs) {
        case 'earlyCourse':
          p = removeEarlyCourse(this.activeRow.teCourseId)
          break
        case 'nurseCourse':
          p = removeNurseCourse(this.activeRow.caeCourseId)
          break
        case 'oneDayProcess':
          p = removeOneDayProcess(this.activeRow.caeScheduleId)
          break
        case 'earlySet':
          p = removeEarly(this.activeRow.caeCoursePackageId)
          break
        case 'nurseSet':
          p = removeNurse(this.activeRow.caeCoursePackageId)
      }
      p.then(res => {
        this.$etmTip.close()
        this.$message.success('删除成功')
        this.refreshTableData()
      }).catch(err => {
        this.$etmTip.close()
        console.log(err)
      })
    },
    handleDrawerSave() { // 侧边弹窗的保存按钮点击事件
      this.$refs.drawer.$refs.form.$children[0].validate(valid => {
        if (valid) {
          let p
          switch (this.tabs) {
            case 'earlyCourse':
              p = updateEarlyCourse(this.activeRow.teCourseId, this.createSubmitData(this.$refs.drawer.formData))
              break
            case 'nurseCourse':
              p = updateNurseCourse(this.activeRow.caeCourseId, this.createSubmitData(this.$refs.drawer.formData))
              break
            case 'oneDayProcess':
              p = updateOneDayProcess(this.activeRow.caeScheduleId, this.createSubmitData(this.$refs.drawer.formData))
              break
            case 'earlySet':
              // console.log(this.activeRow)
              p = updateEarlay({
                ...this.$refs.drawer.formData,
                caeCoursePackageItemList: this.$refs.drawer.templateData,
                teCoursePackageId: this.activeRow.caeCoursePackageId
              })

              break
            case 'nurseSet':
              p = updateNurse({
                ...this.$refs.drawer.formData,
                caeCoursePackageItemList: this.$refs.drawer.templateData,
                teCoursePackageId: this.activeRow.caeCoursePackageId
              })
              break
          }
          p.then(res => {
            this.$message.success('修改成功')
            this.refreshTableData()
            if (this.$refs.drawer['cancelCache']) {
              this.$refs.drawer.cancelCache()
            }

            // 后退
            this.drawerPath = false
            this.drawerState = 'detail'
            this.$nextTick(() => {
              this.$refs.drawer.getData(this.activeRow[idList[this.tabs]]) // 触发弹窗组件的getData事件，获取详情内容
            })
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
      let image
      switch (this.tabs) {
        case 'earlyCourse':
          image = []
          Array.isArray(src.previewSrcKey) && src.previewSrcKey.forEach((v, i) => {
            image.push({
              name: i + Date.now() + 'earlyCourse',
              url: v
            })
          })
          return {
            courseTypeId: src.courseType,
            teCourseName: src.name,
            lesson: src.courseTime,
            price: src.unitPrice,
            introduction: src.description,
            experienceCapacity: src.experienceCapacity,
            enable: src.isOpen,
            formalCapacity: src.formalCapacity,
            totalCapacity: src.totalCapacity,
            image
          }
        case 'nurseCourse':
          image = []
          Array.isArray(src.previewSrcKey) && src.previewSrcKey.forEach((v, i) => {
            image.push({
              name: i + Date.now() + 'nurseCourse',
              url: v
            })
          })
          return {
            duration: src.duration,
            courseTypeId: src.nurseType,
            generationId: src.generationId,
            caeCourseName: src.name,
            lesson: src.courseTime,
            price: src.unitPrice,
            introduction: src.description,
            experienceCapacity: src.experienceCapacity,
            enable: src.isOpen,
            formalCapacity: src.formalCapacity,
            totalCapacity: src.totalCapacity,
            image
          }
        case 'oneDayProcess':
          image = []
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
        case 'earlySet':

          image = []
          Array.isArray(src.previewSrcKey) && src.previewSrcKey.forEach((v, i) => {
            image.push({
              name: i + Date.now() + 'earlySet',
              url: v
            })
          })
          return {
            ...src,
            image
          }

        // break
        case 'nurseSet':
          image = []
          Array.isArray(src.previewSrcKey) && src.previewSrcKey.forEach((v, i) => {
            image.push({
              name: i + Date.now() + 'earlySet',
              url: v
            })
          })
          return {
            ...src,
            image
          }

        // break
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

  margin-top: 16px;
}
</style>
