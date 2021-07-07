<template>
  <div class="edit-wrap">
    <etm-form ref="form" :model="form" type="dialog">
      <el-form-item
        label="费用名称"
        prop="priceName"
        :rules="formValidate.nullValueRule(true,'请输入物品名称',['change'])"
      >
        <el-input
          v-model="form.priceName"
          v-in-focus
          maxlength="10"
          placeholder="请输入费用名称"
        />
      </el-form-item>
      <el-form-item
        label="单价"
        prop="price"
        :rules="[
          { required: true, message: '单价不能为空'},
        ]"
      >
        <el-input
          v-model="form.price"
          placeholder="请输入单价"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
        />
      </el-form-item>
      <el-form-item
        label="费用详情"
        prop="details"
      >
        <el-input
          v-model="form.details"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          resize="none"
          placeholder="请输入费用详情"
        />
      </el-form-item>
      <el-form-item
        label="上传展示图片"
        prop="previewSrcLists"
      >
        <etm-upload-img
          :resource-name="'daycare/costList'"
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
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
/**
 * edit create by Administrator
 * createTime 2020/08/31 15:26
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
// import { getImgUrlRelativePath } from '@/utils'
import etmUploadImg from '@/components/EtmUploadImg/index'
import { getImgUrlRelativePath } from '@/utils'
import { queryCostDetail } from '@/api/newDaycare/materialPriceManage'

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
        priceName: '',
        roomType: '',
        previewSrcLists: [],
        previewSrcKey: [],
        details: '',
        enable: '1'
      },
      roomTypeOptions: [],
      principalOptions: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getImgList(val, key) {
      // console.log('val', val)
      // console.log('key', key)
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    init() {
      queryCostDetail({ priceId: this.itemId }).then(res => {
        // console.log(res.data)
        const { data } = res
        this.form = {
          priceName: data.priceName,
          priceId: data.priceId,
          price: data.price,
          details: data.details,
          previewSrcLists: [],
          previewSrcKey: [],
          enable: data.enable ? '1' : '2'
        }
        data.image.forEach(item => {
          this.form.previewSrcLists.push(item.url)
          this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-wrap {

}
</style>
