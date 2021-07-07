<template>
  <div class="labelWrap">
    <item-template
      :data.sync="dragData"
      :no-slot="['number','enable']"
      btn-text="添加新标签"
      @add="addItem"
      @blur="updateNew"
      @change="handleChange"
      @colorChange="colorChange"
      @delete="deleteItem"
      @focus="handleFocus"
    />
  </div>
</template>
<script>
import itemTemplate from '@/views/newDaycare/recipesManage/components/itemTemplate'
import {
  createDaycareFoodType,
  queryDaycareFoodTypeList,
  removeDaycareFoodType,
  sortDaycareFoodType,
  updateDaycareFoodType
} from '@/api/newDaycare/recipesManage'

export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragData: [],
      oldText: '',
      oldColor: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.dragData = []
      queryDaycareFoodTypeList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.foodTypeName,
            color: v.color,
            edit: v.edit,
            move: v.edit,
            id: v.foodTypeId
          })
        })
      })
    },
    handleChange() {
      const ids = []

      this.dragData.forEach(v => {
        ids.push(v.id)
      })

      sortDaycareFoodType(ids).then(() => {
        this.$message.success('操作成功')
      })
    },
    addItem() {
      const data = this.dragData
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        text: '',
        // color: 'rgb(255, 255, 255)',
        color: '',
        move: false,
        edit: true
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].edit) return
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      removeDaycareFoodType(this.dragData[e[0].index].id).then(() => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    colorChange([index]) {
      this.updateNew(index)
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText && target.color === this.oldColor) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('类型内容不能为空')
      if (!target.color) return this.$message.warning('类型颜色不能为空')
      if (target.id) {
        // 存在id，修改
        updateDaycareFoodType({
          foodTypeName: target.text,
          color: target.color,
          foodTypeId: target.id
        }).then(() => {
          this.$message.success('修改成功')
        })
      } else {
        // 不存在id，新增
        createDaycareFoodType({
          foodTypeName: target.text,
          color: target.color
        }).then(res => {
          const result = res.data
          target.id = result.foodTypeId
          target.move = true
          this.$message.success('新增成功')
        })
      }
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
      this.oldColor = this.dragData[index].color
    }
  }
}
</script>

<style lang="scss" scoped>
.labelWrap {

}
</style>
