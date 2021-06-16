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
        <el-form-item label="收信人号码">
          <div>
            <el-dropdown :hide-on-click="false">
              <span>
                {{ choicePhone[0] }}
                <i
                  v-if="sendMessage.phone.length > 1"
                  class="el-icon-arrow-down el-icon--right"
                />
              </span>
              <el-dropdown-menu
                v-if="sendMessage.phone.length > 1"
                slot="dropdown"
              >
                <el-dropdown-item
                  v-for="(item, index) in sendMessage.phone"
                  :key="index"
                >
                  <div
                    :class="[arrayInclude(choicePhone, item) ? 'choice' : '']"
                    @click="phonePush(item)"
                  >
                    {{ sendMessage.parentName[index] }}
                    {{ item }}
                    &emsp;
                    <i
                      v-if="arrayInclude(choicePhone, item)"
                      class="el-icon-check"
                    />
                    <template v-else>
&emsp;
                    </template>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
import { sendSms, querySmsTemplate } from '@/api/customer'
import baseMixin from '@/layout/mixin/baseMixin'

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
    }
  },
  data () {
    return {
      choicePhone: [],
      visible: false,
      message: {
        content: '',
        templateId: ''
      },
      templates: [],
      rules: {
        content: { message: '请输入短信内容', required: true, trigger: 'blur' }
      }
    }
  },
  computed: {},
  watch: {
    sendMessage: {
      deep: true,
      handler (n) {
        this.choicePhone = [n.phone[0]]
      }
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  methods: {
    arrayInclude (arr, value) {
      return arr.includes(value)
    },
    phonePush (item) {
      const _index = this.choicePhone.indexOf(item)
      if (_index >= 0) {
        if (this.choicePhone.length === 1) {
          this.$message.warning('联系人不能为空')
        } else {
          this.choicePhone.splice(_index, 1)
        }
      } else {
        this.choicePhone.push(item)
      }
    },
    cancel () {
      this.handleVisible(false)
      this.message = {
        content: '',
        templateId: ''
      }
      this.$refs.etmForm.$children[0].resetFields()
    },
    init () {
      querySmsTemplate({
        keyword: null,
        pageNum: 1,
        pageSize: 100000,
        paged: false
      }).then(res => {
        this.templates = this.convertDataToOptions(res.data.content, 'name', 'id')
      })
    },
    handleVisible (visible = true) {
      this.visible = visible
    },
    handleTemplateChange () {
      const find = this.templates.find(item => item.value === this.message.templateId)
      this.message.content = find.content
    },

    handleConfirm () {
      this.$refs.etmForm.$children[0].validate(valid => {
        if (valid) {
          sendSms({
            telephoneList: this.choicePhone,
            content: this.message.content,
            customerId: this.sendMessage.childId
          }).then(res => {
            this.$message.success('操作成功')
            this.cancel()
            this.$refs.etmForm.$children[0].clearValidate()
            this.$emit('handleMessage')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
