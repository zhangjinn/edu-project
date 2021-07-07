<template>
  <div class="addEnrollment">
    <etm-layout-split>
      <el-steps v-if="orderType === 'NEW_SIGN'" :active="active">
        <el-step title="基础信息" />
        <el-step title="课程信息" />
        <el-step title="其他信息" />
      </el-steps>
      <el-steps v-else-if="orderType === 'RENEW'" class="continuedSteps" :active="active">
        <el-step title="课程信息" />
        <el-step title="其他信息" />
      </el-steps>
      <div class="formArea">
        <template v-if="orderType === 'NEW_SIGN'">
          <basic-form v-show="active === 0" :form-data="basicForm" />
          <course-form v-show="active === 1" :form-data="courseForm" :order-type="orderType" />
          <other-form v-show="active === 2" :form-data="otherForm" />
        </template>
        <template v-else-if="orderType === 'RENEW'">
          <course-form v-show="active === 0" :form-data="courseForm" :order-type="orderType" />
          <other-form v-show="active === 1" :form-data="otherForm" />
        </template>
      </div>
      <div class="bottomBtns">
        <el-button v-if="active === 0" plain @click.stop="cancel">
          取消
        </el-button>
        <el-button v-if="active > 0" plain @click.stop="last">上一步</el-button>
        <template v-if="orderType === 'NEW_SIGN'">
          <el-button v-if="active < 2" type="primary" :disabled="disabled" @click.stop="next">
            下一步
          </el-button>
          <el-button v-else type="primary" :disabled="disabled" @click.stop="handleSubmit">
            提交审核
          </el-button>
        </template>
        <template v-else-if="orderType === 'RENEW'">
          <el-button v-if="active < 1" type="primary" :disabled="disabled" @click.stop="next">
            下一步
          </el-button>
          <el-button v-else type="primary" :disabled="disabled" @click.stop="handleSubmit">
            提交审核
          </el-button>
        </template>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import basicForm from './basicForm'
import courseForm from './courseForm'
import otherForm from './otherForm'
import { mapState } from 'vuex'
import { getOrderDetail, postNewOrder, modifyOrder, checkCustomer } from '@/api/sacc/enrollmentManage'
import { validPhoneNumber } from '@/utils/validate'
import { parseTime } from '@/utils'

