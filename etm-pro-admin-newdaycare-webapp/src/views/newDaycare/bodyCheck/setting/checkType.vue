<template>
  <div class="importanceWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新类型"
      :no-slot="['color']"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
    />
  </div>
</template>
<script>
import itemTemplate from '@/views/newDaycare/childManage/components/itemTemplate'
import { createCheckType, queryBodyCheckSetting, removeCheckType } from '@/api/newDaycare/bodyCheck'

export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragData: [],
      oldText: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.dragData = []
      queryBodyCheckSetting({ type: 'CHECK_TYPE' }).then(res => {
        // console.log(res)
        res.data.forEach(item => {
          this.dragData.push({
            text: item.checkSettingsName,
            id: item.checkSettingsId,
            editable: item.del
          })
        })
        // console.log(this.dragData)
      })
    },
    handleChange () {
    },
    addItem () {
      const data = this.dragData
      if (data.length > 0 && !data[data.length - 1].text) {
        return this.$message.warning('请先填写前一项的内容')
      }
      data.push({
        text: '',
        editable: true
      })
    },
    deleteItem (e) {
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      removeCheckType({ checkSettingsId: this.dragData[e[0].index].id }).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]
      // console.log(target.text === this.oldText)
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('类型不能为空')
      const data = {
        checkSettingsName: target.text
      }
      if (target.id) {
        // 存在id，修改
        data.id = target.id
      }
      createCheckType({
        id: (data.id) || null,
        checkSettingsName: data.checkSettingsName,
        type: 'CHECK_TYPE'
      }).then(res => {
        const result = res.data
        target.id = result.checkSettingsId
        target.move = true
        this.$message.success('操作成功')
        // console.log(target)
      }).catch(err => {
        console.log(err)
      })
    },
    handleFocus (index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style scoped>
</style>
