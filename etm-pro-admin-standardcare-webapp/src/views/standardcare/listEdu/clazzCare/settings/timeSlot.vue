<template>
  <div class="nurseWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加年龄段"
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
import itemTemplate from '@/components/itemTemplate/itemTemplate'
import {
  queryDaycareGenerationList,
  createDaycareGenerationTwo,
  updateDaycareGenerationTwo,
  sortDaycareGeneration,
  removeDaycareGeneration
} from '@/api/standardcare/listEdu/clazzCare'
import { deepClone } from './common'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragDataCache: [],
      dragData: [
        {
          text: '全日托',
          modify: true
        }
      ],
      oldText: '',
      oldNumber: '0'
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
            text: v.name,
            id: v.id,
            number: '',
            editable: v.edit
            // unit: '单价'
          })
        })
        this.dragDataCache = deepClone(this.dragData)
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      sortDaycareGeneration(ids).then(res => {
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
        number: '',
        move: false
      })
    },
    deleteItem ([{ index }]) {
      if (this.dragData[index] && !this.dragData[index].text) return this.dragData.splice(index, 1)
      removeDaycareGeneration(this.dragData[index].id).then(res => {
        this.dragData.splice(index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    handleFocus (e) {
      const { index, type } = e
      if (type === 'input') {
        this.oldText = this.dragData[index].text
      }
      if (type === 'number') {
        this.oldNumber = this.dragData[index].number
      }
    },
    updateNew (e) {
      const { index, type } = e
      const target = this.dragData[index]
      if (type === 'input' && target.text === this.oldText) return
      if (type === 'number' && target.number === this.oldNumber) return
      if (/^\s*$/.test(target.text)) {
        return
      }
      if (target.id) {
        // 存在id，修改
        updateDaycareGenerationTwo({
          name: target.text,
          clazzAgeRangeId: target.id
        }).then(res => {
          this.$message.success('操作成功')
        }).catch(err => {
          this.dragData[index].text = this.dragDataCache[index].text
          console.log(err)
        })
      } else {
        // 不存在id，新增
        if (!target.text) return
        createDaycareGenerationTwo({
          name: target.text
        }).then(res => {
          const result = res.data
          target.id = result.id
          target.move = true
          this.$message.success('操作成功')
        }).catch(err => {
          console.log(err)
          this.dragData.pop()
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
