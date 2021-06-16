<template>
  <div class="callWrap">
    <item-template
      :data.sync="dragData"
      :no-slot="['color', 'input', 'enable']"
      btn-text="添加新类型"
      @add="addItem"
      @blur="updateNew"
      @change="handleChange"
      @delete="deleteItem"
    />
  </div>
</template>
<script>
import itemTemplate from '@/views/newDaycare/recipesManage/components/itemTemplate'

import {
  createDaycareGeneration,
  queryDaycareGenerationList,
  removeDaycareGeneration,
  sortDaycareGeneration,
  updateDaycareGeneration
} from '@/api/newDaycare/recipesManage'

export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.dragData = []

      queryDaycareGenerationList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            generationName: v.generationName,
            generationId: v.generationId,
            edit: v.edit,
            move: v.edit,
            id: v.generationId,
            sort: v.sort
          })
        })
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach((v, i) => {
        ids.push(v.id)
      })
      console.log(ids)
      sortDaycareGeneration(ids).then(res => {
        this.$message.success('操作成功')
      })
    },
    addItem () {
      this.dragData.push({
        generationName: '',
        generationId: '',
        id: '',
        edit: true
      })
    },
    deleteItem (e) {
      if (!this.dragData[e[0].index].edit) return
      if (!this.dragData[e[0].index].id) {
        this.dragData.splice(e[0].index, 1)
        return
      }
      removeDaycareGeneration(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (!target.generationName) return // 字段内容没有改变，则不调用接口保存
      const data = {
        generationName: target.generationName
      }
      if (target.id) {
        // 存在id，修改
        updateDaycareGeneration({ ...data, generationId: target.id }).then(() => {
          this.$message.success('修改成功')
        })
      } else {
        // 不存在id，新增
        createDaycareGeneration(data).then(res => {
          const result = res.data
          target.id = result.generationId
          this.$message.success('新增成功')
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
