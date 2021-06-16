<template>
  <div class="editCustomer-wrap">
    <etm-title
      :show-title="false"
      border
      size="big"
    >
      编辑
      <template slot="tool">
        <template>
          <el-button
            plain
            size="mini"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="save"
          >
            保存
          </el-button>
        </template>
      </template>
    </etm-title>
    <etm-form
      ref="form"
      type="dialog"
      :model="customerDetail"
    >
      <el-form-item
        label="学员姓名"
        prop="customerName"
        :rules="formValidate.nullValueRule(true,'请输入学员姓名')"
      >
        <el-input v-model="customerDetail.customerName" />
      </el-form-item>
      <el-form-item
        label="联系人姓名"
        prop="parentName"
        :rules="formValidate.nullValueRule(true,'请输入联系人姓名')"
      >
        <el-input v-model="customerDetail.parentName" />
      </el-form-item>
      <el-form-item
        label="联系人电话"
        prop="parentPhone"
        :rules="formValidate.nullValueRule(true,'请输入联系人电话')"
      >
        <el-input v-model="customerDetail.parentPhone" />
      </el-form-item>
      <el-form-item
        label="性别"
        prop="gender"
      >
        <template>
          <el-radio
            v-model="customerDetail.gender"
            label="MALE"
          >
            男
          </el-radio>
          <el-radio
            v-model="customerDetail.gender"
            label="FEMALE"
          >
            女
          </el-radio>
        </template>
      </el-form-item>
      <el-form-item
        label="生日"
        prop="birthday"
      >
        <el-date-picker
          v-model="customerDetail.birthday"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item
        label="学员来源"
        prop="birthday"
      >
        <el-select
          v-model="customerDetail.sourcesName"
          style="width: 100%;"
        >
          <el-option
            v-for="(item, index) in sourcesList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * editCustomer create by Administrator
 * createTime 2020/11/25 9:58
 */
import formValidate from '@/utils/rules'
import { updateCustomerDetail } from '@/api/newDaycare/customerOrder'
import customerDetail from './followUp/customerDetail'

export default {
  name: 'EditCustomer',
  components: {},
  filters: {},
  mixins: [],
  props: {
    customerDetail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      formValidate,
      sourcesList: [
        {
          name: '观测',
          id: 1
        }
      ]
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
    },
    cancel () {
      this.$emit('cancel')
    },
    save () {
      console.log(customerDetail, ' Deatil')
      const params = {}
      params.customerId = this.customerDetail.customerId
      params.customerName = this.customerDetail.customerName
      params.parentName = this.customerDetail.parentName
      params.parentPhone = this.customerDetail.parentPhone
      params.gender = this.customerDetail.gender
      params.birthday = this.customerDetail.birthday
      params.sources = this.customerDetail.sources
      console.log(params, 'params')
      updateCustomerDetail(params).then(res => {
        if (res.code === 0) {
          this.$message('更新成功')
        } else {
          this.$message(res.message)
        }
      })
      this.$emit('save', false)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
