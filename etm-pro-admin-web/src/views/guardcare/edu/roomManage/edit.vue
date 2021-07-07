<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      label="场所/教室名称"
      prop="roomName"
      :rules="formValidate.nullValueRule(true,'请输入场所/教室名称')"
    >
      <el-input
        v-model="form.roomName"
        maxlength="10"
        placeholder="请输入场所/教室名称"
      />
    </el-form-item>

    <el-form-item
      label="场所类型"
      prop="roomType"
      :rules="formValidate.nullValueRule(true,'请选择场所类型')"
    >
      <el-select v-model="form.roomType" placeholder="请选择场所类型">
        <el-option
          v-for="item in roomTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="可容纳人数"
      maxlength="10"
      prop="capacity"
    >
      <el-input
        v-model="form.capacity"
        placeholder="请输入可容纳人数"
      />
    </el-form-item>

    <el-form-item
      label="负责人"
      prop="principal"
    >
      <el-select v-model="form.principal" filterable placeholder="请选择负责人" @change="changePrincipal(form.principal)">
        <el-option
          v-for="item in principalOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="场所图片"
      prop="previewSrcLists"
    >
      <etm-upload-img
        :resource-name="'guardcare/roomManage'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        :select-multiple="true"
        @getImgList="getImgList"
      />
    </el-form-item>

    <el-form-item
      label="场所简介"
      prop="roomDesc"
    >
      <el-input
        v-model="form.roomDesc"
        type="textarea"
        :rows="3"
        placeholder="请输入场所简介"
      />
    </el-form-item>

    <el-form-item
      label="是否启用"
      prop="enable"
    >
      <el-radio-group v-model="form.enable">
        <el-radio label="1">是</el-radio>
        <el-radio label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { getImgUrlRelativePath } from '@/utils'
import etmUploadImg from '@/components/EtmUploadImg/index'
import {
  getRoomType,
  getRoomItem
} from '@/api/guardcare/edu/roomManage'
import { getEmployeeAll } from '@/api/customer'
export default {
  name: 'EditClass',
  components: {
    etmUploadImg
  },
  mixins: [baseMixin],
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
        roomName: '',
        roomType: '',
        capacity: '',
        principal: '',
        principalName: '',
        previewSrcLists: [],
        previewSrcKey: [],
        roomDesc: '',
        enable: '1'
      },
      roomTypeOptions: [],
      principalOptions: []

    }
  },
  created() {
    this.getRoomTypeData()
    this.getEmployeeAllData()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {

    getImgList(val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },

    // 查询场所类型列表
    getRoomTypeData() {
      getRoomType().then((res) => {
        this.roomTypeOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 获取市场人员
    getEmployeeAllData() {
      getEmployeeAll().then((res) => {
        this.principalOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 获取负责任名称
    changePrincipal(val) {
      const obj = this.principalOptions.find((item) => {
        return item.value === val
      })
      console.log('principal')
      console.log(obj)
      this.form.principalName = obj.label
    },

    // 回显数据
    init() {
      const materialId = this.itemId
      getRoomItem(materialId).then((res) => {
        const { data } = res

        this.form = {
          roomName: data.name,
          roomType: data.roomTypeId,
          capacity: data.num,
          principal: data.employeeId,
          principalName: data.employeeName,
          previewSrcLists: [],
          previewSrcKey: [],
          roomDesc: data.description,
          enable: data.enable ? '1' : '2'
        }
        data.attachment.forEach(item => {
          this.form.previewSrcLists.push(item.url)
          this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
        })
      })
    }

  }
}
</script>

<style scoped>

</style>
