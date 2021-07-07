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
import { getMaterialType, postMaterialType, putMaterialType, delMaterialType, putMaterialTypeSort } from '@/api/guardcare/edu/materialPriceManage'
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
      const param = {
        enable: null,
        type: 'material'
      }
      getMaterialType(param).then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.materialTypeName,
            // editable: v.canDelete,
            id: v.materialTypeId
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const idList = {
        ids: []
      }
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      idList.ids = ids
      putMaterialTypeSort(idList).then(res => {
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
        text: ''
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      delMaterialType(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      const data = {
        enable: null,
        materialTypeName: target.text,
        type: 'material'
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        putMaterialType(data, id).then(res => {
          const result = res.data
          target.id = result.id
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        postMaterialType(data).then(res => {
          const result = res.data
          target.id = result.materialTypeId
          this.handleChange()
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
