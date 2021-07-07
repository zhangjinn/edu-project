<template>
  <div class="nurseWrap">
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
import { queryNurseCourseTypeList, createNurseCourseType, updateNurseCourseType, sortNurseCourseType, removeNurseCourseType } from '@/api/newDaycare/courseManage'
export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragData: [
        {
          text: '全日托',
          unit: '单价',
          modify: true,
          number: 500.00
        },
        {
          text: '半日托',
          unit: '单价',
          number: 500.00
        }
      ],
      oldText: '',
      oldNumber: '0'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.dragData = []
      queryNurseCourseTypeList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.caeCourseTypeName,
            id: v.caeCourseTypeId,
            number: v.price,
            editable: v.modify,
            unit: '单价'
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      sortNurseCourseType(ids).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem() {
      const data = this.dragData
      if (data[data.length - 1] && !data[data.length - 1].text) return this.$message.warning('请先填写前一项的内容')
      data.push({
        text: '',
        unit: '单价',
        number: '0',
        move: false
      })
    },
    deleteItem([{ index }]) {
      if (this.dragData[index] && !this.dragData[index].text) return this.dragData.splice(index, 1)
      removeNurseCourseType(this.dragData[index].id).then(res => {
        this.dragData.splice(index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    handleFocus(e) {
      const { index, type } = e
      if (type === 'input') {
        this.oldText = this.dragData[index].text
      }
      if (type === 'number') {
        this.oldNumber = this.dragData[index].number
      }
    },
    updateNew(e) {
      const { index, type } = e
      const target = this.dragData[index]
      if (type === 'input' && target.text === this.oldText) return
      if (type === 'number' && target.number === this.oldNumber) return
      if (target.id) {
        // 存在id，修改
        updateNurseCourseType(target.id, {
          caeCourseTypeName: target.text,
          price: target.number
        }).then(res => {
          this.$message.success('操作成功')
        }).catch(err => {
          console.log(err)
        })
      } else {
        // 不存在id，新增
        if (!target.text) return
        createNurseCourseType({
          caeCourseTypeName: target.text,
          price: target.number
        }).then(res => {
          const result = res.data
          target.id = result.caeCourseTypeId
          target.move = true
          this.$message.success('操作成功')
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
