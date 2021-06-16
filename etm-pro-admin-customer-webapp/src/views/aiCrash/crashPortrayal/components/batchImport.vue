<template>
  <div class="batchImport-wrap">
    <etm-form
      ref="etmForm"
      type="dialog"
      :rules="rules"
      :model="formData"
    >
      <el-form-item label="模板">
        <el-button
          type="dashed"
          @click.stop="downloadTemplate"
        >
          下载模板
        </el-button>
      </el-form-item>
      <el-form-item
        label="上传文件"
        prop="file"
      >
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :on-change="fileChange"
          :on-remove="fileRemove"
          :limit="1"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { downloadTemplate } from '@/api/customer/aiCrash'
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
  data () {
    return {
      templateUrl: '',
      formData: {
        file: null
      },
      rules: {
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    fileChange (file) {
      if (!this.checkFile(file)) {
        this.formData.file = null
        return this.$message.error('请上传xlsx,xls,csv文件')
      }
      this.formData.file = file
    },
    checkFile (file) {
      const typeList = ['xlsx', 'xlsm', 'xls', 'csv']
      return typeList.includes(file.name.split('.')[1])
    },
    fileRemove () {
      this.formData.file = null
    },
    downloadTemplate () {
      downloadTemplate({ template: 'UN_PORTRAYED_CUSTOMER' }).then(res => {
        downloadFileForUrl(res)
      })
    },
    submit () {
      return new Promise(resolve => {
        this.$refs.etmForm.$children[0].validate(valid => {
          if (!this.formData.file) {
            return this.$message.error('请上传模板文件')
          }
          if (valid) {
            resolve(this.formData)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.batchImport-wrap {

}
</style>
