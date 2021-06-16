<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      class="cover-box"
      label="上传封面"
      prop="coverSrcKey"
    >
      <etm-upload-img
        :resource-name="'customer/speechCenter'"
        :preview-src-list="form.coverSrcLists"
        :preview-src-key="form.coverSrcKey"
        :limit-number="1"
        @getImgList="getCoverList"
      />
    </el-form-item>
    <el-form-item
      label="模板名称"
      prop="templateName"
      :rules="formValidate.nullValueRule(true,'请输入模板名称')"
    >
      <el-input
        v-model="form.templateName"
        maxlength="10"
        placeholder="请输入模板名称"
      />
    </el-form-item>

    <el-form-item
      label="简介"
      prop="templateDesc"
    >
      <el-input
        v-model="form.templateDesc"
        type="textarea"
        :rows="3"
        maxlength="50"
        :show-word-limit="true"
        placeholder="请输入模板简介"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'
import { getImgUrlRelativePath } from '@/utils'
import {
  querySpeechTemplateDetail
} from '@/api/listSource/speechSource'
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
        templateName: '',
        coverSrcLists: [],
        coverSrcKey: [],
        templateDesc: ''
      }

    }
  },
  created () {
    if (this.type === 'edit') {
      this.init()
    }
  },
  methods: {
    getCoverList (val, key) {
      this.form.coverSrcLists = val
      this.form.coverSrcKey = key
    },

    // 回显数据
    init () {
      querySpeechTemplateDetail({
        speechTemplateId: this.itemId
      }).then((res) => {
        const { data } = res

        this.form = {
          templateName: data.name,
          coverSrcLists: [],
          coverSrcKey: [],
          templateDesc: data.detail
        }

        if (data.url) {
          this.form.coverSrcLists.push(data.url)
          this.form.coverSrcKey.push(getImgUrlRelativePath(data.url))
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
