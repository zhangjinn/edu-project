<template>
  <div class="batchImport-wrap">
    <etm-pop
      pop="complex"
      title="批量导入待画像客户"
      cancel-btn="取消"
      :visible="isShow"
      @cancel="cancel"
      @close="cancel"
      @confirm="confirm"
    >
      <etm-form
        ref="form"
        :model="form"
        type="dialog"
      >
        <el-form-item
          prop=""
          label="导入字段"
        >
          <el-checkbox-group v-model="form.checkbox">
            <el-checkbox label="客户字段">
              客户字段
            </el-checkbox>
            <el-checkbox label="客户字段">
              客户字段
            </el-checkbox>
            <el-checkbox label="客户字段">
              客户字段
            </el-checkbox>
            <el-checkbox label="客户字段">
              客户字段
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="下载模板">
          <el-button type="primary">
            下载模板
          </el-button>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            drag
            :file-list="form.extraAddressArray"
            action="#"
            :auto-upload="false"
            :on-change="fileChange"
            :on-remove="fileRemove"
            @click.native="handleFile"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/common'

export default {
  name: 'BatchImport',
  data () {
    return {
      isShow: false,
      form: {
        checkbox: [],
        extraAddressArray: []
      }
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    cancel () {
      this.isShow = false
    },
    confirm () {
      this.cancel()
    },
    fileChange (file) {
      const total = 1024 * 1024 * 10
      const files = deepCopy(this.form.extraAddressArray)
      if (file.size > total) {
        this.form.file = null
        setTimeout(() => {
          this.form.extraAddressArray = files
        }, 0)
        return this.$message.error('文件大小不能超过10M')
      }

      if (!this.checkFile(file)) {
        this.form.file = null

        setTimeout(() => {
          this.form.extraAddressArray = files
        }, 0)
        return this.$message.error('请上传JPG/PNG/PDF/DOC/DOCX/XLS/XLSX文件')
      }
      this.form.extraAddressArray.push(file)
    },
    checkFile (file) {
      const typeList = ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove (file, fileList) {
      this.form.extraAddressArray.forEach((item, index) => {
        if (item.name === file.name) {
          this.form.extraAddressArray.splice(index, 1)
        }
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.form.extraAddressArray.find(item => item.name === e.target.innerText)
        let getUrl = ''
        if (window.createObjectURL !== undefined) { // basic
          getUrl = window.createObjectURL(file.raw)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          getUrl = window.URL.createObjectURL(file.raw)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          getUrl = window.webkitURL.createObjectURL(file.raw)
        }
        open(getUrl)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.batchImport-wrap{

}
</style>
