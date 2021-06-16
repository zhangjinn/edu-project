<template>
  <div class="followMethod">
    <item-template
      :data.sync="dragData"
      btn-text="添加跟进方式"
      :no-slot="['color', 'handle']"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
    />
  </div>
</template>
<script>
import itemTemplate from './itemTemplate'
import { deepClone } from '@/views/listCustomer/myCustomer/common'
import {
  alterMultiSetting,
  queryMultiSettingList,
  removeMultiSettingItem
} from '@/api/customerSettings'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragDataCache: [],
      dragData: [],
      oldText: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.dragData = []
      queryMultiSettingList({ settingType: 'FOLLOW_WAY' }).then(res => {
        const { options } = res.data
        Array.isArray(options) && options.forEach(v => {
          this.dragData.push({
            text: v.label || '',
            id: v.id,
            editable: !v.init
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
      // sortChildFollowMethod(ids).then(res => {
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
      removeMultiSettingItem({ id: this.dragData[e[0].index].id }).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('跟进方式内容不能为空')
      if (target.id) {
        alterMultiSetting({
          options: {
            id: target.id,
            label: target.text
          },
          settingType: 'FOLLOW_WAY'
        }).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.log(err)
          this.dragData[index].text = this.dragDataCache[index].text
        })
      } else {
        alterMultiSetting({
          options: {
            label: target.text
          },
          settingType: 'FOLLOW_WAY'
        }).then(res => {
          const result = res.data
          target.id = result.id
          target.move = false
          this.$message.success('新增成功')
        }).catch(err => {
          console.log(err)
          this.dragData.pop()
        })
      }
    },
    handleFocus (index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style scoped>
</style>
