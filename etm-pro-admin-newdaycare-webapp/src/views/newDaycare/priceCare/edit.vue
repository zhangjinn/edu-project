<template>
  <div class="edit-wrap">
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        label="费用名称"
        prop="priceName"
        :rules="formValidate.nullValueRule(true,'请输入费用名称',['change'])"
      >
        <el-input
          v-model="form.priceName"
          v-in-focus
          maxlength="15"
          placeholder="请输入费用名称"
        />
      </el-form-item>
      <el-form-item
        label="收费方式"
        prop="enable"
        :rules="formValidate.nullValueRule(true,'请填写收费方式')"
      >
        <el-radio-group v-model="form.enable">
          <el-radio label="1">
            周期收费
          </el-radio>
          <el-radio label="2">
            一次性收费
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="费用"
        prop="price"
        :rules="[
          { required: true, message: '费用不能为空'},
        ]"
      >
        <el-input
          v-model="form.price"
          placeholder="请输入费用"
          oninput="this.value = this.value.replace(/[^\d.]/g,'');"
        />
      </el-form-item>
      <el-form-item
        label="状态"
      >
        <el-switch
          v-model="form.open"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * edit create by Administrator
 * createTime 2020/12/09 9:37
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { getPrice } from '@/api/newDaycare/priceCare'

export default {
  name: 'Edit',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator (val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formValidate,
      form: {
        priceName: '',
        enable: '1',
        price: '',
        open: false
      },
      priceMethod: {
        WEEK: '1',
        ONCE: '2'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    init () {
      getPrice({ caPriceId: this.itemId }).then(res => {
        const data = res.data
        this.form.priceName = data.name
        this.form.price = data.cost
        this.form.open = data.type
        this.form.enable = this.priceMethod[data.chargingMethod]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
