<template>
  <div class="collectionMessage">
    <etm-layout-split>
      <etm-title :border="false">{{ $t('collectionManage.breadCrumbTitleMessage') }}</etm-title>
      <div class="messageBox">
        <etm-form type="dialog">
          <el-form-item :label="$t('collectionManage.collAccount')+':'">
            <div v-if="status === 'SUCCESS'">
              <span class="institution">{{ collectionInstitution }}</span>
              <span class="successMark">{{ $t('collectionManage.collAccountPass') }}</span>
              <el-button type="text" @click="toSetting">{{ $t('collectionManage.collAccountReset') }}</el-button>
            </div>
            <div v-else-if="status === 'AUDITING' || status === 'TO_BE_SIGNED' || status === 'FIRST_CHECK_PASS'">
              <span class="inProcess">{{ $t('collectionManage.collAccountCheck') }}</span>
              <el-button type="text" disabled @click="toSetting">{{ $t('collectionManage.collAccountReset') }}</el-button>
            </div>
            <div v-else-if="status === 'REJECT' || status === 'RECHECK_REJECT'">
              <span class="inProcess">{{ $t('collectionManage.collAccountReject') }}</span>
              <el-button type="text" @click="toSetting">{{ $t('collectionManage.collAccountReset') }}</el-button>
              <p class="rejectReason">{{ rejectReason }}</p>
            </div>
            <div v-else-if="status === 'INIT'">
              <el-button @click="toSetting">{{ $t('collectionManage.collAccountBtnText') }}</el-button>
              <p class="setTips">如果您未进行支付账号设置，家长缴费将会支付到广州六米网络科技有限公司</p>
            </div>
          </el-form-item>
        </etm-form>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import { getMerchantSignSate, putMerchantSignSate } from '@/api/collection'

export default {
  name: 'Index',
  components: {},
  data() {
    return {
      status: null,
      rejectReason: '',
      collectionInstitution: ''
    }
  },
  created() {
    this.getState()
  },
  methods: {
    getState() {
      getMerchantSignSate().then(res => {
        if (res.data.state !== 'SUCCESS') {
          putMerchantSignSate().then(res => {
            this.rejectReason = res.data.rejectReason
            this.status = res.data.state
            this.collectionInstitution = res.data.merchantName
          })
        } else {
          this.rejectReason = res.data.rejectReason
          this.status = res.data.state
          this.collectionInstitution = res.data.merchantName
        }
      })
    },
    toSetting() {
      this.$emit('switch', { target: 'setting', index: 0 })
    }
  }
}
</script>

<style lang="scss" scoped>
  .collectionMessage {
    .messageBox {

      .setTips {
        margin-top: 8px;
        font-size: 12px;
        @include c_error_color();
      }

      .inProcess {
        display: inline-block;
        width: 240px;
        @include c_error_color();
      }

      .rejectReason {
        margin-top: 2px;
        font-size: 12px;
        @include c_secondary_color();
      }

      .institution {
        @include c_text_color();
      }

      .successMark {
        margin: 0 40px 0 6px;
        padding: 4px 8px;
        @include bgc_main_12_color();
        @include c_main_color();
      }

      .amount {
        display: inline-block;
        margin-right: 12px;
        @include c_main_color();

        .number {
          font-size: 22px;
        }

        .unit {
          @include c_text_color();
        }
      }

      .modify {
        @include c_text_color();

        &:hover {
          @include c_main_color();
        }
      }
    }
  }
</style>
