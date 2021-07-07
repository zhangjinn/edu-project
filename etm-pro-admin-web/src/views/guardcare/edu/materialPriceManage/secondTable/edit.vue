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
            class="labelTooltip"
            effect="dark"
            :content="'请添加课程和物品以外的收费项目，如伙食费、校车接送费等'"
            placement="top-start"
          >
            <i class=" iconfont iconquestion-circle" />
          </el-tooltip>
        </label>
      </template>
      <el-input
        v-model="form.name"
        placeholder="请输入费用名称，如伙食费，校车接送费"
      />
    </el-form-item>

    <el-form-item
      label="单价（元）"
      prop="sellPrice"
      :rules="formValidate.nullValueRule(true,'请输入售卖单价')"
    >
      <el-input
        v-model="form.sellPrice"
        placeholder="请输入售卖单价"
      />
    </el-form-item>

    <el-form-item
      label="费用性质"
      prop="property"
      :rules="formValidate.nullValueRule(true,'请选择费用性质')"
    >
      <el-radio-group v-model="form.property">
        <el-radio
          v-for="(item,index) in propertyOptions"
          :key="index"
          :label="item.value"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否启用">
      <el-radio-group v-model="form.enable">
        <el-radio label="1">是</el-radio>
        <el-radio label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import {
  getMaterialPriceItem
} from '@/api/guardcare/edu/materialPriceManage'

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
        enable: '1'
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
      getMaterialPriceItem(materialPriceId).then((res) => {
        const { data } = res

        this.form = {
          name: data.materialPriceName,
          sellPrice: data.sellPrice,
          property: data.property,
          enable: data.enable ? '1' : '2'
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
</style>
