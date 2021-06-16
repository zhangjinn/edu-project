<template>
  <div class="importanceWrap">
    <!--    不插入color插槽-->
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
import itemTemplate from '@/views/standardcare/listFeatures/clazzManage/settings/itemTemplate'
import { createClazzType, queryClazzTypeList, removeClazzType, updateClazzType, updateSort } from '@/api/standardcare/clazzManage'

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
    this.init()
  },
  methods: {
    init () {
      this.dragData = []
      queryClazzTypeList().then(res => {
        res.data.forEach(item => {
          this.dragData.push({
            text: item.name,
            id: item.id,
            deletable: item.deletable
          })
        })
      })
    },
    handleChange () {
      const idList = []
      this.dragData.forEach(v => {
        idList.push(v.id)
      })
      updateSort({ idList }).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.error(err)
      })
    },
    addItem () {
      const data = this.dragData
      if (data.length > 0 && !data[data.length - 1].text) {
        return this.$message.warning('请先填写前一项的内容')
      }
      data.push({
        text: '',
        editable: true
      })
    },
    deleteItem (e) {
      console.log(e, '我是e')
      console.log(this.dragData[e[0].index].text, 'text')
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      removeClazzType({ clazzTypeId: this.dragData[e[0].index].id }).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew (index) {
      const target = this.dragData[index]
      // console.log(target.text === this.oldText)
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('类型不能为空')
      const data = {
        checkSettingsName: target.text
      }
      if (target.id) {
        // 存在id，修改
        data.id = target.id
      }
      if (data.id) {
        updateClazzType({
          clazzTypeId: data.id,
          sort: index,
          clazzTypeName: target.text
        }).then(res => {
          console.log(res.data, 'updateRes')
          this.$message.success('操作成功')
        })
      } else {
        createClazzType({
          clazzTypeName: target.text,
          sort: this.dragData.length
        }).then(res => {
          const result = res.data
          target.id = result.id
          target.move = true
          console.log(res, '我是新增')
          this.$message.success('操作成功')
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
