<template>
  <div class="labelWrap">
    <item-template
      :data.sync="dragData"
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
import itemTemplate from '@/views/newDaycare/childManage/components/itemTemplate'
import {
  getFoodType,
  delFoodType,
  postFoodType,
  putFoodType,
  putFoodTypeSort
} from '@/api/newDaycare/recipesGuardManage'
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
      getFoodType().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.foodTypeName,
            color: v.color,
            id: v.foodTypeId,
            editable: !v.defaultItem

          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const idList = {
        foodTypeSortIndexList: []
      }
      const foodTypeSortIndexList = []
      this.dragData.forEach((v, i) => {
        foodTypeSortIndexList.push({
          id: v.id,
          sortIndex: i
        })
      })
      idList.foodTypeSortIndexList = foodTypeSortIndexList

      putFoodTypeSort(idList).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem() {
      const data = this.dragData
      if (data.length) {
        if (data[data.length - 1] && (!data[data.length - 1].text || !data[data.length - 1].color)) {
          return this.$message.warning('请先填写前一项的内容')
        }
      }
      data.push({
        text: '',
        color: '',
        move: false
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      delFoodType(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    colorChange([index, color]) {
      // console.log('color:')
      // console.log(color)
      this.updateNew(index)
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('类型内容不能为空')
      if (!target.color) return this.$message.warning('类型颜色不能为空')
      if (target.id) {
        // 存在id，修改
        const param = {
          foodTypeName: target.text,
          color: target.color
        }
        const foodTypeId = target.id
        putFoodType(param, foodTypeId).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        postFoodType({
          foodTypeName: target.text,
          color: target.color
        }).then(res => {
          const result = res.data
          target.id = result.foodTypeId
          target.move = true
          this.$message.success('新增成功')
        }).catch(err => {
          console.error(err)
        })
      }
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style scoped lang="scss">
.labelWrap {

}
</style>
