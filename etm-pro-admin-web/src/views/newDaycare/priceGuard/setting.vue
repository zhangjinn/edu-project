<template>
  <div class="setting-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
            <el-tab-pane label="费用类型" name="price">
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
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * setting create by Administrator
 * createTime 2021/1/15 13:55
 */
import itemTemplate from '@/views/newDaycare/childManage/components/itemTemplate'
import { getMaterialType, postMaterialType, putMaterialType, delMaterialType, putMaterialTypeSort } from '@/api/newDaycare/priceGuard'
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
      tabsValue: 'price',
      dragData: [],
      oldText: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    // this.getData()
  },
  mounted() {
  },
  methods: {
    getData() {
      this.dragData = []
      const param = {
        enable: null,
        type: 'price'
      }
      getMaterialType(param).then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.materialTypeName,
            // editable: v.canDelete,
            id: v.materialTypeId
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    handleChange() {
      const idList = {
        ids: []
      }
      const ids = []
      this.dragData.forEach(v => {
        ids.push(v.id)
      })
      idList.ids = ids
      putMaterialTypeSort(idList).then(res => {
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
      delMaterialType(this.dragData[e[0].index].id).then(res => {
        this.dragData.splice(e[0].index, 1)
      }).catch(err => {
        console.error(err)
      })
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (target.text === this.oldText) return // 字段内容没有改变，则不调用接口保存
      const data = {
        enable: null,
        materialTypeName: target.text,
        type: 'price'
      }
      if (target.id) {
        // 存在id，修改
        const id = target.id
        putMaterialType(data, id).then(res => {
          const result = res.data
          target.id = result.id
        }).catch(err => {
          console.error(err)
        })
      } else {
        // 不存在id，新增
        postMaterialType(data).then(res => {
          const result = res.data
          target.id = result.materialTypeId
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
<style lang="scss" scoped>
.setting-wrap {
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
