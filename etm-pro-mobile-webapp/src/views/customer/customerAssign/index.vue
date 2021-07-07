<template>
  <div class="customerAssign textLeft">
    <div class="customerBox">
      <div class="count van-hairline--bottom">
        <span>已选客户数量: </span>
        <span class="num">{{ customerIds.length }}</span>
        <span>人</span>
      </div>
      <div class="assignBox">
        <div class="assignForm">
          <van-cell-group :border="false">
            <van-field
              v-model="allocation"
              readonly
              label="分配方式"
              right-icon="arrow"
              input-align="left"
              placeholder="请选择"
              @click="allocationSel"
            />
            <van-cell>
              <van-field
                readonly
                class="innerCell"
                label="跟进人员"
                right-icon="arrow"
                input-align="left"
                placeholder="请选择"
                @click="openMarketPicker"
              />
              <div class="adviserBox">
                <span v-for="(item,index) in adviserData" :key="index">
                  {{ item.name }}
                  <i class="textCenter iconfont iconminus-circle" @click="removeAdviser(index)" />
                </span>
              </div>
            </van-cell>
            <van-field
              v-model="batchCode"
              label="分配批次号"
              input-align="left"
              placeholder="请输入分配批次号"
            />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div v-if="allocation&&adviserData.length" class="assignTitle">分配人员细分</div>
    <div class="assignBox">
      <div class="assignForm">
        <van-cell-group :border="false">
          <template v-for="(item,index) in adviserData">
            <van-field
              v-if="allocationType === 'AVERAGE'"
              :key="index"
              v-model="inputValue[index]"
              :label="item.name"
              input-align="left"
              placeholder="请输入分配数量"
            />
            <van-field
              v-else
              :key="index"
              :label="item.name"
              input-align="left"
              readonly
            />
          </template>
        </van-cell-group>
      </div>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="cancel">
          <control-btn text="取消" type="cancel" />
        </div>
        <div class="btn" @click="save">
          <control-btn text="保存" type="primary" />
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="showAllocation"
      :actions="allocationList"
      cancel-text="取消"
      :round="false"
      get-container="#app"
      @cancel="showAllocation = false"
      @select="allocationConfirm"
    />
    <template v-if="showMarket">
      <department-list
        :adviser-data="adviserData"
        :multiple-on="true"
        :customer-count="customerIds.length"
        :allocation-type="allocationType"
        @marketConfirm="confirmMarket"
        @closeMarket="closeMarket"
      />
    </template>
  </div>
</template>

<script>
import controlBtn from '../../../components/common/controlBtn'
import departmentList from '../components/departmentList'
import { postAssignCustomer, postCustomerList } from '../../../service/customer/customer'

