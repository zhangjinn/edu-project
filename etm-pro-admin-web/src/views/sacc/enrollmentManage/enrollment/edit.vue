<template>
  <div class="enrollEdit">
    <etm-layout-split>
      <div class="enrollForm">
        <etm-form>
          <el-form-item label="报名单号:" class="labelForm">
            <span>{{ orderData.orderNumber }}</span>
          </el-form-item>
          <el-form-item label="签约会员:" class="labelForm">
            <span>{{ orderData.customer&&orderData.customer.name }}</span>
          </el-form-item>
          <el-form-item label="课程类型:" class="labelForm">
            <span>{{ formData.orderCarePackageName }}</span>
          </el-form-item>
          <el-form-item label="课程套餐:" class="labelForm">
            <span>{{ formData.packageType }}</span>
          </el-form-item>
          <el-form-item label="套餐时长（月）:" class="labelForm">
            <span>{{ formData.duration }}</span>
          </el-form-item>
          <el-form-item label="赠送时长（天）:" class="labelForm">
            <span>{{ formData.freeDuration }}</span>
          </el-form-item>
          <el-form-item label="起止日期:" class="dateForm">
            <el-row class="rangeBox">
              <el-col :span="11">
                <el-date-picker
                  v-model="formData.date[0]"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :placeholder="'开始日期'"
                  @change="setDefaultDate"
                />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-date-picker
                  v-model="formData.date[1]"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :placeholder="'结束日期'"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="业绩所属人:">
            <div class="addBox">
              <el-select
                v-model="formData.owner"
                filterable
                placeholder="输入关键字搜索"
                @change="getOwerName"
              >
                <el-option
                  v-for="(adviser, i) in adviserList"
                  :key="i"
                  :value="adviser.id"
                  :label="adviser.name"
                />
              </el-select>
              <div class="add">
                <span class="iconfont iconplus" @click="addOwner" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="业绩所属人占比（%）:">
            <el-input-number
              v-model="formData.ownerPerformance"
              controls-position="right"
              :min="0"
              :max="100"
              placeholder="请输入占比"
              @change="checkPercent('main')"
            />
          </el-form-item>
          <div v-for="(owner, index) in formData.otherOwner" :key="index">
            <el-form-item label="次业绩所属人:">
              <div class="addBox">
                <el-select
                  v-model="owner.id"
                  filterable
                  placeholder="输入关键字搜索"
                  @change="getName($event, index)"
                >
                  <el-option
                    v-for="(adviser, i) in adviserList"
                    :key="i"
                    :value="adviser.id"
                    :label="adviser.name"
                  />
                </el-select>
                <div class="add">
                  <span class="iconfont iconminus" @click="removeOwner(index)" />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="业绩所属人占比（%）:">
              <el-input-number
                v-model="owner.performance"
                controls-position="right"
                :min="0"
                :max="100"
                placeholder="请输入占比"
                @change="checkPercent('secondary', index)"
              />
            </el-form-item>
          </div>
        </etm-form>
      </div>
      <div class="bottomBtns">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import { getOrderDetail, getAllEmployee, renewPassOrder } from '@/api/sacc/enrollmentManage'
import { mapState } from 'vuex'
import { parseTime } from '../../../../utils'

