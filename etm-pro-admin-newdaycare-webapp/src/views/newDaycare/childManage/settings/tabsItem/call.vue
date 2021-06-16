<template>
  <div class="callWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新称呼"
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
import { getChildCallList, deleteChildCall, updateChildCall, sortChildCall } from '@/api/newDaycare/childManageSettings'
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
          text: '妈妈',
          editable: false
        },
        {
          text: '爸爸',
          editable: false
        },
        {
          text: '爷爷',
          editable: false
        },
        {
          text: '奶奶',
          editable: false
        },
        {
          text: '外公',
          editable: false
        },
        {
          text: '外婆',
          editable: false
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
      getChildCallList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.relationshipName,
            editable: v.canDelete,
            id: v.relationshipId
          })

          this.dragDataCache = deepClone(this.dragData)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      sortChildCall(ids).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem () {
      const data = this.dragData
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        text: '',
        move: false
      })
    },
    deleteItem (e) {
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      deleteChildCall(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('称呼不能为空')
      const data = {
        relationshipName: target.text
      }
      if (target.id) {
        // 存在id，修改
        data.id = target.id
      }
      updateChildCall(data).then(res => {
        const result = res.data
        target.id = result.relationshipId
        target.move = true
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
