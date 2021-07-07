<template>
  <div class="msgSignature-wrap">
    <etm-form ref="form" :model="form" type="dialog">
      <el-form-item
        label="短信签名"
        prop="content"
        :rules="formValidate.nullValueRule(true,'请输入公司或产品名称')"
      >
        <el-input
          v-model="form.content"
          maxlength="10"
          placeholder="请输入公司或产品名称"
        />
      </el-form-item>
      <el-form-item
        label="营业执照"
        prop="previewSrcLists"
        :rules="formValidate.nullValueRule(true,'请选择营业执照')"
      >
        <etm-upload-img
          :resource-name="'daycare/costList'"
          :preview-src-list="form.previewSrcLists"
          :preview-src-key="form.previewSrcKey"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item
        label="门头照"
        prop="previewSrcLists2"
        :rules="formValidate.nullValueRule(true,'请选择门头照')"
      >
        <etm-upload-img
          :resource-name="'daycare/costList'"
          :preview-src-list="form.previewSrcLists2"
          :preview-src-key="form.previewSrcKey2"
          @getImgList="getImgList2"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="请简述使用场景，以便快速通过审核"
        />
      </el-form-item>
      <el-form-item
        v-if="showBtn"
        label=""
        prop="enable"
      >
        <el-checkbox v-model="enable">已阅读并同意</el-checkbox>
        <span class="protocol" @click="showType">《承诺保证书》</span>
      </el-form-item>
      <el-form-item v-if="showBtn">
        <el-button type="primary" @click="onSubmit">提交审核</el-button>
        <!--        <el-button>取消</el-button>-->
      </el-form-item>
    </etm-form>
    <etm-pop
      :visible="intPop"
      title="承诺保证书"
      pop="complex"
      @confirm="intPop = false"
      @cancel="intPop = false"
      @close="intPop = false"
    >
      <commitment-letter />
    </etm-pop>
  </div>

</template>

<script>
/**
 * msgSignature create by Administrator
 * createTime 2020/09/09 19:18
 */
import formValidate from '@/utils/rules'
import etmUploadImg from '@/components/EtmUploadImg/index'
import commitmentLetter from '@/views/newDaycare/smsCenter/commitmentLetter'
// import { getImgUrlRelativePath } from '@/utils'
import { createSignature, querySignature } from '@/api/newDaycare/yunSms'
import { getImgUrlRelativePath } from '@/utils'

export default {
  name: 'MsgPromote',
  components: {
    etmUploadImg, commitmentLetter
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      formValidate,
      form: {
        content: '',
        businessLicense: '',
        previewSrcLists: [],
        previewSrcKey: [],
        previewSrcLists2: [],
        previewSrcKey2: [],
        remark: ''
      },
      intPop: false,
      enable: false,
      showBtn: true
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    getImgList(val, key) {
      // console.log('val', val)
      // console.log('key', key)
      this.form.previewSrcLists = val
      this.form.previewSrcKey = key
    },
    getImgList2(val, key) {
      // console.log('val', val)
      // console.log('key', key)
      this.form.previewSrcLists2 = val
      this.form.previewSrcKey2 = key
    },
    showType() {
      this.intPop = true
    },
    init() {
      const smsType = 'MARKETING'
      querySignature({ smsType: smsType }).then(res => {
        // console.log(res.data.content)
        if (res.data.content) {
          this.showBtn = false
          this.form = {
            content: res.data.content,
            remark: res.data.remark,
            previewSrcLists: [],
            previewSrcKey: [],
            previewSrcLists2: [],
            previewSrcKey2: []
          }
          res.data.businessLicense.forEach(item => {
            this.form.previewSrcLists.push(item.url)
            this.form.previewSrcKey.push(getImgUrlRelativePath(item.url))
          })
          res.data.frontPicture.forEach(item => {
            this.form.previewSrcLists2.push(item.url)
            this.form.previewSrcKey2.push(getImgUrlRelativePath(item.url))
          })
        }
      })
    },
    onSubmit() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          if (this.enable) {
            const imageList = []
            const imageList2 = []
            if (this.form.previewSrcKey.length > 0) {
              this.form.previewSrcKey.map((val) => {
                imageList.push({
                  url: val
                })
              })
            }
            if (this.form.previewSrcKey2.length > 0) {
              this.form.previewSrcKey.map((val) => {
                imageList2.push({
                  url: val
                })
              })
            }
            // console.log(this.form)
            const smsType = 'MARKETING'
            createSignature({
              content: this.form.content,
              businessLicense: imageList,
              frontPicture: imageList2,
              remark: this.form.remark,
              smsType: smsType
            }).then(res => {
              this.$message.success('提交审核成功')
              this.init()
            })
          } else {
            this.$message.warning('请确认勾选已阅读并同意《承诺保证书》')
            // console.log(this.enable)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.msgSignature-wrap {
  .protocol {
    @include c_main_color();
    cursor: pointer;
  }
}
</style>
