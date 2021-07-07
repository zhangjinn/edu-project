<template>
  <div class="nurture">
    <etm-main-body>
      <main-content />
    </etm-main-body>
  </div>
</template>

<script>
import etmMainBody from '@/layout/main/EtmMainBody'
import mainContent from './mainContent/index'
import { saveWechatAuthInfo } from '@/api/base'

export default {
  name: 'Index',
  components: {
    etmMainBody,
    mainContent
  },
  data() {
    return {
    }
  },
  mounted() {
    this.getCode()
  },
  methods: {
    getCode() {
      const authCode = this.getQueryVariable('auth_code')
      const organizationId = localStorage.getItem('currentOrganizationId')

      if (authCode) {
        // 保存用户授权
        saveWechatAuthInfo({ authCode, organizationId }).then(res => {
          localStorage.setItem('wx_auth', 'authCode')
          console.log('保存用户授权', res)
          this.$message.success('授权成功')
          this.$router.replace({ name: this.$route.name })
        })
      }
    },
    getQueryVariable(variable) {
      if (!location.href.includes(variable)) {
        return false
      }
      const query = location.href.includes(variable) && decodeURIComponent(location.href).split('?')[1]
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .nurture {
    margin-top: 16px;
  }

</style>
