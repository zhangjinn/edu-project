<template>
  <div class="secondTable">
    <EtmWeeklyCalendar :table-data="tableData" :week-tag="false" :add="false" @handleUpDate="upDate">
      <template slot="toolLeft">
        <etm-screen-tab v-model="categoryActive" title="视图" :options="categoryList" @change="changeView" />
      </template>

      <template v-slot:cell="data">
        <div v-if="data.cellList">
          <div v-for="(item,index) in data.cellList" :key="index">
            <EtmCell :data="item" @handleDetail="handleDetail(item)" />
          </div>
        </div>
      </template>
    </EtmWeeklyCalendar>

    <!--详情/编辑抽屉-->
    <etm-drawer :visible.sync="drawerVisible">
      <etm-layout-split line>
        <etm-title :title="drawerTitle" border size="big" />
        <div class="drawerBody">
          <detail v-if="drawerVisible && scheduleId" :item-id="scheduleId" />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import EtmWeeklyCalendar from '../../components/EtmWeeklyCalendar/index'
import EtmCell from './cell'
import detail from './detail'

import {
  getScheduleClazzView
} from '@/api/guardcare/edu/scheduleManage'
export default {
  name: 'SecondTable',
  components: {
    EtmWeeklyCalendar,
    EtmCell,
    detail
  },
  mixins: [baseMixin],
  data() {
    return {
      drawerVisible: false,
      drawerTitle: '课表详情',
      formData: [],
      formDataSlot: {
        value1: null,
        value2: null
      },
      tableData: {
        title: '班级视图',
        content: []
      },
      categoryActive: '2',
      categoryList: [
        {
          value: '1',
          name: '时间视图'
        },
        {
          value: '2',
          name: '班级视图'
        }
      ],
      scheduleId: null

    }
  },

  methods: {
    // 改变视图
    changeView() {
      this.$emit('changeView', this.categoryActive)
    },

    init() {
      const param = {
        specialCourseId: this.getValueByProp('courseName', this.formData) ? this.getValueByProp('courseName', this.formData) : null,
        gradeId: this.formDataSlot.value1,
        clazzId: this.formDataSlot.value2

      }
      getScheduleClazzView(param).then((res) => {
        const { data } = res
        this.tableData.content = data
      })
    },
    // 切换上下周
    upDate(val) {
      // this.init()
    },

    // 详情
    handleDetail(item) {
      if (item.specialCourseScheduleBatchId) {
        this.scheduleId = item.specialCourseScheduleBatchId
      }
      this.drawerVisible = true
    }

  }

}
</script>

<style scoped lang="scss">
.secondTable {
  ::v-deep .EtmScreenTab-wrap {
    margin-bottom: 0;
  }
}
</style>
