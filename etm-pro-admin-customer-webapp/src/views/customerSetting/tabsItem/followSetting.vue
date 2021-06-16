<template>
  <div class="followSetting">
    <etm-table-tool-bar slot="tool">
      <div slot="right">
        <el-button
          type="primary"
          @click.stop="addField"
        >
          <i class="el-icon-plus" />&nbsp;&nbsp;新增跟进
        </el-button>
      </div>
    </etm-table-tool-bar>
    <etm-table
      :columns="columns"
      :data="tableData"
    >
      <el-table-column
        slot="right"
        label="字段属性"
      >
        <template slot-scope="scoped">
          <el-checkbox
            v-model="scoped.row.visible"
            @change="handleChange(scoped.row)"
          >
            显示
          </el-checkbox>
          <el-checkbox
            v-model="scoped.row.mandatory"
            @change="handleChange(scoped.row)"
          >
            必填
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
      >
        <template slot-scope="scoped">
          <etm-text
            type="primary"
            @click.stop="handleEdit(scoped.row)"
          >
            编辑
          </etm-text>
          <!-- <etm-text type="danger" @click.stop="handleDelete(scoped.row)">删除</etm-text> -->
        </template>
      </el-table-column>
    </etm-table>
    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopCancel"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form
        ref="form"
        type="dialog"
        :model="formData"
        :rules="rules"
      >
        <el-form-item
          label="字段名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            placeholder="请输入字段名称"
          />
        </el-form-item>
        <el-form-item
          label="是否必填"
          prop="mandatory"
        >
          <el-radio
            v-model="formData.mandatory"
            :label="true"
          >
            是
          </el-radio>
          <el-radio
            v-model="formData.mandatory"
            :label="false"
          >
            否
          </el-radio>
        </el-form-item>
        <el-form-item
          label="是否显示"
          prop="visible"
        >
          <el-radio
            v-model="formData.visible"
            :label="true"
          >
            是
          </el-radio>
          <el-radio
            v-model="formData.visible"
            :label="false"
          >
            否
          </el-radio>
        </el-form-item>
        <el-form-item
          label="控件类型"
          prop="controlType"
        >
          <el-select
            v-model="formData.controlType"
            placeholder="请选择控件类型"
          >
            <el-option
              v-for="item in fieldType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div
            v-show="['RADIO', 'CHECKBOX', 'SELECT_BOX', 'CASCADE_SELECT_BOX'].indexOf(formData.controlType) !== -1"
            class="selection"
          >
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
            >
              新增选项
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="字段说明">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入字段说明"
            :rows="3"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import {
  queryFollowSettingList,
  createFollowSettingItem,
  updateFollowSettingItem,
  queryFollowSettingItem
} from '@/api/customer/customerSettings'
export default {
  data () {
    return {
      columns: [
        {
          label: '字段名称',
          prop: 'name'
        }
      ],
      tableData: [],
      cacheNames: [], // 保证字段名称唯一
      showPop: false,
      popTitle: '',
      formData: {
        name: '',
        mandatory: '',
        visible: '',
        controlType: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入字段名称' }
        ],
        mandatory: [
          { required: true, message: '请选择是否必填' }
        ],
        visible: [
          { required: true, message: '请选择是否显示' }
        ],
        controlType: [
          { required: true, message: '请选择控件类型' }
        ]
      },
      fieldType: [
        { value: 'INPUT_BOX', label: '输入框' },
        { value: 'RADIO', label: '单选' },
        { value: 'CHECKBOX', label: '多选' },
        { value: 'SELECT_BOX', label: '下拉框' },
        { value: 'DATE', label: '日期控件' },
        { value: 'CASCADE_SELECT_BOX', label: '级联下拉框' },
        { value: 'MARK_SELECT_BOX', label: '标签选择器' }
      ],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      editName: '',
      editId: undefined
    }
  },
  created () {
    this.refreshTableData()
  },
  methods: {
    refreshTableData () {
      queryFollowSettingList().then(res => {
        const { data } = res
        this.cacheNames = []
        data.forEach(v => {
          v.options = v.options || []
          this.cacheNames.push(v.name)
        })
        this.tableData = data
      }).catch(err => {
        console.log(err)
        this.tableData = []
      })
    },
    addField () {
      this.popTitle = '新增字段'
      this.handlePopOpen()
    },
    handleEdit (row) {
      this.popTitle = '修改字段'
      this.editName = row.name
      this.editId = row.id
      queryFollowSettingItem({ id: row.id }).then(res => {
        const { data } = res
        this.formData = {
          name: data.name || '',
          mandatory: data.mandatory,
          visible: data.visible,
          controlType: data.controlType || '',
          description: data.description || ''
        }
        this.dynamicTags = []
        Array.isArray(data.options) && data.options.forEach(v => {
          this.dynamicTags.push(v.label)
        })
        this.handlePopOpen()
      })
    },
    handleChange (row) {
      updateFollowSettingItem(row).then(res => {
        this.$message.success('修改成功')
      })
    },
    handleDelete (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '是否要删除当前字段',
        content: '该删除操作不可撤销',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          // TODO: 调用接口删除字段
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handlePopOpen () {
      this.showPop = true
    },
    handlePopClose () {
      this.showPop = false
    },
    handlePopConfirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          if (this.popTitle === '新增字段') {
            const options = []
            this.dynamicTags.forEach(v => {
              options.push({
                label: v
              })
            })
            if (this.cacheNames.indexOf(this.formData.name) !== -1) {
              this.$message.warning('字段名称不能重复！')
              return
            }
            createFollowSettingItem({
              ...this.formData,
              options
            }).then(res => {
              this.$message.success('新增字段成功')
              this.handlePopCancel()
              this.refreshTableData()
            })
          } else if (this.popTitle === '修改字段') {
            const options = []
            this.dynamicTags.forEach(v => {
              options.push({
                label: v
              })
            })
            if (this.formData.name !== this.editName && this.cacheNames.indexOf(this.formData.name) !== -1) {
              this.$message.warning('字段名称不能重复！')
              return
            }
            updateFollowSettingItem({
              ...this.formData,
              options,
              id: this.editId
            }).then(res => {
              this.$message.success('修改字段成功')
              this.handlePopCancel()
              this.refreshTableData()
            })
          }
        } else {
          return false
        }
      })
    },
    handlePopCancel () {
      this.$refs.form.$children[0].resetFields()
      this.dynamicTags = []
      this.editName = ''
      this.handlePopClose()
    }
  }
}
</script>

<style scoped lang="scss">
.selection {
  margin-top: 8px;
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  ::v-deep .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep .el-tag {
    line-height: 32px;
    height: 32px;
  }
  ::v-deep .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
}
</style>
