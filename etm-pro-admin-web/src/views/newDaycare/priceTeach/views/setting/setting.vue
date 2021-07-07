<template>
  <div class="setting-wrap">
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
/**
 * setting create by Administrator
 * createTime 2020/08/31 18:04
 */
import itemTemplate from '@/views/newDaycare/childManage/components/itemTemplate'
import {
  queryMaterialType,
  updateMaterialType,
  removeMaterialType,
  updateMaterialTypeSort
} from '@/api/newDaycare/materialPriceManage'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'Setting',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      dragDataCache: [],
      dragData: [
        {
          text: '教材',
          editable: true
        },
        {
          text: '玩具',
          editable: true
        },
        {
          text: '礼品',
          materialTypeId: 4,
          materialTypeName: '毛磊'
        }
      ],
      oldText: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      this.dragData = []
      queryMaterialType().then(res => {
        // console.log(res.data)
        res.data.forEach(v => {
          this.dragData.push({
            text: v.materialTypeName,
            id: v.materialTypeId
          })
        })
        this.dragDataCache = deepClone(this.dragData)
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      // console.log(ids)
      updateMaterialTypeSort({ ids }).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    deleteItem(e) {
      if (!this.dragData[e[0].index].text) return this.dragData.splice(e[0].index, 1)
      removeMaterialType(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    handleFocus(index) {
      this.oldText = this.dragData[index].text
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      if (!target.text) return this.$message.warning('称呼不能为空')
      const data = {
        materialTypeName: target.text
      }
      if (target.id) {
        // 存在id，修改
        data.id = target.id
      }
      updateMaterialType(data).then(res => {
        const result = res.data
        target.id = result.materialTypeId
        target.move = true
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
        if (target.id) {
          this.dragData[index].text = this.dragDataCache[index].text
        } else {
          this.dragData.pop()
        }
      })
    },
    addItem() {
      const data = this.dragData
      if (data.length > 0 && !data[data.length - 1].text) {
        return this.$message.warning('请先填写前一项的内容')
      }
      data.push({
        text: '',
        editable: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-wrap {

}
</style>
