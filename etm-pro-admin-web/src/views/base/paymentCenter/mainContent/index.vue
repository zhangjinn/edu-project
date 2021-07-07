<template>
  <div class="paymentCenterContent">
    <etm-layout-split :left-styles="{minWidth:'300px'}">
      <template slot="left">
        <div class="leftContent">
          <div class="department">
            {{ basicInfo.companyName }}
          </div>
          <etm-title :border="false">账户信息</etm-title>
          <etm-field-label type="left" label="剩余通话时长"> {{ basicInfo.callTime }}分钟</etm-field-label>
          <etm-field-label type="left" label="剩余短信条数"> {{ basicInfo.messageNum }}条</etm-field-label>
          <etm-field-label type="left" label="剩余云盘容量"> {{ basicInfo.remainingSpace }}</etm-field-label>
          <etm-title :border="false">基础信息</etm-title>
          <etm-field-label type="left" label="企业名称"> {{ basicInfo.companyName }}</etm-field-label>
          <etm-field-label type="left" label="负责人"> {{ basicInfo.principal }}</etm-field-label>
          <etm-field-label type="left" label="手机号"> {{ basicInfo.phoneNumber }}</etm-field-label>
          <etm-field-label type="left" label="地址"> {{ basicInfo.address }}</etm-field-label>
        </div>
      </template>
      <template slot="right">
        <recharge-record :org="basicInfo.companyName" />
      </template>
    </etm-layout-split>
  </div>
</template>

<script>
import rechargeRecord from '../components/rechargeRecord'
import { getAccount } from '@/api/customer'
import { getEnterpriseCurrent, queryAreaInfoByAreaId } from '@/api/base/base'

export default {
  name: 'Index',
  components: {
    rechargeRecord
  },
  data() {
    return {
      basicInfo: {
        callTime: null,
        companyName: null,
        principal: null,
        phoneNumber: null,
        address: null,
        remainingSpace: ''
      }
    }
  },
  created() {
    this.getEnterpriseCurrentData()
    this.getAccountData()
  },
  methods: {

    getAccountData() {
      getAccount().then((res) => {
        const { data } = res
        this.basicInfo.callTime = Math.floor(data.callTime / 60)
        this.basicInfo.messageNum = data.messageNum
        this.basicInfo.remainingSpace = data.remainingSpace
      })
    },
    getEnterpriseCurrentData() {
      getEnterpriseCurrent().then((res) => {
        const { data } = res
        this.basicInfo.companyName = data.name
        this.basicInfo.principal = data.principalName
        this.basicInfo.phoneNumber = data.principalTelephone
        this.basicInfo.remainingSpace = data.remainingSpace
        if (data.areaCode) {
          const param = {
            areaId: data.areaCode
          }
          queryAreaInfoByAreaId(param).then(res => {
            const { provinceName, cityName, countyName } = res.data
            const address = provinceName + cityName + countyName + (data.address || '')
            this.basicInfo.address = address
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.paymentCenterContent {
  .leftContent {
    .department {
      padding: 8px 0 24px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      @include c_title_color();
    }
  }
}
</style>
