<template>
  <div class="nurseWrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs
            ref="tabs"
            v-model="tabsValue"
            tab-position="left"
            :show-toggle="false"
          >
            <el-tab-pane
              label="会员卡类型"
              name="setting"
            >
              <item-template
                :data.sync="dragData"
                btn-text="添加新类型"
                :no-slot="['number']"
                @change="handleChange"
                @add="addItem"
                @delete="deleteItem"
                @focus="handleFocus"
                @blur="updateNew"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>
<script>

import itemTemplate from '@/views/newDaycare/courseManage/settings/itemTemplate'
// import { queryDaycareGenerationList, createDaycareGenerationTwo, updateDaycareGenerationTwo, sortDaycareGeneration, removeDaycareGeneration } from '@/api/daycare/recipesManage'
import {
  queryCardSetting,
  createCardSetting,
  updateCardSetting,
  createCradSort,
  removeCardSetting
} from '@/api/newDaycare/contract'
import { deepClone } from '@/views/newDaycare/contract/common'
export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      dragDataCache: [],
      tabsValue: 'setting',
      dragData: [
        {
          text: '',
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
      queryCardSetting().then(res => {
        res.data.forEach(v => {
          this.dragData.push({
            text: v.membershipCardTypeName,
            id: v.membershipCardTypeId
            // number: v.price,
            // editable: v.edit
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
      createCradSort(ids).then(res => {
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
        move: false
      })
    },
    deleteItem ([{ index }]) {
      if (this.dragData[index] && !this.dragData[index].text) return this.dragData.splice(index, 1)
      removeCardSetting(this.dragData[index].id).then(res => {
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
      if (target.id) {
        // 存在id，修改
        updateCardSetting({
          membershipCardTypeName: target.text,
          membershipCardTypeId: target.id
        }).then(res => {
          this.$message.success('操作成功')
        }).catch(err => {
          this.dragData[index].text = this.dragDataCache[index].text
          console.log(err)
        })
      } else {
        // 不存在id，新增
        if (!target.text) return
        createCardSetting({
          membershipCardTypeName: target.text
        }).then(res => {
          const result = res.data
          target.id = result.membershipCardTypeId
          target.move = true
          this.$message.success('操作成功')
        }).catch(err => {
          this.dragData.pop()
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding-bottom: 16px;
}
</style>
