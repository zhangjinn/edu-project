<template>
  <div class="deposit-wrap">
    <etm-form
      ref="form"
      type="dialog"
      :model="detail"
    >
      <el-form-item
        label="会员卡号"
        prop="cardNumber"
        :rules="formValidate.nullValueRule(true, '请输入会员卡号')"
      >
        <el-input v-model.number="detail.cardNumber" />
      </el-form-item>
      <el-form-item
        label="卡类型"
        prop="cardTypeId"
      >
        <el-select v-model="detail.cardTypeId">
          <el-option
            v-for="(item, index) in cardType"
            :key="index"
            :label="item.membershipCardTypeName"
            :value="item.membershipCardTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学员姓名">
        {{ detail.childName }}
      </el-form-item>

      <!--      :rules="formValidate.nullValueRule(true, '请选择关联联系人')"-->
      <el-form-item
        label="关联联系人"
        prop="kinshipId"
      >
        <el-select v-model="detail.kinshipId">
          <el-option
            v-for="(item, index) in relateLists"
            :key="index"
            :label="`${item.parentName} (${item.relationshipName})-${item.telephone}`"
            :value="item.kinshipId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开卡时间">
        {{ detail.openCardTime }}
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * deposit create by Administrator
 * createTime 2020/9/1 15:55
 */

import formValidate from '@/utils/rules'
import {
  queryUserCardType,
  queryCardDetail
} from '@/api/newDaycare/childManage'

export default {
  name: 'Deposit',
  components: {},
  filters: {},
  mixins: [],
  model: {
    prop: 'detail',
    event: 'evt'
  },
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formValidate,
      relateLists: [],
      cardType: []
    }
  },
  computed: {},
  watch: {
    detail: {
      immediate: true,
      deep: true,
      handler (n) {
        queryCardDetail(n.childId).then(res => {
          this.relateLists = res.data
        })
      }
    }
  },
  created () {
    queryUserCardType().then(res => {
      this.cardType = res.data
    })
  },
  mounted () {
  },
  methods: {
    // change() {
    //   this.$emit('evt', this.detail)
    // }
  }
}
</script>
<style lang="scss" scoped>
</style>
