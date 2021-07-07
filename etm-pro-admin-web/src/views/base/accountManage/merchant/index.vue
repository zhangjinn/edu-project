<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div v-if="state === 'edit'" class="editBox">
          <div class="imgBox">
            <img src="../../../../assets/images/base/mainBg.png">
          </div>
          <div class="selectBox">
            <div v-if="firstEdit" class="top">请选择商户性质</div>
            <div v-else class="top">当前选择为：企业商户</div>
            <div v-if="firstEdit" class="selectList">
              <div class="selectItem" @click="toEnterpriseMerchant">
                <span class="iconfont iconqiyeshanghu" />
                <div class="centerMsg">
                  <div class="title">企业商户</div>
                  <div class="text">所需材料：营业执照、法人身份证件、对公账户文件、结算账户文件、营业所门头照/内景照</div>
                </div>
                <span class="iconfont iconright-circle" />
              </div>
              <div class="selectItem" @click="toPersonalMerchant">
                <span class="iconfont icongerenshanghu" />
                <div class="centerMsg">
                  <div class="title">个体商户</div>
                  <div class="text">所需材料：营业执照、法人身份证件、法人银行卡、营业所门头照/内景照</div>
                </div>
                <span class="iconfont iconright-circle" />
              </div>
              <div class="selectItem" @click="toPersonal">
                <span class="iconfont iconzhanghao" />
                <div class="centerMsg">
                  <div class="title">个人</div>
                  <div class="text">所需材料：本人身份证件、本人银行卡等信息</div>
                </div>
                <span class="iconfont iconright-circle" />
              </div>
            </div>
            <div v-else class="selectList">
              <div class="selectItem" @click="toEdit">
                <span class="iconfont iconqiyeshanghu" />
                <div class="centerMsg">
                  <div class="title">继续录入企业商户信息</div>
                  <div class="text">商户信息登记录入中，请完善剩余信息</div>
                </div>
                <span class="iconfont iconright-circle" />
              </div>
              <div class="selectItem" @click="selectAgain">
                <span class="iconfont iconzhongxinxuanze" />
                <div class="centerMsg">
                  <div class="title">重新选择</div>
                  <div class="text">重新选择后原已填入信息都将被重置</div>
                </div>
                <span class="iconfont iconright-circle" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="state === 'review'" class="stateBox">
          <div class="stateImg">
            <img src="src/assets/images/base/reviewing.png">
          </div>
          <div class="stateTitle">信息审核中</div>
          <div class="stateText">商户信息已完成并提交，请耐心等待审核结果</div>
          <div class="stateBtn">
            <el-button plain @click="checkAccount">
              查看信息 <span class="iconfont iconarrow-left" />
            </el-button>
          </div>
        </div>
        <div v-else-if="state === 'refuse'" class="stateBox">
          <div class="stateImg">
            <img src="src/assets/images/base/refuse.png">
          </div>
          <div class="stateTitle">审核未通过</div>
          <div class="stateText">{{ rejectReason }}</div>
          <div class="stateBtn">
            <el-button plain @click="editAccount">
              修改信息 <span class="iconfont iconarrow-left" />
            </el-button>
          </div>
        </div>
        <div v-else-if="state === 'success'" class="successBox">
          <etm-title :show-line="false" size="big">进件信息</etm-title>
          <etm-field-label label="进件状态" type="left">
            <span class="iconfont iconsuccess" />
            <span class="text">已进件</span>
          </etm-field-label>
          <etm-field-label label="开户名称" type="left">{{ accountData.openAccountName }}</etm-field-label>
          <etm-field-label label="银行账号" type="left">{{ accountData.bankAccountNumber }}</etm-field-label>
          <etm-field-label label="开户银行" type="left">{{ accountData.branchBankName }}</etm-field-label>
          <etm-field-label label="开户支行" type="left">{{ accountData.openAccountBank }}</etm-field-label>
          <etm-field-label label="联行号" type="left">{{ accountData.bankContactLine }}</etm-field-label>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/11/3 10:07
 */

