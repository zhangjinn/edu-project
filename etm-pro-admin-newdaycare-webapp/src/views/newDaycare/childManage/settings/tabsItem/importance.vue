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
import itemTemplate from '../../components/itemTemplate'
import { getChildAttrList, deleteChildAttr, updateChildAttr, sortChildAttr } from '@/api/newDaycare/childManageSettings'
import { deepClone } from '@/views/newDaycare/contract/common'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragDataCache: [],
      dragData: [
        {
          text: '重要'
        },
        {
          text: '很重要'
        },
        {
          text: '非常重要'
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
      getChildAttrList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.option,
            editable: v.canDelete,
            id: v.childAttributeId,
            name: v.name
          })
        })
        this.dragDataCache = deepClone(
          this.dragData
        )
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      sortChildAttr(ids).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem () {
      this.dragData.push({
        text: ''
      })
    },
    deleteItem (e) {
      deleteChildAttr(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      const data = {
        option: target.text,
        name: 'IMPORTANCE'
      }
      if (target.id) {
        // 存在id，修改
        data.id = target.id
      }
      updateChildAttr(data).then(res => {
        const result = res.data
        target.id = result.childAttributeId
        target.name = result.name
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
        if (target.id) {
          // 存在id，修改
          this.dragData[index].text = this.dragDataCache[index].text
        } else {
          this.dragData.pop()
        }
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
