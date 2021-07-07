<template>
  <div class="importPop-wrap">
    <etm-title>第一步</etm-title>
    <div class="mainText">
      <div class="img">
        <img src="../../../../../assets/images/guardcare/qrCodeScan.png">
      </div>
      <div class="text">下载导入菜肴模版，按要求填写信息。</div>
    </div>
    <div class="download">
      <div class="btnBox">
        <el-button plain @click="getTemplate">
          <span class="iconfont icondownload" />
          下载导入模板
        </el-button>
      </div>

    </div>

    <etm-title>第二步</etm-title>
    <div class="mainText">
      <div class="img">
        <img src="../../../../../assets/images/guardcare/excelImport.png">
      </div>
      <div class="text">上传填写好并需要导入的Excel文件。</div>
    </div>
    <div class="download">
      <div>
        <el-upload
          accept=".xls"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :on-remove="remove"
          :on-change="handleUpload"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button plain>
            <span class="iconfont iconplus" />
            选择文件
          </el-button>
        </el-upload>
      </div>
    </div>
  </div>

</template>

<script>
import { getImportTemplate } from '@/api/guardcare/careManage/recipesManage'
/**
 * importPop create by Administrator
 * createTime 2020/9/1 19:12
 */
export default {
  name: 'Import',
  filters: {},
  mixins: [],

  data() {
    return {
      fileList: []
    }
  },

  methods: {

    handleUpload(file) {
      this.fileList.push(file.raw)
    },
    remove() {
      this.fileList = []
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
  img{
    display: block!important;
  }
.mainText{
  display: flex;
  padding-bottom: 16px;
  .img{
    width: 32px;
    img{
      width: 100%;
    }
  }
  .text{
    margin-left: 16px;
    height: 32px;
    line-height: 32px;
  }
}
  .qrCode{
    display: flex;
    padding: 0 0 24px 48px;
    .qrCodeBox{
      width: 120px;
      border: 1px solid $divide-color;
    }
    .btn{
      margin-left: 24px;
    }
  }
  .download{
    padding: 0 0 0 48px;
    .tips{
      padding-bottom: 16px;
    }
    .btnBox{
      padding-bottom: 32px;
    }
  }
  .iconfont{
    font-size: 14px;
  }
}
</style>
