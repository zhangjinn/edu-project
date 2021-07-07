<template>
  <div class="planWrap">
    <el-alert
      title="设置套餐后，需在开启状态家长端才能购买此套餐。"
      type="warning"
      :closable="false"
    />
    <plan-template
      :data.sync="dragData"
      :option-filter="filterArr"
      btn-text="添加套餐"
      @change="handleChange"
      @add="addItem"
      @delete="handleDelete"
      @focus="handleFocus"
      @blur="handleBlur"
      @switch="handleSwitch"
      @select="handleSelect"
    />
  </div>
</template>
<script>
import planTemplate from './components/planTemplate'
import {
  queryServiceList,
  createService,
  removeService,
  updateService,
  updateServiceSort
} from '@/api/guardcare/cloudDeviceManage/monitor'
export default {
  components: {
    planTemplate
  },
  data() {
    return {
      dragData: [],
      filterArr: [] // 记录设置项中已有的时长
    }
  },
  watch: {
    dragData: {
      handler() {
        this.handleFilterArr()
      },
      deep: true
    }
  },
  methods: {
    getListData() { // 获取设置项数据
      this.dragData = []
      queryServiceList({}).then(res => {
        const { data } = res
        data.forEach(v => {
          v.select = v.countMonth + ''
          v.priceI = v.price
          v.priceII = v.discountPrice
          v.switch = v.isEnable
          v.id = v.deviceServiceId
        })
        this.dragData = data
      }).catch(err => {
        this.dragData = []
        console.log(err)
      })
    },
    handleFilterArr() {
      // 根据已有设置项，标识出已有的购买时长
      this.filterArr = []
      this.dragData.forEach(v => {
        this.filterArr.push(v.select)
      })
    },
    handleSelect({ index }) { // 下拉框选择改变
      this.updateNew(index)
    },
    handleChange() { // 排序变化
      const ids = []
      this.dragData.forEach(v => {
        if (v.id) {
          ids.push(v.id)
        }
      })
      updateServiceSort({ ids }).then(res => {
        this.$message.success('操作成功')
        this.getListData()
      }).catch(err => {
        this.getListData()
        console.log(err)
      })
    },
    addItem() { // 点击添加按钮
      if (this.dragData.length) {
        const lastItem = this.dragData[this.dragData.length - 1]
        if (!lastItem.select || !lastItem.priceI) { // 购买时长或售卖金额其一为空
          return this.$message.warning('请先补充完整前一个套餐的内容再新增套餐')
        }
      }
      this.dragData.push({
        select: '',
        priceI: '',
        priceII: '',
        switch: false,
        move: false
      })
    },
    handleDelete([{ index }]) { // 删除设置项
      this.$etmTip.init({
        type: 'warn',
        title: '删除设置项',
        content: '是否删除该设置项？该操作不可撤销',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          this.deleteItem(index)
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    deleteItem(index) {
      const target = this.dragData[index]
      if (target.id) {
        removeService({ deviceServiceId: target.id }).then(res => {
          this.$etmTip.close()
          this.$message.success('删除成功')
          this.getListData()
        }).catch(err => {
          this.$etmTip.close()
          console.log(err)
        })
      } else {
        this.dragData.splice(index, 1)
        this.$etmTip.close()
      }
    },
    handleFocus() { // 输入框聚焦事件
      // console.log('handleFocus', arguments)
    },
    handleBlur({ index, value, type }) { // 输入框失焦事件
      this.dragData[index][type] = value
      this.updateNew(index)
    },
    handleSwitch({ index }) { // 开关变化事件
      this.updateNew(index)
    },
    updateNew(index) {
      const target = this.dragData[index]
      if (!target.select || !target.priceI) return // 套餐时长或售卖金额其一为空则不操作
      if (target.id) {
        // 存在id，修改
        updateService({
          deviceServiceId: target.id,
          countMonth: target.select,
          price: target.priceI,
          discountPrice: target.priceII,
          sort: index,
          isEnable: target.switch
        }).then(res => {
          this.$message.success('修改成功')
          this.getListData()
        }).catch(err => {
          console.log(err)
        })
      } else {
        // 不存在id，新增
        createService({
          countMonth: target.select,
          price: target.priceI,
          discountPrice: target.priceII,
          sort: index,
          isEnable: target.switch
        }).then(res => {
          this.$message.success('新增成功')
          this.getListData()
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.planWrap {
  .el-alert {
    margin-bottom: 16px;
  }
}
</style>
