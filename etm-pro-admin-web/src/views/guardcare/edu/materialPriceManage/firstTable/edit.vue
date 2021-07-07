<template>
  <etm-form ref="form" :model="form" type="dialog">

    <el-form-item
      label="物品类型"
      prop="type"
      :rules="formValidate.nullValueRule(true,'请选择物品类型')"
    >
      <el-select v-model="form.type" placeholder="请选择物品类型">
        <el-option
          v-for="item in materialTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="物品名称"
      prop="name"
      :rules="formValidate.nullValueRule(true,'请输入物品名称')"
    >
      <el-input
        v-model="form.name"
        maxlength="10"
        placeholder="请输入物品名称"
      />
    </el-form-item>

    <el-form-item
      label="单位"
      prop="unit"
      :rules="formValidate.nullValueRule(true,'请输入单位')"
    >
      <el-input
        v-model="form.unit"
        placeholder="如：期/天/套/个..."
      />
    </el-form-item>

    <el-form-item
      label="入库总数"
      prop="reserve"
      :rules="formValidate.nullValueRule(true,'请输入入库总数')"
    >
      <el-input
        v-model="form.reserve"
        placeholder="请输入入库总数"
      />
    </el-form-item>

    <el-form-item
      label="采购价（元）"
      prop="purchasePrice"
    >
      <el-input
        v-model="form.purchasePrice"
        placeholder="请输入采购价"
      />
    </el-form-item>

    <el-form-item
      label="销售价（元）"
      prop="sellingPrice"
      :rules="formValidate.nullValueRule(true,'请输入销售价')"
    >
      <el-input
        v-model="form.sellingPrice"
        placeholder="请输入销售价"
      />
    </el-form-item>

    <el-form-item
      label="物品图片"
      prop="previewSrcLists"
    >
      <etm-upload-img
        :resource-name="'guardcare/materialManage'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        :limit="9"
        @getImgList="getImgList"
      />
    </el-form-item>

    <el-form-item
      label="物品简介"
      prop="desc"
    >
      <el-input
        v-model="form.desc"
        type="textarea"
        :rows="3"
        placeholder="请输入场所描述"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { getImgUrlRelativePath } from '@/utils'
import formValidate from '@/utils/rules'
import etmUploadImg from '@/components/EtmUploadImg/index'
import {
  getMaterialType,
  getMaterialItem
} from '@/api/guardcare/edu/materialPriceManage'

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
        name: '',
        type: '',
        unit: '',
        reserve: '',
        purchasePrice: '',
        sellingPrice: '',
        previewSrcLists: [],
        previewSrcKey: [],
        desc: ''
      },
      materialTypeOptions: []

    }
  },
  created() {
    this.getMaterialTypeData()
    if (this.type === 'edit') {
      this.getMaterialItemData()
    }
  },
  methods: {
    getImgList(val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },

    // 获取物品类型
    getMaterialTypeData() {
      const param = {
        enable: null,
        type: 'material'
      }

      getMaterialType(param).then((res) => {
        const { data } = res
        this.materialTypeOptions = this.convertDataToOptions(data, 'materialTypeName', 'materialTypeId')
        console.log(this.materialTypeOptions)
      })
    },
    getMaterialItemData() {
      const materialId = this.itemId
      getMaterialItem(materialId).then((res) => {
        const { data } = res

        this.form = {
          name: data.materialName,
          type: data.materialTypeId,
          unit: data.unit,
          reserve: data.reserve,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellPrice,
          previewSrcLists: [],
          previewSrcKey: [],
          desc: data.detail
        }
        data.imageList.forEach(item => {
          this.form.previewSrcLists.push(item.url)
          this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
