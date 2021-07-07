<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      prop="name"
      :rules="formValidate.nullValueRule(true,'请输入费用名称')"
    >
      <template slot="label">
        <label>
          费用名称
          <el-tooltip
            effect="light"
            popper-class="stepTips"
            :visible-arrow="false"
            placement="bottom-start"
            :content="'请添加课程和物品以外的收费项目，如伙食费、校车接送费等'"
          >
            <i class=" iconfont iconquestion-circle" />
          </el-tooltip>
        </label>
      </template>
      <template v-if="type === 'add'">
        <el-input
          v-model="form.name"
          v-focus
          :placeholder="'请输入费用名称，如伙食费，校车接送费'"
        />
      </template>
      <template v-else>
        <el-input
          v-model="form.name"
          :placeholder="'请输入费用名称，如伙食费，校车接送费'"
        />
      </template>

    </el-form-item>
    <el-form-item
      prop="property"
      :rules="formValidate.nullValueRule(true,'请选择费用性质')"
    >
      <template slot="label">
        <label>
          费用性质
          <el-tooltip
            effect="light"
            popper-class="stepTips"
            :visible-arrow="false"
            placement="bottom-start"
            :content="'一次性费用不纳入考勤结算，周期性费用会纳入考勤结算'"
          >
            <i class=" iconfont iconquestion-circle" />
          </el-tooltip>
        </label>
      </template>
      <el-radio-group v-model="form.property">
        <el-radio
          v-for="(item,index) in propertyOptions"
          :key="index"
          :label="item.value"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="单价（元）"
      prop="sellPrice"
      :rules="formValidate.nullValueRule(true,'请输入售卖单价')"
    >
      <div class="unitInput">
        <el-input
          v-model="form.sellPrice"
          placeholder="请输入售卖单价"
        />
        <span class="unit">{{ form.property === 'once' ? '元/笔' : '元/月' }}</span>
      </div>
    </el-form-item>

    <el-form-item label="是否启用">
      <el-radio-group v-model="form.enable">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>

  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import {
  queryGuardPriceById
} from '@/api/newDaycare/priceGuard'

export default {
  name: 'Edit',
  props: {
    type: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        name: '',
        sellPrice: '',
        property: 'once',
        enable: true
      },
      propertyOptions: [
        {
          value: 'once',
          label: '一次性'
        }, {
          value: 'cycle',
          label: '周期性'
        }
      ]

    }
  },
  created() {
    if (this.type === 'edit') {
      this.getMaterialPriceItemData()
    }
  },
  methods: {
    getMaterialPriceItemData() {
      const materialPriceId = this.itemId
      queryGuardPriceById({ materialPriceId: materialPriceId }).then((res) => {
        const { data } = res

        this.form = {
          name: data.materialPriceName,
          sellPrice: data.sellPrice,
          property: data.property,
          enable: data.enable
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip{
  margin-bottom: 24px;
}
.unitInput{
  display: flex;
  .unit{
    flex: 0 0 auto;
    margin-left: 12px;
    width: 40px;
  }
}
</style>
