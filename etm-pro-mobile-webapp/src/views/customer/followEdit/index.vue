<template>
  <div class="followEdit">
    <div class="topFixed">
      <div class="customerCard">
        <div class="top" />
        <div class="card">
          <div class="cardTop van-hairline--bottom">
            <div class="left">
              <div class="img">
                <img v-if="customerIcon && hasImg" :src="customerIcon" @error="hasImg = false">
                <div v-else class="noImg">{{ subName(customerName) }}</div>
              </div>
            </div>
            <div class="left msg textLeft">
              <div class="name">{{ customerName }}</div>
              <div class="phone">{{ contactPhone }}</div>
            </div>
          </div>
          <div class="cardBottom">
            <van-row>
              <van-col :span="12">
                <div class="call">
                  <div class="operate" @click="wakeCall('phone')">
                    <span class="iconfont iconphone" />
                    <span>打电话</span>
                  </div>
                </div>
              </van-col>
              <van-col :span="12">
                <div class="sendMessage">
                  <div class="operate" @click="wakeCall('msg')">
                    <span class="iconfont iconmessage" />
                    <span>发短信</span>
                  </div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="rightOperate" @click="showDetail">
            <span class="angle" />
            <span>查看详情</span>
            <span class="iconfont iconright" />
          </div>
        </div>
      </div>
    </div>
    <div class="formList">
      <follow-edit-form
        :form-list="formList"
        :follow-data="followData"
        :customer-id="customerId"
        :require-complete="requireComplete"
        @tagEditOn="openTag"
        @requireField="makeRequire"
      />
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="cancel">
          <control-btn text="取消" type="cancel" />
        </div>
        <div class="btn" @click="save(0)">
          <control-btn text="保存" />
        </div>
        <div class="btn" @click="nextCustomer">
          <control-btn
            text="下一位/保存"
            type="primary"
            :disabled="(customerIds.length - 1) === customerIndex ? 'disabled' : ''"
          />
        </div>
      </div>
    </div>
    <div v-if="customerDetail" class="customerDetail">
      <div class="overlay" @click="closeDetail" />
      <div class="detailBox">
        <customer-detail-card :customer-id="customerId" type="followEdit" />
        <div v-show="hidshow" class="bottomFixed">
          <div class="bottomBtn van-hairline--top">
            <div class="btn" @click="closeDetail">
              <control-btn text="我知道了" type="primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <tag-edit
      v-if="editTagOn"
      :tag-list="formList.tag"
      @tagEditOn="openTag"
      @tagEditList="tagConfirm"
    />
    <van-action-sheet
      v-model="showContact"
      :actions="contactList"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @select="contactConfirm"
    />
  </div>
</template>

<script>
import controlBtn from '../../../components/common/controlBtn'
import followEditForm from './components/followEditForm'
import customerDetailCard from '../components/customerDetailCard'
import { getCustomerDetail, postFollow } from '../../../service/customer/customer'
import { uploadFile } from '../../../service/upload'
import tagEdit from '../components/tagEdit'

