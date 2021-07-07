<template>
  <div class="addOrg-wrap">
    <el-form ref="org" :model="orgData" :rules="orgRule" label-width="100px">
      <el-form-item label="上级组织:">
        <span>{{ currentNode.data.name }}</span>
      </el-form-item>
      <el-form-item label="组织LOGO:" prop="logo" class="logo">
        <etm-upload-image
          :value="imgUrl || orgData.logo"
          shape="square"
          btn-text="上传图片"
          description="图片尺寸168*100"
          resource-name="basic/organization"
          @success="getImg"
        />
      </el-form-item>
      <el-form-item label="组织名称:" prop="name">
        <el-input v-model="orgData.name" placeholder="请输入组织名称" />
      </el-form-item>
      <el-form-item label="组织地址:" prop="address">
        <el-input v-model="orgData.address" placeholder="请输入组织地址" />
      </el-form-item>
      <el-form-item label="组织负责人:" prop="organizationManager">
        <el-input v-model="orgData.organizationManager" :disabled="orgData.status === 'edit'" placeholder="请输入组织负责人" />
      </el-form-item>
      <el-form-item label="手机号码:" prop="telephone">
        <el-input v-model="orgData.telephone" :disabled="orgData.status === 'edit'" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="选择方案:" prop="solutionIdList">
        <el-checkbox-group v-model="orgData.solutionIdList" @change="change">
          <el-checkbox v-for="(app, index) of applicationList" :key="index" :label="app.solutionId">{{ app.displayName }}</el-checkbox>
        </el-checkbox-group>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkPhone } from '@/api/organization'
import EtmUploadImage from '@/views/base/profile/EtmUploadImage'
import { getCurrentAccountHaveSolutionList } from '@/api/organizationV2'

/**
   *  2020/4/8 10:39
   *  haijinsha
   */
export default {
  name: 'AddOrg',
  components: { EtmUploadImage },
  filters: {},
  mixins: [],
  inject: ['topInfo', 'currentNode'],
  props: {
    org: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    const checkUser = async(rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          await checkPhone(value).then(res => {
            if (res.data) {
              this.orgData.organizationManager = res.data.name
              callback(new Error('当前输入的账号已任职其他公司，如有疑问请联系当事人' + res.data.name))
            } else {
              callback()
            }
          })
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      orgData: this.org,
      orgRule: {
        logo: { required: false, message: '', trigger: 'change' },
        name: { required: true, message: '请输入组织名称', trigger: 'blur' },
        address: { required: false, message: '请输组织地址', trigger: 'blur' },
        organizationManager: { required: true, message: '请输入组织负责人', trigger: 'blur' },
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkUser }
        ],
        solutionIdList: { required: true, message: '请选择方案', trigger: 'change' }
      },
      applicationList: [],
      imgUrl: null
    }
  },
  computed: {},
  watch: {
    org(val) {
      this.orgData = val
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    getImg(hash, key, url) {
      this.orgData.logo = key
      this.imgUrl = url
    },
    change() {
      console.log(this.orgData.solutionList)
    },
    init() {
      getCurrentAccountHaveSolutionList().then(res => {
        console.log(res.data)
        this.applicationList = res.data
      })
    },
    validator() {
      this.orgData.parentOrganizationId = this.topInfo.data.topOrganizationId
      return this.$refs['org'].validate()
    },
    resetFields() {
      this.$refs['org'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addOrg-wrap {
    padding-bottom: 20px;

    & /deep/ .el-input {
      width: 100%;
    }

    /*.logo {*/
    /*  display: flex;*/
    /*  align-items: center;*/
    /*  justify-content: flex-start;;*/

    /*  & /deep/ .el-form-item__content {*/
    /*    margin-left: 0 !important;*/
    /*  }*/
    /*}*/
  }
</style>
