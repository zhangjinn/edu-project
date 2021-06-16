<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="物品名称"
      prop="materialName"
      :rules="formValidate.nullValueRule(true,'请输入物品名称')"
    >
      <el-input
        v-model="form.materialName"
        maxlength="10"
        placeholder="请输入物品名称"
      />
    </el-form-item>

    <el-form-item
      label="物品类型"
      prop="materialTypeId"
      :rules="formValidate.nullValueRule(true,'请选择物品类型')"
    >
      <el-select
        v-model="form.materialTypeId"
        placeholder="请选择物品类型"
      >
        <el-option
          v-for="item in materialTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="销售单价"
      prop="price"
      :rules="[
        { required: true, message: '销售单价不能为空'},
      ]"
    >
      <el-input
        v-model="form.price"
        placeholder="请输入销售单价"
        onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
      />
    </el-form-item>
    <el-form-item
      label="采购单价"
      prop="purchasePrice"
    >
      <el-input
        v-model="form.purchasePrice"
        placeholder="0.00"
      />
    </el-form-item>
    <el-form-item
      label="单位"
      prop="company"
    >
      <el-input
        v-model="form.company"
        placeholder="如：个"
        value="个"
      />
    </el-form-item>
    <el-form-item
      label="物品详情"
      prop="details"
    >
      <el-input
        v-model="form.details"
        type="textarea"
        :rows="3"
        maxlength="200"
        show-word-limit
        resize="none"
        placeholder="请输入物品详情"
      />
    </el-form-item>
    <el-form-item
      label="上传展示图片"
      prop="previewSrcLists"
    >
      <etm-upload-img
        :resource-name="'daycare/article'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        @getImgList="getImgList"
      />
    </el-form-item>
    <el-form-item
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
/**
 * edit create by Administrator
 * createTime 2020/08/31 15:26
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
import { queryMaterialType, queryArticleDetail } from '@/api/newDaycare/materialPriceManage'
import { getImgUrlRelativePath } from '@/utils'

export default {
  name: 'Edit',
  components: {
    etmUploadImg
  },
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
        materialName: '',
        materialTypeId: '',
        price: '',
        company: '',
        purchasePrice: '',
        details: '',
        previewSrcLists: [],
        previewSrcKey: [],
        enable: '1'
      },
      materialTypeOptions: [],
      principalOptions: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.getTypeData()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    getTypeData () {
      queryMaterialType().then(res => {
        const itemSearch = []
        for (let i = 0; i < res.data.length; i++) {
          itemSearch.push({
            value: res.data[i].materialTypeId,
            label: res.data[i].materialTypeName
          })
        }
        // this.$set(this.article[1], 'options', itemSearch)
        this.materialTypeOptions = itemSearch
        // console.log(this.roomTypeOptions)
      })
    },
    init () {
      queryArticleDetail({ materialId: this.itemId }).then(res => {
        // console.log(res.data)
        const { data } = res
        this.form = {
          materialName: data.materialName,
          materialTypeId: data.materialTypeId,
          price: data.price,
          company: data.company,
          purchasePrice: data.purchasePrice,
          details: data.details,
          previewSrcLists: [],
          previewSrcKey: [],
          enable: data.enable ? '1' : '2'
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
<style lang="scss" scoped>
</style>
