<template>
  <div class="clazz-wrap">
    <el-timeline>
      <el-timeline-item
        v-for="(clazz, index) in clazzData"
        :key="index"
        :timestamp="clazz.timestamp"
        placement="top"
      >
        <div class="timeBox">
          <div v-if="clazz.type === 'OUT'">
            <div class="mark">退园</div>
            <etm-field-label type="left" label="所在班级">{{ clazz.oldClazzName }}</etm-field-label>
            <etm-field-label type="left" label="原因">{{ transferReason(clazz.outReason) }}</etm-field-label>
          </div>
          <div v-if="clazz.type === 'CLAZZ_UPDATE'">
            <div class="mark">调班</div>
            <etm-field-label type="left" label="调入班级">{{ clazz.clazzName }}</etm-field-label>
            <etm-field-label type="left" label="原班级">{{ clazz.oldClazzName }}</etm-field-label>
          </div>
          <div v-if="clazz.type === 'IN'">
            <div class="mark">入园</div>
            <etm-field-label type="left" label="入园班级">{{ clazz.clazzName }}</etm-field-label>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <template v-if="!clazzData.length">
      <etm-empty />
    </template>
  </div>

</template>

<script>/**
 * clazz create by Administrator
 * createTime 2020/9/2 17:29
 */

// import { getclazzRecord } from '@/api/guardcare/childManage/childManage'
import { getclazzRecord } from '@/api/newDaycare/listEduGuardChildManage'
import { parseTime } from '@/utils'

export default {
  name: 'Clazz',
  components: {},
  filters: {},
  mixins: [],
  props: {
    childId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      clazzData: []
    }
  },
  computed: {},
  watch: {
    childId() {
      this.getData()
    }
  },
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.childId) {
        const param = {
          childId: this.childId
        }
        getclazzRecord(param).then(res => {
          const data = res.data
          this.clazzData = []
          data.forEach(item => {
            const time = parseTime(item.createTime, '{y}-{m}-{d}') + ' 星期' + parseTime(item.createTime, '{a}')
            const clazz = {
              timestamp: time,
              type: item.type,
              oldClazzName: item.oldClazzName,
              clazzName: item.clazzName,
              outReason: item.outReason
            }
            this.clazzData.push(clazz)
          })
        })
      }
    },
    transferReason(reason) {
      switch (reason) {
        case 'GRADUATION':
          return '毕业退园'
        case 'TRANSFER':
          return '转校退园'
        case 'OTHER':
          return '其他原因'
        default:
          return reason
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.clazz-wrap {
  .el-timeline {
    ::v-deep .el-timeline-item {
      position: relative;
      padding-bottom: 8px;

      .el-timeline-item__node {
        @include bgc_main_color();
      }

      .el-timeline-item__timestamp {
        margin-bottom: 16px;
        font-size: 16px;
        @include c_title_color();
      }
    }
  }

  .timeBox {
    .mark {
      position: absolute;
      top: 0;
      left: 180px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      @include c_main_color();
      border: 1px solid;
      @include bc_main_color();
      border-radius: 2px;
    }
  }
}
</style>
