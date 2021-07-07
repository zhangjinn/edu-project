<template>
  <etm-layout-split>
    <div class="modify">
      <etm-title>修改会员</etm-title>
      <basic ref="basic" :modify="basicData" />
      <div class="bottomBtns">
        <el-button type="primary" @click.stop="handleSave">保存</el-button>
        <el-button plain @click.stop="handleCancel">取消</el-button>
      </div>
    </div>
  </etm-layout-split>
</template>
<script>
import basic from '../add/basic'
import { getMemberInfo, modifyMemberInfo } from '@/api/memberManageV2'

export default {
  components: {
    basic
  },
  data() {
    return {
      basicData: {}
    }
  },
  computed: {
  },
  created() {
    getMemberInfo(localStorage.getItem('memberManageV2_currentId')).then(res => {
      this.basicData = res.data
    }).catch(err => {
      console.log(err)
      this.$emit('jump', 'manage')
    })
  },
  methods: {
    handleCancel() {
      this.$emit('jump', 'manage')
    },
    handleSave() {
      this.$refs.basic.$refs.basicForm.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.basic.basicForm
          formData.areaCode = formData.district.area
          formData.icon = formData.submitIcon
          delete formData.district
          delete formData.submitIcon
          modifyMemberInfo({ id: localStorage.getItem('memberManageV2_currentId'), data: {
            ...formData
          }}).then(res => {
            this.$message.success('修改成功')
            this.$emit('jump', 'manage')
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.warning('您还有必填信息未填')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.modify {
  .bottomBtns {
    display: flex;
    align-items: center;
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    height: 68px;
    padding-left: 300px;
    margin: 0 -16px;
    box-shadow:0px -4px 6px 0px rgba(34,34,34,0.04);
    .el-button+.el-button {
      margin-left: 16px!important;
    }
  }
}
</style>
