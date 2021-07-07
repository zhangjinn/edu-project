<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div>
          <etm-table-page :columns="columns" :data="tableData" @currentChange="currentChange">
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button type="primary" icon="el-icon-plus" @click="addOrg">添加区域总部</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column label="操作" width="200" fixed="right">
              <template v-slot="{row}">
                <div slot="tool">
                  <etm-text @click="handleEdit(row)">编辑</etm-text>
                  <etm-text @click="handleDel(row)">删除</etm-text>
                </div>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <!--  添加区域总部  -->
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="添加区域总部"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showAppPopup"
      @close="closeShowPop"
      @confirm="addOrganization"
      @cancel="closeShowPop"
    >
      <el-alert
        title="企业设为区域总部后，组织架构中的子企业都自动归属于这个区域总部管理"
        type="error"
        :closable="false"
      />
      <etm-form v-if="showPop" ref="form" :model="form" style="margin-top: 16px;" type="dialog">
        <el-form-item
          label="区域名称"
          prop="organizationName"
          :rules="formValidate.nullValueRule(true,'请输入区域名称',['change'])"
        >
          <el-input
            ref="first"
            v-model="form.organizationName"
            maxlength="10"
            placeholder="请输入区域名称"
          />
        </el-form-item>
        <el-form-item
          :rules="formValidate.nullValueRule(true,'请选择总部企业')"
          prop="value"
          label="选择总部企业"
        >
          <el-cascader
            v-model="form.value"
            :options="options"
            :props="{ checkStrictly: true,children: 'childList', label:'name',value:'id' }"
            clearable
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
    <!--  编辑  -->
    <etm-drawer :visible.sync="drawerVisible" :before-close="before">
      <etm-layout-split line>
        <etm-title title="区域总部详情" border size="big">
          <template slot="tool">
            <el-button plain size="mini" @click="close">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmEdit">保存</el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <edit
            v-if="drawerVisible"
            ref="childPopForm"
            :edit-msg="editMsg"
          />
        </div>

      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/01/28 14:53
 */
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import edit from '@/views/newDaycare/areaSetHead/components/edit'
import { queryArea_list, queryTree, createOrganization, removeOrganization, updateOrganization } from '@/api/newDaycare/areaSetHead'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'Index',
  components: { edit },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      formValidate,
      form: {},
      options: [],
      showPop: false,
      popType: 'complex',
      drawerVisible: false,
      columns: [
        {
          label: '区域名称',
          prop: 'areaName'
        },
        {
          label: '区域总部企业名称',
          prop: 'organizationName'
        },
        {
          label: '子园所数量',
          prop: 'sunSchoolNumber'
        },
        {
          label: '总面积（平方米）',
          prop: 'gardenArea'
        },
        {
          label: '员工数量',
          prop: 'employeeNumber'
        },
        {
          label: '学员数量',
          prop: 'childNumber'
        }
      ],
      tableData: {
        content: []
      },
      OrganizationId: null,
      editMsg: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    init() {
      queryArea_list(this.pageInfo).then(res => {
        this.tableData = res.data
      })
    },
    addOrg() {
      this.getOrganization()
      this.showPop = true
    },
    handleEdit(row) {
      console.log(row)
      this.editMsg.organizationName = row.areaName
      this.editMsg.organizationId = row.organizationId
      this.OrganizationId = row.organizationId
      this.drawerVisible = true
    },
    handleDel(row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除区域总部？',
        content: '删除区域总部，不会影响组织架构中的企业设置',
        confirmBtn: '好的',
        cancelBtn: '不了',
        confirm: () => {
          removeOrganization({ organizationId: row.organizationId }).then(() => {
            this.init()
            this.$message.success('操作成功')
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    confirmEdit() {
      this.$refs['childPopForm'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs['childPopForm'].form
          console.log(formData)
          console.log(this.OrganizationId)
          console.log(typeof (formData.value))
          updateOrganization({
            oldOrganizationId: this.OrganizationId,
            organizationId: typeof (formData.value) === 'number' ? formData.value : formData.value[formData.value.length - 1],
            areaName: formData.organizationName }).then(() => {
            this.init()
            this.$message.success('操作成功')
            this.drawerVisible = false
          })
        }
      })
    },
    close() {
      this.drawerVisible = false
    },
    getOrganization() {
      queryTree().then(res => {
        const options = this.callBack(res.data.root.childList)
        // console.log(options)
        this.options = options
      })
    },
    callBack(arr) {
      const data = deepClone(arr)
      const result = []
      data.forEach(cur => {
        // if (cur['type'] !== 'ENTERPRISE') {
        //   return false
        // }
        if (cur['type'] === 'ENTERPRISE') {
          cur.childList = cur.childList.length ? this.callBack(cur.childList) : []
          result.push(cur)
        }
      })
      return result
    },
    addOrganization() {
      this.$refs['form'].$children[0].validate(valid => {
        if (valid) {
          // this.$refs['form'].resetFields()
          createOrganization({ organizationId: this.form.value[this.form.value.length - 1], areaName: this.form.organizationName }).then(() => {
            this.$refs['form'].$children[0].resetFields()
            this.init()
            this.showPop = false
          })
        }
      })
    },
    closeShowPop() {
      this.$refs['form'].$children[0].resetFields()
      this.showPop = false
    },
    // 关闭抽屉
    before(done) {
      setTimeout(() => {
        done()
      }, 50)
    },
    showAppPopup() {
      this.showPop = true
      this.$nextTick(() => {
        this.$refs.first.focus()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  ::v-deep .el-alert {
    width: 575px;
  }
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-default {
      overflow-y: auto;
    }
  }
}
</style>
