<template>
  <div class="earlyWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新类型"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
    />
  </div>
</template>
<script>
import itemTemplate from './itemTemplate'
import { queryEarlyCourseTypeList, createEarlyCourseType, updateEarlyCourseType, sortEarlyCourseType, removeEarlyCourseType } from '@/api/newDaycare/courseManage'
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
          text: '英语',
          unit: '单价',
          number: 500.00
        },
        {
          text: '兴趣班',
          unit: '单价',
          number: 500.00
        },
        {
          text: '活动课',
          unit: '单价',
          number: 500.00
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
      queryEarlyCourseTypeList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.teCourseTypeName,
            id: v.teCourseTypeId,
            number: v.price,
            unit: '单价'
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
      sortEarlyCourseType(ids).then(res => {
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
        unit: '单价',
        number: '0',
        move: false
      })
    },
    deleteItem ([{ index }]) {
      if (this.dragData[index] && !this.dragData[index].id) return this.dragData.splice(index, 1)
      removeEarlyCourseType(this.dragData[index].id).then(res => {
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
      if (target.text === '') {
        return
      }
      if (type === 'input' && target.text === this.oldText) {
        return
      }
      if (type === 'number' && target.number === this.oldNumber) {
        return
      }
      if (target.id) {
        // 存在id，修改
        updateEarlyCourseType(target.id, {
          teCourseTypeName: target.text,
          price: target.number
        }).then(res => {
          this.$message.success('操作成功')
        }).catch(err => {
          this.dragData[index].text = this.dragDataCache[index].text
          console.log(err)
        })
      } else {
        // 不存在id，新增
        if (!target.text) return
        createEarlyCourseType({
          teCourseTypeName: target.text,
          price: target.number
        }).then(res => {
          const result = res.data
          target.id = result.teCourseTypeId
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
