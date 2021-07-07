<template>
  <div class="upload-file">
    <etm-drawer :visible.sync="isShow">
      <etm-layout-split>
        <etm-title title="编辑共享" :show-line="false" border size="big">
          <template slot="tool">
            <el-button plain size="mini" @click="hide">取消</el-button>
            <el-button type="primary" size="mini" @click="confirm">保存</el-button>
          </template>
        </etm-title>
        <etm-form ref="form" :model="form" type="dialog">
          <el-form-item prop="" label="共享">
            <el-select v-model="form.share" :rules="formValidate.nullValueRule(true,'请选择是否共享')">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item prop="" label="文件选择">
            <el-date-picker
              v-model="form.time"
              :disabled="form.longTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-checkbox v-model="form.longTime">无限制</el-checkbox>
          </el-form-item>
          <el-form-item label="下载">
            <el-select v-model="form.download">
              <el-option label="可下载" :value="true" />
              <el-option label="不可下载" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="查阅人" prop="sharePersonId" :rules="formValidate.nullValueRule(true,'请选择查阅人')">
            <el-select v-model="form.sharePersonId" multiple filterable placeholder="请选择查阅人">
              <el-option
                v-for="item in employee"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </etm-form>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import {
  queryeMployee,
  updateShareFile
} from '@/api/base/cloudDisk'
import formValidate from '@/utils/rules'
export default {
  name: 'UploadFile',
  props: {
    document: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const currentTime = new Date()
    currentTime.setHours(0, 0, 0)

    const nextTime = new Date(currentTime.getTime() + (23 * 3600 * 1000))

    return {
      formValidate,
      cacheDocument: {},
      employee: [],
      isShow: false,
      form: {
        download: true,
        fileIds: null,
        sharePersonId: [],
        sharedStartItem: '',
        sharedEndItem: '',
        share: true,
        longTime: false,
        time: [currentTime, nextTime]
      }
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(bool) {
        if (bool) {
          const n = this.document
          this.form = {
            download: n.download,
            fileId: n.id,
            sharePersonId: n.sharePersonIds,
            sharedStartItem: n.sharedStartItem,
            sharedEndItem: n.sharedStartItem,
            share: true,
            longTime: n.longTime,
            time: [new Date(n.sharedStartItem || ''), new Date(n.sharedEndItem || '')]
          }
        }
      }
    }
    // document: {
    //   handler(n) {
    //     if (n && Object.keys(n).length) {
    //       this.cacheDocument = n
    //       this.form = {
    //         download: n.download,
    //         fileId: n.id,
    //         sharePersonId: n.sharePersonIds,
    //         sharedStartItem: n.sharedStartItem,
    //         sharedEndItem: n.sharedStartItem,
    //         share: true,
    //         longTime: n.longTime,
    //         time: [new Date(n.sharedStartItem || ''), new Date(n.sharedEndItem || '')]
    //       }
    //     }
    //   }
    // }
  },
  created() {
    queryeMployee({
      recursiveSearch: true,
      paged: false
    }).then(res => {
      this.employee = res.data.content
    })
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    close() {
      this.isShow = false
    },
    confirm() {
      if (!this.form.time && !this.form.longTime) {
        this.$message.warning('请选择共享时间')
        return
      }

      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          // const _ids = []
          // this.choice.forEach(cur => {
          //   if (cur.isChoice) {
          //     _ids.push(cur.id)
          //   }
          // })
          //
          // this.form.fileIds = _ids
          const arg = Object.assign({}, this.form, {
            sharedStartItem: this.form.time[0].getTime(),
            sharedEndItem: this.form.time[1].getTime()
          })
          updateShareFile(arg).then(res => {
            this.$message.success('编辑共享文件成功')
            this.$refs['form'].$children[0].resetFields()
            this.isShow = false
            this.$emit('success', {})
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep{
  .el-date-editor--datetimerange.el-input__inner{
    width: auto;
  }
}

.limit{
  margin-left: 8px;
}

.upload-file{

}
</style>
