<template>
  <div class="setWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-selector ref="time" />
      <radio-list title="状态" :list-data="state" :value.sync="stateValue" />
      <radio-list title="颜色" :list-data="color" :value.sync="colorValue" />
      <radio-list title="排便量" :list-data="quantity" :value.sync="quantityValue" />
      <radio-list title="屁屁状态" :list-data="buttState" :value.sync="buttStateValue" />
      <radio-list title="更换尿布" :list-data="change" :value.sync="changeValue" />
      <remark ref="remark" />
    </div>
    <bottom-btns @save="handleSave" @cancel="handleCancel" />
  </div>
</template>

<script>
import itemCard from '../components/itemCard'
import timeSelector from '../components/timeSelector'
import radioList from '../components/radioList'
import remark from '../components/remark'
import bottomBtns from '../components/bottomBtns'
import { addStoolRecord, getEnumByName } from '../../../../service/sacc/stoolRecord'
import { uploadFile } from '../../../../service/upload'
import transferDate from '../../../../js/date'

export default {
  components: {
    itemCard,
    timeSelector,
    radioList,
    remark,
    bottomBtns
  },
  data() {
    return {
      itemData: {
        name: '栗子',
        age: '1岁三个月'
      },
      state: [],
      stateValue: '',
      color: [],
      colorValue: '',
      quantity: [],
      quantityValue: '',
      buttState: [],
      buttStateValue: '',
      change: [],
      changeValue: false,
      customerId: undefined,
      addressArray: []
    }
  },
  computed: {
    today() {
      const now = transferDate()
      return `${now.year}-${now.month}-${now.date}`
    }
  },
  created() {
    // 获取单选的选项列表
    this.getOptions()

    const { name, age, avatar, customerId, isLeave } = this.$route.query
    this.customerId = customerId
    this.itemData = {
      name,
      age,
      avatar,
      customerId,
      isLeave
    }
  },
  methods: {
    handleSave() {
      if (this.stateValue && this.colorValue && this.quantityValue && this.buttStateValue) {
        // 先上传图片
        const promiseArr = []
        if (this.$refs.remark.uploader.length) {
          // 需要上传图片
          this.$refs.remark.uploader.forEach(file => {
            promiseArr.push(uploadFile(file.file, 'sacc/stoolRecord/set', 'image'))
            this.addressArray.push({
              name: file.file.name
            })
          })
          Promise.all(promiseArr).then(res => {
            // 上传图片成功后，再提交保存内容
            res.forEach((data, index) => {
              this.addressArray[index].url = data.data.key
            })
            this.uploadRecord()
          })
        } else {
          // 不需要上传图片
          this.addressArray = []
          this.uploadRecord()
        }
      } else {
        this.$toast({
          message: '请完整填写便便信息',
          icon: 'icon iconfont iconwarning'
        })
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    uploadRecord() {
      addStoolRecord({
        stoolColour: this.colorValue,
        buttStatus: this.buttStateValue,
        stoolTime: `${this.today} ${this.$refs.time.showTime}:00`,
        customerId: this.customerId,
        stoolStatus: this.stateValue,
        stoolQuantity: this.quantityValue,
        addressArray: this.addressArray,
        diaperChange: this.changeValue,
        remarks: this.$refs.remark.$refs.text.value
      }).then(res => {
        this.$toast({
          message: '操作成功',
          duration: 1000,
          icon: 'icon iconfont iconsuccess'
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      })
    },
    getOptions() {
      const promiseArr = []
      const menus = ['StoolStatus', 'StoolColour', 'StoolQuantity', 'ButtStatus']
      const names = ['state', 'color', 'quantity', 'buttState']
      menus.forEach(v => {
        promiseArr.push(getEnumByName(v))
      })
      Promise.all(promiseArr).then(res => {
        res.forEach((item, index) => {
          this[names[index]] = item.data.data
        })
      })
      this.change = [
        {
          name: '无',
          value: false
        },
        {
          name: '有',
          value: true
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .setWrap {
        height: calc(100vh - 50px);
        background-color: $white;

        .wrap {
            height: calc(100vh - 122px);
            overflow-y: auto;

            &::after {
                content: '';
                display: block;
                height: 61px;
            }
        }
    }
</style>
