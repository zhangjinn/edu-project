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
import itemTemplate from '@/components/itemTemplate/itemTemplate'
import {
  queryFoodTypeList,
  removeFoodType,
  addFoodType,
  updateFoodType,
  updateFoodSort
} from '@/api/standardcare/listFeatures/recipesManage'
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
    this.getData()
  },
  methods: {
    getData () {
      this.dragData = []
      queryFoodTypeList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.name,
            color: v.color,
            id: v.id
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach((v, i) => {
        if (v.id) {
          ids.push({
            id: v.id,
            sortIndex: i
          })
        }
      })

      updateFoodSort({
        foodTypeSortIndexList: ids
      }).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem () {
      const data = this.dragData
      if (data.length) {
        if (data[data.length - 1] && (!data[data.length - 1].text || !data[data.length - 1].color)) {
          return this.$message.warning('请先填写前一项的内容')
        }
      }
      data.push({
        text: '',
        color: ''
      })
    },
    deleteItem (e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      removeFoodType({
        foodTypeId: this.dragData[e[0].index].id
      }).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    colorChange ([index, color]) {
      this.updateNew(index)
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('类型内容不能为空')
      if (!target.color) return this.$message.warning('类型颜色不能为空')
      const param = {
        foodTypeName: target.text,
        color: target.color
      }
      if (target.id) {
        // 存在id，修改
        param.foodTypeId = target.id
        updateFoodType(param).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        addFoodType(param).then(res => {
          const result = res.data
          target.id = result.id
          this.$message.success('新增成功')
        }).catch(err => {
          console.error(err)
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
</style>