import { queryPaymentMerchantInfo } from '@/api/base/accountManage'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      state: '',
      firstEdit: true,
      rejectReason: '',
      accountData: {},
      merchantType: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getState()
  },
  methods: {
    getState() {
      queryPaymentMerchantInfo().then(res => {
        const { data } = res
        this.accountData = data.settlementInfo
        this.merchantType = data.merchantType
        // INIT :未签约 AUDITING :审核中 SUCCESS :签约成功 REJECT :驳回 FIRST_CHECK_PASS :首次检查合格 RECHECK_REJECT :复审驳回 TO_BE_SIGNED :待确认
        if (data.state === 'SUCCESS') {
          this.state = 'success'
        } else if (data.state === 'AUDITING' || data.state === 'TO_BE_SIGNED' || data.state === 'FIRST_CHECK_PASS') {
          this.state = 'review'
        } else if (data.state === 'REJECT' || data.state === 'RECHECK_REJECT') {
          this.state = 'refuse'
        } else {
          this.state = 'edit'
        }
      })
    },
    toEnterpriseMerchant() {
      this.$etmTip.init({
        type: 'warn',
        title: '确认选择 企业商户？',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          this.$etmTip.close()
          this.$router.push({
            path: '/accountSetting/enterpriseMerchant'
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    toPersonalMerchant() {
      this.$etmTip.init({
        type: 'warn',
        title: '确认选择 个体商户？',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          this.$etmTip.close()
          this.$router.push({
            path: '/accountSetting/personalMerchant'
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    toPersonal() {
      this.$etmTip.init({
        type: 'warn',
        title: '确认选择 个人？',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          this.$etmTip.close()
          this.$router.push({
            path: '/accountSetting/personalAccount'
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    toEdit() {

    },
    selectAgain() {
      this.$etmTip.init({
        type: 'error',
        title: '确认需要重新选择商户性质？',
        content: '重新选择后原已填入信息都将被重置',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          this.firstEdit = true
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    checkAccount() {
      if (this.merchantType === 'PERSONAL_COMPANY') {
        this.$router.push({
          path: '/accountSetting/personalMerchant'
        })
      } else if (this.merchantType === 'COMPANY') {
        this.$router.push({
          path: '/accountSetting/enterpriseMerchant'
        })
      } else if (this.merchantType === 'PERSONAL') {
        this.$router.push({
          path: '/accountSetting/personalAccount'
        })
      }
    },
    editAccount() {
      if (this.merchantType === 'PERSONAL_COMPANY') {
        this.$router.push({
          path: '/accountSetting/personalMerchant'
        })
      } else if (this.merchantType === 'COMPANY') {
        this.$router.push({
          path: '/accountSetting/enterpriseMerchant'
        })
      } else if (this.merchantType === 'PERSONAL') {
        this.$router.push({
          path: '/accountSetting/personalAccount'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .editBox {
    display: flex;
    justify-content: center;
    padding: 80px 0 200px 0;

    .imgBox {
      padding-top: 95px;
      width: 538px;

      img {
        width: 100%;
      }
    }

    .selectBox {
      margin-left: 64px;
      width: 412px;

      .top {
        font-size: 18px;
        text-align: center;
      }

      .selectList {
        padding: 24px 0;

        .selectItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border: 1px solid;
          @include bc_divide_color();
          @include bgc_hover_color();
          border-radius: 4px;
          cursor: pointer;

          & + .selectItem {
            margin-top: 16px;
          }

          &:hover {
            @include etm-bdc();
            @include bgc_main_12_color();

            .iconfont {
              @include etm-color();
            }

            .centerMsg {
              @include etm-color();

              .text {
                @include etm-color();
              }
            }
          }

          .iconfont {
            width: auto;
            font-size: 42px;
            @include c_secondary_color();
          }

          .centerMsg {
            width: 250px;

            .title {
              font-size: 16px;
            }

            .text {
              margin-top: 12px;
              @include c_secondary_color();
            }
          }

          .iconright-circle {
            font-size: 22px;
          }
        }
      }
    }
  }

  .stateBox {
    padding: 148px 0 188px;
    text-align: center;

    .stateImg {
      margin: 0 auto;
      width: 264px;

      img {
        width: 100%;
      }
    }

    .stateTitle {
      margin-top: 32px;
      font-size: 18px;
      @include c_title_color();
    }

    .stateText {
      margin-top: 16px;
      @include c_secondary_color();
    }

    .stateBtn {
      margin-top: 24px;

      .iconfont {
        font-size: 14px;
      }
    }
  }

  .successBox {
    padding: 16px 16px 48px;

    .iconfont {
      @include c_success_color();
    }

    .text {
      @include c_success_color();
    }
  }
}
</style>
