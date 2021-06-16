<template>
  <div class="etm-calendar-wrap">
    <div
      v-if="$slots.header"
      class="etm-calendar-header"
    >
      <slot name="header" />
    </div>
    <el-calendar
      :value="value"
      @input="$emit('input', $event)"
    >
      <slot
        slot="dateCell"
        slot-scope="{date, data}"
        name="dateCell"
        :date="date"
        :data="data"
      />
    </el-calendar>
  </div>
</template>
<script>
export default {
  name: 'EtmCalendar',
  props: {
    value: {}
  },
  methods: {
    isWeekEnd (date) {
      const weekDay = new Date(date).getDay()
      return [0, 6].includes(weekDay)
    },
    isPreMonth (date, data) {
      return data.type === 'prev-month'
    },
    isCurrentMonth (date, data) {
      return data.type === 'current-month'
    },
    isNextMonth (date, data) {
      return data.type === 'next-month'
    },
    month (data) {
      try {
        return data.day.split('-')[1]
      } catch (e) {
        return '-'
      }
    },
    day (data) {
      try {
        return data.day.split('-')[2]
      } catch (e) {
        return '-'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .etm-calendar-wrap {
    background-color: #fff;
    height: auto;
    max-height: 100%;
    position: relative;

    .etm-calendar-header {
      @include c_title_color();
      background-color: inherit;
      font-size: 14px;
      left: 130px;
      position: absolute;
      top: 4px;
      width: 50%;
    }

    ::v-deep .el-calendar {
      display: flex;
      flex-direction: column;
      height: 100%;

      .el-calendar__header,
      .el-calendar__body {
        padding-left: 24px;
        padding-right: 24px;
      }

      .el-calendar__header {
        border-bottom: 0;
        /*padding-top: 16px;*/
        /*padding-bottom: 16px;*/
        padding: 0 0 16px;

        .el-calendar__title {
          @include c_title_color();
          margin-right: 16px;
        }
      }

      .el-calendar__body {
        flex: 1;
        margin-bottom: 16px;;
        /*padding: 0 24px;*/
        padding: 0;
        //noinspection CssInvalidPropertyValue
        @supports (overflow: overlay) {
          overflow: overlay;
        }

        .el-calendar-table {
          thead {
            background-color: #f7f7f7;

            th {
              padding: 8px 0;
            }
          }
        }

        .el-calendar-day {
          padding: 0;
          user-select: none;

          &:hover {
            cursor: default;
          }
        }
      }

      .prev,
      .next {
        background-color: #fbfbfb;
        pointer-events: none;

        > * {
          display: none;
        }
      }
    }
  }
</style>
