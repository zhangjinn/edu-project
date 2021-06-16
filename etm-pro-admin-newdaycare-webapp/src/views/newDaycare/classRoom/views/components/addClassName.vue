<template>
  <div class="addClass-wrap">
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        label="教室名称"
        prop="roomName"
        :rules="formValidate.nullValueRule(true,'请输入场所/教室名称')"
      >
        <el-input
          v-model="form.roomName"
          placeholder="请输入教室名称"
        />
      </el-form-item>
      <el-form-item
        label="教室容量"
        prop="capacity"
      >
        <el-input
          v-model="form.capacity"
          placeholder="20"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="roomDesc"
      >
        <el-input
          v-model="form.roomDesc"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          resize="none"
          placeholder="请输入教室备注"
        />
      </el-form-item>
      <el-form-item
        label="上传展示图片"
        prop="previewSrcLists"
      >
        <etm-upload-img
          :resource-name="'guardcare/roomManage'"
          :preview-src-list="form.previewSrcLists"
          :preview-src-key="form.previewSrcKey"
          @getImgList="getImgList"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * addClass create by Administrator
 * createTime 2020/08/28 15:57
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
// import { getImgUrlRelativePath } from '@/utils'
import etmUploadImg from '@/components/EtmUploadImg/index'
export default {
  name: 'AddClassName',
  components: {
    etmUploadImg
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      formValidate,
      form: {
        roomName: '',
        roomType: '',
        capacity: '',
        principal: '',
        previewSrcLists: [],
        previewSrcKey: [],
        roomDesc: '',
        enable: '1'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    getImgList (val, key) {
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
