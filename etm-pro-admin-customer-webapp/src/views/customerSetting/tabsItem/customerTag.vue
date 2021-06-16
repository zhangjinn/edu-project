<template>
  <div class="customerTag">
    <item-template
      :data.sync="dragData"
      :no-slot="['handle']"
      btn-text="添加新标签"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
      @colorChange="colorChange"
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
      queryMultiSettingList({ settingType: 'MARK' }).then(res => {
        const { options } = res.data
        Array.isArray(options) && options.forEach(v => {
          this.dragData.push({
            text: v.label || '',
            color: v.color || 'rgb(255, 255, 255)',
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
      // sortChildTag(ids).then(res => {
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
        color: 'rgb(255, 255, 255)',
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
    colorChange ([index, color]) {
      const target = this.dragData[index]

      if (target.text) {
        alterMultiSetting({
          options: {
            id: target.id,
            label: target.text,
            color: target.color
          },
          settingType: 'MARK'
        }).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('标签内容不能为空')
      if (target.id) {
        alterMultiSetting({
          options: {
            id: target.id,
            label: target.text,
            color: target.color
          },
          settingType: 'MARK'
        }).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.log(err)
          this.dragData[index].text = this.dragDataCache[index].text
        })
      } else {
        alterMultiSetting({
          options: {
            label: target.text,
            color: target.color
          },
          settingType: 'MARK'
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

<style scoped lang="scss">
.customerTag {

}
</style>
