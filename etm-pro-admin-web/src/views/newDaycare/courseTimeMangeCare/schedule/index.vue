<template>
  <div class="schedule-wrap">
    <EtmWeeklyCalendar
      ref="EtmWeeklyCalendar"
      :table-data="tableData"
      @handleUpDate="handleWeekChange"
    >
      <!--      日历tool按钮-->
      <template slot="toolLeft">
        {{ _startWeek }}
      </template>
      <template slot="toolRight">
        <div class="button-group">
          <el-button type="primary" @click.stop="batchScheduling"><i class="el-icon-plus" />&nbsp;&nbsp;批量添加</el-button>
          <el-button type="primary" @click="copy = true">复制日程</el-button>
          <el-button @click="exportExcel">导出Excel</el-button>
        </div>
      </template>

      <!--      日程状态-->
      <template v-slot:cell="data">
        <template v-if="!data.cellList">
          <div class="itemBox plus" @click="createSchedule(data)">
            <i class="el-icon-plus plusIcon" />
          </div>
        </template>
        <template v-else-if="!data.cellList.caSclazzScheduleId && data.cellList.offFlag">
          <div class="itemBox reset" @click="createSchedule(data)">
            <i class="el-icon-plus plusIcon" />
            <p>园区休息</p>
          </div>
        </template>
        <template v-else>
          <div
            class="itemBox"
            :style="{ backgroundColor: data.cellList['colorCode'] ? data.cellList['colorCode'].replace(')', ', .1)') : 'rgba(255,255,255,.1)'}"
          >
            <p>{{ data.cellList.scheduleName }}</p>
            <div>{{ data.cellList.remark }}</div>

            <div class="itemTools">
              <div @click.stop="addRemark(data)">备注</div>
              <div @click.stop="showDetail(data)">详情</div>
              <div @click.stop="deleteSched(data)">删除</div>
            </div>
          </div>
        </template>
      </template>
    </EtmWeeklyCalendar>

    <!--    各类弹框组件-->
    <add-schedule ref="addSchedule" :props="addScheduleProp" @update="init" />
    <remark-schedule ref="remarkSchedule" :props="remarkScheduleProp" @update="init" />
    <detail-schedule ref="detailSchedule" :props="detailScheduleProp" @update="init" />
    <batch-add ref="batchAdd" :props="batchScheduleProp" @update="init" />

    <etm-pop
      title="复制一周日程"
      :visible="copy"
      @cancel="copyCancel"
      @confirm="copyConfirm"
      @close="copyCancel"
    >
      <etm-form ref="copyForm" v-model="copyForm" type="dialog">
        <el-form-item label="选择班级">
          <el-select v-model="copyForm.targetClazzIdList" multiple>
            <el-option
              v-for="(item, index) in clazzList"
              :key="index"
              :value="item.caeClazzId"
              :label="item.caeClazzName"
            />
          </el-select>
        </el-form-item>
      </etm-form>
    </etm-pop>

  </div>
</template>
<script>
/**
 * index create by Administrator
 * createTime 2020/9/16 17:07
 */
import EtmWeeklyCalendar from '@/views/newDaycare/courseTimeMangeCare/schedule/components/weeklyCalendar'
import detailSchedule from '@/views/newDaycare/courseTimeMangeCare/schedule/components/detailSchedule'
import remarkSchedule from '@/views/newDaycare/courseTimeMangeCare/schedule/components/remarkSchedule'
import addSchedule from '@/views/newDaycare/courseTimeMangeCare/schedule/components/addPop/addSchedule'
import batchAdd from '@/views/newDaycare/courseTimeMangeCare/schedule/components/batchAdd'
// import baseMixin from '@/layout/mixin/baseMixin'

import { weekIndexInYear } from './common'
import { queryScheduleList, removeSchedule, createCopySchedule, createCheckCopyWeek } from '@/api/newDaycare/nurseSchedule'
import { queryRomeCareName } from '@/api/newDaycare/attendanceCare'
import { parseTime } from '@/utils'
import XLSX from 'xlsx'
// import XLSX from 'xlsx'
// import {removeClass} from "@/api/daycare/classes";

