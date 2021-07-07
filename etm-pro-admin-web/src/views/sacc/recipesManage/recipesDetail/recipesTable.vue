<template>
  <el-table
    ref="etmTable"
    :data="tableData"
    style="width: 100%"
    class="recipesTable"
    :row-style="rowStyle"
  >
    <el-table-column
      :label="$t('recipeManagement.meal')"
    >
      <template slot-scope="scope">
        <div>
          {{ scope.row.timeQuantumName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(day, i) in dayArr"
      :key="i"
      :index="i"
      :label="dateArr[i]?`${day.c} (${dateArr[i]})`:`${day.c}`"
    >
      <template slot-scope="scope">
        <div class="cellContent">
          <ul>
            <li v-for="(issue, index) in scope.row[dayArr[i].e]" :key="index">
              <div class="foodName">
                <span ref="issues">{{ issue.foodName || '' }}</span>
                <i ref="deletes" class="el-icon-close" @click.stop="deleteIssue(scope, index)" />
              </div>
              <div v-if="showDesc" class="foodDesc">
                <etm-label>{{ $t('recipeManagement.ingredients') }}</etm-label>{{ issue.description }}
              </div>
            </li>
          </ul>
          <div class="addScreen">
            <span @click.stop="editCell(scope)"><i class="el-icon-plus" />{{ $t('recipeManagement.addTo') }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
const MIN_HEIGHT = 50
// const OFFSET_TOP = 66
const OFFSET_TOP = 200
import etmLabel from '@/components/EtmLabel'

export default {
  name: 'ScheduleTable',
  components: {
    etmLabel
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
    showDesc: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dayArr: [
        { c: '周一', e: 'monday' },
        { c: '周二', e: 'tuesday' },
        { c: '周三', e: 'wednesday' },
        { c: '周四', e: 'thursday' },
        { c: '周五', e: 'friday' },
        { c: '周六', e: 'saturday' },
        { c: '周日', e: 'sunday' }
      ],
      tableHeight: MIN_HEIGHT
    }
  },
  computed: {
  },
  mounted() {
    const that = this
    setTimeout(() => {
      this.autoHeight()
    }, 500)
    this.$nextTick(() => {
      that.autoHeight()
    })

    window.addEventListener('resize', () => {
      this.autoHeight()
    })
    window.addEventListener('click', () => {
      that.$nextTick(() => {
        that.autoHeight()
      })
    })
  },
  methods: {
    autoHeight() {
      this.$nextTick(() => {
        this.$refs.etmTable && setTimeout(() => {
          const height = window.innerHeight - this.$refs.etmTable.$el.offsetTop - OFFSET_TOP
          this.tableHeight = height < MIN_HEIGHT ? MIN_HEIGHT : height
        }, 500)
      })
    },
    rowStyle({ row, rowIndex }) {
      return {
        'height': '98px'
      }
    }
  }
}
</script>
<style scoped lang="scss">

    .recipesTable {
      display: flex;
      flex-direction: column;
      font-size:14px;
      font-weight:400;
      & /deep/.el-table__header-wrapper {
        overflow: visible;
        th{
          background: #FAFAFA;
        }
      }
      & /deep/ .el-table__body-wrapper {
        .cell {
          height: 100%;
        }
        tr td:first-child {
          .cell {
            height: auto;
          }
        }
        tr td{
          padding: 10px 0;
        }
      }
      .cellContent {
        position: relative;
        height: 100%;
        padding: 10px 0;
        ul {
          padding:0 0 45px 0;
          &.showHandle {
            padding-bottom: 35px;
          }
          margin: 0;
          li {
            list-style-type:none;
            .foodName{
              display: flex;
              justify-content: space-between;
              align-items: center;
              span{
                @include c_text_color();
              }
              i {
                font-weight: normal;
                &:hover {
                  @include c_error_color();
                  cursor: pointer;
                }
              }
            }
            .foodDesc{
              font-size:12px;
              @include c_secondary_color();
              &/deep/.etmLabel{
                @include c_secondary_color();
              }
            }
            &:not(:first-child){
              margin-top: 8px;
            }
          }
        }

        .addScreen{
          position: absolute;
          bottom: 5px;
          left: 0;
          display: inline-block;
          margin-top: 8px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          cursor: pointer;
          @include c_main_color();
          i{
            margin-right: 6px;
          }
        }
      }
      & /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: transparent;
      }
    }

</style>
