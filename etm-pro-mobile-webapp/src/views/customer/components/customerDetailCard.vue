<template>
  <div class="customerDetailCard" :class="type">
    <div class="cusTop">
      <div class="top" />
      <div class="listCard">
        <div class="msg" @click="toCustomerEdit">
          <div class="left">
            <div class="img">
              <img v-if="iconUrl && hasImg" :src="iconUrl" @error="hasImg = false">
              <div v-else class="noImg">{{ subName(customerName) }}</div>
            </div>
          </div>
          <div class="left text textLeft">
            <div class="name">{{ customerName }}</div>
            <div class="phone">
              <span class="iconfont iconphone" />
              <span>{{ phone }}</span>
            </div>
            <div class="van-ellipsis address">
              <span class="iconfont iconlocation" />
              <span :class="address ? '' : 'labelColor'">{{ address ? address : '地址未录入' }}</span>
            </div>
          </div>
          <div class="right">
            <span class="iconfont iconright" />
          </div>
        </div>
        <div class="tagBox textLeft">
          <div class="scrollBox">
            <template v-if="tagList&&tagList.length">
              <van-tag
                v-for="(item,index) in tagList"
                :key="index"
                class="tag"
                color="#CFF3F3"
                text-color="#10C2C4"
              >
                {{ item }}
              </van-tag>
            </template>
            <template v-else>
              <div class="noneTag">暂无标签</div>
            </template>
          </div>
          <div class="linear" />
        </div>
      </div>
    </div>
    <div class="cusCenter">
      <van-row>
        <van-col :span="8">
          <div class="text">
            <span class="count">{{ followCount }}</span>
            <span>次</span>
          </div>
          <div class="label">跟进次数</div>
        </van-col>
        <van-col :span="8">
          <div class="van-ellipsis text" :class="stateName ? '' : 'labelColor'">{{
            stateName ? stateName :
            '未录入'
          }}
          </div>
          <div class="label">客户状态</div>
        </van-col>
        <van-col :span="8">
          <div class="text">
            <span class="count">{{ assignCount }}</span>
            <span>次</span>
          </div>
          <div class="label">分配次数</div>
        </van-col>
      </van-row>
    </div>
    <div class="tabsBox">
      <div class="scrollBox">
        <div class="tabsTitle textLeft">跟进记录</div>
        <div class="innerBox">
          <time-axis v-if="followList.length" :data="followList" />
          <no-content v-else message="跟进记录为空" type="none" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFollowList, getCustomerDetail, getAssignCount } from '../../../service/customer/customer'
import { DateFormat } from '../../../js/rules'
import timeAxis from './timeAxis'
import noContent from '../../../components/common/noContent'

export default {
  name: 'CustomerDetailCard',
  components: {
    timeAxis,
    noContent
  },
  props: {
    type: {
      type: String,
      default() {
        return null
      }
    },
    customerId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      followCount: 0,
      adviser: [],
      tabActive: '0',
      customer: {},
      iconUrl: '',
      customerName: '',
      phone: '',
      address: '',
      tagList: [],
      stateName: '',
      assignCount: 0,
      signCount: 0,
      followList: [],
      planList: [],
      signList: [],
      appointmentList: [],
      activityList: [],
      hasImg: true
    }
  },
  created() {
    this.getCustomerInfo()
    // 跟进记录
    this.getFollowData()
  },
  methods: {
    async getCustomerInfo() {
      const res = await getCustomerDetail(this.customerId)
      const customer = res.data.data
      this.customer = customer.customer
      if (customer.contact.length) {
        customer.contact[0].customFields.forEach(item => {
          if (item.key === 'contact_telephone') {
            this.phone = item.value
          }
        })
        this.$emit('contact', customer.contact)
      } else {
        this.phone = '-'
      }
      this.customer.forEach(item => {
        if (item.value) {
          if (item.key === 'avatar') {
            this.iconUrl = item.value
          } else if (item.key === 'name') {
            this.customerName = item.value
          } else if (item.key === 'mark') {
            this.tagList = item.value.split(',')
          } else if (item.key === 'state') {
            this.stateName = item.value
          } else if (item.key === 'address') {
            this.address = item.value
          }
        }
      })
      this.getAssignCount()
    },
    async getAssignCount() {
      const res = await getAssignCount(this.customerId)
      const data = res.data.data
      this.followCount = data.followCount
      this.assignCount = data.assignCount
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2)
      } else {
        return name
      }
    },
    closeDetail() {
      this.$emit('closeDetail', true)
    },

    // 跟进列表
    async getFollowData() {
      const res = await getFollowList(this.customerId)
      const followList = res.data.data
      this.followList = this.setDataList(followList, 'follow')
    },
    // 处理列表数据
    setDataList(data, type) {
      const list = []
      let followTime = ''
      data.forEach(val => {
        const item = {
          date: '',
          records: []
        }
        const record = {}
        record.recordTime = DateFormat(val.createTime, 'MM.dd hh:mm')
        record.id = val.id
        record.customerId = this.customerId
        let time
        if (type === 'follow') {
          val.customFields.forEach(item => {
            if (item.key === 'follow_way') {
              record.title = item.value
            } else if (item.key === 'follow_content') {
              record.text = item.value
            } else if (item.key === 'follow_img') {
              record.pictures = item.value ? item.value.split(',') : []
            }
          })
          record.reporter = val.creator + '   ' + DateFormat(val.followTime, 'hh:mm')
          item.date = DateFormat(val.followTime, 'MM.dd')
          time = DateFormat(val.followTime, 'yyyy-MM-dd')
        } else if (type === 'plan') {
          record.reporter = val.creator + '   ' + DateFormat(val.nextFollowTime, 'hh:mm')
          item.date = DateFormat(val.nextFollowTime, 'MM.dd')
          time = DateFormat(val.nextFollowTime, 'yyyy-MM-dd')
        }
        if (followTime === time) {
          list[list.length - 1].records.push(record)
        } else {
          item.records.push(record)
          list.push(item)
        }
        followTime = time
      })
      return list
    },
    toCustomerEdit() {
      this.$router.replace({
        path: '/customerEdit',
        query: {
          customerId: this.customerId
        }
      })
    }
  }
}
</script>

