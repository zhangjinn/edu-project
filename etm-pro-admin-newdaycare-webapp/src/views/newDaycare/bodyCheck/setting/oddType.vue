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
      dragData: [
        {
          text: '红眼病'
        },
        {
          text: '头痛'
        },
        {
          text: '皮炎'
        }
      ],
      oldText: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.dragData = []
      queryBodyCheckSetting({ type: 'COMMON_TYPES_OF_SYMPTOMS' }).then(res => {
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
      this.dragData.push({
        text: ''
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
        type: 'COMMON_TYPES_OF_SYMPTOMS'
      }).then(res => {
        const result = res.data
        target.id = result.checkSettingsId
        target.move = true
        this.$message.success('操作成功')
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
