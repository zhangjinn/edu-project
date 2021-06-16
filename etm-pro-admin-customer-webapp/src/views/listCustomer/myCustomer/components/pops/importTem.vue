<template>
  <div class="importTem-wrap">
    <etm-pop
      title="批量导入"
      pop="big"
      :visible="isShow"
      cancel-btn="取消"
      @cancel="cancel"
      @close="cancel"
      @confirm="confirm"
    >
      <etm-form
        ref="form"
        :model="batchImportData"
        type="dialog"
      >
        <!--        <etm-title>编辑模板</etm-title>-->
        <!--        <el-form-item label="导入字段" prop="">-->
        <!--          <el-checkbox-group v-model="form.checkList">-->
        <!--            <el-checkbox label="1">头像</el-checkbox>-->
        <!--            <el-checkbox label="客户名称">客户名称</el-checkbox>-->
        <!--            <el-checkbox label="联系人称呼">联系人称呼</el-checkbox>-->
        <!--            <el-checkbox label="联系人名称">联系人名称</el-checkbox>-->
        <!--            <el-checkbox label="联系人电话">联系人电话</el-checkbox>-->
        <!--            <el-checkbox label="市场人员">市场人员</el-checkbox>-->
        <!--            <el-checkbox label="微信号码">微信号码</el-checkbox>-->
        <!--            <el-checkbox label="性别">性别</el-checkbox>-->
        <!--            <el-checkbox label="QQ号码">QQ号码</el-checkbox>-->
        <!--            <el-checkbox label="生日">生日</el-checkbox>-->
        <!--            <el-checkbox label="家庭住址">家庭住址</el-checkbox>-->
        <!--          </el-checkbox-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="市场人员" prop="" :rules="formValidate.nullValueRule(true, '请选择市场人员')">-->
        <!--          <el-select>-->
        <!--            <el-option label="选项已" value="11" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="下载自定义模板">
          <el-button
            type="primary"
            @click="downloadFile"
          >
            下载模板
          </el-button>
        </el-form-item>

        <!--        <etm-title>上传文件</etm-title>-->
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
        <el-form-item
          prop="batchCode"
          label="批次号"
          :rules="formValidate.nullValueRule(true, '请填写批次号')"
        >
          <el-input v-model="batchImportData.batchCode" />
        </el-form-item>
        <p class="warning">
          注：批次号可用于批次导入和撤回
        </p>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import { createBatchNumber } from '@/utils/base'
import {
  importCustomerImport
} from '@/api/customer'
import formValidate from '@/utils/rules'
import { Loading } from 'element-ui'
import { queryDownloadFile } from '@/api/portrayal'
import { downloadFileForUrl } from '@/utils/file'
let loadding
export default {
  name: 'ImportTem',
  data () {
    return {
      formValidate,
      batchImportData: {
        // checkList: ['1'],
        batchCode: createBatchNumber(),
        extraAddressArray: [],
        file: null
      },
      isShow: false
    }
  },
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.batchImportData = {
            // checkList: ['1'],
            batchCode: createBatchNumber(),
            extraAddressArray: [],
            file: null
          }
        }
      }
    }
  },
  methods: {
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
        }
      })
    },
    downloadFile () {
      queryDownloadFile('NOT_DEAL_CUSTOMER').then(res => {
        downloadFileForUrl(res)
      })
    },
    handleFile (e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.batchImportData.extraAddressArray.find(item => item.name === e.target.innerText)
        open(file.url)
      }
    },
    show () {
      this.isShow = true
    },
    hide () {
      this.$refs.form.$children[0].resetFields()
      this.isShow = false
    },
    cancel () {
      this.hide()
    },
    confirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          loadding = Loading.service({
            fullscreen: true,
            lock: true,
            customClass: 'etm-loading',
            // text: '数据加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0,0,0,.1)'
          })
          const { file, batchCode } = this.batchImportData

          // console.log(file.raw)
          //
          // return
          importCustomerImport(file.raw, { batchCode }).then(res => {
            this.$emit('success')
            this.hide()
            this.$message.success('导入成功')
            loadding.close()
          }).catch(() => {
            loadding.close()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.warning {
  font-size: 12px;
  color: #999;
  margin-top: -8px;
}
.importTem-wrap{
}
</style>
