<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="使用场合"
      prop="useOccasion"
      :rules="formValidate.nullValueRule(true,'请输入使用场合')"
    >
      <el-input
        v-model="form.useOccasion"
        maxlength="20"
        placeholder="请输入使用场合"
      />
    </el-form-item>

    <el-form-item
      label="话术内容"
      prop="templateDesc"
      :rules="formValidate.nullValueRule(true,'请输入话术内容')"
    >
      <el-input
        v-model="form.templateDesc"
        type="textarea"
        :rows="5"
        maxlength="500"
        :show-word-limit="true"
        placeholder="请输入模板简介"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  querySpeechContentDetail
} from '@/api/listSource/speechSource'
export default {
  name: 'EditClass',
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
        useOccasion: '',
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
    // 回显数据
    init () {
      querySpeechContentDetail({
        speechContentId: this.itemId
      }).then((res) => {
        const { data } = res
        this.form = {
          useOccasion: data.situation,
          templateDesc: data.content
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
