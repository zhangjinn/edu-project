<template>
  <div class="m-infoDialog">
    <full-pop
      :visible="isOpen"
      :title="formTitle"
      @close="handleClose"
      @open="handleOpen"
    >
      <div class="title">编辑字段信息</div>

      <el-form ref="form" :model="form" label-width="85px" :rules="rules">

        <el-form-item v-if="!!formItem.name" prop="name" :label="formItem.name" class="formName">
          <el-input v-model="form.name" placeholder="请输入字段名称" />
        </el-form-item>

        <el-form-item v-if="!!formItem.isFill" prop="isFill" :label="formItem.isFill" class="formFill">
          <el-radio-group v-model="form.isFill">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="!!formItem.fieldType" prop="fieldType" :label="formItem.fieldType" class="formField">
          <el-select v-model="form.fieldType" placeholder="请选择字段类型" value-key="fieldType" @change="selectChange">
            <el-option key="fieldType1" label="文本" :value="1" />
            <el-option key="fieldType2" label="数值" :value="2" />
            <el-option key="fieldType3" label="日期" :value="3" />
          </el-select>
          <tool-tip :content="'字段类型关系到你新增的字段是以什么类型去文本数输入的，有数字、文字等类型'" :placement="'right'" />
        </el-form-item>

        <el-form-item v-if="!!formItem.isDisplay" prop="isDisplay" :label="formItem.isDisplay" class="formDisplay">
          <el-radio-group v-model="form.isDisplay">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="!!formItem.widgetType" prop="widgetType" :label="formItem.widgetType" class="formWidget">
          <el-select v-model="form.widgetType.type" placeholder="请选择控件类型" value-key="widgetType">
            <el-option
              v-for="(item, index) in appOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disable"
            />
          </el-select>
          <tool-tip :content="'控件类型是分几种，文本框数用于输入的内容，下拉框用于选择，<br/>日期控件是用于选择时间的'" :placement="'right'" />

          <add-option
            v-if="[2, 3, 4].indexOf(form.widgetType.type) !== -1"
            :option="form.widgetType.option"
            :title="'新增选项'"
          />
        </el-form-item>

        <el-form-item v-if="!!formItem.school" prop="school" :label="formItem.school" class="formSchool">
          <el-select v-model="form.school" multiple placeholder="请选择">
            <el-option
              v-for="item in organizaitonList"
              :key="item.id"
              :label="item.organizationName"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="!!formItem.explain" prop="explain" :label="formItem.explain" class="formExplain">
          <el-input
            v-model="form.explain"
            type="textarea"
            placeholder="请输入字段说明"
            maxlength="150"
            show-word-limit
            :autosize="{ minRows: 4 }"
          />
        </el-form-item>
      </el-form>

      <div class="controlBtn">
        <el-button type="primary" @click.stop="handleSubmit('form')">确定</el-button>
        <el-button type="primary" class="return" @click.stop="handleReset">重置</el-button>
      </div>
    </full-pop>
  </div>
</template>

<script>
import titleObj from '../data'
import addOption from './addOption'
import { getCustomFieldById, postCustomField, updateCustomField } from '@/api/customField'
import { getContactById, postContact, updateContact } from '@/api/contact'
import { deepCopy } from '../utils/common'
import { getOrganizationTree } from '@/api/organization'
import fullPop from '../../../../layout/main/fullPop'
import toolTip from '@/components/Tooltip/index'
import { getPersonId } from '@/utils/auth'

