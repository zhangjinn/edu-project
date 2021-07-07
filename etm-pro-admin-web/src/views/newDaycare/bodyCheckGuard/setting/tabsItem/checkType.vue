<template>
  <div class="checkType">
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
import {
  queryCheckTypeList,
  createCheckTypeListItem,
  updateCheckTypeListItem,
  removeCheckTypeListItem,
  updateCheckTypeListSort
} from '@/api/newDaycare/bodyCheckGuard'
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
      queryCheckTypeList().then(res => {
        Array.isArray(res.data) && res.data.forEach((v, i) => {
          this.dragData.push({
            text: v.checkSubjectName,
            id: v.checkSubjectId
          })
        })
        if (this.dragData.length) {
          this.dragData[0].editable = false
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      updateCheckTypeListSort({ ids }).then(res => {
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
      removeCheckTypeListItem({ checkSubjectId: this.dragData[e[0].index].id }).then(res => {
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
        p = updateCheckTypeListItem({
          checkSubjectId: target.id,
          checkSubjectName: target.text
        })
      } else {
        // 不存在id，新增
        p = createCheckTypeListItem({ checkSubjectName: target.text })
      }
      p.then(res => {
        const result = res.data
        target.id = result.checkSubjectId
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
.checkType {

}
</style>
