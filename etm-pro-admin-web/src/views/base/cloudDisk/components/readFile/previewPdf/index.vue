<template>
  <div v-if="isShow" class="preview-pdf">
    <div class="pdfBoxs">
      <div class="pdf-tools">
        <div v-if="pageCount > 1" class="pages">
          <p class="arrow">
            <span class="turn" :class="{grey: currentPage==1}" @click="changePdfPage(0)">上一页</span>
            {{ currentPage }} / {{ pageCount }}
            <span class="turn" :class="{grey: currentPage==pageCount}" @click="changePdfPage(1)">下一页</span>
          </p>
        </div>
        <div v-else />
        <div class="close" @click="hide"><span>关闭</span></div>
      </div>
      <div class="preview-box">
        <pdf
          v-if="pdfSrc"
          :src="pdfSrc"
          :page="currentPage"
          @num-pages="pageCount=$event"
          @page-loaded="currentPage=$event"
          @loaded="loadPdfHandler"
        />
      </div>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  name: 'PreviewPdf',
  components: {
    pdf
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      pdfSrc: ''
    }
  },
  watch: {
    isShow: {
      handler(n) {
        if (n) {
          this.pdfSrc = pdf.createLoadingTask(this.src)
        }
      }
    }
    // src: {
    //   immediate: true,
    //   handler(n) {
    //     // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    //     if (n) {
    //       this.pdfSrc = pdf.createLoadingTask(this.src)
    //     }
    //   }
    // }
  },
  created() {
    // this.pdfSrc = pdf.createLoadingTask(this.src)
  },
  methods: {
    show() {
      this.isShow = true
      this.currentPage = 1
    },
    hide() {
      this.isShow = false
      this.pdfSrc = ''
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        // console.log(this.currentPage)
      }
    },
    loadPdfHandler(e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    }
  }
}
</script>

<style scoped lang="scss">
.preview-pdf{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 2000;
  background: rgba(0,0,0,.8);

  .pdfBoxs{
    width: 60%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 20%;
    background: #fff;

    &:hover{
      .pdf-tools{
        display: flex;
      }
    }

    .pdf-tools {
      position: absolute;
      top: 0;
      padding: 0 16px;
      width: 100%;
      left: 0;
      display: none;
      color: #999;
      height: 60px;
      z-index: 10;
      justify-content: space-between;
      align-items: center;

      span{
        cursor: pointer;
      }
    }

    .preview-box{
      overflow-y: scroll;
      height: 100%;
      width: 100%;
    }
  }

}
</style>
