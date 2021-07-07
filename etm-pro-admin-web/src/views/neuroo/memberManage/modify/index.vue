<template>
  <div class="modify">
    <etm-layout-split>
      <etm-title>会员修改</etm-title>
      <!-- <el-steps :active="active" finish-status="success">
        <el-step title="基础信息" />
        <el-step title="学籍信息" />
      </el-steps> -->
      <div class="tableArea">
        <basic v-show="active === 0" ref="basic" :modify="basicForm" />
        <status v-show="active === 1" ref="status" :content="statusData" :modify="statusForm" />
      </div>
      <div class="bottomBtns">
        <!-- <el-button v-if="active !== 1" type="primary" @click.stop="next">下一步</el-button> -->
        <el-button type="primary" @click.stop="handleSubmit">保存</el-button>
        <el-button plain @click.stop="handleCancel">取消</el-button>
        <!-- <el-button v-show="active !== 0" plain @click.stop="last">上一步</el-button> -->
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import basic from './basic'
import status from './status'
import { modifyMember, getMemberInfo } from '@/api/neuroo/memberManage'
import { getUploadFilePrefix } from '@/api/base'

import transferDate from '../../../../utils/date'
export default {
  components: {
    basic,
    status
  },
  data() {
    return {
      active: 0,
      statusData: [],
      basicForm: {},
      statusForm: {},
      disabled: true,
      prefix: ''
    }
  },
  computed: {
    basicDone() {
      return this.$store.state.memberManageNeuroo.basic
    },
    statusDone() {
      return this.$store.state.memberManageNeuroo.status
    },
    id() {
      return localStorage.getItem('memberManage_neuroo_currentId')
    }
  },
  watch: {
    active(v) {
      switch (v) {
        case 0:
          this.disabled = !this.basicDone
          break
        case 1:
          this.disabled = !this.statusDone
          break
        default:
          this.disabled = false
      }
    },
    basicDone(v) {
      if (this.active === 0) {
        this.disabled = !v
      }
    },
    statusDone(v) {
      if (this.active === 1) {
        this.disabled = !v
      }
    }
  },
  created() {
    getMemberInfo(this.id).then(res => {
      const { data } = res
      this.basicForm = data
    }).catch(err => {
      console.log(err)
    })
    getUploadFilePrefix().then(res => {
      this.prefix = res
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    next() {
      if (this.active < 2) this.active++
    },
    last() {
      if (this.active > 0) this.active--
    },
    handleSubmit() {
      const formData = this.$refs.basic.basicForm
      this.$refs.basic.$refs.basicForm.$children[0].validate(valid => {
        if (valid) {
          const data = {
            parentInfoList: formData.contacts,
            customerInfo: {
              birthday: transferDate(formData.birthday).time,
              areaCode: formData.district.area,
              address: formData.address,
              gender: formData.gender,
              name: formData.name,
              remark: formData.remark
            }
          }
          if (formData.avatar && typeof formData.avatar === 'string') {
            data.customerInfo.avatar = formData.commitAvatar
          }
          modifyMember({ id: this.id, data }).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleCancel()
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('jump', 'manage')
    }
  }
}
</script>

<style scoped lang="scss">
.modify {
  position: relative;
  //@include bgc_white();
  /*height: calc(100vh - 150px);*/
  /*padding-bottom: 68px;*/
  & >>> .el-steps {
    margin: 25px 0 32px 150px;
    width: 800px;
    .el-step__main {
      transform: translateX(-15px);
    }
    .el-step__icon {
      width: 30px;
      height: 30px;
    }
    .el-step__head.is-process {
      @include bc_main_color();
      @include c_white();
      .el-step__icon.is-text {
        @include bgc_main_color();
      }
    }
    .el-step__head.is-success {
      @include c_main_color();
      @include bc_main_color();
    }
    .el-step__title.is-success {
      @include c_main_color();
    }
    .el-step__title.is-process {
      font-weight: 400;
    }
    .el-step.is-horizontal .el-step__line {
      top: 14px;
      right: 20px;
      left: 50px;
    }
  }
  .tableArea {
    /*height: calc(100vh - 288px);*/
    /*overflow-y: auto;*/
    .basic, .status {
      /*height: 100%!important;*/
    }
  }
  .bottomBtns {
    display: flex;
    align-items: center;
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    height: 68px;
    padding-left: 316px;
    margin: 0 -16px;
    box-shadow:0px -4px 6px 0px rgba(34,34,34,0.04);
    .el-button+.el-button {
      margin-left: 16px!important;
    }
  }
}
</style>
