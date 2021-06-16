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
        :model="batchImportData"
        type="dialog"
      >
        <!--        <el-form-item prop="" label="导入字段">-->
        <!--          <el-checkbox-group v-model="form.checkbox">-->
        <!--            <el-checkbox label="客户字段">客户字段</el-checkbox>-->
        <!--            <el-checkbox label="客户字段">客户字段</el-checkbox>-->
        <!--            <el-checkbox label="客户字段">客户字段</el-checkbox>-->
        <!--            <el-checkbox label="客户字段">客户字段</el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <el-form-item label="下载模板">
          <el-button
            type="primary"
            @click="downloadFile"
          >
            下载模板
          </el-button>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            drag
            :file-list="batchImportData.extraAddressArray"
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
import { downloadFileForUrl } from '@/utils/file'
import {
  customerBatchImport,
  queryDownloadFile
} from '@/api/portrayal'
import { Loading } from 'element-ui'

let loadding
export default {
  name: 'BatchImport',
  data () {
    return {
      isShow: false,
      batchImportData: {
        extraAddressArray: [],
        file: null
      }
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    downloadFile () {
      queryDownloadFile('UN_PORTRAYED_CUSTOMER').then(res => {
        downloadFileForUrl(res)
      })
    },
    cancel () {
      this.batchImportData.extraAddressArray = []
      this.isShow = false
    },
    confirm () {
      loadding = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: 'etm-loading',
        // text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.1)'
      })
      const { file } = this.batchImportData

      if (!file) {
        this.$message.warning('请上传文件')
        loadding.close()
        return
      }

      customerBatchImport(file.raw, {}).then(res => {
        this.$emit('success')
        // this.$message.success('待画像客户导入成功')
        this.$etmTip.init({
          type: 'success',
          title: '导入客户画像完成',
          content: `成功导入${res.data.successItemTotal}条数据`,
          confirmBtn: '确定',
          cancel: () => {
            this.$etmTip.close()
            this.$emit('success')
          },
          confirm: () => {
            this.$etmTip.close()
            this.$emit('success')
          }
        })
        this.cancel()
        this.$etmTip.open()
        loadding.close()
      }).catch(res => {
        loadding.close()
      })
    },
    fileChange (file) {
      if (!this.checkFile(file)) {
        this.batchImportData.file = null
        return this.$message.error('请上传xlsx,xls,csv文件')
      }
      this.batchImportData.file = file
    },
    checkFile (file) {
      const typeList = ['xlsx', 'xlsm', 'xls', 'csv']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove (file, fileList) {
      this.batchImportData.extraAddressArray.forEach((item, index) => {
        if (item.name === file.name) {
          this.batchImportData.extraAddressArray.splice(index, 1)
          this.batchImportData.file = ''
        }
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.batchImportData.extraAddressArray.find(item => item.name === e.target.innerText)
        open(file.url)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.batchImport-wrap{

}
</style>
