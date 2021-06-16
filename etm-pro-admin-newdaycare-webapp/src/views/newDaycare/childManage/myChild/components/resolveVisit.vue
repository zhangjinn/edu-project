<template>
  <div class="resolveVisit-wrap">
    <etm-pop
      title="到访确认"
      :visible="isShow"
      cancel-btn="取消"
      @close="close"
      @cancel="close"
      @confirm="confirm"
    >
      <etm-form
        ref="form"
        type="dialog"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          label="到访时间"
          prop="visitTime"
        >
          <el-date-picker
            v-model="form.visitTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item
          label="到访情况"
          prop="visits"
        >
          <el-input
            v-model="form.visits"
            type="textarea"
            :rows="6"
            placeholder="请输入到访情况"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
/**
 * resolveVisit create by Administrator
 * createTime 2020/10/9 16:40
 */

import formValidate from '@/utils/rules'
import { updateVisit } from '@/api/newDaycare/childManage'
// import { parseTime } from '@/utils'

export default {
  name: 'ResolveVisit',
  components: {},
  filters: {},
  mixins: [],
  props: {
    followId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      formValidate,
      rules: {
        visits: [{
          required: true,
          message: '请输入到访情况'
        }],
        visitTime: [
          {
            required: true,
            message: '请输入到访时间'
          }
        ]
      },
      isShow: false,
      form: {
        visitTime: '',
        visits: '',
        followId: null
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
    show () {
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.form = {
        visitTime: '',
        visits: '',
        followId: null
      }
      this.$refs.form.$children[0].resetFields()
    },
    confirm () {
      this.$refs.form.$children[0].validate(res => {
        if (res) {
          this.form.followId = this.followId
          updateVisit({
            visitTime: this.form.visitTime,
            visits: this.form.visits,
            followId: this.followId
          }).then(res => {
            this.close()
            this.$message.success('确认到访成功')
            this.$emit('update', {})
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