<style lang="scss">

.customerDetailCard {
  min-height: calc(100vh - 178px);
  background-color: $bg-5;

  .cusTop {
    position: relative;

    .top {
      @include wh(100%, 95px);
      background-color: $theme;
    }

    .listCard {
      position: absolute;
      top: 15px;
      left: 12px;
      right: 12px;
      @include border-radius(3px);
      box-shadow: 0px 3px 10px 0px rgba(40, 40, 40, 0.06);
      overflow: hidden;

      .msg {
        padding: 15px;
        background-color: $white;
        overflow: hidden;

        .img {
          @include round(54px);
          overflow: hidden;

          .noImg {
            @include wh(100%, 100%);
            color: $white;
            line-height: 54px;
            background-color: $theme;
          }
        }

        .text {
          margin-left: 15px;

          .name {
            font-size: 17px;
          }

          .phone, .address {
            margin-top: 10px;
            font-size: 13px;
            color: $text-6;
          }

          .address {
            max-width: 200px;
          }

          .iconfont {
            margin-right: 6px;
            font-size: 13px;
          }
        }

        .right {
          line-height: 74px;

          .iconright {
            font-size: 12px;
            color: $text-b;
          }
        }
      }

      .tagBox {
        position: relative;
        padding: 15px;
        background-color: $fbColor;

        .scrollBox {
          overflow-x: auto;
          white-space: nowrap;

          .tag {
            &:not(:last-child) {
              margin-right: 8px;
            }
          }

          .noneTag {
            font-size: 14px;
            line-height: 26px;
            color: $text-6;
          }
        }

        .linear {
          position: absolute;
          top: 15px;
          right: 15px;
          @include wh(30px, 26px);
          @include linear-gradient(to right, rgba(255, 255, 255, 0), $white);
        }
      }
    }
  }

  .cusCenter {
    padding: 120px 12px 25px;
    background-color: $white;

    .text {
      font-size: 15px;
      height: 24px;
      line-height: 24px;

      span {
        font-size: 12px;

        &.count {
          font-size: 18px;
        }
      }
    }

    .label {
      margin-top: 6px;
      font-size: 12px;
      color: $text-9;
    }
  }

  .tabsBox {
    margin-top: 10px;

    .tabsTitle {
      padding: 0 12px;
      height: 50px;
      line-height: 50px;
      text-align: left;
      background-color: $white;
    }
  }

  .btn {
    width: 82px;

    &:not(:last-child) {
      margin-right: 7.5px;
    }
  }

  .van-tabs--line .van-tabs__wrap {
    height: 50px;
  }

  .van-tab {
    height: 50px;
    line-height: 50px;
  }

  .van-tab--active {
    font-size: 16px;
  }

  .van-tabs__line {
    background-color: $theme;
  }
}
</style>
