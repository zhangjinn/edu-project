<template>
  <div class="msgTemplate-wrap">
    <etm-table-tool-bar slot="tool">
      <el-input
        v-model.trim="search"
        placeholder="请输入搜索内容"
        @keyup.native.enter="query"
      >
        <i
          slot="suffix"
          class="el-icon-search el-input__icon"
          @click.stop="queryInit"
        />
      </el-input>
      <el-button
        slot="right"
        type="primary"
        @click.stop="addTemplate"
      >
        <i class="el-icon-plus" />&nbsp;&nbsp;新建模板
      </el-button>
    </etm-table-tool-bar>
    <etm-table
      :columns="columns"
      :data="tableData"
    >
      <el-table-column
        slot="right"
        label="操作"
      >
        <template slot-scope="scoped">
          <etm-text
            type="primary"
            @click.stop="editTemplate(scoped.row)"
          >
            编辑
          </etm-text>
          <etm-text
            type="danger"
            @click.stop="deleteTemplate(scoped.row)"
          >
            删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table>
    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="templateTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="showPop=false"
      @confirm="handlePopConfirm"
      @cancel="showPop=false"
    >
      <etm-form
        ref="form"
        type="dialog"
        :model="formData"
      >
        <el-form-item
          label="模板名称"
          prop="name"
          :rules="formValidate.nullValueRule(true,'请输入模板名称')"
        >
          <el-input
            v-model="formData.name"
            placeholder="请输入模板名称"
          />
        </el-form-item>
        <el-form-item
          label="模板内容"
          prop="content"
          :rules="formValidate.nullValueRule(true,'请输入内容')"
        >
          <el-input
            v-model="formData.content"
            type="textarea"
            placeholder="请输入内容"
            :rows="5"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
/**
 * msgTemplate create by Administrator
 * createTime 2020/09/09 19:11
 */
import formValidate from '@/utils/rules'
import { querySmsTemplate, createNewTemplate, updateTemplate, removeTemplate } from '@/api/newDaycare/yunSms'

export default {
  name: 'MsgTemplate',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      formValidate,
      templateTitle: '新建模板',
      formData: {
        name: '',
        content: ''
      },
      columns: [
        { label: '模板名称', prop: 'name' },
        { label: '模板内容', prop: 'content' }
      ],
      tableData: [],
      search: null,
      showPop: false,
      msgId: null
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      querySmsTemplate({ keyword: (this.search) || null }).then(res => {
        this.tableData = res.data
      })
    },
    addTemplate () {
      this.showPop = true
      this.templateTitle = '新建模板'
      this.formData = {
        name: '',
        content: ''
      }
      this.$nextTick(() => {
        this.$refs.form.$children[0].resetFields()
        // console.log(this.$refs['form'])
      })
    },
    editTemplate (row) {
      this.templateTitle = '编辑模板'
      this.formData.name = row.name
      this.formData.content = row.content
      this.msgId = row.id
      // console.log(row)
      this.showPop = true
    },
    deleteTemplate (row) {
      this.msgId = row.id
      this.$etmTip.init({
        type: 'warn',
        title: '是否确认删除此模板',
        content: '是否确认删除此模板',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          removeTemplate({ smsTemplateId: this.msgId }).then(res => {
            this.init()
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handlePopConfirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          if (this.msgId) {
            updateTemplate({
              smsTemplateId: this.msgId,
              name: this.formData.name,
              content: this.formData.content
            }).then(res => {
              this.init()
              this.showPop = false
            })
          } else {
            createNewTemplate({ name: this.formData.name, content: this.formData.content }).then(res => {
              this.init()
              this.showPop = false
            })
          }
        }
      })
    },
    queryInit () {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
