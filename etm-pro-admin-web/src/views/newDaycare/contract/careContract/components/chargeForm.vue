<template>
  <etm-drawer :visible.sync="isShow" type="big">
    <div class="chargeForm-wrap">
      <etm-layout-split>
        <etm-title :show-line="false" border size="big">
          修改合同

          <template slot="tool">
            <el-button size="mini" plain>取消</el-button>
            <el-button size="mini" type="primary">保存</el-button>
          </template>
        </etm-title>

        <etm-form type="dialog">
          <el-form-item label="学员姓名" prop="type">
            小李
          </el-form-item>
          <el-form-item label="业务类型" prop="type">
            托育
          </el-form-item>
          <el-form-item label="合同类型" prop="contractType" :required="true">
            <el-radio-group v-model="contractType">
              <el-radio v-model="contractType" label="PER_CHILD">新签约</el-radio>
              <el-radio v-model="contractType" label="PER_CLAZZ">续约</el-radio>
            </el-radio-group>
          </el-form-item>

        </etm-form>

        <div class="itemTable">
          <etm-title>收费项目</etm-title>
          <div class="buttonBox">
            <el-button type="primary" @click="selectEvent">选择套餐</el-button>
            <el-button type="primary" @click="selectEvent">选择课程类型</el-button>
            <el-button type="primary" @click="selectEvent">选择课程</el-button>
            <el-button type="primary" @click="selectEvent">选择物品</el-button>
            <el-button type="primary" @click="selectEvent">选择费用</el-button>
          </div>

          <!--    嵌套模板组件-->

          <nesting-table v-model="demoData" />
        </div>

        <div>
          <etm-title>支付信息</etm-title>
          <el-row>
            <el-col :span="16">
              <etm-form type="dialog">
                <el-form-item label="实收定金">
                  <el-select value="100.0">
                    <el-option label="100.0" value="100.0" />
                  </el-select>
                </el-form-item>
                <el-form-item label="应收金额">
                  100
                </el-form-item>
                <el-form-item label="实收金额">
                  1950.0
                </el-form-item>
                <el-form-item label="支付方式" :required="true">
                  <el-select value="0">
                    <el-option label="微信" value="0" />
                    <el-option label="支付宝" value="1" />
                    <el-option label="现金" value="2" />
                    <el-option label="银行卡" value="3" />
                    <el-option label="POS机" value="4" />
                  </el-select>
                </el-form-item>
              </etm-form>
            </el-col>
          </el-row>
        </div>

        <div>
          <etm-title>其他信息</etm-title>
          <el-row>
            <el-col :span="16">
              <etm-form type="dialog">
                <el-form-item label="签约日期">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="有效期">
                  <el-date-picker
                    type="daterange"
                    range-separator="至"
                    start-placeholder="年/月"
                    end-placeholder="年/月"
                  />
                </el-form-item>
                <el-form-item label="实收定金">
                  1950.0
                </el-form-item>
                <el-form-item label="业绩人及占比" :required="true">
                  <el-row>
                    <el-col :span="15">
                      <el-select value="0" style="width: 100%">
                        <el-option label="水杉" value="0" />
                      </el-select>
                    </el-col>
                    <el-col :span="6" :offset="1">
                      <el-input />
                    </el-col>
                    <el-col :span="2">&emsp;%</el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="次业绩人及占比">
                  <el-row>
                    <el-col :span="15">
                      <el-select value="0" style="width: 100%">
                        <el-option label="水杉" value="0" />
                      </el-select>
                    </el-col>
                    <el-col :span="6" :offset="1">
                      <el-input />
                    </el-col>
                    <el-col :span="2">&emsp;%</el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="备注">
                  <el-input type="textarea" :rows="5" placeholder="请输入备注内容" />
                </el-form-item>
              </etm-form>
            </el-col>
          </el-row>
        </div>
      </etm-layout-split>

    </div>
  </etm-drawer>

</template>

<script>

/**
 * chargeForm create by Administrator
 * createTime 2020/8/20 17:29
 */
import NestingTable from '../../components/nestingTable3'
import { queryCacContractDetail } from '@/api/newDaycare/contract'

