<template>
  <div class="orderDrawer-wrap">
    <etm-title :show-line="false" border size="big">关联账单</etm-title>
    <div class="orderList">
      <div class="orderItem">
        <div class="totalBox">
          <el-row class="total">
            <el-col :span="4">
              <etm-field-label label="姓名">{{ orderData.childName }}</etm-field-label>
            </el-col>
            <el-col :span="6">
              <etm-field-label label="账单编号">{{ orderData.code }}</etm-field-label>
            </el-col>
            <el-col :span="4">
              <etm-field-label label="应收总价">{{ orderData.totalAmount }}</etm-field-label>
            </el-col>
            <el-col :span="4">
              <etm-field-label label="订金">{{ orderData.depositAmount }}</etm-field-label>
            </el-col>
            <el-col :span="4">
              <etm-field-label label="实收总价">
                <span class="main">¥ {{ orderData.actualAmount }}</span>
              </etm-field-label>
            </el-col>
          </el-row>
        </div>
        <etm-table :data="orderData.orderItemList" :border="false" :stripe="false" class="itemTable">
          <el-table-column slot="left" label="项目名称">
            <template slot-scope="scoped">
              <div class="itemName">
                <div class="itemImg">
                  <img src="../../../../../assets/images/etm-logo.png">
                </div>
                <div class="name">{{ scoped.row.orderItemName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="单价">
            <template slot-scope="scoped">
              <div class="actual">实收：¥ {{ scoped.row.actualUnitAmount }}</div>
              <div class="origin">应收：¥ {{ scoped.row.unitAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="数量" prop="number" />
          <el-table-column slot="left" label="小计" width="240">
            <template slot-scope="scoped">
              <div class="actual">实收：¥ {{ scoped.row.actualAmount }}</div>
              <div class="origin">应收：¥ {{ scoped.row.totalAmount }}</div>
            </template>
          </el-table-column>
        </etm-table>
      </div>
    </div>
  </div>

</template>

<script>
/**
 * orderDrawer create by Administrator
 * createTime 2020/9/24 15:47
 */
export default {
  name: 'OrderDrawer',
  components: {},
  filters: {},
  mixins: [],
  props: {
    orderData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.orderDrawer-wrap {
  .orderList {

    .orderItem {

      .totalBox {

        .main {
          font-weight: bold;
          @include c_main_color();
        }
      }
      .itemName {
        display: flex;

        .itemImg {
          margin-right: 15px;
          padding-top: 11px;
          width: 100px;
          height: 54px;
          text-align: center;
          border-radius: 2px;
          @include bgc_divide_color();

          img {
            width: 32px;
          }
        }

        .name {
          max-width: 120px;
        }
      }
    }
  }
}
</style>