export default {
  name: 'FollowEdit',
  components: {
    controlBtn,
    followEditForm,
    customerDetailCard,
    tagEdit
  },
  data() {
    return {
      source: '',
      formList: {
        tag: [],
        otherField: {},
        follow_content: '',
        follow_img: []
      },
      customerDetail: false,
      editTagOn: false,
      customerIds: [],
      customerIndex: 0,
      customerId: '',
      customer: {},
      customerIcon: '',
      customerName: '',
      contactPhone: '',
      followData: {
        customFields: [],
        customerCustomFields: []
      },
      requireData: [],
      inputFeild: [],
      requireComplete: [],
      requireTxt: [],
      tagId: '',
      contentId: '',
      showContact: false,
      contactType: null,
      contactList: [],
      hasImg: true
    }
  },
  inject: ['reload'],
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    const customerId = this.$route.query.customerId
    this.source = this.$route.query.source
    if (customerId.length > 1) {
      const customerIds = customerId.split(',')
      this.customerIds = customerIds
    } else {
      this.customerIds.push(customerId)
    }
    this.getCustomer()
  },
  mounted() {
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.backChange, false)// false阻止默认事件
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.backChange, false)// false阻止默认事件
  },
  methods: {
    async getCustomer() {
      this.customerId = parseInt(this.customerIds[this.customerIndex])
      const res = await getCustomerDetail(this.customerId)
      const data = res.data.data
      const contact = data.contact
      this.getContact(contact)
      contact[0].customFields.forEach(item => {
        if (item.key === 'contact_telephone') {
          this.contactPhone = item.value
        }
      })
      this.customer = data.customer
      this.customer.forEach(item => {
        if (item.key === 'avatar') {
          this.customerIcon = item.value
        }
        if (item.key === 'name') {
          this.customerName = item.value
        }
        if (item.key === 'important_level' || item.key === 'state' || item.key === 'sales_stage' || item.key === 'mark') {
          if (item.value) {
            this.requireComplete.push(item.key)
            if (item.key === 'mark') {
              const markList = []
              item.value.split(',').forEach(item => {
                const data = {
                  name: item
                }
                markList.push(data)
              })
              this.formList.tag = markList
            } else {
              this.formList[item.key] = item.value
            }
          }
          const data = {
            key: item.key,
            value: item.value
          }
          this.followData.customerCustomFields.push(data)
        }
      })
      this.followData.customerId = this.customerId
    },
    openTag(val) {
      this.editTagOn = val
    },
    tagConfirm(val) {
      this.formList.tag = val
      const arr = []
      val.forEach(item => {
        arr.push(item.name)
      })
      for (let i = 0; i < this.followData.customerCustomFields.length; i++) {
        if (this.followData.customerCustomFields[i].key === 'mark') {
          this.followData.customerCustomFields[i].value = arr.join(',')
          break
        }
      }
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2)
      } else {
        return name
      }
    },
    showDetail() {
      this.customerDetail = true
    },
    closeDetail() {
      this.customerDetail = false
    },
    getContact(val) {
      if (!val) return
      for (let i = 0; i < val.length; i++) {
        let str1 = ''
        let str2 = ''
        let str3 = ''
        val[i].customFields.forEach(item => {
          if (item.key === 'contact_name') {
            str1 = item.value
          } else if (item.key === 'contact_telephone') {
            str2 = item.value
          } else if (item.key === 'contact_relationship') {
            str3 = item.value
          }
        })
        const str = str3 + '-' + str1 + '-' + str2
        const data = {
          name: str,
          phone: str2
        }
        this.contactList.push(data)
      }
    },
    wakeCall(type) {
      if (!this.contactList.length) {
        this.$toast('联系人未录入')
        return
      }
      this.showContact = true
      this.contactType = type
    },
    contactConfirm(val) {
      this.showContact = false
      const a = document.createElement('a')
      if (this.contactType === 'phone') {
        a.href = 'tel:' + val.phone
      } else if (this.contactType === 'msg') {
        a.href = 'sms:' + val.phone
      }
      a.click()
    },
    cancel() {
      if (this.source === 'list') {
        this.$router.replace({
          path: '/customerList'
        })
      } else {
        this.$router.back(-1)
      }
    },
    save(key) {
      if (this.formList.follow_content) {
        for (let i = 0; i < this.followData.customFields.length; i++) {
          if (this.followData.customFields[i].key === 'follow_content') {
            this.followData.customFields[i].value = this.formList.follow_content
            break
          }
        }
        this.requireComplete.push('follow_content')
      }
      this.inputFeild.forEach(item => {
        if (this.formList[item.key]) {
          for (let i = 0; i < this.followData.customFields.length; i++) {
            if (this.followData.customFields[i].key === item.key) {
              this.followData.customFields[i].value = this.formList[item.key]
              break
            }
          }
          this.requireComplete.push(item.key)
        }
      })
      this.requireTxt = []
      for (let i = 0; i < this.requireData.length; i++) {
        let flag = false
        for (let v = 0; v < this.requireComplete.length; v++) {
          if (this.requireComplete[v] === this.requireData[i].key) {
            flag = true
          }
        }
        if (!flag) {
          this.requireTxt.push(this.requireData[i].name)
        }
      }
      if (!this.requireTxt.length) {
        if (this.formList.follow_img.length) {
          this.uploadImg(key)
        } else {
          this.saveFollow(key)
        }
      } else {
        const str = '请完善' + this.requireTxt[0]
        this.$toast({
          message: str,
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      }
    },
    uploadImg(key) {
      let reqNum = 0
      const imageUrl = []
      this.formList.follow_img.forEach(item => {
        uploadFile(item.file, 'customer/follow/followEdit', 'image').then(res => {
          imageUrl.push(res.data.key)
          for (let i = 0; i < this.followData.customFields.length; i++) {
            if (this.followData.customFields[i].key === 'follow_img') {
              this.followData.customFields[i].value = imageUrl.join(',')
              break
            }
          }
          reqNum++
          if (reqNum === this.formList.follow_img.length) {
            this.saveFollow(key)
          }
        })
      })
    },
    saveFollow(key) {
      postFollow(this.followData).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '添加跟进成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          if (key === 0) {
            this.$router.back(-1)
          } else {
            this.toNext()
          }
        }, 1000)
      })
    },
    nextCustomer() {
      if (this.customerIds.length > 1) {
        this.save(1)
      }
    },
    toNext() {
      if (this.customerIndex + 1 < this.customerIds.length) {
        this.customerIds.splice(0, 1)
        const customerIds = this.customerIds.join(',')
        this.$router.replace({
          path: 'followEdit',
          query: {
            customerId: customerIds,
            source: 'list'
          }
        })
        this.reload()
      }
    },
    makeRequire(val, val2) {
      this.requireData = val
      this.inputFeild = val2
    },
    backChange() {
      if (this.source === 'list') {
        this.$router.replace({
          path: '/customerList'
        })
      } else {
        this.$router.back(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .followEdit {
        .topFixed {
            @include wh(100%, 95px);
        }

        .customerCard {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 11;
            @include wh(100%, 95px);

            .top {
                @include wh(100%, 100%);
                background-color: $theme;
            }

            .card {
                position: absolute;
                top: 20px;
                left: 12px;
                right: 12px;
                padding: 0 15px;
                background-color: $white;
                @include border-radius(3px);
                box-shadow: 0px 1px 3.5px 0px rgba(0, 0, 0, 0.05);
                overflow: hidden;

                .cardTop {
                    padding: 15px 0;
                    overflow: hidden;

                    .img {
                        @include round(54px);
                        overflow: hidden;

                        .noImg {
                            @include wh(100%, 100%);
                            color: $white;
                            line-height: 54px;
                            background-color: $theme;
                        }
                    }

                    .msg {
                        margin-left: 15px;

                        .name {
                            font-size: 17px;
                            line-height: 27px;
                        }

                        .phone {
                            font-size: 13px;
                            color: $text-6;
                            line-height: 27px;
                        }
                    }
                }

                .cardBottom {
                    padding: 15px 0;
                    font-size: 15px;

                    .call {
                        position: relative;

                        &::after {
                            display: inline-block;
                            position: absolute;
                            right: 0;
                            top: -2px;
                            content: '';
                            @include wh(1px, 24px);
                            background-color: $text-e;
                        }
                    }

                    .operate {
                        display: inline-block;

                        .iconfont {
                            margin-right: 8px;
                            color: $theme;
                        }
                    }
                }

                .rightOperate {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 10px 6px;
                    font-size: 12px;
                    color: $theme;
                    background-color: $themeLight;

                    .iconright {
                        margin-left: 4px;
                        font-size: 12px;
                    }

                    .angle {
                        position: absolute;
                        left: -18px;
                        top: 0;
                        display: inline-block;
                        width: 0;
                        height: 0;
                        border-color: $themeLight $themeLight $white $white;
                        border-width: 18px 9px 18px 9px;
                        border-style: solid;
                        vertical-align: middle;
                    }
                }
            }
        }

        .formList {
            padding-bottom: 12px;
        }

        .customerDetail {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 50px;
            z-index: 1111;

            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10;
                background-color: rgba(0, 0, 0, 0.7);
            }

            .detailBox {
                position: absolute;
                top: 60px;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 11;
                background-color: $bg-5;
                overflow-y: auto;
            }
        }
    }
</style>
