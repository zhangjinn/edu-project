<template>
  <div class="batchImport-wrap">
    <etm-form ref="etmForm" type="dialog" :rules="rules" :model="batchImportData">
      <el-form-item label="导入批次号" prop="batchNo">
        <el-input v-model="batchImportData.batchNo" />
      </el-form-item>
      <!--<el-form-item label="市场人员">-->
      <!--  <el-select v-model="batchImportData.markerId">-->
      <!--    <el-option v-for="(marker) of markers" :key="marker.value" :label="marker.label" :value="marker.value" />-->
      <!--  </el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="名单来源">
        <el-input v-model="batchImportData.source" placeholder="请输入名单来源" />
      </el-form-item>
      <el-form-item label="模板">
        <!--<el-button @click="downloadTemplate">下载模板</el-button>-->
        <!--        <a :href="templateUrl">-->
        <!--        {{category}}-->
        <!--        UNSOLD-->
        <!--        DEAL-->
        <el-button v-if="category === 'UNSOLD'" type="dashed" @click="downloadTemplate('UNSOLD_IMPORT_TEMPLATE')">下载模板</el-button>
        <template v-else>
          <el-button type="dashed" @click="downloadTemplate('TA_COMPLETED_IMPORT_TEMPLATE')">下载早教学员模板</el-button>
          <el-button type="dashed" @click="downloadTemplate('CA_COMPLETED_IMPORT_TEMPLATE')">下载托育学员模板</el-button>
        </template>
        <!--        </a>-->
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
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import { createBatchNumber } from '@/utils/base'
import baseMixin from '@/layout/mixin/baseMixin'
import { downloadTemplate } from '@/api/newDaycare/importBatch'
import { downloadFileForUrl } from '@/utils/file'

/**
 * batchImport create by haijinsha
 * createTime 2020/8/28 16:53
 */
export default {
  name: 'BatchImport',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    category: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateUrl: '',
      markers: [],
      rules: {
        batchNo: { required: true, message: '请输入批次号', trigger: 'blur' }
      },
      batchImportData: {
        source: '',
        batchNo: createBatchNumber(),
        file: '',
        category: this.category,
        extraAddressArray: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryEmployeeSelectByTabCode({ tagCode: '' }).then(res => {
        console.log(res)
        this.markers = this.convertDataToOptions(res.data, 'name', 'id')
        console.log(this.markers)
      })

      // downloadTemplate({ params: this.category === 'UNSOLD' ? 'UNSOLD_IMPORT_TEMPLATE' : 'COMPLETED_IMPORT_TEMPLATE' }).then(res => {
      //   this.templateUrl = res.data
      // })
    },
    reset() {
      this.batchImportData = {
        source: '',
        batchNo: createBatchNumber(),
        file: '',
        category: this.category,
        extraAddressArray: []
      }
    },
    fileChange(file) {
      if (!this.checkFile(file)) {
        this.batchImportData.file = null
        return this.$message.error('请上传xlsx,xls,csv文件')
      }
      this.batchImportData.file = file
    },
    checkFile(file) {
      const typeList = ['xlsx', 'xlsm', 'xls', 'csv']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove(file, fileList) {
      this.model.extraAddressArray.forEach((item, index) => {
        if (item.name === file.name) {
          this.model.extraAddressArray.splice(index, 1)
        }
      })
    },
    handleFile(e) {
      if (e.target.className === 'el-upload-list__item-name' && e.target.tagName === 'A') {
        const file = this.model.extraAddressArray.find(item => item.name === e.target.innerText)
        open(file.url)
      }
    },
    downloadTemplate(template) {
      downloadTemplate({
        template
      }).then(res => {
        downloadFileForUrl(res)
      })
    },
    submit() {
      let result = null
      this.$refs.etmForm.$children[0].validate(valid => {
        if (!this.batchImportData.file) {
          return this.$message.error('请上传模板文件')
        }
        if (valid) {
          result = this.batchImportData
        }
      })
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.batchImport-wrap {

}
</style>
