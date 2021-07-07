<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item>
      <el-alert
        :closable="false"
        title="萤石摄像头序列号和验证码均在在机身底部位置。"
        type="warning"
      />
    </el-form-item>
    <!--    <el-alert-->
    <!--      class="tip"-->
    <!--      :closable="false"-->
    <!--      title="萤石摄像头序列号和验证码均在在机身底部位置。"-->
    <!--      type="warning"-->
    <!--    />-->
    <el-form-item
      :rules="formValidate.nullValueRule(true,'请选择品牌')"
      label="品牌"
      prop="brand"
    >
      <el-select v-model="form.brand" placeholder="请选择品牌">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      :rules="formValidate.nullValueRule(true,'请输入名称')"
      label="名称"
      prop="cameraName"
    >
      <el-input
        v-model="form.cameraName"
        placeholder="请输入名称"
      />
    </el-form-item>
    <el-form-item
      :rules="formValidate.nullValueRule(true,'请输入序列号')"
      label="序列号"
      prop="deviceSerial"
    >
      <el-input
        v-model="form.deviceSerial"
        placeholder="请输入序列号"
      />
    </el-form-item>
    <el-form-item
      :rules="formValidate.nullValueRule(true,'请输入验证码')"
      label="验证码"
      prop="validateCode"
    >
      <el-input
        v-model="form.validateCode"
        placeholder="请输入验证码"
      />
    </el-form-item>
    <el-form-item
      label="位置"
      prop="address"
    >
      <el-input
        v-model="form.address"
        placeholder="请输入位置"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryCamera } from '@/api/newDaycare/monitorEquipment'

export default {
  name: 'CameraManagementEdit',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add'
    },
    cameraId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        cameraName: '未命名设备',
        cameraId: null,
        deviceSerial: null,
        brand: null,
        validateCode: null,
        address: null
      },
      options: [
        { value: 'EZVIZ', label: '萤石' } // todo 暂时写死
      ]
    }
  },
  created() {

  },
  mounted() {
    if (this.type === 'edit') this.getDetailData()
  },
  methods: {
    getDetailData() {
      const id = this.cameraId
      queryCamera(id).then((res) => {
        const { data } = res
        this.form = {
          cameraName: data.cameraName,
          cameraId: data.cameraId,
          deviceSerial: data.deviceSerial,
          brand: data.brand,
          validateCode: data.validateCode,
          address: data.address
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  margin-bottom: 24px;
}
</style>
