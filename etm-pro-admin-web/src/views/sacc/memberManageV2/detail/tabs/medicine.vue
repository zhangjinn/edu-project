<template>
  <div class="medicine">
    <div class="switch">
      <span :class="{active: active === 'notheal'}" @click.stop="switchState('notheal')">{{ $t('memberManage.detailMedicineNotHeal') }}</span>
      <span :class="{active: active === 'heal'}" @click.stop="switchState('heal')">{{ $t('memberManage.detailMedicineIsHeal') }}</span>
    </div>
    <ul v-if="active === 'notheal'" class="disease">
      <li v-for="(v, i) in inUse" v-show="inUse" :key="i">
        <h5>{{ v.disease || $t('memberManage.unknownText') }}</h5>
        <div class="handle">
          <span @click.stop="healDisease(i)">{{ $t('memberManage.detailMedicineHealBtnText') }}</span>
          <span class="delete" @click.stop="deleteDisease(i)">{{ $t('memberManage.detailMedicineDeleteBtnText') }}</span>
        </div>
        <div v-for="(m, index) in v.medicine" v-show="v.medicine" :key="index" class="drug">
          <h6>{{ m.name || $t('memberManage.unknownText') }}</h6>
          <p>{{ $t('memberManage.detailMedicineLabelUsage') }}：{{ m.usage || $t('memberManage.unknownText') }}</p>
          <p>{{ $t('memberManage.detailMedicineLabelDescription') }}：{{ m.description || '-' }}</p>
          <span>{{ $t('memberManage.detailMedicineLabelCreateTime') }}：{{ m.createTime || $t('memberManage.unknownText') }}</span>
          <hr color="#EEE" size="1">
        </div>
      </li>
    </ul>

    <ul v-else class="nondisease">
      <li v-for="(v, i) in reCure" v-show="reCure" :key="i">
        <h5>{{ v.disease || $t('memberManage.unknownText') }}</h5>
        <div class="handle">
          <span class="healed">{{ $t('memberManage.detailMedicineIsHeal') }}</span>
          <span class="delete" @click.stop="deleteHealed(i)">{{ $t('memberManage.detailMedicineDeleteBtnText') }}</span>
        </div>
        <div v-for="(m, index) in v.medicine" v-show="v.medicine" :key="index" class="drug">
          <h6>{{ m.name || $t('memberManage.unknownText') }}</h6>
          <p>{{ $t('memberManage.detailMedicineLabelUsage') }}：{{ m.usage || $t('memberManage.unknownText') }}</p>
          <p>{{ $t('memberManage.detailMedicineLabelDescription') }}：{{ m.description || '-' }}</p>
          <span>{{ $t('memberManage.detailMedicineLabelCreateTime') }}：{{ m.createTime || $t('memberManage.unknownText') }}</span>
          <hr color="#EEE" size="1">
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { editMedication } from '@/api/sacc'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    }
  },
  data() {
    return {
      active: 'notheal',
      inUse: [],
      reCure: []
    }
  },
  watch: {
    content: {
      handler(v) {
        if (v) {
          this.inUse = v.inUse || []
          this.reCure = v.reCure || []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    switchState(state) {
      this.active = state
    },
    healDisease(index) {
      const copyInUse = JSON.parse(JSON.stringify(this.inUse))
      const copyReCure = JSON.parse(JSON.stringify(this.reCure))
      copyReCure.push(copyInUse.splice(index, 1)[0])
      this.submitMedication({
        inUse: copyInUse,
        reCure: copyReCure
      }).then(res => {
        this.inUse = copyInUse
        this.reCure = copyReCure
        this.$message({
          type: 'success',
          message: this.$t('memberManage.detailMedicineHealSuccessTip')
        })
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('memberManage.detailMedicineHealFailTip'))
      })
    },
    deleteDisease(index) {
      const copyInUse = JSON.parse(JSON.stringify(this.inUse)) // 深拷贝一个inUse数组
      copyInUse.splice(index, 1)
      this.submitMedication({
        inUse: copyInUse,
        reCure: this.reCure
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('memberManage.detailMedicineDeleteSuccessTip')
        })
        this.inUse.splice(index, 1)
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('memberManage.detialMedicineDeleteFailTip'))
      })
    },
    deleteHealed(index) {
      const copyReCure = JSON.parse(JSON.stringify(this.reCure)) // 深拷贝一个reCure数组
      copyReCure.splice(index, 1)
      this.submitMedication({
        inUse: this.inUse,
        reCure: copyReCure
      }).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('memberManage.detailMedicineDeleteSuccessTip')
        })
        this.reCure.splice(index, 1)
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error(this.$t('memberManage.detialMedicineDeleteFailTip'))
      })
    },
    submitMedication(data) {
      return editMedication(localStorage.getItem('memberManageV2_currentId'), data)
    }
  }
}
</script>

<style scoped lang="scss">
.medicine {
  .switch {
    font-size: 14px;
    line-height: 32px;
    span {
      cursor: pointer;
      @include c_text_color();
      &.active {
        @include c_title_color();
      }
      & + span {
        margin-left: 28px;
      }
    }
  }
  .disease, .nondisease {
    margin: 15px 0 0 0;
    list-style: none;
    padding: 0 0 15px 0;
    li {
      position: relative;
      width: 488px;
      border-radius: 2px;
      margin-bottom: 14px;
      border: 1px solid;
      @include bc_divide_color();
      h5 {
        margin: 0;
        padding: 0 20px;
        line-height: 40px;
        font-size: 14px;
        @include c_title_color();
        @include bgc_hover_color();
      }
      .handle {
        position: absolute;
        top: 11px;
        right: 20px;
        span {
          cursor: pointer;
          font-size: 14px;
          @include c_main_color();
          &.delete {
            @include c_error_color();
            margin-left: 14px;
          }
          &.healed {
            @include c_secondary_color();
            cursor: default;
          }
        }
      }
      .drug {
        padding: 0 20px;
        height: 142px;
        font-size: 14px;
        h6 {
          margin: 0;
          font-size: 14px;
          font-weight: normal;
          line-height: 46px;
        }
        p {
          margin: 0;
          line-height: 28px;
        }
        span {
          line-height: 24px;
          font-size: 12px;
          @include c_secondary_color();
        }
        &:last-of-type {
          hr {
            display: none;
          }
        }
      }
    }
  }
}
</style>
