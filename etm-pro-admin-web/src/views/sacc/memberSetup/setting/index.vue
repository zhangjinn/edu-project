<template>
  <div class="setting">
    <div class="title">
      <span class="settingTitle">{{ tab.title }}</span>
      <el-button type="primary" @click.stop="addInfo">{{ tab.add }}</el-button>
    </div>
    <div class="table">
      <el-table
        ref="dragTable"
        :data="tableData"
        row-key="index"
        border
        style="width: 100%"
        :row-class-name="setRowClass"
        height="calc(100vh - 198px)"
      >

        <el-table-column
          v-if="!!tableTitle.control"
          :label="tableTitle.control"
          width="124"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.control.editable" type="text" @click.stop="handleEdit(scope)">编辑</el-button>
            <el-button v-if="scope.row.control.delete" type="text" @click.stop="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          width="80"
          label="序号"
        />

        <el-table-column
          v-if="!!tableTitle.name"
          :label="tableTitle.name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!!tableTitle.attribute"
          :label="tableTitle.attribute"
          width="300"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isDisplay" :disabled="scope.row.control.disabled" @change="changeAttr(scope.row)">显示</el-checkbox>
            <el-checkbox v-model="scope.row.isFill" :disabled="scope.row.control.disabled" @change="changeAttr(scope.row)">必填</el-checkbox>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!!tableTitle.school"
          :label="tableTitle.school"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.school }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import titleObj from '../data'
import Sortable from 'sortablejs'
import { getCustomField, updateCustomField, updateCustomFieldSort } from '@/api/customField'
import { deleteContact, getContact } from '@/api/contact'

export default {
  name: 'Setting',
  data() {
    return {
      tableData: null,
      tableTitle: null,
      sortable: null
    }
  },
  computed: {
    tab() {
      return titleObj[this.$store.state.memberSetup.setting]
    },
    handle() {
      return this.$store.state.memberSetup.handle
    }
  },
  watch: {
    $route: {
      handler() {
        this.refreshTableData()

        this.$nextTick(() => {
          this.setSort()
        })
      },
      immediate: true
    },
    handle() {
      this.refreshTableData()
    }
  },
  methods: {
    addInfo() {
      this.$store.commit('memberSetup/SET_MODE', 'add')
      this.$store.commit('memberSetup/SET_DRAWER', true)
    },
    handleEdit(s) {
      this.$store.commit('memberSetup/SET_TYPE', s.row.entityType)
      this.$store.commit('memberSetup/SET_MODE', s.row.id)
      this.$store.commit('memberSetup/SET_DRAWER', true)
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelector('.el-table__body-wrapper > table > tbody')
      this.sortable = Sortable.create(el, {
        swap: true,
        animation: 150,
        filter: '.filtered',
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const setting = this.$store.state.memberSetup.setting
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, targetRow)
          const data = this.tableData.map((v, i) => {
            return {
              id: v.attributeId,
              sortIndex: i + 1,
              type: v.entityType
            }
          })
          let p
          if (setting === 'custom') {
            p = updateCustomFieldSort({ data })
          } else {
            return false
          }
          p.then(response => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }).catch(error => {
            this.$message.error(error)
          })
        },
        onMove(e) {
          return e.related.className.indexOf('filtered') === -1
        }
      })
    },
    handleDelete(scope) {
      const setting = this.$store.state.memberSetup.setting
      if (setting === 'custom') {
        // deleteCustomField({ids: [scope.row.attributeId]}).then(response => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
        //   this.$store.commit('memberSetup/ADD_HANDLE')
        // }).catch(error => {
        //   this.$message.error(error)
        // })
        this.$message.error('功能开发中')
      } else {
        deleteContact(scope.row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$store.commit('memberSetup/ADD_HANDLE')
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
    setRowClass({ row }) {
      if (!row.control.move) {
        return 'filtered'
      }
    },
    // 刷新页面表格数据
    refreshTableData() {
      const setting = this.$route.query.setting || 'custom'
      this.tableTitle = titleObj[setting].table
      if (setting === 'custom') {
        // 获取会员自定义字段
        getCustomField()
          .then(response => {
            // Mock的数据可能放在data里面的data属性中，正常接口返回的数据直接放在data属性里面
            const data = response.data.data ? response.data.data : response.data
            if (Array.isArray(data) && data.length) {
              data.forEach((v, i) => {
                v.id = v.attributeId
                v.isDisplay = v.visible
                v.isFill = v.mandatory
                v.school = v.organizationName
                v.index = i + 1
                if (v.entityType === 'BASIC') {
                  // 系统默认字段
                  v.control = {
                    delete: false,
                    editable: false,
                    move: !v.fix,
                    disabled: v.fix
                  }
                } else {
                  // 自定义字段
                  v.control = {
                    move: true,
                    delete: true,
                    editable: true,
                    disabled: false
                  }
                }
              })
              this.tableData = data
            } else {
              this.tableData = []
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else if (setting === 'contact') {
        // 获取联系人称呼
        getContact()
          .then(response => {
            // Mock的数据可能放在data里面的data属性中，正常接口返回的数据直接放在data属性里面
            const data = response.data.data ? response.data.data : response.data
            if (Array.isArray(data) && data.length) {
              data.forEach((v, i) => {
                v.school = v.organizationName
                v.name = v.value
                v.index = i + 1
                v.control = {
                  move: false,
                  delete: true,
                  editable: true
                }
              })
              this.tableData = data
            } else {
              this.tableData = []
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // 错误处理
        this.$message.error('获取表格数据错误')
      }
    },
    changeAttr(row) {
      console.log(row)
      const { name, attributeType, attributeId, controlType, description, isFill, isDisplay, organizationId, options } = row
      const data = {
        name,
        type: attributeType,
        controlType,
        description,
        mandatory: isFill,
        visible: isDisplay,
        organizationIds: [organizationId],
        options
      }
      updateCustomField({ data, id: attributeId }).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .setting {
    @include wh(100%, 100%);
    padding: 10px 20px 0;
    @include border-radius(4px);
    @include bgc_white();
    font-family: "Microsoft YaHei", sans-serif;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        span {
          font-weight: 400;
        }
      }
      span.settingTitle {
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        @include c_colorTextPrimary();
      }
    }
    .table {
      margin-top: 10px;
      .el-button {
        span {
          &:hover {
            @include c_themeColor();
          }
        }
      }
      .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        padding-left: 20px!important;
      }
      .el-table {
        .el-table__body-wrapper {
          tr {
            cursor: move;
            &.filtered {
              cursor: default;
            }
          }
        }
      }
    }
    .isDisplay {
      margin-right: 5px;
    }
    .el-radio-group {
      .el-radio {
        margin-right: 5px;
      }
      .el-radio__label {
        padding-left: 5px;
      }
    }
  }
</style>
