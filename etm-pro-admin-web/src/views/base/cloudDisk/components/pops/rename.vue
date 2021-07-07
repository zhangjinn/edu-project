<template>
  <div class="rename-wrap">
    <etm-pop
      title="重命名"
      cancel-btn="取消"
      :visible="isShow"
      @close="close"
      @cancel="close"
      @confirm="confirm"
    >
      <etm-form ref="form" :model="form" type="dialog">
        <el-form-item prop="name" label="文件夹名称" :rules="formValidate.nullValueRule(true,'请输入文件夹名称')">
          <el-input v-model="form.name" placeholder="请输入文件夹名称" />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>
<script>
import formValidate from '@/utils/rules'
import {
  updateFileName
  // createVaildFileName
} from '@/api/base/cloudDisk'
export default {
  name: 'Rename',
  props: {
    document: {
      type: Object || undefined,
      default() {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formValidate,
      isShow: false,
      currentExten: '',
      currentName: '',
      form: {
        name: ''
      }
    }
  },
  watch: {
    document: {
      immediate: true,
      deep: true,
      handler(n) {
        if (n && Object.keys(n).length) {
          const suffixIndex = n['name'].lastIndexOf('.')
          const name = suffixIndex === -1 ? n['name'] : n['name'].substr(0, suffixIndex)
          const suffix = suffixIndex === -1 ? '' : n['name'].substr(suffixIndex)

          this.form.name = name
          this.currentName = name
          this.currentExten = suffix
        }
      }
    }
  },
  methods: {
    close() {
      this.isShow = false
      this.form.name = this.currentName
    },
    confirm() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          // if (!res.data) {
          updateFileName({
            documentId: this.document.id,
            documentName: this.form.name.replace(/(\.|\\|\/|\^|\$)/g, '_') + this.currentExten
          }).then(res => {
            this.$message.success('文件重命名成功')
            this.$emit('success', {})
            this.$refs['form'].$children[0].resetFields()
            this.hide()
          })
          // } else {
          //   this.$message.warning('文件名已存在')
          // }
          // })
        }
      })
    },
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
      this.currentExten = ''
      this.form = {
        name: ''
      }
      this.$refs['form'].$children[0].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.rename-wrap{

}
</style>
