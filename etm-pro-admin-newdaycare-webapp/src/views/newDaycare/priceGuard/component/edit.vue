<template>
  <etm-form
    ref="form"
    :model="formData"
    type="dialog"
  >
    <el-form-item
      prop="materialPriceId"
      label="收费科目"
      :rules="formValidate.nullValueRule(true,'请选择收费科目')"
    >
      <el-select
        v-model="formData.materialPriceId"
        @change="changePrice"
      >
        <el-option
          v-for="(item, index) in priceList"
          :key="index"
          :label="item.materialPriceName"
          :value="item.materialPriceId"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      prop="name"
      label="费用标准"
      :rules="formValidate.nullValueRule(true,'请输入费用标准')"
    >
      <el-input
        v-model="formData.name"
        placeholder="请输入费用标准"
      />
    </el-form-item>
    <el-form-item
      label="单价（元）"
      prop="price"
      :rules="formValidate.nullValueRule(true,'请输入售卖单价')"
    >
      <div class="unitInput">
        <el-input
          v-model="formData.price"
          placeholder="请输入售卖单价"
        />
        <span class="unit">{{ property === 'once' ? '元/笔' : '元/月' }}</span>
      </div>
    </el-form-item>

    <el-form-item label="是否启用">
      <el-radio-group v-model="formData.enable">
        <el-radio :label="true">
          是
        </el-radio>
        <el-radio :label="false">
          否
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import {
  queryGuardPriceList
} from '@/api/newDaycare/priceGuard'

export default {
  name: 'Edit',
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formValidate,
      priceList: [],
      property: 'once'
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      queryGuardPriceList({ paged: false }).then(res => {
        this.priceList = res.data
      })
    },
    changePrice (val) {
      this.priceList.forEach(item => {
        if (item.materialPriceId === val) {
          this.property = item.property
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip {
  margin-bottom: 24px;
}

.unitInput {
  display: flex;

  .unit {
    flex: 0 0 auto;
    margin-left: 12px;
    width: 40px;
  }
}
</style>
