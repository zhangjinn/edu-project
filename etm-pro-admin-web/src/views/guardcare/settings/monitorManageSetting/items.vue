<template>
  <div class="items">
    <ul>
      <li v-for="(d, dindex) in timeList" :key="dindex">
        <p>
          <i class="iconfont iconcalendar" />
          <span style="font-weight: bold;">{{ dindex | weekday }}</span>
        </p>
        <div v-for="(t, tindex) in d" :key="tindex" class="formArea">
          <span>开放时段{{ tindex + 1 }}：</span>
          <div class="greyWrapper">
            <el-time-picker
              v-model="t.start"
              placeholder="选择时间"
              :clearable="false"
              :picker-options="{
                selectableRange: `00:00:00 - ${t.end}:00`
              }"
              value-format="HH:mm"
              format="HH:mm"
              @change="e => handleUpdate(e, t)"
            />
            <i>---</i>
            <el-time-picker
              v-model="t.end"
              placeholder="选择时间"
              :clearable="false"
              :picker-options="{
                selectableRange: `${t.start}:00 - 23:59:00`
              }"
              value-format="HH:mm"
              format="HH:mm"
              @change="e => handleUpdate(e, t)"
            />
            <el-switch v-model="t.enable" @change="e => handleUpdate(e, t)" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import {
  updateDeviceOpenTime
} from '@/api/guardcare/cloudDeviceManage/monitor'
export default {
  filters: {
    weekday(index) {
      return '星期' + ['一', '二', '三', '四', '五', '六', '日'][index]
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    type: {
      type: String
    }
  },
  data() {
    return {
      timeList: []
    }
  },
  watch: {
    list: {
      handler(value) {
        const result = []
        if (value.length === 7) {
          value.forEach(v => {
            const daytime = []
            v.deviceOpenTimeVOList.forEach(d => {
              daytime.push({
                deviceOpenTimeId: d.deviceOpenTimeId,
                weekDay: d.weekDay,
                start: d.start,
                end: d.end,
                enable: d.enable,
                sort: d.sort
              })
            })
            result.push(daytime)
          })
        }
        this.timeList = result
      }
    }
  },
  methods: {
    handleUpdate(e, t) {
      const { deviceOpenTimeId, weekDay, sort, start, end, enable } = t
      updateDeviceOpenTime({ deviceOpenTimeId, weekDay, sort, start: start + ':00', end: end + ':00', type: this.type, enable }).then(res => {
        this.$message.success('修改成功')
        this.$emit('refresh')
      }).catch(err => {
        this.$message.error('修改失败，请重试')
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.items {
  ul {
    li {
      .formArea {
        display: flex;
        align-items: center;
        height: 48px;
        padding-left: 6px;
        margin: 8px 0 16px;
        .greyWrapper {
          height: 48px;
          display: flex;
          align-items: center;
          border-radius: 4px;
          padding: 0 12px;
          margin-left: 10px;
          @include bgc_bg_color();
          i {
            color: #DBDDE4;
            margin: 0 3px;
          }
          ::v-deep .el-date-editor {
            width: 120px;
            height: 32px;
          }
          ::v-deep .el-switch {
            margin-left: 16px;
          }
        }
      }
    }
  }
}
</style>
