<template>
  <div class="addEnrollment">
    <etm-layout-split>
      <el-steps class="continuedSteps" :active="active">
        <el-step title="课程信息" />
        <el-step title="其他信息" />
      </el-steps>
      <div class="formArea">
        <template>
          <course-form v-show="active === 0" :form-data="courseForm" :order-type="orderType" />
          <other-form v-show="active === 1" :form-data="otherForm" />
        </template>
      </div>
      <div class="bottomBtns">
        <el-button v-if="active === 0" plain @click.stop="cancel">
          取消
        </el-button>
        <el-button v-if="active > 0" plain @click.stop="last">上一步</el-button>
        <template>
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
import courseForm from './courseForm'
import otherForm from './otherForm'
import { postNewOrder } from '@/api/sacc/enrollmentManage'
import { parseTime } from '@/utils'

export default {
  components: {
    courseForm,
    otherForm
  },
  data() {
    return {
      orderType: 'RENEW',
      active: 0,
      disabled: true,
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
        ownerPerformance: '',
        otherOwner: [],
        previewSrcLists: [], // 上传图片的url
        previewSrcKey: [], // 提交的上传图片路径
        remark: ''
      },
      formData: {}
    }
  },
  watch: {
    courseForm: {
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
    active() {
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
  },
  created() {
    const memberName = this.$store.state.memberManageV2.memberName
    this.courseForm.name = memberName.cn
    this.courseForm.englishName = memberName.en
    this.formData.customerId = localStorage.getItem('memberManageV2_currentId')
  },
  methods: {
    cancel() {
      this.$emit('jump', 'manage')
    },
    last() {
      this.active--
    },
    next() {
      this.active++
    },
    handleSubmit() {
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
        ownerPerformance: this.otherForm.ownerPerformance,
        otherOwner: this.otherForm.otherOwner,
        mark: this.otherForm.mark
      }
      if (this.courseForm.packages.length) {
        param.packages = []
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
      if (this.courseForm.mealses.length) {
        param.mealses = []
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
      if (this.courseForm.materials.length) {
        param.materials = []
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
      param.customerId = this.formData.customerId
      this.add(param)
    },
    add(param) {
      postNewOrder(param).then(() => {
        this.$message.success('报名成功')
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
