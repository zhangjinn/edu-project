<template>
  <div class="callWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加标签"
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
  queryLabelList,
  addLabelType,
  updateLabelType,
  removeLabelType,
  updateLabelSort
} from '@/api/standardcare/listFeatures/scheduleManage'
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
      queryLabelList().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.name,
            id: v.id
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange () {
      const ids = []
      this.dragData.forEach((v, index) => {
        if (v.id) {
          ids.push(v.id)
        }
      })
      updateLabelSort({
        idList: ids
      }).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem () {
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
    deleteItem (e) {
      if (!this.dragData[e[0].index].id) {
        return this.dragData.splice(e[0].index, 1)
      }
      removeLabelType({
        scheduleLabelId: this.dragData[e[0].index].id
      }).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]

      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      const data = {
        scheduleLabelName: target.text,
        sort: index
      }
      if (target.id) {
        // 存在id，修改
        data.scheduleLabelId = target.id
        updateLabelType(data).then(res => {
          const result = res.data
          target.id = result.id
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        addLabelType(data).then(res => {
          const result = res.data
          target.id = result.id
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

<style scoped>
</style>