export default {
  name: 'InfoDialog',
  components: {
    addOption,
    toolTip,
    fullPop
  },
  data() {
    return {
      titleObj,
      rules: {
        school: [
          { required: true, message: '请选择应用组织', trigger: 'blur' }
        ]
      },
      form: {
        name: '',
        isFill: '',
        isDisplay: '',
        fieldType: '',
        widgetType: {
          type: '',
          option: []
        },
        school: [],
        explain: ''
      },
      queryEntry: {
        personId: getPersonId()
      },
      organizaitonList: [],
      tree: null,
      appOptions: [{
        value: 1,
        label: '输入框',
        disable: false
      }, {
        value: 2,
        label: '单选',
        disable: false
      }, {
        value: 3,
        label: '多选',
        disable: false
      }, {
        value: 4,
        label: '下拉框',
        disable: false
      }, {
        value: 5,
        label: '日期控件',
        disable: false
      }
      ]
    }
  },
  computed: {
    isOpen() {
      return this.$store.state.memberSetup.drawer
    },
    setting() {
      return this.$store.state.memberSetup.setting
    },
    formItem() {
      return titleObj[this.$store.state.memberSetup.setting].form
    },
    formTitle() {
      if (this.$store.state.memberSetup.mode === 'add') {
        return titleObj[this.setting].add
      } else {
        return titleObj[this.setting].modify
      }
    }
  },
  watch: {
    $route: {
      handler(route) {
        // 切换设置后重置侧边弹窗内的表单内容
        if (this.$refs.form) {
          this.$refs.form.resetFields()
          this.form.school = []
        }
      }
    }
  },
  created() {
    getOrganizationTree(this.queryEntry).then(response => {
      this.organizaitonList = response.data
      // this.organizaitonList = [
      //   {
      //     id: 1,
      //     organizationName: '南海集团',
      //     organizationId: 4
      //   }
      // ]
    }).catch(() => {
      this.$message.error('获取组织树失败')
      this.tree = []
    })
  },
  methods: {
    handleOpen() {
      const mode = this.$store.state.memberSetup.mode
      const setting = this.$store.state.memberSetup.setting
      if (mode === 'add') {
        // 新增内容模式
        this.form = {
          name: '',
          isFill: '',
          isDisplay: '',
          fieldType: '',
          widgetType: {
            type: '',
            option: []
          },
          school: [],
          explain: ''
        }
      } else {
        // 修改内容模式
        const id = this.$store.state.memberSetup.mode
        if (setting === 'custom') {
          const type = this.$store.state.memberSetup.type
          getCustomFieldById({ id, type }).then(response => {
            const { data } = response
            this.form = {
              name: data.name,
              isFill: data.mandatory,
              fieldType: +['TEXT', 'DECIMAL', 'DATE'].indexOf(data.attributeType) + 1,
              isDisplay: data.visible,
              widgetType: {
                type: +['INPUT_BOX', 'RADIO', 'CHECKBOX', 'SELECT_BOX', 'DATE'].indexOf(data.controlType) + 1,
                option: data.options
              },
              school: [data.organizationId],
              explain: data.description
            }
          }).catch(err => {
            console.log(err)
          })
        }
        if (setting === 'contact') {
          getContactById({ id }).then(response => {
            const { data } = response
            this.form = {
              name: data.value,
              school: [data.organizationId]
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    handleClose() {
      this.$store.commit('memberSetup/SET_DRAWER', false)
      this.handleReset() // 解决切换设置后点击编辑不能弹出弹窗的bug
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const setting = this.$store.state.memberSetup.setting
          const mode = this.$store.state.memberSetup.mode
          const isAdd = mode === 'add' // 为true时为添加操作，为false时为修改操作
          let p
          switch (setting) {
            case 'custom':
              if (isAdd) {
                const data = {
                  name: this.form.name,
                  mandatory: this.form.isFill,
                  controlType: this.form.fieldType,
                  visible: this.form.isDisplay,
                  type: this.form.widgetType.type,
                  options: this.form.widgetType.option,
                  organizationIds: this.form.school,
                  description: this.form.explain
                }
                p = postCustomField({ data })
              } else {
                const form = deepCopy(this.form)
                const id = mode
                const data = {
                  name: form.name,
                  type: ['TEXT', 'DECIMAL', 'DATE'][form.fieldType - 1],
                  controlType: ['INPUT_BOX', 'RADIO', 'CHECKBOX', 'SELECT_BOX', 'DATE'][form.widgetType.type - 1],
                  description: form.explain,
                  mandatory: form.isFill,
                  visible: form.isDisplay,
                  organizationIds: form.school,
                  options: form.widgetType.option
                }
                p = updateCustomField({ data, id })
              }
              break
            case 'contact':
              if (isAdd) {
                const data = {
                  value: this.form.name,
                  organizationIds: this.form.school,
                  type: 'CONTACTS'
                }
                p = postContact({ data })
              } else {
                const form = deepCopy(this.form)
                const id = mode
                const data = {
                  value: form.name,
                  organizationIds: form.school,
                  type: 'CONTACTS'
                }
                p = updateContact({ data, id })
              }
              break
          }
          p.then(response => {
            this.handleClose()
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.$store.commit('memberSetup/ADD_HANDLE') // 增删查操作加1
          }).catch(error => {
            console.log(error)
            this.$message.error(error)
          })
        } else {
          this.$message.error('请输入必填信息！')
          return false
        }
      })
    },
    selectChange(val) {
      switch (val) {
        case 1:
          if (this.form.widgetType.type === 5) {
            this.form.widgetType.type = undefined
          }
          for (const index in this.appOptions) {
            if (this.appOptions.hasOwnProperty(index)) {
              this.appOptions[index].disable = index === '4'
            }
          }
          break
        case 2:
          this.form.widgetType.type = 1
          for (const index in this.appOptions) {
            if (this.appOptions.hasOwnProperty(index)) {
              this.appOptions[index].disable = index !== '0'
            }
          }
          break
        case 3:
          this.form.widgetType.type = 5
          for (const index in this.appOptions) {
            if (this.appOptions.hasOwnProperty(index)) {
              this.appOptions[index].disable = index !== '4'
            }
          }
      }
    },
    handleReset() {
      this.form = {
        name: '',
        isFill: '',
        isDisplay: '',
        fieldType: '',
        widgetType: {
          type: '',
          option: []
        },
        school: [],
        explain: ''
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/variables";
  @import "~@/styles/mixin.scss";
  .m-infoDialog {
    .title {
      margin: 24px 0;
    }
    .el-dialog__body {
      border-radius: 4px;
    }
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .formName {
        input {
          width: 200px;
        }
      }
      .formName, .formField {
        width: 34%;
      }
      .formFill, .formDisplay, .formSchool {
        width: 56%;
      }
      .formExplain, .formSecond, .formWidget {
        width: 84%;
      }
    }
    .el-select.school {
      .el-select__tags {
        .el-tag {
          display: none;
        }
      }
    }
    .controlBtn {
      padding-left: 20px;
      padding-bottom: 20px;
      .el-button+.el-button {
        margin-left: 10px;
      }
      .return {
        @include c_colorTextRegular();
        @include bgc_white();
        @include bc_borderColorBase();
      }
    }
  }
</style>
