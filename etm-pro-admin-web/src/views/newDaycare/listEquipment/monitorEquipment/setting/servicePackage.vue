<template>
  <div class="labelWrap">
    <item-template
      :data.sync="dragData"
      :filter="true"
      :package-option="packageOption"
      :slot-arr="['handle', 'delete', 'drag']"
      add-btn-text="新增套餐"
      class="itemTemplage"
      @add="addItem"
      @blur="updateNew"
      @focus="handleFocus"
      @change="updateNew"
      @delete="deleteItem"
      @dragChange="handleChange"
      @enable="handleEnable"
    />
  </div>
</template>
<script>
import itemTemplate from '../components/itemTemplate'
import {
  queryPackageList,
  queryServiceType,
  createPackage,
  updatePackage,
  removePackage,
  sortPackage
} from '@/api/newDaycare/monitorEquipment'

export default {
  components: {
    itemTemplate
  },
  data() {
    return {
      dragData: [],
      oldSellMoney: '',
      oldDiscountMoney: '',
      packageOption: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      queryPackageList({}).then(res => {
        // console.log('设置', res)
        const { data } = res
        this.dragData = data.map(target => {
          return {
            sellMoney: target.sellMoney,
            discountMoney: target.discountMoney,
            enable: target.enable,
            sort: target.sort,
            typeId: target.typeId,
            id: target.cameraServicePackageId
          }
        }) || []
      })
      queryServiceType().then(res => {
        // console.log('设置', res)
        const { data } = res
        this.packageOption = data || []
      })
    },
    handleChange() {
      const ids = []
      this.dragData.forEach((v, i) => {
        ids.push(v.id)
      })
      console.log(ids)
      sortPackage(ids).then(res => {
        this.$message.success('操作成功')
      })
    },
    handleEnable(index) {
      const target = this.dragData[index]
      if (target.enable) {
        this.$etmTip.init({
          type: 'warn',
          title: `确认开启？`,
          content: `开启后，家长即可按此价格购买云视频服务`,
          confirmBtn: '确定',
          cancelBtn: '取消',
          cancel: () => {
            this.$etmTip.close()
          },
          confirm: () => {
            this.$etmTip.close()
            this.updateNew(index)
          }
        })
      } else {
        this.$etmTip.init({
          type: 'error',
          title: `确认关闭？`,
          content: `关闭后，家长将不能按此价格购买云视频服务`,
          confirmBtn: '确定',
          cancelBtn: '取消',
          cancel: () => {
            this.$etmTip.close()
          },
          confirm: () => {
            this.$etmTip.close()
            this.updateNew(index)
          }
        })
      }
      this.$etmTip.open()
    },
    addItem() {
      this.dragData.push({
        sellMoney: '',
        discountMoney: '',
        enable: false,
        typeId: ''
      })
    },
    deleteItem(index) {
      if (!this.dragData[index].id) {
        this.dragData.splice(index, 1)
        return
      }
      removePackage(this.dragData[index].id).then(res => {
        this.$message.success('删除成功')
        this.dragData.splice(index, 1)
      })
    },
    updateNew(index) {
      const target = this.dragData[index]
      console.log('updateNew', this.dragData[index])
      if (target.sellMoney === this.oldSellMoney && target.discountMoney === this.oldDiscountMoney) return
      if (!target.typeId) {
        this.$message.warning('请选择套餐时长')
        return
      } // 字段内容没有改变，则不调用接口保存
      if (!target.sellMoney) {
        this.$message.warning('套餐金额不能为空')
        return
      } // 字段内容没有改变，则不调用接口保存
      const data = {
        sellMoney: target.sellMoney,
        discountMoney: target.discountMoney,
        enable: target.enable,
        sort: target.sort,
        typeId: target.typeId
      }
      if (target.id) {
        // 存在id，修改
        updatePackage({ ...data, cameraServicePackageId: target.id }).then(() => {
          this.$message.success('修改成功')
        })
      } else {
        // 不存在id，新增
        createPackage(data).then(res => {
          const result = res.data
          target.id = result.cameraServicePackageId
          this.$message.success('新增成功')
        })
      }
    },
    handleFocus(index) {
      this.oldSellMoney = this.dragData[index].sellMoney
      this.oldDiscountMoney = this.dragData[index].discountMoney
    }
  }
}
</script>

<style lang="scss" scoped>
.labelWrap {
  .itemTemplage /deep/ .dragItem /deep/ .greyWrap {
    @include bgc_bg_color();
    border-radius: 4px;
    height: 48px;
    width: 60%;

    .defaultWrap {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
