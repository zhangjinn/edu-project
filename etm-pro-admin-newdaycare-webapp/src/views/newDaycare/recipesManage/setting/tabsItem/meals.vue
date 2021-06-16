<template>
  <div class="callWrap">
    <div class="wrapList">
      <etm-title
        border
        show-toggle
        open-text=""
        close-text=""
        @toggle="toggle($event, 'standard')"
      >
        标准餐次
      </etm-title>
      <item-template
        v-show="showStandard"
        :data.sync="defaultDragData"
        :no-slot="['color', 'number', 'enable']"
        btn-text="添加新类型"
        @add="addItem('STANDARD')"
        @blur="updateNew($event, 'STANDARD')"
        @change="handleChange($event, 'STANDARD')"
        @delete="deleteItem($event, 'STANDARD')"
        @focus="handleFocus($event, 'STANDARD')"
      />
    </div>
    <div class="wrapList">
      <etm-title
        border
        show-toggle
        open-text=""
        close-text=""
        @toggle="toggle($event, 'baby')"
      >
        乳儿餐次
      </etm-title>
      <item-template
        v-show="showBaby"
        :data.sync="dragData"
        :no-slot="['color', 'number', 'enable']"
        btn-text="添加新类型"
        @add="addItem('SUCKLING')"
        @blur="updateNew($event, 'SUCKLING')"
        @change="handleChange($event, 'SUCKLING')"
        @delete="deleteItem($event, 'SUCKLING')"
        @focus="handleFocus($event, 'SUCKLING')"
      />
    </div>
  </div>
</template>
<script>
import itemTemplate from '@/views/newDaycare/recipesManage/components/itemTemplate'

import {
  createDaycareMeal,
  queryDaycareMealsList,
  removeDaycareMeal,
  sortDaycareMeal,
  updateDaycareMeal
} from '@/api/newDaycare/recipesManage'

export default {
  components: {
    itemTemplate
  },
  data () {
    return {
      defaultDragData: [],
      dragData: [],
      oldText: '',
      showStandard: true,
      showBaby: true
    }
  },
  created () {
    this.getData()
  },
  methods: {
    toggle (t, type) {
      if (type === 'standard') {
        this.showStandard = t
      } else {
        this.showBaby = t
      }
    },
    getData () {
      this.dragData = []
      this.defaultDragData = []

      queryDaycareMealsList().then(res => {
        res.data.forEach(v => {
          if (v.mealsType === 'STANDARD') {
            this.defaultDragData.push({
              mealsType: v.mealsType,
              text: v.timeQuantumName,
              id: v.timeQuantumId,
              edit: v.edit,
              move: v.edit
              // enable: v.enable
            })
          } else {
            this.dragData.push({
              mealsType: v.mealsType,
              text: v.timeQuantumName,
              id: v.timeQuantumId,
              edit: v.edit,
              move: v.edit
              // enable: v.enable
            })
          }
        })
      })
    },
    handleChange (mealsType) {
      const ids = []
      const target = this.getTarget(mealsType)
      target.forEach((v, i) => {
        ids.push(v.id)
      })
      sortDaycareMeal(ids).then(res => {
        this.$message.success('操作成功')
      }).catch(err => {
        console.log(err)
      })
    },
    addItem (mealsType) {
      switch (mealsType) {
        case 'STANDARD' :
          this.defaultDragData.push({
            text: '',
            id: '',
            mealsType: 'STANDARD',
            edit: true,
            move: true
          })
          break
        case 'SUCKLING' :
          this.dragData.push({
            text: '',
            id: '',
            mealsType: 'SUCKLING',
            edit: true,
            move: true
          })
          break
      }
    },
    deleteItem (e, mealsType) {
      const target = this.getTarget(mealsType)
      if (!target[e[0].index].id) {
        target.splice(e[0].index, 1)
        return
      }
      removeDaycareMeal(target[e[0].index].id).then(res => {
        target.splice(e[0].index, 1)
        this.$message.success('删除成功')
      }).catch(err => {
        console.log(err)
      })
    },
    updateNew (index, mealsType) {
      const target = this.getTarget(mealsType)[index]
      // console.log('target', target)
      if (target.text === this.oldText) return
      const data = {
        timeQuantumName: target.text,
        mealsType: target.mealsType
        // enable: target.enable
      }
      if (target.id) {
        // 存在id，修改
        updateDaycareMeal({ ...data, timeQuantumId: target.id }).then(() => {
          this.$message.success('修改成功')
        })
      } else {
        // 不存在id，新增
        createDaycareMeal(data).then(res => {
          const result = res.data
          target.id = result.timeQuantumId
          this.$message.success('新增成功')
        })
      }
    },
    handleFocus (index, mealsType) {
      const target = this.getTarget(mealsType)[index]
      this.oldText = target.text
    },
    getTarget (mealsType) {
      let target
      switch (mealsType) {
        case 'STANDARD' :
          target = this.defaultDragData
          break
        case 'SUCKLING' :
          target = this.dragData
          break
      }
      return target
    }
    // handleEnable(index) {
    //   this.updateNew(index)
    // }
  }
}
</script>
<style lang="scss" scoped>
.callWrap {
  width: 564px;

  .wrapList {
    &:not(:first-child) {
      margin-top: 16px;
    }

    ::v-deep .box {
      &.bdb {
        padding-bottom: 8px;
      }
    }
  }
}
</style>