export default {
  name: 'Index',
  components: {
    addSchedule,
    remarkSchedule,
    detailSchedule,
    batchAdd,
    EtmWeeklyCalendar
  },
  filters: {},
  mixins: [], // baseMixin
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
      remarkScheduleProp: {},
      detailScheduleProp: {},
      batchScheduleProp: {},
      copyForm: {
        targetClazzIdList: []
      },
      timePeriod: [],
      copy: false,
      schedule: [],
      clazzList: {},
      addScheduleProp: {},
      startWeek: null,
      clazzId: 0,
      tableData: {
        title: '时段',
        time: '',
        content: []
      }
    }
  },
  computed: {
    _startWeek() {
      const time = new Date(this.startWeek)
      const week = weekIndexInYear(time)

      return parseTime(time.getTime(), '{y}年{m}月') + ' 第' + week + '周'
    }
  },
  watch: {
    props: {
      deep: true,
      handler(n) {
        if (n['clazzId']) {
          this.clazzId = n.clazzId
        } else {
          this.clazzId = Object.keys(this.clazzList)[0]
        }

        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    copyConfirm() {
      const _arg = Object.assign({}, {
        sourceDate: this.startWeek,
        sourceClazzId: this.clazzId
      }, this.copyForm)

      new Promise((resolve, reject) => {
        createCheckCopyWeek(_arg).then(res => {
          if (res.data) {
            this.$etmTip.init({
              type: 'warn',
              title: '将覆盖原有日程，是否继续！',
              html: '',
              confirmBtn: '确认',
              cancelBtn: '取消',
              confirm: () => {
                createCopySchedule(_arg).then(res => {
                  this.copy = false
                  this.$refs['copyForm'].$children[0].resetFields()
                  this.copyForm = {
                    targetClazzIdList: []
                  }
                  this.$message.success('一周日程复制成功')
                })
                this.$etmTip.close()
              },
              cancel: () => {
                this.$etmTip.close()
              }
            })
            this.$etmTip.open()
          } else {
            this.copy = false
            this.$refs['copyForm'].$children[0].resetFields()
            this.copyForm = {
              targetClazzIdList: []
            }
            this.$message.success('一周日程复制成功')
            // resolve()
          }
        })
      }).then(res => {
        // createCopySchedule(_arg).then(res => {
        // this.copy = false
        // this.$refs['copyForm'].$children[0].resetFields()
        // this.copyForm = {
        //   targetClazzIdList: []
        // }
        // this.$message.success('一周日程复制成功')
        // })
      })
    },
    copyCancel() {
      this.$refs['copyForm'].$children[0].resetFields()
      this.copyForm = {
        targetClazzIdList: []
      }
      this.copy = false
    },
    batchScheduling(data) {
      this.batchScheduleProp = {
        clazz: this.clazzList[this.clazzId],
        timePeriodId: data.labelId,
        startWeek: this.startWeek,
        list: this.tableData.content
      }
      this.$nextTick(() => {
        this.$refs['batchAdd'].show()
      })
    },
    exportExcel() {
      this.exportTableToExcel({ name: '班级一周日程', ref: this.$refs['EtmWeeklyCalendar'].$children[4].$el })
    },
    exportTableToExcel({ id = null, ref = null, name = '表格', sheetName = name }) {
      let table = null
      if (id) {
        table = document.getElementById(id)
      } else if (ref) {
        table = ref
      } else {
        this.$message.error('导入必须传入表格节点或者表格id')
        return
      }
      const wb = XLSX.utils.table_to_book(table, { sheet: sheetName })

      Object.keys(wb.Sheets).forEach((cur, index) => {
        Object.keys(wb.Sheets[cur]).forEach((c, i) => {
          if (c !== '!merges' && c !== '!ref') {
            wb.Sheets[cur][c].v = wb.Sheets[cur][c].v.replace('备注详情删除', '')
          }
        })
      })

      XLSX.writeFile(wb, name + '.xlsx')
    },
    deleteSched(data) {
      this.$etmTip.init({
        type: 'error',
        title: '确定删除该日程？',
        content: '',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          this.$etmTip.close()
          removeSchedule(data.cellList.caSclazzScheduleId).then(res => {
            this.$message.success('日程删除成功')
            this.init()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    showDetail(data) {
      this.detailScheduleProp = {
        id: data.cellList.caSclazzScheduleId,
        timePeriod: this.timePeriod
      }

      this.$nextTick(() => {
        this.$refs.detailSchedule.show()
      })
    },
    addRemark(data) {
      this.remarkScheduleProp = {
        name: data.cellList.scheduleName,
        id: data.cellList.caSclazzScheduleId,
        startDay: this.startWeek,
        step: data.dayStep,
        round: data.labelRound
      }

      this.$nextTick(() => {
        this.$refs.remarkSchedule.show()
      })
    },
    createSchedule(data) {
      this.addScheduleProp = {
        clazz: this.clazzList[this.clazzId],
        timePeriodId: data.labelId,
        startDay: this.startWeek,
        step: data.dayStep
      }
      this.$nextTick(() => {
        this.$refs.addSchedule.show()
      })
    },
    handleWeekChange(event) {
      this.startWeek = event.weekStartDay
      this.$nextTick(() => {
        this.init()
      })
    },
    getClassLists() {
      return new Promise((resolve, reject) => {
        if (!this.clazzId) {
          queryRomeCareName().then(res => {
            const clazzList = {}
            res.data.forEach(cur => {
              clazzList[cur.caeClazzId] = cur
            })
            this.$emit('rever', clazzList)
            this.clazzId = res.data[0].caeClazzId
            this.clazzList = clazzList
            this.$nextTick(() => {
              resolve()
            })
          })
        } else {
          resolve()
        }
      })
    },
    init() {
      this.getClassLists().then(res => {
        queryScheduleList({ clazzId: this.clazzId, date: this.startWeek }).then(res => {
          this.tableData.content = res.data
          this.timePeriod = res.data.map(cur => {
            return cur.label
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-wrap {
  .button-group {
    display: flex;

    /deep/ .el-button--small {
      margin-left: 8px;
      display: block;
    }
  }

  .itemBox {
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    flex-direction: column;
    position: relative;

    &:hover {
      .itemTools {
        display: flex;
      }
    }

    .itemTools {
      position: absolute;
      width: 100%;
      height: 24px;
      line-height: 24px;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      bottom: 0;
      left: 0;
      display: none;

      div {
        font-size: 12px;
        flex: 1;
        cursor: pointer;
        text-align: center;
      }
    }

    &.plus {
      font-weight: bold;
      cursor: pointer;

      &:hover {
        .plusIcon {
          display: block;
        }
      }

      .plusIcon {
        display: none;
        font-size: 24px;
        color: #999;
      }
    }

    &.reset {
      background: #f9f9f9;
      color: #999;

      &:hover {
        .plusIcon {
          display: block;
        }

        p {
          display: none;
        }
      }

      .plusIcon {
        display: none;
        font-size: 24px;
        color: #999;
      }
    }
  }

}

</style>

