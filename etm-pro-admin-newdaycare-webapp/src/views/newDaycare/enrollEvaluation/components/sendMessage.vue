<template>
  <div class="sendMessage-wrap">
    <etm-pop
      pop="simple"
      :visible.sync="visible"
      title="发短信"
      @cancel="cancel"
      @close="cancel"
      @confirm="handleConfirm"
    >
      <etm-form
        ref="etmForm"
        type="dialog"
        :model="message"
        :rules="rules"
      >
        <el-form-item
          label="收信人号码"
          :rules="formValidate.nullValueRule(true,'请输入文件名称')"
        >
          <el-input
            v-model="telephoneList"
            type="textarea"
            placeholder="请输入手机号码或者多个手机号码,用逗号分隔"
          />
        </el-form-item>

        <el-form-item label="选择模板">
          <el-select
            v-model="message.templateId"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="(temp, i) of templates"
              :key="i"
              :label="temp.label"
              :value="temp.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="短信内容"
          prop="content"
        >
          <el-input
            v-model="message.content"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>/**
 * sendMessage create by haijinsha
 * createTime 2020/9/11 16:20
 */
import { createSms, querySmsTemplate } from '@/api/newDaycare/yunSms'
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'

export default {
  name: 'SendMessage',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    sendMessage: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    littleBabyLink: {
      type: String,
      default: () => {
        return undefined
      }
    },
    babyLink: {
      type: String,
      default: () => {
        return undefined
      }
    },
    childLink: {
      type: String,
      default: () => {
        return undefined
      }
    }
  },
  data () {
    return {
      formValidate,
      choicePhone: [],
      telephoneList: '',
      visible: false,
      message: {
        content: '',
        templateId: ''
      },
      templates: [
        {
          id: 997,
          name: '亿童梦婴儿喂养观测',
          content: '亿童梦婴儿喂养观测'
        },
        {
          id: 998,
          name: '亿童梦幼儿照护观测',
          content: '亿童梦幼儿照护观测'
        },
        {
          id: 999,
          name: '亿童梦儿童成长观测',
          content: '亿童梦儿童成长观测'
        }
      ],
      rules: {
        content: {
          message: '请输入短信内容',
          required: true,
          trigger: 'blur'
        }
      },
      once: true
    }
  },
  created () {

  },
  async mounted () {
    this.once = false
    await this.init()
  },
  methods: {
    handleConfirm () {
      // console.log(this.telephoneList.split(','), 'log')
      if (this.telephoneList.length === 0) {
        this.$message({
          message: '请输入手机号码',
          type: 'error'
        })
        return
      }
      const params = {}
      params.telephoneList = this.telephoneList.split(',')
      params.content = this.message.content
      // console.log(params, 'params')
      createSms(params).then(res => {
        this.$message.success('操作成功')
        this.cancel()
      })
    },
    cancel () {
      this.message = {
        content: '',
        templateId: ''
      }
      this.handleVisible(false, 0)
    },
    init () {
      querySmsTemplate({ keyword: null }).then(res => {
        res.data.forEach(item => {
          this.templates.push(item)
        })
        this.templates = this.convertDataToOptions(this.templates, 'name', 'id')
      })
    },
    handleVisible (visible = true, number) {
      if (this.templates[0].content.indexOf('http') === -1 && visible) {
        this.templates[0].content = `${this.templates[0].content}${this.littleBabyLink}`
        this.templates[1].content = `${this.templates[1].content}${this.babyLink}`
        this.templates[2].content = `${this.templates[2].content}${this.childLink}`
      }
      this.message.content = this.templates[number].content
      this.message.templateId = this.templates[number].id
      this.visible = visible
    },
    handleTemplateChange () {
      const find = this.templates.find(item => item.value === this.message.templateId)
      this.message.content = find.content
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
