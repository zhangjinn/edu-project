<template>
  <div class="customerDetail">
    <div class="followUpAvatar">
      <div class="avatar">
        <el-avatar v-if="customerDetailLists.avatar" :size="72" :src="customerDetailLists.avatar" />
        <span v-else style="width:72px; font-size: 72px; color: #C1C4CC;" class="iconfont iconmorentouxiang" />

      </div>
      <span>{{ customerDetailLists.name }}</span>
    </div>
    <div v-if="customerDetailLists.customFields.length>0" class="sampleFileInfo">
      <etm-title :border="false">联系人信息</etm-title>
      <ul class="contactInfo">
        <li v-for="(item,index) in customerDetailLists.contact" :key="index">
          <div v-if="item.customFields.length>=3" class="contactInfoInner">
            <div>{{ item.customFields[0].value }}(<span>{{ item.customFields[1].value }}</span>)</div>
            <div class="contactPhoneInfo">
              <div>{{ item.customFields[2].value }}</div>
              <div class="allMeans">
                <span @click="doCall(item.customFields)"><i class="el-icon-phone-outline" />打电话</span>
                <span @click="popInfoOpen('SEND_MESSAGE', item.customFields, $event)"><i class="el-icon-message" />发短信</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="communicationMode">
        <li><etm-field-label type="left" label="QQ号码">{{ customerDetailLists.qq }}</etm-field-label></li>
        <li><etm-field-label type="left" label="微信号码">{{ customerDetailLists.wechat }}</etm-field-label></li>
      </ul>
      <etm-title :border="false">基础资料</etm-title>
      <ul>
        <li v-for="(item,index) in customerDetailLists.customFields" :key="index">
          <etm-field-label type="left" :label="item.name">{{ item.value }}</etm-field-label>
          <!--          <etm-label>{{ item.name }}</etm-label>{{ item.value }}-->
        </li>
      </ul>
      <ul>
        <li>
          <el-tag
            v-for="tag in customerDetailLists.mark"
            :key="tag"
            :disable-transitions="false"
          >
            {{ tag }}
          </el-tag>
        </li>
      </ul>
    </div>
    <send-message ref="sendMessage" :send-message="sendMessage" @handleMessage="handleMessage" />

  </div>

</template>

<script>
import { getCustomerDetails, postCustomerDoCall } from '@/api/customer'
import SendMessage from './sendMessage'

export default {
  name: 'CustomerDetail',
  components: {
    SendMessage
  },
  props: {
    customerId: { // 当前客户id
      type: Number
    }
  },
  data() {
    return {
      popTitle: '打电话',
      customerDetailLists: {// 客户详情
        name: '',
        avatar: '',
        wechat: '',
        qq: '',
        customFields: [],
        contact: [],
        tag: []

      },
      sendMessage: {
        phone: '',
        childId: this.customerId
      }
    }
  },

  created() {
    this.getCustomerDetailLists()
  },
  methods: {
    handleMessage() {
      this.$emit('handleMessage')
    },
    // 获取客户详情
    getCustomerDetailLists() {
      const customerId = this.customerId
      getCustomerDetails(customerId).then((source) => {
        const customerDetailLists = source.data

        customerDetailLists.customer.forEach((val, index) => {
          if (val.key === 'name') {
            this.customerDetailLists.name = val.value
          } else if (val.key === 'avatar') {
            this.customerDetailLists.avatar = val.value
          } else if (val.key === 'wechat') {
            this.customerDetailLists.wechat = val.value
          } else if (val.key === 'qq') {
            this.customerDetailLists.qq = val.value
          } else if (val.key === 'mark') {
            this.customerDetailLists.mark = val.value === '' ? [] : val.value.split(',')
          } else {
            if (val.key === 'area_code') {
              if (val.value) {
                const obj = JSON.parse(val.value)
                const v = `${obj.provinceName} ${obj.cityName} ${obj.regionName}`
                val.value = v
              }
            }
            if (val.key !== 'contact_relationship' && val.key !== 'contact_name' && val.key !== 'contact_telephone') {
              this.customerDetailLists.customFields.push(val)
            }
          }
        })
        this.customerDetailLists.contact = customerDetailLists.contact
      })
    },
    popInfoOpen(type, item) {
      const phone = []
      const parentName = []

      switch (type) {
        case 'PHONE': {
          // if (this.childInfoDetail.relationshipList.length > 1) {
          //   // this.target = event
          //   this.showCall = true
          // } else {
          //   this.callPhone(this.childInfoDetail.relationshipList[0].telephone, `${this.childInfoDetail.relationshipList[0].parentName}(${this.childInfoDetail.relationshipList[0].relationshipName})`)
          // }
          break
        }
        case 'SEND_MESSAGE':

          // this.childInfoDetail.relationshipList.forEach(cur => {
          //   phone.push(item[1].value)
          //   parentName.push(`${cur.parentName} (${cur.relationshipName})`)
          // })
          phone.push(item[1].value)
          parentName.push(`${item[0].value} (${item[2].value})`)
          this.sendMessage.phone = phone
          this.sendMessage.parentName = parentName
          this.sendMessage.childId = this.customerId
          this.$refs.sendMessage.handleVisible(true)
          break
      }
    },

    // 打电话
    doCall(val) {
      const phone = val[1].value
      const name = val[0].value
      this.$etmTip.init({
        type: 'warn',
        title: `确定要拨打给 ${name} ${phone} 吗？`,
        content: `系统将在您确认拨打电话后自动为您拨号，请留意接听您的手机。`,
        confirmBtn: '拨打',
        cancelBtn: '取消',
        confirm: () => {
          const param = {
            phone: phone,
            customerId: this.customerId
          }
          postCustomerDoCall(param).then((res) => {
            this.$emit('handleCall')
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style lang="scss" scoped>
  .customerDetail{
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .followUpAvatar{
      display: flex;
      flex-direction: column;
      align-items: center;
      .avatar{
        margin-bottom: 16px;
        & /deep/.el-avatar>img{
          width: 100%;
        }

      }
    }
    .sampleFileInfo{
      & /deep/.EtmTitle-wrap{
        font-size: 14px;
      }
      ul {
        list-style-type: none;
        padding:0 24px;
        margin: 0;
        li{
          //margin-bottom: 16px;
          &/deep/ .el-tag{
            height: 34px;
            line-height: 32px;
            margin-right: 8px;
            margin-bottom: 8px;

          }

        }
      }
      .contactInfo{
        li{
          margin-bottom: 0;
          .contactInfoInner{
            margin-bottom: 16px;
            border-bottom: 1px solid $divide-color;
            .contactPhoneInfo{
              display: flex;
              justify-content: space-between;
              padding: 16px 0;
              span{
                @include c_main_color();
                cursor: pointer;
                i{
                  margin-right: 7px;
                }
                &:first-child{
                  padding-right: 16px;
                }
                &:last-child{
                  padding-left: 16px;
                  border-left: 1px solid $divide-color;
                }
              }
            }
          }

        }
      }

    }
  }

</style>
