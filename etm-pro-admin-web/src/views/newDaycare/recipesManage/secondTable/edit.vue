<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      :rules="formValidate.nullValueRule(true,'请输入菜肴名称')"
      label="菜肴名称"
      prop="foodName"
    >
      <el-input
        v-model="form.foodName"
        maxlength="10"
        placeholder="请输入菜肴名称"
      />
    </el-form-item>

    <el-form-item
      :rules="formValidate.nullValueRule(true,'请选择菜肴类型')"
      label="菜肴类型"
      prop="typeId"
    >
      <el-select v-model="form.typeId" placeholder="请选择菜肴类型">
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
      prop="description"
    >
      <el-input
        v-model="form.description"
        :rows="3"
        placeholder="请输入食材用量"
        type="textarea"
      />
    </el-form-item>

    <el-form-item label="上传图片:">
      <etm-upload-img
        :preview-src-key="form.previewSrcKey"
        :preview-src-list="form.previewSrcLists"
        :text="''"
        resource-name="daycare_listCare/daycare_recipesManage"
        @getImgList="getImgList"
      />
    </el-form-item>
    <el-form-item label="是否开启" porp="enable">
      <el-switch v-model="form.enable" />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryDaycareDishes, queryDaycareFoodTypeList } from '@/api/newDaycare/recipesManage'
import EtmUploadImg from '@/components/EtmUploadImg/index'
import { getImgUrlRelativePath } from '@/utils'

export default {
  name: 'Edit',
  components: { EtmUploadImg },
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
        foodName: '',
        typeId: '',
        description: '',
        image: [],
        previewSrcKey: [],
        previewSrcLists: [],
        enable: true
      },
      dishTypeOptions: []

    }
  },
  created() {
    this.getFoodTypeData()
    if (this.type === 'edit') this.getFoodDetailData()
  },
  methods: {
    // 菜肴类型
    getFoodTypeData() {
      queryDaycareFoodTypeList().then(res => {
        if (res.data) {
          this.dishTypeOptions = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getFoodDetailData() {
      const id = this.itemId
      queryDaycareDishes(id).then((res) => {
        const { data } = res
        this.form = {
          foodName: data.foodName,
          typeId: data.typeId,
          description: data.description,
          image: data.image || [],
          enable: data.enable,
          previewSrcKey: [],
          previewSrcLists: []
        }
        data.image.forEach(v => {
          this.form.previewSrcLists.push(v.url)
          this.form.previewSrcKey.push(getImgUrlRelativePath(v.url))
        })
      })
    },
    filterImage(v) {
      return v.map(it => {
        return it.url
      })
    },
    // 获取上传图片列表
    getImgList(val, key) {
      // console.log(val, key)
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  margin-bottom: 24px;
}
</style>
