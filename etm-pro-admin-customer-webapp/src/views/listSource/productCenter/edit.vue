<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      class="cover-box"
      label="上传封面"
    >
      <etm-upload-img
        :resource-name="'customer/productCenter'"
        :preview-src-list="form.coverSrcLists"
        :preview-src-key="form.coverSrcKey"
        :limit-number="1"
        @getImgList="getCoverList"
      />
    </el-form-item>
    <el-form-item
      label="产品名称"
      prop="productName"
      :rules="formValidate.nullValueRule(true,'请输入产品名称')"
    >
      <el-input
        v-model="form.productName"
        maxlength="10"
        placeholder="请输入产品名称"
      />
    </el-form-item>

    <el-form-item
      label="产品类型"
      prop="productType"
      :rules="formValidate.nullValueRule(true,'请选择产品类型')"
    >
      <el-select
        v-model="form.productType"
        placeholder="请选择产品类型"
      >
        <el-option
          v-for="item in productTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="销售单价"
      prop="unitPrice"
      :rules="formValidate.nullValueRule(true,'请输入销售单价')"
    >
      <el-input
        v-model="form.unitPrice"
        placeholder="请输入销售单价"
        oninput="value=value.replace(/[^0-9.]/g,'')"
      />
    </el-form-item>
    <el-form-item
      label="采购单价"
      prop="purchasePrices"
    >
      <el-input
        v-model="form.purchasePrices"
        placeholder="请输入采购单价"
        oninput="value=value.replace(/[^0-9.]/g,'')"
      />
    </el-form-item>
    <el-form-item
      label="单位"
      prop="unit"
    >
      <el-input
        v-model="form.unit"
        placeholder="如：个"
      />
    </el-form-item>

    <el-form-item
      label="产品详情"
      prop="productDesc"
    >
      <el-input
        v-model="form.productDesc"
        type="textarea"
        :rows="3"
        maxlength="400"
        :show-word-limit="true"
        placeholder="请输入产品详情"
      />
    </el-form-item>
    <el-form-item
      label="上传展示图片"
      prop="previewSrcLists"
    >
      <etm-upload-img
        :resource-name="'customer/productCenter'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        :select-multiple="true"
        :limit-number="9"
        @getImgList="getImgList"
      />
    </el-form-item>

    <el-form-item
      v-if="type === 'edit'"
      label="是否开启"
      prop="enable"
    >
      <el-radio-group v-model="form.enable">
        <el-radio label="1">
          是
        </el-radio>
        <el-radio label="2">
          否
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
import { getImgUrlRelativePath } from '@/utils'
import {
  queryProductTypeList,
  queryProductDetail
} from '@/api/listSource/productCenter'
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
        productName: '',
        productType: '',
        unitPrice: '',
        purchasePrices: '',
        unit: '',
        previewSrcLists: [],
        previewSrcKey: [],
        coverSrcLists: [],
        coverSrcKey: [],
        productDesc: '',
        enable: '1'
      },
      productTypeOptions: []

    }
  },
  created () {
    this.queryProductTypeData()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {

    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    getCoverList (val, key) {
      this.form.coverSrcLists = val
      this.form.coverSrcKey = key
    },
    // 查询产品类型列表
    queryProductTypeData () {
      queryProductTypeList().then((res) => {
        this.productTypeOptions = this.convertDataToOptions(res.data, 'productTypeName', 'productTypeId')
      })
    },

    // 回显数据
    init () {
      queryProductDetail({
        productId: this.itemId
      }).then((res) => {
        const { data } = res

        this.form = {
          productName: data.name,
          productType: data.productTypeId,
          unitPrice: data.unitPrice,
          purchasePrices: data.purchasePrices,
          unit: data.unit,
          previewSrcLists: [],
          previewSrcKey: [],
          coverSrcLists: [],
          coverSrcKey: [],
          productDesc: data.details,
          enable: data.status ? '1' : '2'
        }
        data.imageList.forEach(item => {
          this.form.previewSrcLists.push(item.url)
          this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
        })
        if (data.cover) {
          this.form.coverSrcLists.push(data.cover)
          this.form.coverSrcKey.push(getImgUrlRelativePath(data.cover))
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.cover-box {
  margin-top: 10px;
}

::v-deep.el-textarea {
  .el-input__count {
    background: none;
  }
}
</style>
