<template>
  <div class="infoHideSetting">
    <item-template
      :data.sync="dragData"
      :no-slot="['color', 'handle', 'delete']"
      :has-slot="['switch']"
      @change="handleChange"
      @switch="handleSwitch"
    />
  </div>
</template>

<script>
import itemTemplate from './itemTemplate'
import {
  queryInfoHideSettingList,
  updateInfoHideSettingItem,
  createInfoHideSettingItem
} from '@/api/customerSettings'
import { deepClone } from '@/views/listCustomer/myCustomer/common'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      types: {
        CUSTOMER_NAME: '客户名称',
        CONTACT_NAME: '联系人名称',
        CONTACT_TELEPHONE: '联系人电话'
      },
      reverseTypes: {
        客户名称: 'CUSTOMER_NAME',
        联系人名称: 'CONTACT_NAME',
        联系人电话: 'CONTACT_TELEPHONE'
      },
      dragDataCache: [],
      dragData: [],
      oldText: '',
      value: true
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.dragData = []
      queryInfoHideSettingList().then(res => {
        const { data } = res
        Array.isArray(data) && data.forEach(v => {
          this.dragData.push({
            text: this.types[v.rule],
            id: v.id,
            editable: false,
            switch: v.enable
          })
        })
        this.dragDataCache = deepClone(this.dragData)
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      // TODO: 调用接口处理排序
      // sortChildCall(ids).then(res => {
      //   this.$message.success('操作成功')
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    addItem () {
      const data = this.dragData
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        text: '',
        move: false
      })
    },
    deleteItem (e) {
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      // TODO: 调用接口删除
      // deleteChildCall(this.dragData[e[0].index].id).then(res => {
      //   this.dragData.splice(e[0].index, 1)
      //   this.$message.success('操作成功')
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    handleSwitch (index) {
      const target = this.dragData[index]
      if (target.id) {
        updateInfoHideSettingItem({
          id: target.id, enable: target.switch, rule: this.reverseTypes[target.text]
        }).then(res => {
          this.$message.success('操作成功')
        }).catch(err => {
          console.log(err)
        })
      } else {
        createInfoHideSettingItem({
          enable: target.switch,
          rule: this.reverseTypes[target.text]
        }).then(res => {
          this.getData()
        })
      }
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('字段内容不能为空')
      if (target.id) {
        updateInfoHideSettingItem({
          id: target.id,
          enable: target.switch,
          rule: this.reverseTypes[target.text]
        })
      } else {
        createInfoHideSettingItem({
          enable: target.switch,
          rule: this.reverseTypes[target.text]
        }).then(res => {
          this.getData()
        })
      }
    },
    handleFocus (index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style>

</style>
