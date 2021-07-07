<template>
  <div class="allocationList">
    <div class="Info">
      <div class="left">批次号：{{ batchCode }}</div>
      <div class="right">
        <span>共</span>
        <span class="count">{{ list.length }}</span>
        <span>人</span>
      </div>
    </div>
    <div class="listTop textLeft">
      <van-row>
        <van-col :span="6">
          客户姓名
        </van-col>
        <van-col :span="8">
          分配前跟进人
        </van-col>
        <van-col :span="10">
          分配后跟进人
        </van-col>
      </van-row>
    </div>
    <div class="listBox">
      <div v-for="(item,index) in list" :key="index" class="list textRight">
        <van-row>
          <van-col :span="6">
            <div class="van-ellipsis textLeft percent">{{ item.customerName }}</div>
          </van-col>
          <van-col :span="8">
            <div v-if="item.lastAssignEmployee" class="van-ellipsis textLeft percent">{{
              item.lastAssignEmployee }}
            </div>
            <div v-else class="labelColor textLeft">无数据</div>
          </van-col>
          <van-col :span="10">
            <div class="van-ellipsis textLeft">{{ item.currentAssignEmployee }}</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getBatchInfo } from '../../../service/customer/customer'

export default {
  name: 'AllocationList',
  data() {
    return {
      batchCode: '',
      list: []
    }
  },
  created() {
    this.batchId = this.$route.query.batchId
    // 根据批次id获取批次详情
    this.getBatchInfoById()
  },
  methods: {
    async getBatchInfoById() {
      const res = await getBatchInfo(this.batchId)
      this.list = res.data.data
      this.list.forEach((val) => {
        this.batchCode = val.batchCode
        if (val.lastAssignEmployee && val.lastAssignEmployee.indexOf(',')) {
          val.lastAssignEmployee = val.lastAssignEmployee.replace(/,/g, '/')
          if (val.lastAssignEmployee.lastIndexOf('/') === (val.lastAssignEmployee.length - 1)) {
            val.lastAssignEmployee = val.lastAssignEmployee.substring(0, val.lastAssignEmployee.length - 1)
          }
        }
        if (val.currentAssignEmployee && val.currentAssignEmployee.indexOf(',')) {
          val.currentAssignEmployee = val.currentAssignEmployee.replace(/,/g, '/')
          if (val.currentAssignEmployee.lastIndexOf('/') === (val.currentAssignEmployee.length - 1)) {
            val.currentAssignEmployee = val.currentAssignEmployee.substring(0, val.currentAssignEmployee.length - 1)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .allocationList {
        .Info {
            padding: 0 12px;
            height: 60px;
            color: $black;
            font-size: 14px;
            line-height: 60px;
            background-color: $white;
            overflow: hidden;

            .count {
                margin: 0 2px;
                color: $theme;
            }
        }

        .listTop {
            padding: 0 12px;
            height: 45px;
            line-height: 45px;
            color: $text-6;
            font-size: 14px;
        }

        .listBox {
            min-height: calc(100vh - 155px);
            background-color: $white;

            .list {
                padding: 12px;
                font-size: 13px;

                &:nth-child(even) {
                    font-size: 14px;
                    background-color: $fbColor;
                }

                .percent {
                    max-width: 70%;
                }
            }
        }
    }

</style>
