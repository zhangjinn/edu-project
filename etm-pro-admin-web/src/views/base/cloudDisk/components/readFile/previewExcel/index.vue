<template>
  <div class="preview-excel">
    <div class="table-box" v-html="table" />
  </div>
</template>

<script>
import XLSX from 'xlsx'
import axios from 'axios'
export default {
  name: 'PrevireExcel',
  data() {
    return {
      table: ''
    }
  },
  created() {
    // http://qiniu.etmpro.etmcn.com/base/cloudDisk/file/13066239582/1608014043938/未成交学员导入模板 (1).xlsx

    axios({
      url: 'http://qiniu.etmpro.etmcn.com/base/cloudDisk/file/13066239582/1608022947756/未成交学员导入模板 (1).xlsx',
      responseType: 'arraybuffer'
    }).then(res => {
      // 获取xlsx对象
      const data = new Uint8Array(res.data)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetNames = workbook.SheetNames // 工作表名称集合

      const worksheet = workbook.Sheets[sheetNames[0]]
      const dataNow = XLSX.utils.sheet_to_html(worksheet)

      const getTableHtml = /<table>(.*)<\/table>/.exec(dataNow)
      this.table = getTableHtml[0]
    })
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.preview-excel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 2500;

  .table-box {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  td{
    padding: 8px;
  }
}
</style>
