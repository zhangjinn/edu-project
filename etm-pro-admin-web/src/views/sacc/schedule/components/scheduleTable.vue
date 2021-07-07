<template>
  <div class="scheduleTable">
    <el-table
      :data="tableData"
      style="width: 100%"
      class="scheduleTableBody"
      :row-style="rowStyle"
    >
      <el-table-column
        prop="date"
        :label="$t('schedule.tableLabelTimeDate')"
      />
      <el-table-column
        v-for="(day, i) in dayArr"
        :key="i"
        :index="i"
        :label="`${dayArr[i].c} (${dateArr[i]})`"
      >
        <template slot-scope="scope">
          <div class="cellContent">
            <ul :class="showHandle ? 'showHandle' : ''">
              <li v-for="(issue, index) in scope.row[dayArr[i].e]" :key="index">
                <span ref="issues">{{ issue.scheduleItemContentName || '' }}</span>
                <b v-if="showHandle" ref="deletes" class="iconfont" @click.stop="deleteIssue(scope, index)">&#xe64e;</b>
              </li>
            </ul>
            <span v-if="showHandle" class="add" @click.stop="editCell(scope)">
              <EtmFontIcon name="plus" />{{ $t('schedule.addBtnText') }}
            </span>
            <!-- <i v-if="showHandle" class="iconfont" @click.stop="editCell(scope)">&#xe669;</i> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import EtmFontIcon from '@/components/EtmFontIcon/index'
export default {
  name: 'ScheduleTable',
  components: {
    EtmFontIcon
  },
  props: {
    tableData: {
      type: Array,
      required: true
    },
    dateArr: {
      type: Array,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    editCell: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    deleteIssue: {
      type: Function
    },
    showHandle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const _this = this
    return {
      dayArr: [
        { c: _this.$t('schedule.mondayText'), e: 'monday' },
        { c: _this.$t('schedule.tuesdayText'), e: 'tuesday' },
        { c: _this.$t('schedule.wednesdayText'), e: 'wednesday' },
        { c: _this.$t('schedule.thursdayText'), e: 'thursday' },
        { c: _this.$t('schedule.fridayText'), e: 'friday' },
        { c: _this.$t('schedule.saturdayText'), e: 'saturday' },
        { c: _this.$t('schedule.sundayText'), e: 'sunday' }
      ]
    }
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      return {
        'height': '98px'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.scheduleTable {
  /*height: 100%;*/
  padding-bottom: 16px;
  & >>> .el-table .cell, .el-table th>.cell {
    padding-left: 24px;
  }
  .scheduleTableBody {
    & >>> td{
      border: 1px solid;
      @include bc_divide_color();
    }
    & >>> th>.cell {
      border-right: none;
    }
    & >>> .el-table__body-wrapper {
      .cell {
        height: 100%;
      }
      tr td:first-child {
        .cell {
          height: auto;
        }
      }
    }
    .cellContent {
      position: relative;
      height: 100%;
      padding: 10px 0;
      ul {
        @include c_secondary_color();
        padding: 0 0 0 17px;
        &.showHandle {
          padding-bottom: 28px;
        }
        margin: 0;
        li {
          span {
            @include c_text_color();
          }
          b {
            font-weight: normal;
            font-size: 12px;
            &:hover {
              @include c_error_color();
              cursor: pointer;
            }
          }
        }
      }
      .add {
        position: absolute;
        bottom: 10px;
        left: 0;
        cursor: pointer;
        font-size: 14px;
        @include c_main_color();
        i {
          transform: translateX(-4px);
          margin-right: 3px;
        }
        &:hover {
          opacity: .7;
        }
      }
    }
  }
  & >>> .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent;
  }
}
</style>
