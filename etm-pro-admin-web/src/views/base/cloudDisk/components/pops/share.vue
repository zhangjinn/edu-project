<template>
  <div class="upload-file">
    <etm-pop
      title="共享"
      cancel-btn="取消"
      pop="complex"
      :visible="isShow"
      @cancel="close"
      @close="close"
      @confirm="confirm"
    >
      <etm-form ref="form" :model="form" type="dialog">
        <el-form-item prop="time" label="共享时间">
          <el-row>
            <el-col :span="19">
              <el-date-picker
                v-model="form.time"
                :disabled="form.longTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-col>
            <el-col :span="5">
              <div class="limit">
                <el-checkbox v-model="form.longTime">无限制</el-checkbox>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="下载" prop="download">
          <el-select v-model="form.download">
            <el-option label="可下载" :value="true" />
            <el-option label="不可下载" :value="false" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="查阅人">-->
        <!--          <el-select v-model="form.sharePersonId">-->
        <!--            <el-option label="根目录/软件" :value="1" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="查阅人" prop="sharePersonId" :rules="formValidate.nullValueRule(true,'请输入文件名称')">
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
    </etm-pop>
  </div>
</template>

<script>
import {
  createShare,
  queryeMployee
} from '@/api/base/cloudDisk'
import formValidate from '@/utils/rules'

export default {
  name: 'UploadFile',
  props: {
    choice: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const currentTime = new Date()
    currentTime.setHours(0, 0, 0)

    const nextTime = new Date(currentTime.getTime() + (23 * 3600 * 1000))

    return {
      formValidate,
      isShow: false,
      employee: [],
      form: {
        download: true,
        fileIds: [],
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
      handler(n) {
        if (n) {
          const currentTime = new Date()
          currentTime.setHours(0, 0, 0)

          const nextTime = new Date(currentTime.getTime() + (23 * 3600 * 1000))

          this.form.time = [currentTime, nextTime]
        }
      }
    }
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
      this.$refs['form'].$children[0].resetFields()
      this.isShow = false
    },
    close() {
      this.isShow = false
      this.$refs['form'].$children[0].resetFields()
      this.form = {
        download: true,
        fileIds: [],
        sharePersonId: [],
        sharedStartItem: '',
        sharedEndItem: '',
        share: true,
        longTime: false,
        time: []
      }
    },
    confirm() {
      if (!this.form.time && !this.form.longTime) {
        this.$message.warning('请选择共享时间')
        return
      }

      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const _ids = []
          this.choice.forEach(cur => {
            if (cur.isChoice) {
              _ids.push(cur.id)
            }
          })

          this.form.fileIds = _ids
          const arg = Object.assign({}, this.form, {
            sharedStartItem: (this.form.time[0] || new Date()).getTime(),
            sharedEndItem: (this.form.time[1] || new Date()).getTime()
          })
          createShare(arg).then(res => {
            this.$message.success('文件共享成功')
            this.$refs['form'].$children[0].resetFields()
            this.$emit('success', {})
            this.close()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-date-editor--datetimerange.el-input__inner{
  width: auto;
}

.limit{
  margin-left: 8px;
}

.upload-file{

}
</style>
