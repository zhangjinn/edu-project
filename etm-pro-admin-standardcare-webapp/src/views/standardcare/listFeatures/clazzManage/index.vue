<template>
  <!--  标品功能-班级管理-->
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          v-model="activeName"
          setting
          @setting="setting"
        >
          <el-tab-pane
            name="classManage"
            label="班级管理"
          >
            <etm-tool-bar
              v-model="formData"
              @search="handleSearch"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          selection
          border
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button
                type="primary"
                @click="addClass"
              >
                <i class="el-icon-plus" />
                添加班级
              </el-button>
            </div>
          </etm-table-tool-bar>
          <template slot="left">
            <el-table-column
              slot="left"
              label="班级名称"
              fixed="left"
              min-width="120"
            >
              <template slot-scope="scoped">
                <span>
                  {{ scoped.row.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="班级类型"
              fixed="left"
              min-width="120"
            >
              <template slot-scope="scoped">
                <span
                  type="text"
                >
                  {{ scoped.row.typeName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="容量"
              fixed="left"
              min-width="120"
            >
              <template slot-scope="scoped">
                <span
                  type="text"
                >
                  {{
                    scoped.row.capacity
                  }}
                </span>
              </template>
            </el-table-column>
          </template>
          <template slot="right">
            <el-table-column
              slot="right"
              label="操作"
              fixed="left"
            >
              <template slot-scope="scoped">
                <etm-text
                  type="primary"
                  @click="editClass(scoped.row.id, true)"
                >
                  编辑
                </etm-text>
                <etm-text
                  type="danger"
                  @click="removeClass(scoped.row.id, true)"
                >
                  删除
                </etm-text>
              </template>
            </el-table-column>
          </template>
        </etm-table-page>
      </div>
    </etm-layout-split>

    <etm-drawer
      :visible.sync="isShowClassEdit"
    >
      <etm-layout-split>
        <edit-class
          v-if="isShowClassEdit"
          ref="editClass"
          :class-detail="classDetail"
          :clazz-type-list="clazzTypeList"
          @editCancel="cancel"
          @editSave="editSave"
        />
      </etm-layout-split>
    </etm-drawer>

    <etm-pop
      :visible="isShowAddPop"
      title="添加班级"
      :confirm="handleAddClass"
      @cancel="addCancel"
      @close="addCancel"
    >
      <add-class
        ref="addClass"
        :clazz-type-list="clazzTypeList"
      />
    </etm-pop>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/12/8 11:20
 */
import editClass from '@/views/standardcare/listFeatures/clazzManage/components/editClass'
import addClass from '@/views/standardcare/listFeatures/clazzManage/components/addClass'
import { createClazz, queryClazzList, queryClazzTypeList, querySingleClazz, removeClazz, updateClazz } from '@/api/standardcare/clazzManage'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Index',
  components: {
    editClass,
    addClass
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'classManage',
      isShowAddPop: false,
      isShowClassEdit: false,
      clazzTypeList: [], // 班级类型列表
      classDetail: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      columns: [],
      formData: [
        {
          label: '班级',
          type: 'input',
          value: '',
          prop: 'name',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '班级类型',
          type: 'select',
          value: '',
          prop: 'typeId',
          props: {
            placeholder: '请选择班级类型'
          },
          options: []
        }
      ],
      tableData: {
        content: []
      }
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
    setting () {
      this.$router.push({ name: 'standardcare_clazzManageSetting' })
    },
    async init (search = {}) {
      const params = Object.assign(search, this.pageInfo)
      console.log(params, 'params')
      await queryClazzList(params).then(res => {
        console.log(res.data, 'res')
        this.tableData = res.data
      })
      await queryClazzTypeList().then(res => {
        this.formData[1].options = []
        res.data.forEach(item => {
          this.formData[1].options.push({
            value: item.id,
            label: item.name
          })
        })
      })
    },
    handleSearch (event) {
      const result = {}
      console.log(this.pageInfo, 'handleSearch')
      this.pageInfo.pageNum = 1
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      this.init(this.search)
    },
    currentChange (pageNum, pageSize) {
      // console.log(pageNum, 'num')
      // console.log(pageSize, 'size')
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.search)
    },
    // 添加班级按钮
    addClass () {
      queryClazzTypeList().then(res => {
        // console.log(res, '班级类型列表')
        this.clazzTypeList = res.data
      })
      this.isShowAddPop = true
    },
    handleAddClass () {
      this.$refs.addClass.$children[0].$children[0].validate(valid => {
        if (!valid) {

        } else {
          // this.$message.error(res.message)
          const result = this.$refs.addClass.classDetail
          const params = {}
          params.typeId = result.id
          params.typeName = result.typeName
          params.name = result.name
          params.capacity = Math.abs(Number(result.capacity))
          params.remark = result.remark
          createClazz(params).then(res => {
            if (res.code === 0) {
              this.$message.success('创建成功')
              this.$refs.addClass.classDetail = {
                name: '',
                capacity: '',
                typeName: ''
              }
              this.isShowAddPop = false
              this.init()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },

    addCancel () {
      this.$refs.addClass.classDetail = {}
      this.isShowAddPop = false
    },
    async editClass (id) {
      this.isShowClassEdit = true
      await queryClazzTypeList().then(res => {
        console.log(res, '班级类型列表')
        this.clazzTypeList = res.data
      })
      await querySingleClazz({ clazzId: id }).then(res => {
        this.classDetail = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    // 保存编辑
    editSave (clazzId) {
      const result = this.$refs.editClass.classDetail
      if (!result.id || !result.name || !result.capacity) {
        this.$message.error('请填写必要的选项')
        return
      }
      console.log(result, 'result')
      const params = {}
      params.clazzId = clazzId
      params.name = result.name
      params.typeId = result.typeId
      params.typeName = result.typeName
      params.name = result.name
      params.capacity = Math.abs(Number(result.capacity))
      params.remark = result.remark
      console.log(params, 'params')
      updateClazz(params).then(res => {
        if (res.code === 0) {
          this.$message.success('更新成功')
          this.init()
        } else {
          this.$message.error(res.message)
        }
      })

      this.isShowClassEdit = false
    },
    removeClass (id) {
      console.log('remove')
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除该记录？',
        comfirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          removeClazz({ clazzId: id }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.init()
              this.$etmTip.close()
            } else {
              this.$message.error(res.message)
            }
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    reset () {

    },
    handleSelectionChange (e) {
      this.selected = e
    },
    cancel () {
      this.isShowClassEdit = false
      this.classDetail = {}
    }
  }
}
</script>
<style lang="scss" scoped>
//.index-wrap {
//  margin-top: 24px;
//}
</style>
