<template>
  <div class="importPop-wrap">
    <etm-title>方式一</etm-title>
    <div class="mainText">
      <div class="img">
        <img src="../../../../../assets/images/guardcare/qrCodeScan.png">
      </div>
      <div class="text">适用首次加入班级的幼儿填写，可下载二维码，打印张贴到报名处或转发给家长扫码填写。</div>
    </div>
    <div class="qrCode">
      <div ref="qrCodeBox" class="qrCodeBox">
        <vue-qr v-if="wechatUrl" :text="wechatUrl" :size="118" :margin="10" />
      </div>
      <div class="btn">
        <el-button plain @click="save">
          <span class="iconfont icondownload" />
          下载二维码
        </el-button>
      </div>
    </div>
    <etm-title>方式二</etm-title>
    <div class="mainText">
      <div class="img">
        <img src="../../../../../assets/images/guardcare/excelImport.png">
      </div>
      <div class="text">Excel表格录入幼儿信息，下载幼儿信息导入模板，按要求录入信息，再导入系统中。</div>
    </div>
    <div class="download">
      <div class="tips">1.下载导入幼儿信息模板，按要求填写信息</div>
      <div class="btnBox">
        <el-button plain @click="getTemplate">
          <span class="iconfont icondownload" />
          下载导入模板
        </el-button>
      </div>
      <div class="tips">2.选择填写好并需要导入的Excel文件</div>
      <div>
        <el-upload
          accept=".xls,.xlsx"
          action="#"
          :limit="1"
          :file-list="formData.fileList"
          :auto-upload="false"
          :on-change="fileChange"
          :on-remove="fileRemove"
          @click.native="handleFile"
        >
          <el-button type="dashed">
            <span class="iconfont iconplus" />
            选择文件
          </el-button>
        </el-upload>
      </div>
    </div>
  </div>

</template>

<script>
import VueQr from 'vue-qr'
import { getImportTemplate, getRegistrationUrl } from '@/api/guardcare/childManage/childManage'

/**
 * importPop create by Administrator
 * createTime 2020/9/1 19:12
 */
export default {
  name: 'ImportPop',
  components: {
    VueQr
  },
  filters: {},
  mixins: [],
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      wechatUrl: '',
      fileList: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getUrl()
  },
  methods: {
    getUrl() {
      getRegistrationUrl().then(res => {
        this.wechatUrl = res.data
      })
    },
    save() {
      const link = document.createElement('a')
      link.href = this.$refs.qrCodeBox.childNodes[0].src
      link.download = '二维码.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    fileChange(file) {
      if (!this.checkFile(file)) {
        this.batchImportData.file = null
        return this.$message.error('请上传xlsx,xls,csv文件')
      }
      this.formData.fileList.push(file.raw)
    },
    checkFile(file) {
      const typeList = ['xlsx', 'xlsm', 'xls', 'csv']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove() {
      this.formData.fileList = []
    },
    handleFile(e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.model.extraAddressArray.find(item => item.name === e.target.innerText)
        open(file.url)
      }
    },
    getTemplate() {
      getImportTemplate().then(res => {
        const link = document.createElement('a')
        link.href = res.data
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.importPop-wrap {
  img {
    display: block !important;
  }

  .mainText {
    display: flex;
    padding-bottom: 16px;

    .img {
      width: 32px;

      img {
        width: 100%;
      }
    }

    .text {
      margin-left: 16px;
      height: 32px;
      line-height: 32px;
    }
  }

  .qrCode {
    display: flex;
    padding: 0 0 24px 48px;

    .qrCodeBox {
      width: 120px;
      border: 1px solid $divide-color;
    }

    .btn {
      margin-left: 24px;
    }
  }

  .download {
    padding: 0 0 0 48px;

    .tips {
      padding-bottom: 16px;
    }

    .btnBox {
      padding-bottom: 32px;
    }
  }

  .iconfont {
    font-size: 14px;
  }
}
</style>
