<template>
  <div class="peopleCount-wrap">
    <div class="data-tip">
      <div class="top">
        <div class="range">
          分析范围：2020-02
        </div>
        <div class="people-num">
          人日数：xxx
        </div>
      </div>
      <div class="bottom">
        <div class="meal">
          进餐系数：
        </div>
        <div class="category">
          <span class="name">早餐:20%</span>
          <span class="name">早餐:20%</span>
          <span class="name">早餐:20%</span>
        </div>
      </div>
    </div>
    <div class="in-school">
      <etm-table
        :columns="columns"
        :data="tableData"
      >
        <etm-table-tool-bar slot="tool">
          <div class="inschool-wrap">
            <span class="in-school-count">在园人数：</span>
            <span class="in-school-num">0</span>
          </div>
        </etm-table-tool-bar>
      </etm-table>
      <div class="operate">
        <el-button v-if="showBackOut">
          &lt;撤销
        </el-button>
        <el-button
          type="primary"
          @click="showBackOut = !showBackOut"
        >
          同步至出勤人日数&gt;
        </el-button>
      </div>
      <etm-table
        :columns="columns"
        :data="tableData"
      >
        <etm-table-tool-bar slot="tool">
          <div class="inschool-wrap">
            <span class="in-school-count">出勤人数</span>
            <span class="in-school-text">（用于计算平均参考摄入量）</span>
          </div>
          <div slot="right">
            <el-button type="primary">
              重新获取
            </el-button>
          </div>
        </etm-table-tool-bar>
      </etm-table>
    </div>
  </div>
</template>

<script>
/**
   * peopleCount create by 油麦菜
   * createTime 2021/3/23 15:51
   */
export default {
  name: 'PeopleCount',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      columns: [
        { label: '年龄组', prop: 'a', minWidth: 65 },
        { label: '男（人）', prop: 'b', minWidth: 80 },
        { label: '女（人）', prop: 'c', minWidth: 80 },
        { label: '年龄组', prop: 'a1', minWidth: 65 },
        { label: '男（人）', prop: 'b1', minWidth: 80 },
        { label: '女（人）', prop: 'c1', minWidth: 80 },
        { label: '年龄组', prop: 'a2', minWidth: 65 },
        { label: '男（人）', prop: 'b2', minWidth: 80 },
        { label: '女（人）', prop: 'c2', minWidth: 80 }
      ],
      tableData: [],
      showBackOut: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .peopleCount-wrap {
    .in-school {
      display: flex;
      justify-content: space-between;
      position: relative;

      ::v-deep .EtmTable-wrap {
        width: 43% !important;

        .inschool-wrap {
          align-items: flex-end;
          display: flex;
          height: 32px;
          line-height: 1;
        }

        .in-school-count {
          color: #222;
          font-size: 14px;
          font-weight: 700;
        }

        .in-school-num {
          @include etm-color;
        }

        .in-school-text {
          color: #999;
          font-size: 14px;
          font-weight: 400;
        }
      }

      .operate {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .el-button {
          margin: 0 0 16px;
          width: 150px;
        }
      }
    }

    .data-tip {
      color: #555;
      font-size: 14px;
      font-weight: 400;

      .top {
        display: flex;

        .people-num {
          margin-left: 40px;
        }
      }

      .bottom {
        display: flex;
        margin-top: 12px;

        .category .name {
          &:not(:first-child) {
            margin-left: 8px;
          }
        }
      }
    }
  }
</style>
