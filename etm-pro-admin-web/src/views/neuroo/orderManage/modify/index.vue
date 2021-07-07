<template>
  <div class="modify">
    <etm-layout-split>
      <etm-title>修改订单</etm-title>
      <div class="tableArea">
        <order ref="order" :content="orderData" />
      </div>
      <div class="bottomBtns">
        <el-button type="primary" :disabled="disabled" @click.stop="handleSubmit">保存</el-button>
        <el-button plain @click.stop="handleCancel">取消</el-button>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>
import order from './order'
import { getOrderDetail, modifyOrder } from '@/api/neuroo/orderManage'
import transferDate from '@/utils/date'
export default {
  components: {
    order
  },
  data() {
    return {
      orderData: null
    }
  },
  computed: {
    id() {
      return localStorage.getItem('orderManageNeuroo_currentId')
    }
  },
  created() {
    getOrderDetail(this.id).then(res => {
      res.data.startDate = +res.data.startDate
      res.data.endDate = +res.data.endDate
      this.orderData = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    handleSubmit() {
      this.$refs.order.$refs.orderForm.$children[0].validate(validate => {
        if (validate) {
          const data = this.$refs.order.orderForm
          delete data.customerName
          delete data.orderNo
          data.startDate = transferDate(data.startDate).time
          data.endDate = transferDate(data.endDate).time
          modifyOrder({ id: this.id, data }).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleCancel()
          }).catch(err => {
            console.log(err)
            this.handleCancel()
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('jump', 'manage')
    }
  }
}
</script>

<style scoped lang="scss">
.modify {
  position: relative;
  //@include bgc_white();
  /*height: calc(100vh - 150px);*/
  /*padding-bottom: 68px;*/
  /*.tableArea {*/
    /*height: calc(100vh - 288px);*/
    /*overflow-y: auto;*/
    /*.basic, .status {*/
      /*height: 100%!important;*/
    /*}*/
  /*}*/
  .bottomBtns {
    display: flex;
    align-items: center;
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    height: 68px;
    padding-left: 316px;
    margin: 0 -16px;
    box-shadow:0px -4px 6px 0px rgba(34,34,34,0.04);
    .el-button+.el-button {
      margin-left: 16px!important;
    }
  }
}
</style>
