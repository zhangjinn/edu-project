<template>
  <div class="confirm">
    <etm-form type="dialog">
      <div class="alertBox">
        <el-alert
          title="开启异常确认后，若幼儿检查状态为异常，将在异常明细列表确认后才能将检查结果通过消息推送给相应的家长"
          type="warning"
          :closable="false"
        />
      </div>
      <el-form-item label="开启异常确认">
        <el-switch
          v-model="value"
          @change="update"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>
<script>
import {
  queryOddSureSetting, updateOddSureSetting
} from '@/api/newDaycare/bodyCheckGuard'
export default {
  data () {
    return {
      value: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      queryOddSureSetting().then(res => {
        this.value = res.data.abnormalCheck
      }).catch(err => {
        console.error(err)
      })
    },
    update () {
      updateOddSureSetting({ abnormalCheck: this.value }).then(res => {
        this.$message.success('修改成功')
      }).catch(err => {
        console.error(err)
        this.getData()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.confirm {
  .alertBox {
    display: inline-block;
  }
}
</style>
