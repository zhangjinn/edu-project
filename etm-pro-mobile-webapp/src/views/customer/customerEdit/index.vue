<template>
  <div class="customerEdit">
    <div class="container textLeft">
      <div class="formList">
        <customer-basic-form
          ref="form"
          :customer-id="customerId"
          :form-list="formList"
          :post-data="postData"
          :require-complete="requireComplete"
          @requireField="confirmField"
          @changImg="getUserImg"
          @tagEditOn="openTag"
          @showMarket="confirmMarket"
        />
      </div>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="cancel">
          <control-btn text="取消" type="cancel" />
        </div>
        <div class="btn" @click="save">
          <control-btn text="保存" type="primary" />
        </div>
      </div>
    </div>
    <template v-if="showTag">
      <tag-edit :tag-list="formList.mark" @tagEditOn="openTag" @tagEditList="confirmTag" />
    </template>
  </div>
</template>

<script>
import customerBasicForm from './components/customerBasicForm'
import controlBtn from '../../../components/common/controlBtn'
import { postCustomer, putCustomer } from '../../../service/customer/customer'
import { uploadFile } from '../../../service/upload'
import tagEdit from '../components/tagEdit'
import { judgePhone } from '../../../js/rules'

export default {
  name: 'CustomerEdit',
  components: {
    customerBasicForm,
    controlBtn,
    tagEdit
  },
  data() {
    return {
      customerId: '',
      showTag: false,
      formList: {
        mark: [],
        contactDTOList: [
          {
            contactId: null,
            contact_name: null,
            contact_telephone: null,
            contact_relationship: null
          }
        ],
        avatarFile: null
      },
      postData: {
        customFields: [],
        contacts: []
      },
      requireComplete: [],
      requireData: [],
      requireTxt: [],
      inputField: [],
      showMarket: false
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    if (this.$route.query.customerId) {
      this.customerId = parseInt(this.$route.query.customerId)
    } else {
      this.customerId = 0
    }
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
  beforeDestroy() {
    window.removeEventListener('popstate', this.backChange, false)// false阻止默认事件
  },
  methods: {
    getUserImg(data) {
      this.formList.avatar = data
      this.formList = Object.assign({}, this.formList)
    },
    cancel() {
      if (this.customerId) {
        this.$router.replace({
          path: '/customerDetail',
          query: {
            customerId: this.customerId
          }
        })
      } else {
        this.$router.replace({
          path: '/customerList'
        })
      }
    },
    openTag(val) {
      this.showTag = val
    },
    confirmTag(val) {
      this.formList.mark = val
      const arr = []
      val.forEach(item => {
        arr.push(item.name)
      })
      for (let i = 0; i < this.postData.customFields.length; i++) {
        if (this.postData.customFields[i].key === 'mark') {
          this.postData.customFields[i].value = arr.join(',')
          break
        }
      }
      if (val && val.length) {
        this.requireComplete.push('mark')
      } else {
        const index = this.requireComplete.indexOf('mark')
        if (index !== -1) {
          this.requireComplete.splice(index, 1)
        }
      }
    },
    confirmField(val, inputField) {
      this.requireData = val
      this.inputField = inputField
    },
    getPostContacts(data) {
      const arr = []
      for (let i = 0; i < data.length; i++) {
        const itemObj = {
          contactId: data[i].contactId,
          customFields: []
        }
        for (const v in data[i]) {
          if (v !== 'contactId') {
            const obj = {
              key: v,
              value: data[i][v]
            }
            itemObj.customFields.push(obj)
          }
        }
        arr.push(itemObj)
      }
      return arr
    },
    save() {
      for (let i = 0; i < this.inputField.length; i++) {
        if (this.formList[this.inputField[i].key]) {
          if (this.requireComplete.indexOf(this.inputField[i].key) === -1) {
            this.requireComplete.push(this.inputField[i].key)
          }
          for (let v = 0; v < this.postData.customFields.length; v++) {
            if (this.postData.customFields[v].key === this.inputField[i].key) {
              this.postData.customFields[v].value = this.formList[this.inputField[i].key]
            }
          }
        }
      }
      this.postData.contacts = this.getPostContacts(this.formList.contactDTOList)
      this.requireTxt = []

      for (let n = 0; n < this.requireData.length; n++) {
        let flag = false
        for (let m = 0; m < this.requireComplete.length; m++) {
          if (this.requireComplete[m] === this.requireData[n].key) {
            flag = true
          }
        }
        if (!flag) {
          this.requireTxt.push(this.requireData[n].name)
        }
      }
      if (this.requireTxt.indexOf('联系人称呼') !== -1 &&
                    this.formList.contactDTOList[0].contact_name &&
                    this.formList.contactDTOList[0].contact_telephone &&
                    this.formList.contactDTOList[0].contact_relationship) {
        this.requireTxt.splice(this.requireTxt.indexOf('联系人称呼'), 1)
      }

      if (!this.requireTxt.length) {
        for (let v = 0; v < this.formList.contactDTOList.length; v++) {
          if (!judgePhone(this.formList.contactDTOList[v].contact_telephone)) {
            this.$toast({
              icon: 'icon iconfont iconwarning',
              message: '联系人电话号码格式不正确',
              duration: 1000
            })
            return
          }
        }
        if (this.formList.avatarFile) {
          uploadFile(this.formList.avatarFile, 'customer/customer/customerAdd', 'image').then(res => {
            for (let i = 0; i < this.postData.customFields.length; i++) {
              if (this.postData.customFields[i].key === 'avatar') {
                this.postData.customFields[i].value = res.data.key
                break
              }
            }
            if (this.customerId) {
              this.reviseCostomer()
            } else {
              this.addCustomer()
            }
          })
        } else {
          if (this.customerId) {
            this.reviseCostomer()
          } else {
            this.addCustomer()
          }
        }
      } else {
        const str = '请完善' + (this.requireTxt[0] === '联系人称呼' ? '联系人信息' : this.requireTxt[0])
        this.$toast({
          message: str,
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      }
    },
    // 新增客户
    addCustomer() {
      postCustomer(this.postData).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '添加客户成功',
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
    // 修改客户
    reviseCostomer() {
      putCustomer(this.customerId, this.postData).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '修改客户成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.$router.replace({
            path: '/customerDetail',
            query: {
              customerId: this.customerId
            }
          })
        }, 1000)
      })
    },
    confirmMarket(val) {
      if (val) {
        this.showMarket = true
      } else {
        this.showMarket = false
      }
    },
    backChange() {
      if (this.showMarket) {
        this.$refs.form.confirmMarket()
      } else if (this.showTag) {
        this.showTag = false
      } else {
        if (this.customerId) {
          this.$router.replace({
            path: '/customerDetail',
            query: {
              customerId: this.customerId
            }
          })
        } else {
          this.$router.replace({
            path: '/customerList'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .customerEdit {

        .container {
            padding-bottom: 12px;
        }
    }
</style>
