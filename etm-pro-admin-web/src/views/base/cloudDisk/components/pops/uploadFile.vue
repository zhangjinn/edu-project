<template>
  <div class="upload-file">
    <etm-pop
      title="上传文件"
      cancel-btn="取消"
      pop="complex"
      :visible="isShow"
      @cancel="close"
      @close="close"
      @confirm="confirm"
    >
      <etm-form ref="form" :modal="batchImportData" type="dialog">
        <el-form-item prop="file" label="文件选择">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :on-change="fileChange"
            :on-remove="fileRemove"
            :file-list="fileList"
            @click.native="handleFile"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件大小">
          {{ fileSize | mb }}M
        </el-form-item>
        <!--        <el-form-item label="文件夹">-->
        <!--          <el-select v-model="form.select">-->
        <!--            <el-option label="根目录/软件" :value="1" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="云盘剩余空间">
          {{ size }}
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import {
  createVaildFileName,
  uploadFiles
} from '@/api/base/cloudDisk'
import {
  getEmployee
} from '@/views/newDaycare/contract/common'
import { Loading } from 'element-ui-etm'

let uploadLoading
export default {
  name: 'UploadFile',
  filters: {
    mb(value) {
      return (value / (1024 * 1024)).toFixed(2)
    }
  },
  props: {
    size: {
      type: String,
      default: '0M'
    },
    parentId: {
      type: Number || null,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      fileSize: 0,
      isShow: false,
      batchImportData: {
        file: ''
      }
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
      this.$refs['form'].$children[0].resetFields()
      this.fileSize = 0
      this.$refs['upload'].clearFiles()
    },
    close() {
      this.hide()
    },
    uploadFile(file) {
      return new Promise((resolve, reject) => {
        const userInfo = getEmployee()

        createVaildFileName({
          parentId: this.parentId,
          documentName: file.name
        }).then(res => {
          if (!res.data) {
            uploadFiles({
              file: file,
              tenantId: userInfo.organizationId,
              employeeId: userInfo.employeeId,
              directoryId: this.parentId || ''
            }).then(res => {
              if (res.data.data.suc) {
                // this.$message.success('上传文件成功')
                resolve({
                  fileName: file.name,
                  type: 'success'
                })
              } else {
                // this.$message.error('上传文件失败')
                resolve({
                  fileName: file.name,
                  type: 'error'
                })
              }
              // uploadLoading.close()
            })
          } else {
            // this.$message.warning('文件名字重复')
            resolve({
              fileName: file.name,
              type: 'replace'
            })
          }
        })
      })
    },
    confirm() {
      if (!this.fileList.length) {
        this.$message.warning('请上传文件')
        return
      }
      uploadLoading = Loading.service({
        fullscreen: true,
        lock: true,
        text: '文件上传中...',
        background: 'rgba(0,0,0,.1)'
      })

      const promise = this.fileList.map(file => {
        return this.uploadFile(file)
      })

      Promise.all(promise).then(res => {
        // this.$refs['form'].$children[0].resetFields()
        // this.isShow = false
        // this.fileSize = 0
        //
        // this.$emit('success', {})
        const status = {
          success: [],
          error: [],
          replace: []
        }

        res.map(cur => {
          status[cur.type].push(cur)
        })

        if (status.success.length === res.length) {
          this.$message.success('文件上传成功')
          this.$refs['form'].$children[0].resetFields()
          this.isShow = false
          this.fileList = []
          this.fileSize = 0

          this.$emit('success', {})
        } else if (status.success.length === 0) {
          this.$message.error('文件上传失败')
        } else {
          this.$message.warning(`成功上传${status.success.length}个文件`)
          this.$refs['form'].$children[0].resetFields()
          this.isShow = false
          this.fileList = []
          this.fileSize = 0

          this.$emit('success', {})
        }

        uploadLoading.close()
      })

      // const userInfo = getEmployee()
      //
      // createVaildFileName({
      //   parentId: this.parentId,
      //   documentName: this.batchImportData.file.name
      // }).then(res => {
      //   if (!res.data) {
      //     uploadLoading = Loading.service({
      //       fullscreen: true,
      //       lock: true,
      //       text: '文件上传中...',
      //       background: 'rgba(0,0,0,.1)'
      //     })
      //
      //     uploadFiles({
      //       file: this.batchImportData.file,
      //       tenantId: userInfo.organizationId,
      //       employeeId: userInfo.employeeId,
      //       directoryId: this.parentId || ''
      //     }).then(res => {
      //       if (res.data.data.suc) {
      //         this.$message.success('上传文件成功')
      //         this.$refs['form'].$children[0].resetFields()
      //         this.isShow = false
      //         this.fileSize = 0
      //
      //         this.$emit('success', {})
      //       } else {
      //         this.$message.error('上传文件失败')
      //       }
      //       uploadLoading.close()
      //     })
      //   } else {
      //     this.$message.warning('文件名字重复')
      //   }
      // })

      // Loading.service({
      //   fullscreen: true,
      //   lock: true,
      //   text: '数据加载中...',
      //   background: 'rgba(0,0,0,.1)'
      // })
    },
    fileChange(file) {
      if (!this.checkFile(file)) {
        this.batchImportData.file = null
        return this.$message.error('文件大小不能大于100MB')
      }
      // this.$nextTick(() => {

      // })

      this.fileList.push(file)
      this.fileSize = this.fileSize + file.size
      this.batchImportData.file = file
    },
    checkFile(file) {
      // const typeList = ['xlsx', 'xlsm', 'xls', 'csv', 'jpeg', 'png', 'jpg']
      // return typeList.includes(file.name.split('.')[1])
      if (file.size > (1024 * 1024 * 100)) {
        return false
      }
      return true
    },
    fileRemove(file, fileList) {
      this.fileList = fileList
      this.fileSize = this.fileSize - file.size
    },
    handleFile(e) {

    }
  }
}
</script>

<style scoped lang="scss">
.upload-file{

}
</style>
