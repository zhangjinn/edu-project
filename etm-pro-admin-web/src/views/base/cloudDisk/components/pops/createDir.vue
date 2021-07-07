<template>
  <div class="rename-wrap">
    <etm-pop
      title="创建文件夹"
      cancel-btn="取消"
      :visible="isShow"
      @close="close"
      @cancel="close"
      @confirm="confirm"
    >
      <etm-form ref="form" :model="form" type="dialog">
        <el-form-item prop="documentName" label="文件名称" :rules="formValidate.nullValueRule(true,'请输入文件名称')">
          <el-input v-model="form.documentName" placeholder="请输入文件名称" />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>
<script>
import formValidate from '@/utils/rules'
import {
  createFolder
} from '@/api/base/cloudDisk'
export default {
  name: 'Rename',
  props: {
    parentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formValidate,
      isShow: false,
      form: {
        documentName: ''
      }
    }
  },
  methods: {
    close() {
      this.hide()
    },
    confirm() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const argument = Object.assign({ parentId: this.parentId }, {
            documentName: this.form.documentName.replace(/(\.|\\|\/|\^|\$)/g, '_')
          })
          createFolder(argument).then(res => {
            this.$message.success('文件夹创建成功')
            this.$emit('success', {})
            this.$refs['form'].$children[0].resetFields()
            this.hide()
          })
        }
      })
    },
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.rename-wrap{

}
</style>