export default {
  components: {
    basicForm,
    courseForm,
    otherForm
  },
  data() {
    return {
      orderType: '',
      active: 0,
      disabled: true,
      basicDone: false,
      basicForm: {
        name: '',
        englishName: '',
        gender: 'FEMALE',
        birthday: '',
        contactList: [
          {
            name: '',
            phone: '',
            contactTypeId: '',
            isReceiver: true
          }
        ],
        area: {
          provinceCode: '',
          cityCode: '',
          countyCode: ''
        },
        address: ''
      },
      courseDone: false,
      courseForm: {
        name: '',
        englishName: '',
        packages: [],
        mealses: [],
        sellMaterial: false,
        materials: [],
        payType: '',
        date: [],
        signDate: new Date(),
        totalAmount: 0,
        actualAmount: 0,
        totalMealsAmount: '',
        actualMealsAmount: '',
        totalPackageAmount: '',
        actualPackageAmount: ''
      },
      otherDone: false,
      otherForm: {
        owner: '',
        ownerName: '',
        ownerPerformance: '',
        otherOwner: [],
        previewSrcLists: [], // 上传图片的url
        previewSrcKey: [], // 提交的上传图片路径
        mark: ''
      },
      formData: {}
    }
  },
  computed: {
    ...mapState('sacc/enrollment', [`orderId`])
  },
  watch: {
    basicForm: { // 基础信息监听，以确定必填信息是否完成，底部按钮是否可点
      handler(val) {
        if (!val.name || !val.birthday || !val.gender) {
          this.disabled = true
          this.basicDone = false
        } else {
          let flag = true
          const patt = /^[\u4e00-\u9fa5]{0,}$/g
          if (!patt.test(val.name)) {
            this.disabled = true
            this.basicDone = false
            flag = false
          }
          val.contactList.forEach(item => {
            if (!item.contactTypeId || !item.name || !item.phone) {
              this.disabled = true
              this.basicDone = false
              flag = false
            } else if (!validPhoneNumber(item.phone)) {
              this.disabled = true
              this.basicDone = false
              flag = false
            }
          })
          if (flag) {
            this.disabled = false
            this.basicDone = true
          }
        }
      },
      deep: true
    },
    courseForm: { // 课程信息监听，以确定必填信息是否完成，底部按钮是否可点
      handler(val) {
        if (!val.packages.length || !val.date.length || !val.payType) {
          this.disabled = true
        } else {
          this.disabled = false
          this.courseDone = true
        }
      },
      deep: true
    },
    active() { // 上一步，下一步切换时更改底部按钮状态
      if (this.orderType === 'NEW_SIGN') {
        if (this.active === 0) {
          if (this.basicDone) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        } else if (this.active === 1) {
          if (this.courseDone) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        } else {
          this.disabled = false
        }
      } else {
        if (this.active === 0) {
          if (this.courseDone) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        } else if (this.active === 1) {
          this.disabled = false
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      if (!this.orderId) { // 新签
        this.orderType = 'NEW_SIGN'
      } else { // 修改
        getOrderDetail(this.orderId).then(res => {
          const data = res.data
          this.orderType = data.orderType
          this.formData = data
          this.setBasicForm()
          this.setCourseForm()
          this.setOtherForm()
        })
      }
    },
    setBasicForm() { // 设置基础信息
      this.basicForm.name = this.formData.customer.name
      this.basicForm.englishName = this.formData.customer.englishName
      this.basicForm.gender = this.formData.customer.gender
      this.basicForm.birthday = parseTime(this.formData.customer.birthday, '{y}-{m}-{d}')
      this.basicForm.contactList = this.formData.customer.contactList
      this.basicForm.address = this.formData.customer.address
      if (this.formData.customer.area) {
        this.basicForm.area = this.formData.customer.area
      }
    },
    setCourseForm() { // 设置课程信息
      this.courseForm.name = this.formData.customer.name
      this.courseForm.englishName = this.formData.customer.englishName
      this.courseForm.sellMaterial = this.formData.sellMaterial
      this.courseForm.payType = this.formData.payType
      this.courseForm.signDate = parseTime(this.formData.signDate, '{y}-{m}-{d}')
      this.courseForm.totalAmount = this.formData.totalAmount
      this.courseForm.actualAmount = this.formData.actualAmount
      this.courseForm.totalMealsAmount = this.formData.totalMealsAmount
      this.courseForm.actualMealsAmount = this.formData.actualMealsAmount
      this.courseForm.totalPackageAmount = this.formData.totalPackageAmount
      this.courseForm.actualPackageAmount = this.formData.actualPackageAmount
      if (this.formData.carePackageList.length) {
        this.courseForm.packages = []
        this.formData.carePackageList.forEach(item => {
          const list = {
            carePackageName: item.orderCarePackageName,
            careType: item.packageType,
            duration: item.duration,
            freeDuration: item.freeDuration,
            price: item.price,
            actualPrice: item.actualPrice
          }
          this.courseForm.packages.push(list)
        })
      }
      if (this.formData.mealsPriceList && this.formData.mealsPriceList.length) {
        this.courseForm.mealses = []
        this.formData.mealsPriceList.forEach(item => {
          const list = {
            mealsPriceName: item.mealsName,
            duration: item.duration,
            price: item.price,
            actualPrice: item.actualPrice,
            amount: item.amount,
            actualAmount: item.actualAmount
          }
          this.courseForm.mealses.push(list)
        })
      }
      if (this.formData.materialList && this.formData.materialList.length) {
        this.courseForm.materials = []
        this.formData.materialList.forEach(item => {
          const list = {
            serial: item.serial,
            materialName: item.orderMaterialName,
            unit: item.unit,
            materialType: item.materialType,
            numbers: item.numbers,
            sellPrice: item.sellPrice
          }
          this.courseForm.materials.push(list)
        })
      }
      this.courseForm.date = []
      this.courseForm.date.push(parseTime(this.formData.startDate, '{y}-{m}-{d}'))
      this.courseForm.date.push(parseTime(this.formData.endDate, '{y}-{m}-{d}'))
    },
    setOtherForm() { // 设置更多信息
      this.otherForm = {
        owner: this.formData.owner,
        ownerName: this.formData.ownerName,
        ownerPerformance: this.formData.ownerPerformance,
        otherOwner: this.formData.otherOwner,
        previewSrcLists: [],
        previewSrcKey: [],
        mark: this.formData.mark
      }
      if (this.formData.extraAddressArray && this.formData.extraAddressArray.length) {
        this.formData.extraAddressArray.forEach(item => {
          this.otherForm.previewSrcLists.push(item.url)
          this.otherForm.previewSrcKey.push(item.url)
        })
      }
    },
    cancel() { // 返回报名管理首页
      this.$emit('jump', 'manage')
    },
    last() { // 上一步
      this.active--
    },
    next() { // 下一步
      if (!this.orderId && this.active === 0) {
        let count = 0
        let flag = false
        this.basicForm.contactList.forEach(item => {
          const param = {
            name: this.basicForm.name,
            phone: item.phone
          }
          checkCustomer(param).then(res => {
            count++
            if (!res.data) {
              flag = true
            }
            if (count === this.basicForm.contactList.length) {
              if (flag) {
                this.$message.warning('会员已存在')
              } else {
                this.active++
              }
            }
          })
        })
      } else {
        this.active++
      }
    },
    handleSubmit() { // 提交报名信息
      const param = {
        payType: this.courseForm.payType,
        orderType: this.orderType,
        startDate: parseTime(this.courseForm.date[0], '{y}-{m}-{d}'),
        endDate: parseTime(this.courseForm.date[1], '{y}-{m}-{d}'),
        signDate: parseTime(this.courseForm.signDate, '{y}-{m}-{d}'),
        totalAmount: this.courseForm.totalAmount,
        actualAmount: this.courseForm.actualAmount,
        totalMealsAmount: this.courseForm.totalMealsAmount,
        actualMealsAmount: this.courseForm.actualMealsAmount,
        totalPackageAmount: this.courseForm.totalPackageAmount,
        actualPackageAmount: this.courseForm.actualPackageAmount,
        sellMaterial: this.courseForm.sellMaterial,
        owner: this.otherForm.owner,
        ownerName: this.otherForm.ownerName,
        ownerPerformance: this.otherForm.ownerPerformance,
        otherOwner: this.otherForm.otherOwner,
        mark: this.otherForm.mark,
        mealses: [],
        packages: [],
        materials: []
      }
      // 课程套餐
      if (this.courseForm.packages.length) {
        this.courseForm.packages.forEach(item => {
          const data = {
            orderCarePackageName: item.carePackageName,
            packageType: item.careType,
            duration: item.duration,
            freeDuration: item.freeDuration,
            price: item.price,
            actualPrice: item.actualPrice
          }
          param.packages.push(data)
        })
      }
      // 餐费
      if (this.courseForm.mealses.length) {
        this.courseForm.mealses.forEach(item => {
          const data = {
            mealsName: item.mealsPriceName,
            duration: item.duration,
            price: item.price,
            actualPrice: item.actualPrice,
            amount: item.amount,
            actualAmount: item.actualAmount
          }
          param.mealses.push(data)
        })
      }
      // 材料物品
      if (this.courseForm.materials.length) {
        this.courseForm.materials.forEach(item => {
          const data = {
            serial: item.serial,
            orderMaterialName: item.materialName,
            unit: item.unit,
            materialType: item.materialType,
            numbers: item.numbers,
            sellPrice: item.sellPrice
          }
          param.materials.push(data)
        })
      }
      // 上传的图片
      if (this.otherForm.previewSrcKey.length) {
        param.extraAddressArray = []
        this.otherForm.previewSrcKey.forEach(item => {
          const arr = item.split('/')
          const data = {
            name: arr[arr.length - 1],
            url: item
          }
          param.extraAddressArray.push(data)
        })
      }
      if (this.orderType === 'RENEW') { // 续签
        param.customerId = this.formData.customerId
      } else { // 新签
        param.customerDTO = {
          name: this.basicForm.name,
          englishName: this.basicForm.englishName,
          birthday: parseTime(this.basicForm.birthday, '{y}-{m}-{d}'),
          gender: this.basicForm.gender,
          areaCode: this.basicForm.area.countyCode,
          address: this.basicForm.address,
          contacts: this.basicForm.contactList
        }
      }
      if (!this.orderId) { // 新增
        this.add(param)
      } else { // 修改
        this.modify(param)
      }
    },
    add(param) {
      postNewOrder(param).then(() => {
        this.$message.success('报名成功')
        this.$emit('jump', 'manage')
      })
    },
    modify(param) {
      modifyOrder(this.orderId, param).then(() => {
        this.$message.success('修改报名信息成功')
        this.$emit('jump', 'manage')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .addEnrollment {
    @include bgc_white();

    /deep/ .el-steps {
      margin: 0 0 32px 150px;
      width: 800px;

      &.continuedSteps {
        margin-left: 300px;
        width: 500px;
      }

      .el-step__main {
        transform: translateX(-15px);
      }

      .el-step__icon {
        width: 30px;
        height: 30px;
      }

      .el-step__head.is-process {
        @include bc_main_color();
        @include c_white();

        .el-step__icon.is-text {
          @include bgc_main_color();
        }

      }

      .el-step__head.is-success {
        @include c_main_color();
        @include bc_main_color();
      }

      .el-step__title.is-success {
        @include c_main_color();
      }

      .el-step__title.is-process {
        font-weight: 400;
      }

      .el-step.is-horizontal .el-step__line {
        top: 14px;
        right: 20px;
        left: 50px;
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
