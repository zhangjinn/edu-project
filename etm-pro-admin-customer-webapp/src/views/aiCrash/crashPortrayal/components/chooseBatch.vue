<template>
  <div class="choose-batch-wrap">
    <el-form
      ref="elFormRef"
      inline
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="选择待画像客户批次"
        prop="batch"
      >
        <el-select
          v-model="formData.batch"
          :popper-append-to-body="false"
          placeholder="请选择批次"
          @change="batchChange"
        >
          <el-option
            v-for="item in options"
            :key="item.batchId"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="客户数量"
        class="customer-count"
        prop="unPortrayedTotal"
      >
        {{ formData.unPortrayedTotal }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
   * index create by 油麦菜
   * createTime 2021/1/29 17:01
   */
import {
  queryBatchNoList,
  queryBatchNo
} from '@/api/aiCrash'
// import formValidate from '@/utils/rules'
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {
  },
  data () {
    // const ruleNumberRange = (rule, value, callback) => {
    //   // 数字类型输入框可以为空
    //   if (value > this.formData.unPortrayedTotal) {
    //     callback(new Error('不能大于已选客户数量'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      options: [],
      formData: {
        batch: '',
        batchId: '',
        unPortrayedTotal: 0,
        doTouchTotal: 0
      },
      rules: {
        batch: [
          { required: true, message: '请选择批次', trigger: ['blur', 'change'] }
        ]
        // doTouchTotal: [
        //   formValidate.isPositiveIntegerNumber(true),
        //   { validator: ruleNumberRange, trigger: ['blur', 'change'] }
        // ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryBatchNoList().then(res => {
        this.options = []
        res.data.forEach(item => {
          this.options.push({
            label: item.no,
            value: item.no,
            batchId: item.id
          })
        })
      })
    },
    batchChange (val) {
      queryBatchNo({ batchNo: val }).then(res => {
        this.formData.unPortrayedTotal = res.data.itemTotal
        this.formData.batchId = this.options.find(item => item.value === val).batchId
        this.formData.doTouchTotal = 1
        this.emitFormData()
      })
    },
    emitFormData () {
      this.$emit('emitFormData', this.formData, this.$refs.elFormRef)
    }
  }
}
</script>
<style lang="scss" scoped>
  .choose-batch-wrap {
    ::v-deep .el-form {
      margin-left: 25px;
      .el-form-item__label {
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
      }
      .el-select {
        width: 344px;
        height: 34px;
        border: 1px solid #6C5A34;
        border-radius: 2px;
        .el-input--small .el-input__inner {
          background: #4B3C1D;
          border: none;
          border-radius: inherit;
          font-size: 14px;
          font-weight: 400;
          color: #FFFFFF;
        }
      }
      .el-input--small .el-input__inner {
        background: #4B3C1D;
        border: none;
        border-radius: inherit;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
      }
      .el-form-item__content {
        color: #ffffff;
      }
    }
    .customer-count {
      margin: 0 40px!important;
    }
  }

  ::v-deep .el-select-dropdown {
    background: #4B3C1D;
    border: 1px solid #6C5A34;
    border-radius: 2px;

    .el-select-dropdown__item {
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
    }

    .el-select-dropdown__item.hover {
      background: rgba(255,255,255,.2);
    }

    .popper__arrow:after {
      border-bottom-color: #4B3C1D!important;
    }

  }
</style>
