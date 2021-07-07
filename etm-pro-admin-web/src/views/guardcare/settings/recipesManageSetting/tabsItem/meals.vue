<template>
  <div class="callWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新类型"
      :no-slot="['color']"
      @focus="handleFocus"
      @blur="updateNew"
      @switch="handleSwitch"
    />
  </div>
</template>
<script>
import itemTemplate from '../components/itemTemplate'
import { getTimeQuantumType, postTimeQuantumType, putTimeQuantumType, delTimeQuantumType, putTimeQuantumTypeSort } from '@/api/guardcare/careManage/recipesManage'
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

      getTimeQuantumType().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.timeQuantumName,
            id: v.timeQuantumId,
            switch: v.enable
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const idList = {
        timeQuantumSortIndexList: []
      }
      const timeQuantumSortIndexList = []
      this.dragData.forEach((v, i) => {
        timeQuantumSortIndexList.push({
          id: v.id,
          sortIndex: i
        })
      })
      idList.timeQuantumSortIndexList = timeQuantumSortIndexList
      putTimeQuantumTypeSort(idList).then(res => {
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
      delTimeQuantumType(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew(index, type) {
      const target = this.dragData[index]

      if (!type) {
        if (!target.text || (target.text === this.oldText)) return // 字段内容没有改变，则不调用接口保存
      }

      const data = {
        timeQuantumName: target.text,
        enable: target.switch
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        putTimeQuantumType(data, id).then(res => {
          const result = res.data
          target.switch = result.enable
          this.$message.success('修改成功')
          // this.getData()
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        postTimeQuantumType(data).then(res => {
          const result = res.data
          target.id = result.timeQuantumId
          this.handleChange()
        }).catch(err => {
          console.error(err)
        })
      }
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
    },
    handleSwitch(index) { // 下拉框选择改变
      this.updateNew(index, 'switch')
    }
  }
}
</script>

<style scoped>
</style>
