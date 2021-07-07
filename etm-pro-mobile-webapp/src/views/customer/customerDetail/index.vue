<template>
  <div class="customerDetail">
    <customer-detail-card :customer-id="customerId" @contact="getContact" />
    <div class="detailBottom">
      <div class="btnBox">
        <van-row>
          <van-col :span="6">
            <div class="operate" @click="toFollow">
              <div class="iconBox">
                <span class="iconfont iconedit-outline" />
              </div>
              <div class="txt">写跟进</div>
            </div>
          </van-col>
          <van-col :span="6">
            <div class="operate" @click="wakeCall('phone')">
              <div class="iconBox">
                <span class="iconfont iconphone" />
              </div>
              <div class="txt">打电话</div>
            </div>
          </van-col>
          <van-col :span="6">
            <div class="operate" @click="wakeCall('msg')">
              <div class="iconBox">
                <span class="iconfont iconmessage" />
              </div>
              <div class="txt">发短信</div>
            </div>
          </van-col>
          <van-col :span="6">
            <div class="operate" @click="showMoreAction">
              <div class="iconBox">
                <span class="iconfont iconmore" />
              </div>
              <div class="txt">更多</div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <van-action-sheet
      v-model="showMore"
      :actions="actions"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @select="actionConfirm"
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
import customerDetailCard from '../components/customerDetailCard'
import { abandonCustomer, delCustomer } from '../../../service/customer/customer'
import { judgeAuth } from '../../../utils/permiss'

export default {
  name: 'CustomerDetail',
  components: {
    customerDetailCard
  },
  data() {
    return {
      customerId: '',
      showMore: false,
      actions: [
        {
          name: '分配客户',
          path: '/customerAssign',
          authId: 'customer.crm.assign'
        },
        {
          name: '放弃客户',
          authId: 'customer.crm.assign'
        },
        {
          name: '删除客户',
          authId: 'customer.crm.remove'
        }
      ],
      showContact: false,
      contactType: null,
      contactList: []
    }
  },
  created() {
    this.customerId = parseInt(this.$route.query.customerId)
  },
  mounted() {
    this.actions = this.actions.filter(item => {
      return judgeAuth(item.authId)
    })
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.onCancel, false)// false阻止默认事件
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.onCancel, false)// false阻止默认事件
  },
  methods: {
    showMoreAction() {
      this.showMore = true
    },
    getContact(val) {
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
    actionConfirm(item) {
      this.showMore = false
      if (item.name === '放弃客户') {
        this.$dialog.confirm({
          title: '确认放弃客户？',
          message: '被放弃的客户进入客户公海池',
          confirmButtonColor: '#F53939',
          cancelButtonColor: '#666666'
        }).then(() => {
          this.customerAbandon()
        }).catch(() => {
          // onCancel
        })
      } else if (item.name === '删除客户') {
        this.$dialog.confirm({
          title: '确认删除客户？',
          message: '删除操作不可撤回',
          confirmButtonColor: '#F53939',
          cancelButtonColor: '#666666'
        }).then(() => {
          this.customerDelete()
        }).catch(() => {
          // onCancel
        })
      } else {
        const customerId = this.customerId.toString()
        this.$router.push({
          path: item.path,
          query: {
            customerId: customerId
          }
        })
      }
    },
    customerAbandon() {
      const param = {
        customerIds: []
      }
      param.customerIds.push(this.customerId)
      abandonCustomer(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '放弃客户成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.$router.replace({
            path: '/customerList'
          })
        }, 1000)
      })
    },
    customerDelete() {
      delCustomer(this.customerId).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '删除客户成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.$router.replace({
            path: '/customerList'
          })
        }, 1000)
      })
    },
    toFollow() {
      this.$router.push({
        path: '/followEdit',
        query: {
          customerId: this.customerId
        }
      })
    },
    onCancel() {
      this.$router.replace({
        path: '/customerList'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../assets/style/mixin';

    .customerDetail {
        .detailBottom {
            @include wh(100%, 80px);

            .btnBox {
                position: fixed;
                bottom: 50px;
                left: 0;
                padding: 10px 0;
                @include wh(100%, 80px);
                @include linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 1) 30%);

                .operate {
                    display: inline-block;

                    .iconBox {
                        @include round(40px);
                        color: $white;
                        line-height: 40px;
                        background-color: $theme;
                    }

                    .txt {
                        margin-top: 3px;
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>