export default {
  name: 'CustomerAssign',
  components: {
    controlBtn,
    departmentList
  },
  data() {
    return {
      customerIds: [],
      adviserData: [],
      adviserIds: [],
      showAllocation: false,
      showAdviser: false,
      showMarket: false,
      allocationList: [
        {
          name: '自由分配',
          type: 'AVERAGE'
        },
        {
          name: '追加分配',
          type: 'APPEND'
        },
        {
          name: '重新分配',
          type: 'REDO'
        }
      ],
      adviserList: [],
      allocation: '',
      allocationType: null,
      batchCode: '',
      inputValue: []
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.getCustomerId()
  },
  mounted() {
    // 如果支持 popstate 一般移动端都支持了
    if (window.history && window.history.pushState) {
      // 往历史记录里面添加一条新的当前页面的url
      history.pushState(null, null, document.URL)
      // 给 popstate 绑定一个方法 监听页面刷新
      window.addEventListener('popstate', this.backChange, false)// false阻止默认事件
    }
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.backChange, false)// false阻止默认事件
  },
  methods: {
    getCustomerId() {
      const customerId = this.$route.query.customerId
      if (customerId) {
        const customerIds = customerId.split(',')
        for (let i = 0; i < customerIds.length; i++) {
          this.customerIds.push(parseInt(customerIds[i]))
        }
      } else {
        postCustomerList({ pageSize: 999, pageNum: 1 }).then(res => {
          const data = res.data.data.content
          data.forEach(item => {
            this.customerIds.push(item.customerId)
          })
        })
      }
    },
    allocationSel() {
      this.showAllocation = true
    },
    allocationConfirm(val) {
      this.showAllocation = false
      this.allocation = val.name
      this.allocationType = val.type
      if (val.type === 0) {
        this.allocationCount()
      }
    },
    calculate(arr) {
      let sum = 0
      for (var i = 0; i < arr.length; i++) {
        sum += parseInt(arr[i])
      }
      return sum
    },
    allocationCount() {
      const aLen = this.adviserData.length
      const cLen = this.customerIds.length
      const num = Math.floor(cLen / aLen)
      for (let i = 0; i < aLen; i++) {
        this.inputValue[i] = num
      }
      for (let i = 0; i < aLen; i++) {
        if (this.calculate(this.inputValue) < cLen) {
          this.inputValue[i]++
        }
      }
    },
    removeAdviser(index) {
      this.adviserData.splice(index, 1)
      if (this.allocationType === 'AVERAGE') {
        this.allocationCount()
      }
    },
    cancel() {
      this.$router.back(-1)
    },
    save() {
      const patt = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
      if (!this.allocationType) {
        this.$toast({
          message: '请选择分配方式',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      } else if (!this.batchCode) {
        this.$toast({
          message: '请输入分配批次号',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      } else if (!patt.test(this.batchCode)) {
        this.$toast({
          message: '批次记录需要输入数字类型哦',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      } else {
        this.sureAssign()
      }
    },
    openMarketPicker() {
      if (this.allocation) {
        this.showMarket = true
      }
    },
    closeMarket() {
      this.showMarket = false
    },
    confirmMarket(val) {
      this.showMarket = false
      if (val && val.length) {
        this.adviserData = val
        for (let i = 0; i < val.length; i++) {
          this.adviserIds.push(val[i].id)
        }
        if (this.allocationType === 'AVERAGE') {
          this.allocationCount()
        }
      }
    },
    sureAssign() {
      const param = {
        assignType: this.allocationType,
        batchCode: this.batchCode,
        employeeIds: this.adviserIds,
        customerIds: this.customerIds,
        employeeIdsAndCount: {}
      }
      for (let i = 0; i < this.adviserIds.length; i++) {
        if (this.allocationType === 'AVERAGE') {
          param.employeeIdsAndCount[this.adviserIds[i]] = parseInt(this.inputValue[i])
        } else {
          param.employeeIdsAndCount[this.adviserIds[i]] = parseInt(this.customerIds.length)
        }
      }
      if (this.allocationType === 'AVERAGE') {
        if (this.calculate(this.inputValue) < this.customerIds.length) {
          this.$toast({
            message: '分配数量少于选中分配的数量',
            duration: 1000,
            icon: 'icon iconfont iconwarning'
          })
        } else if (this.calculate(this.inputValue) > this.customerIds.length) {
          this.$toast({
            message: '分配数量多于选中分配的数量',
            duration: 1000,
            icon: 'icon iconfont iconwarning'
          })
        } else {
          this.postAssign(param)
        }
      } else {
        this.postAssign(param)
      }
    },
    postAssign(data) {
      postAssignCustomer(data).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '分配成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.$router.replace({
            path: '/customerList'
          })
        }, 1000)
      })
    },
    backChange() {
      if (this.showMarket) {
        this.showMarket = false
      } else {
        this.$router.back(-1)
      }
    }
  }
}
</script>

<style lang="scss">

    .customerAssign {

        .customerBox {
            .count {
                padding: 12px;
                font-size: 13px;
                background-color: $white;

                .num {
                    color: $theme;
                    font-size: 18px;
                }
            }

            .assignBox {
                .innerCell {
                    padding: 0;

                    &::after {
                        border-bottom: none;
                    }
                }

                .adviserBox {
                    span {
                        position: relative;
                        display: inline-block;
                        margin: 6px 12px 0 0;
                        padding: 0 12px;
                        color: $white;
                        background-color: $theme;
                        @include border-radius(5px);

                        i {
                            position: absolute;
                            right: -5px;
                            top: -5px;
                            font-size: 10px;
                            line-height: 15px;
                            color: $red;
                        }
                    }
                }
            }

        }

        .van-cell {
            padding: 20px 12px;
        }

        .assignTitle {
            margin-top: 10px;
            padding: 12px 12px 0;
            color: $black;
            background-color: $white;
        }
    }
</style>
