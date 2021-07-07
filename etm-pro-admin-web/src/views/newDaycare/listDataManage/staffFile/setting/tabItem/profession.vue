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
import itemTemplate from './itemTemplate'
import { queryStaffSettingsList, createSettingTabView, updateSettingTabViews, removeSettingTabViews, updateSorts } from '@/api/newDaycare/staffFile'
// import {
//   putSubjectSettingSort
// } from '@/api/newDaycare/listEduGuardScheduleManage'
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
      queryStaffSettingsList({ type: 'POSITION' }).then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.headquartersSettingName,
            id: v.headquartersSettingId
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach((v, index) => {
        ids.push(v.id)
      })
      updateSorts({ ids }).then(res => {
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
      removeSettingTabViews({ headquartersSettingId: this.dragData[e[0].index].id }).then(res => {
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
        headquartersSettingName: target.text,
        type: 'POSITION'
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        data.headquartersSettingId = id
        updateSettingTabViews(data).then(res => {
          const result = res.data
          target.id = result.id
          this.$message.success('更新成功')
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        createSettingTabView(data).then(res => {
          const result = res.data
          target.id = result.id
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
