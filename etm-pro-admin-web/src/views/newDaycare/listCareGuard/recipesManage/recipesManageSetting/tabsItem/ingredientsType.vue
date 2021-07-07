<template>
  <div class="callWrap">
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
import {
  queryIngredientsType,
  addIngredientsType,
  updateIngredientsType,
  removeIngredientsType,
  updateIngredientsTypeSort
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
      queryIngredientsType().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.name,
            id: v.id,
            editable: !v.defaultItem
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const foodTypeSortIndexList = {
        foodTypeSortIndexList: []
      }
      const ids = []
      this.dragData.forEach((v, index) => {
        if (v.editable) {
          ids.push({
            id: v.id,
            sortIndex: index
          })
        }
      })
      foodTypeSortIndexList.foodTypeSortIndexList = ids
      updateIngredientsTypeSort(foodTypeSortIndexList).then(res => {
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
      this.dragData.push({
        text: '',
        editable: true
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      removeIngredientsType({ foodIngredientsTypeId: this.dragData[e[0].index].id }).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew(index) {
      const target = this.dragData[index]

      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      const data = {
        enable: true,
        name: target.text
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        data.foodIngredientsTypeId = id
        updateIngredientsType(data).then(res => {
          const result = res.data
          target.id = result.id
          this.$message.success('修改成功')
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        addIngredientsType(data).then(res => {
          const result = res.data
          target.id = result.id
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

<style scoped>
</style>