export default {
  name: 'ChargeForm',
  components: { NestingTable },
  filters: {},
  mixins: [],
  model: {
    prop: 'showChargeForm',
    event: 'evt'
  },
  props: {
    prop: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      contractType: 'PER_CHILD',
      isShow: false,
      detailInfo: {},
      demoData: [
        {
          id: 1,
          name: '套餐',
          netReceipts: 12.00,
          receivable: 10.00,
          purchase: 10,
          give: 1,
          netReceiptsNotes: 100.00,
          receivableNotes: 120.00,
          cacSetMealEnum: 'SET_MEAL',
          childList: [
            {
              id: 1,
              name: '我是套餐的小弟',
              netReceipts: 12.00,
              receivable: 10.00,
              purchase: 10,
              give: 1,
              netReceiptsNotes: 100.00,
              receivableNotes: 120.00,
              cacSetMealEnum: 'RURRICULUM'
            }
          ]
        }, {
          id: 1,
          name: '***',
          netReceipts: 12.00,
          receivable: 10.00,
          purchase: 10,
          give: 1,
          netReceiptsNotes: 100.00,
          receivableNotes: 120.00,
          cacSetMealEnum: 'GOODS'
        }, {
          id: 1,
          name: '***',
          netReceipts: 12.00,
          receivable: 10.00,
          purchase: 10,
          give: 1,
          netReceiptsNotes: 100.00,
          receivableNotes: 120.00,
          cacSetMealEnum: 'GOODS'
        }
      ],
      formData: {
        two: [
          {
            orderBunchItemName: '商品名',
            actualUnitAmount: '100',
            unitAmount: '101',
            itemType: '物品',
            actualAmount: '100',
            number: '2',
            totalAmount: '100'
          }, {
            orderBunchItemName: '商品名',
            actualUnitAmount: '100',
            unitAmount: '101',
            itemType: '物品',
            actualAmount: '100',
            number: '2',
            totalAmount: '100'
          }, {
            orderBunchItemName: '商品名',
            actualUnitAmount: '100',
            unitAmount: '101',
            itemType: '物品',
            actualAmount: '100',
            number: '2',
            totalAmount: '100'
          }
        ],
        orderBunchItemList: [
          {
            orderBunchItemName: '商品名',
            actualUnitAmount: '100',
            unitAmount: '101',
            itemType: '物品',
            actualAmount: '100',
            number: '2',
            totalAmount: '100',
            index: 0
          }, {
            orderBunchItemName: '商品名',
            actualUnitAmount: '100',
            unitAmount: '101',
            itemType: '物品',
            actualAmount: '100',
            number: '2',
            totalAmount: '100',
            index: 1
          }, {
            orderBunchItemName: '商品名',
            actualUnitAmount: '100',
            unitAmount: '101',
            itemType: '物品',
            actualAmount: '100',
            number: '2',
            totalAmount: '100',
            index: 2
          }
        ]
      }
    }
  },
  computed: {},
  watch: {
    prop: {
      // immediate: true,
      deep: true,
      handler(n, o) {
        // console.log(n)
        if (Object.keys(n).length) {
          this.init(n)
        }
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    triggerShow() {
      this.isShow = true
    },
    init(prop) {
      // console.log(prop)
      queryCacContractDetail(prop.id).then(res => {
        this.detailInfo = res.data
      })
    },
    selectEvent() {

    },
    choice() {
      this.$emit('choice', {})
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeForm-wrap {

  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }

  .childSelect {
    .el-tag {
      margin: 0 8px 8px 0;
      height: 32px;
      line-height: 32px;
    }
  }

  .el-cascader {
    width: 100%;
    height: 32px;
  }

  .buttonBox {
    padding-bottom: 16px;
    text-align: left;

    .el-button + .el-button {
      margin-left: 8px;
    }
  }

  .selectBox {
    .iconfont {
      @include c_warn_color();
      cursor: pointer;
    }
  }

  .itemTable {
    .numberCom {
      margin: 2px 0;
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
        max-width: 130px;
      }
    }

    .actual {
      height: 14px;
      line-height: 14px;
    }

    .actualInput {
      height: 32px;
      line-height: 32px;

      ::v-deep .el-input-number__increase {
        display: none;
      }

      ::v-deep .el-input-number__decrease {
        display: none;
      }
    }

    .origin {
      margin-top: 16px;
      height: 14px;
      line-height: 14px;
      @include c_secondary_color();
    }
  }
}

.selPop {
  .search {
    padding-bottom: 16px;

    .el-cascader, .el-input {
      margin-right: 8px;
      width: 240px;
    }
  }
}
</style>
