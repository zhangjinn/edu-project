<template>
  <div class="preview-pdf">
    <div class="pdfBoxs">
      <div class="pdf-tools">
        <div v-if="pageCount > 1" class="pages">
          <p class="arrow">
            <span class="turn" :class="{grey: currentPage==1}" @click="changePdfPage(0)">上一页</span>
            {{ currentPage }} / {{ pageCount }}
            <span class="turn" :class="{grey: currentPage==pageCount}" @click="changePdfPage(1)">下一页</span>
          </p>
        </div>
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
    item: {
      type: Object,
      default() {
        return {}
      }
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
    item: {
      immediate: true,
      deep: true,
      handler(n) {
        if (Object.keys(n).length) {
          this.pdfSrc = pdf.createLoadingTask(this.item.url)
        }
      }
    }
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
  width: 100%;
  height: 100%;

  .pdfBoxs{
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    font-size: 13px;

    .pdf-tools {
      position: absolute;
      bottom: 0;
      padding: 0 16px;
      width: 100%;
      left: 0;
      color: #999;
      height: 30px;
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
