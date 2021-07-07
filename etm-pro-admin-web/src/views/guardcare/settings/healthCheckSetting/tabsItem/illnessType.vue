<template>
  <div class="illnessType">
    <item-template
      :data.sync="dragData"
      btn-text="添加新类型"
      :no-slot="['color', 'unit']"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
    />
  </div>
</template>
<script>
import itemTemplate from '../../../../newDaycare/childManage/components/itemTemplate'
import { queryCheckItemList, createCheckItem, updateCheckItem, removeCheckItem, sortCheckItemList } from '@/api/guardcare/careManage/healthCheck'
export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragData: [],
      oldText: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.dragData = []
      queryCheckItemList().then(res => {
        Array.isArray(res.data) && res.data.forEach((v, i) => {
          this.dragData.push({
            text: v.checkProjectName,
            id: v.checkProjectId
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      sortCheckItemList(ids).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem() {
      const data = this.dragData
      if (data.length) {
        if (data[data.length - 1] && !data[data.length - 1].text) {
          return this.$message.warning('请先填写前一项的内容')
        }
      }
      data.push({
        text: '',
        move: false
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].text) {
        return this.dragData.splice(e[0].index, 1)
      }
      removeCheckItem(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('检查类型内容不能为空')
      let p
      if (target.id) {
        // 存在id，修改
        p = updateCheckItem({
          checkProjectId: target.id,
          checkProjectName: target.text
        })
      } else {
        // 不存在id，新增
        p = createCheckItem(target.text)
      }
      p.then(res => {
        const result = res.data
        target.id = result.checkProjectId
        target.move = true
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style scoped>
.illnessType {

}
</style>