export default {
  data() {
    return {
      orderData: {},
      formData: {
        orderCarePackageName: '',
        packageType: '',
        duration: '',
        freeDuration: '',
        date: [],
        owner: '',
        ownerName: '',
        ownerPerformance: '',
        otherOwner: []
      },
      adviserList: [],
      percent: 0
    }
  },
  computed: {
    ...mapState('sacc/enrollment', [`orderId`])
  },
  created() {
    this.getEmployee()
    this.getData()
  },
  methods: {
    getData() {
      getOrderDetail(this.orderId).then(res => { // 信息回填
        this.orderData = res.data
        this.formData.orderCarePackageName = this.orderData.carePackageList[0].orderCarePackageName
        this.formData.packageType = this.orderData.carePackageList[0].packageType
        this.formData.duration = this.orderData.carePackageList[0].duration
        this.formData.freeDuration = this.orderData.carePackageList[0].freeDuration
        this.formData.date.push(new Date(this.orderData.startDate))
        this.formData.date.push(new Date(this.orderData.endDate))
        this.formData.owner = this.orderData.owner
        this.formData.ownerName = this.orderData.ownerName
        this.formData.ownerPerformance = this.orderData.ownerPerformance
        this.formData.otherOwner = this.orderData.otherOwner
      })
    },
    setDefaultDate(date) {
      this.formData.date = []
      this.formData.date.push(new Date(date))
      const year = new Date(date).getFullYear()
      const month = new Date(date).getMonth() + this.formData.duration
      const day = new Date(date).getDate() + this.formData.freeDuration - 1
      this.formData.date.push(new Date(year, month, day))
    },
    getEmployee() {
      const organizationId = localStorage.getItem('currentOrganizationId')
      const param = {
        organizationId: organizationId,
        paged: false
      }
      getAllEmployee(param).then(res => {
        this.adviserList = res.data.content
      })
    },
    checkPercent(type, index) { // 业绩总占比不能超过100%
      let percent = 0
      percent += this.formData.ownerPerformance
      this.formData.otherOwner.forEach(item => {
        percent += item.performance
      })
      if (percent > 100) {
        if (type === 'secondary') {
          this.percent = percent - this.formData.ownerPerformance
          this.$nextTick(() => {
            this.formData.otherOwner[index].performance = 0
            const item = this.formData.otherOwner[index]
            this.formData.otherOwner.splice(index, 1, item)
          })
        } else if (type === 'main') {
          this.percent = percent - this.formData.ownerPerformance
          this.$nextTick(() => {
            this.formData.ownerPerformance = 0
          })
        }
        this.$message.warning('业绩占比总数不能超过100%')
      } else {
        this.percent = percent
      }
    },
    getOwerName(value) {
      for (let i = 0; i < this.adviserList.length; i++) {
        if (value === this.adviserList[i].id) {
          this.formData.ownerName = this.adviserList[i].name
          break
        }
      }
    },
    addOwner() { // 增加次业绩所属人
      if (this.percent < 100) {
        const owner = {
          id: '',
          name: '',
          performance: ''
        }
        this.formData.otherOwner.push(owner)
      } else {
        this.$message.warning('业绩占比总数已达100%')
      }
    },
    getName(value, index) {
      for (let i = 0; i < this.adviserList.length; i++) {
        if (value === this.adviserList[i].id) {
          this.formData.otherOwner[index].name = this.adviserList[i].name
          break
        }
      }
    },
    removeOwner(index) { // 删除次业绩所属人
      this.formData.otherOwner.splice(index, 1)
      this.checkPercent()
    },
    cancel() {
      this.$emit('jump', 'manage')
    },
    save() { // 保存修改
      const param = {
        startDate: parseTime(this.formData.date[0], '{y}-{m}-{d}'),
        endDate: parseTime(this.formData.date[1], '{y}-{m}-{d}'),
        owner: this.formData.owner,
        ownerName: this.formData.ownerName,
        ownerPerformance: this.formData.ownerPerformance,
        otherOwner: this.formData.otherOwner
      }
      renewPassOrder(this.orderId, param).then(() => {
        this.$message.success('修改成功')
        this.$emit('jump', 'manage')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .enrollEdit {
    @include bgc_white();

    .enrollForm {

      .el-form {
        .labelForm {
          margin-bottom: 16px;
        }
      }

      /deep/ .el-input__inner {
        text-align: left !important;
      }

      .dateForm {
        /deep/ .el-form-item__content {
          margin-left: 300px !important;

          .rangeBox {
            width: 100% !important;

            .el-date-editor.el-input {
              width: 100% !important;
            }

            .line {
              text-align: center;
            }
          }
        }
      }

      .addBox {
        position: relative;

        .add {
          position: absolute;
          top: 0;
          right: -32px;

          .iconfont {
            @include c_main_color();
            cursor: pointer;

            &:hover {
              opacity: 0.8;
            }
          }
        }
      }

      .el-select {
        width: 100%;
      }
    }

    .bottomBtns {
      display: flex;
      align-items: center;
      height: 68px;
      padding-left: 300px;

      .el-button + .el-button {
        margin-left: 16px !important;
      }

    }
  }
</style>
