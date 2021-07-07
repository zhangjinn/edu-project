<template>
  <div class="templateWrap">
    <etm-table-tool-bar slot="tool">
      <el-input v-model.trim="search" placeholder="请输入搜索内容" @keyup.native.enter="query">
        <i slot="suffix" class="el-icon-search el-input__icon" @click.stop="query" />
      </el-input>
      <el-button slot="right" type="primary" @click.stop="addTemplate"><i class="el-icon-plus" />&nbsp;&nbsp;新建模板</el-button>
    </etm-table-tool-bar>
    <etm-table-page
      :columns="columns"
      :data="tableData"
      @currentChange="currentChange"
    >
      <el-table-column
        slot="right"
        label="操作"
      >
        <template slot-scope="scoped">
          <etm-text type="primary" @click.stop="editTemplate(scoped.row)">编辑</etm-text>
          <etm-text type="primary" @click.stop="deleteTemplate(scoped.row)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" type="dialog" :model="formData" :rules="rules">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
          <el-input v-model="formData.content" type="textarea" placeholder="请输入内容" :rows="5" />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>
<script>
import { queryFollowContentTemplateList, deleteFollowContentTemplate, getFollowContentTemplate, updateFollowContentTemplate } from '@/api/newDaycare/childManageSettings'
export default {
  data() {
    return {
      columns: [
        {
          label: '模板名称',
          prop: 'name'
        },
        {
          label: '模板内容',
          prop: 'content'
        }
      ],
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      search: '',
      showPop: false,
      popTitle: '',
      formData: {
        name: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入模板名称' }
        ],
        content: [
          { required: true, message: '请输入模板内容' }
        ]
      },
      currentRow: null
    }
  },
  created() {
    this.refreshTableData()
  },
  mounted() {
    this.$etmTip.init({
      type: 'warn',
      title: '是否要删除当前模板',
      content: '该删除操作不可撤销',
      confirmBtn: '确定',
      cancelBtn: '取消',
      confirm: this.handleTipConfirm,
      cancel: () => {
        this.$etmTip.close()
      }
    })
  },
  methods: {
    refreshTableData() {
      const options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        keyWord: this.search
      }
      queryFollowContentTemplateList(options).then(res => {
        const { data } = res
        data.content.forEach(v => {
          v.name = v.followContentTemplateName
          v.id = v.followContentTemplateId
        })
        this.tableData = data
      }).catch(err => {
        console.log(err)
      })
    },
    query() {
      this.refreshTableData()
      console.log('query')
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    addTemplate() {
      this.popTitle = '新建模板'
      this.currentRow = null
      this.showPop = true
      this.$nextTick(() => {
        this.$refs.form.$children[0].resetFields()
      })
    },
    editTemplate(row) {
      this.popTitle = '编辑模板'
      this.currentRow = row
      getFollowContentTemplate(row.id).then(res => {
        this.formData.name = res.data.followContentTemplateName
        this.formData.content = res.data.content
        this.showPop = true
      }).catch(err => {
        console.log(err)
      })
    },
    deleteTemplate(row) {
      this.currentRow = row
      this.$etmTip.open()
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const data = {
            followContentTemplateName: this.formData.name,
            content: this.formData.content
          }
          if (this.currentRow) {
            data.id = this.currentRow.id
          }
          updateFollowContentTemplate(data).then(res => {
            this.showPop = false
            this.$message.success('操作成功')
            this.refreshTableData()
          }).catch(err => {
            this.showPop = false
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handlePopCancel() {
      this.showPop = false
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopOpen() {
      this.showPop = true
    },
    handleTipConfirm() { // 执行删除模板操作
      deleteFollowContentTemplate(this.currentRow.id).then(res => {
        this.$etmTip.close()
        this.$message.success('删除成功')
        this.refreshTableData()
      }).catch(err => {
        this.$etmTip.close()
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.templateWrap {
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
