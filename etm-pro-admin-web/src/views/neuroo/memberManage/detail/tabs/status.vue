<template>
  <div class="status">
    <div class="guardian">
      <Etm-title>{{ $t('memberManage.detailStatusTitleGuardian') }}</Etm-title>
      <ul v-if="content && content.guardian">
        <li>{{ $t('memberManage.detailStatusLabelName') }}：{{ content && content.guardian.name }}</li>
        <li>{{ convert(content && content.guardian.cardType, 'cardType') || $t('memberManage.unknownText') }}：{{ content && content.guardian.cardNumber }}</li>
      </ul>
    </div>
    <div class="receiver">
      <Etm-title>{{ $t('memberManage.detailStatusTitleReceiver') }}</Etm-title>
      <ul v-if="content && content.pickUpPeoples">
        <li v-for="(p, i) in content.pickUpPeoples" :key="i">
          <span>
            {{ p.name }}（{{ p.contactTypeName }}）
          </span>
          <span>
            <i class="iconfont">&#xe668;</i>
            {{ convert(p.cardType, 'cardType') || $t('memberManage.unknownText') }}:{{ p.cardNumber }}
          </span>
        </li>
      </ul>
    </div>
    <div class="inf">
      <Etm-title>{{ $t('memberManage.detailStatusTitleInfo') }}</Etm-title>
      <ul>
        <li>{{ $t('memberManage.detailStatusLabelCardType') }}：({{ convert(content && content.cardType, 'cardType') || $t('memberManage.unknownText') }}) {{ (content && content.cardNumber) || $t('memberManage.unknownText') }}</li>
        <li>{{ $t('memberManage.detailStatusLabelTrusteeshipType') }}：{{ convert(content && content.trusteeshipType, 'trusteeshipType') || $t('memberManage.unknownText') }}</li>
        <li>{{ $t('memberManage.detailStatusLabelHouseholdRegistration') }}：{{ (content && content.householdRegistration) || $t('memberManage.unknownText') }}</li>
        <li>{{ $t('memberManage.detailStatusLabelBloodGroup') }}：{{ convert(content && content.bloodGroup, 'bloodGroup') || $t('memberManage.unknownText') }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
// import EtmTitle from '@/layout/main/EtmTitle'
export default {
  components: {
    // EtmTitle
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
    }
  },
  methods: {
    convert(val, type) {
      const converter = {
        cardType: {
          'ID_CARD': this.$t('memberManage.detailStatusLabelIdentityCard')
        },
        trusteeshipType: {
          'FULL': this.$t('memberManage.detailStatusLabelFull'),
          'HALF': this.$t('memberManage.detailStatusLabelHalf'),
          'TEM': this.$t('memberManage.detailStatusLabelHour'),
          'PORARY': this.$t('memberManage.detailStatusLabelTemporary')
        },
        bloodGroup: {
          'A': this.$t('memberManage.detailStatusLabelA'),
          'B': this.$t('memberManage.detailStatusLabelB'),
          'O': this.$t('memberManage.detailStatusLabelO'),
          'AB': this.$t('memberManage.detailStatusLabelAB'),
          'RH_A': this.$t('memberManage.detailStatusLabelRH_A'),
          'RH_B': this.$t('memberManage.detailStatusLabelRH_B'),
          'OTHER': this.$t('memberManage.detailStatusLabelOther')
        }
      }
      return converter[type][val]
    }
  }
}
</script>

<style scoped lang="scss">
.status {
  height: calc(100vh - 206px);
  overflow-y: auto;
  & >>> .EtmTitle-wrap .text {
    border: none;
  }
  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .receiver, .inf, .guardian {
    @include c_text_color();
    font-size: 14px;
  }
  .receiver {
    ul {
      padding: 0 24px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 46px;
        border-bottom: 1px solid;
        @include bc_divide_color();
        i {
          font-size: 14px;
        }
      }
    }
  }
  .inf, .guardian {
    ul {
      padding: 0 24px;
      li {
        line-height: 34px;
      }
    }
  }
}
</style>
