<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="菜肴名称"
      prop="dishName"
      :rules="formValidate.nullValueRule(true,'请输入菜肴名称')"
    >
      <el-input
        v-model="form.dishName"
        maxlength="10"
        placeholder="请输入菜肴名称"
      />
    </el-form-item>

    <el-form-item
      label="菜肴类型"
      prop="dishType"
      :rules="formValidate.nullValueRule(true,'请选择菜肴类型')"
    >
      <el-select
        v-model="form.dishType"
        placeholder="请选择菜肴类型"
      >
        <el-option
          v-for="item in dishTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="食材用量"
      prop="ingredients"
    >
      <el-input
        v-model="form.ingredients"
        type="textarea"
        :rows="3"
        placeholder="请输入食材用量"
      />
    </el-form-item>

    <el-form-item
      label="上传展示图片"
    >
      <etm-upload-img
        :resource-name="'standardcare/recipesManage'"
        :preview-src-list="form.previewSrcLists"
        :preview-src-key="form.previewSrcKey"
        :limit-number="1"
        @getImgList="getImgList"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
import { getImgUrlRelativePath } from '@/utils'
import { queryFoodDetail, queryFoodTypeList } from '@/api/standardcare/listFeatures/recipesManage'

export default {
  name: 'Edit',
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
        dishName: '',
        dishType: '',
        ingredients: '',
        previewSrcLists: [],
        previewSrcKey: []
      },
      dishTypeOptions: []

    }
  },
  created () {
    this.getFoodTypeData()
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    // 菜肴类型
    getFoodTypeData () {
      queryFoodTypeList().then(res => {
        if (res.data) {
          this.dishTypeOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      }).catch(err => {
        console.error(err)
      })
    },
    init () {
      queryFoodDetail({
        foodId: this.itemId
      }).then((res) => {
        const { data } = res

        this.form = {
          dishName: data.name,
          dishType: data.typeId,
          ingredients: data.description,
          previewSrcLists: [],
          previewSrcKey: []

        }
        if (data.image) {
          this.form.previewSrcLists.push(data.image)
          this.form.previewSrcKey.push(getImgUrlRelativePath(data.image))
        }
        // data.image.forEach(item => {
        //   this.form.previewSrcLists.push(item.url)
        //   this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
        // })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip {
  margin-bottom: 24px;
}
</style>
