<template>
  <div class="labelWrap">
    <item-template
      :data.sync="dragData"
      btn-text="添加新标签"
      @change="handleChange"
      @add="addItem"
      @delete="deleteItem"
      @focus="handleFocus"
      @blur="updateNew"
      @colorChange="colorChange"
    />
  </div>
</template>
<script>
import itemTemplate from '../../components/itemTemplate'
import { getChildTag, deleteChildTag, addChildTag, updateChildTag, sortChildTag } from '@/api/newDaycare/childManageSettings'
import { deepClone } from '@/views/newDaycare/contract/common'
export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragDataCache: [],
      dragData: [
        {
          text: '新客户',
          color: null,
          editable: false
        },
        {
          text: '意向客户',
          color: null
        },
        {
          text: '试听客户',
          color: null
        }
      ],
      oldText: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.dragData = []
      getChildTag().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.tagName,
            color: v.colorCode,
            id: v.tagId,
            editable: v.canDelete
          })
        })
        this.dragDataCache = deepClone(
          this.dragData
        )
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      sortChildTag(ids).then(res => {
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
        color: 'rgb(255, 69, 0)',
        move: false
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      deleteChildTag(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    colorChange([index, color]) {
      const target = this.dragData[index]

      if (target.text) {
        updateChildTag({
          tagId: target.id,
          data: {
            tagName: target.text,
            colorCode: target.color
          }
        }).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('标签内容不能为空')
      if (target.id) {
        // 存在id，修改
        updateChildTag({
          tagId: target.id,
          data: {
            tagName: target.text,
            colorCode: target.color
          }
        }).then(res => {
          this.$message.success('修改成功')
        }).catch(err => {
          console.log(err)
          this.dragData[index].text = this.dragDataCache[index].text
        })
      } else {
        // 不存在id，新增
        addChildTag({
          tagName: target.text,
          colorCode: target.color
        }).then(res => {
          const result = res.data
          target.id = result.tagId
          target.move = true
          this.$message.success('新增成功')
        }).catch(err => {
          console.log(err)
          this.dragData.pop()
        })
      }
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
    }
  }
}
</script>

<style scoped lang="scss">
.labelWrap {

}
</style>
