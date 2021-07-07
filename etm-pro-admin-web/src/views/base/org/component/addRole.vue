<template>
  <div class="addRole-wrap">
    <div class="container">
      <!--<etm-title>添加角色</etm-title>-->
      <!--<etm-title :border="false">填写角色信息</etm-title>-->
      <!--<el-button @click="add">获取treeKeys</el-button>-->
      <el-form
        ref="rule"
        class="container-box"
        :model="roleData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级岗位" prop="parentName">
          <el-input v-model="roleData.parentName" disabled placeholder="无" />
        </el-form-item>
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="roleData.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位描述">
          <el-input v-model="roleData.description" placeholder="请输入岗位描述" />
        </el-form-item>
        <!--<el-form-item label="数据权限" prop="dataPrivilege">-->
        <!--  <el-radio-group v-model="roleData.dataPrivilege">-->
        <!--    <el-radio label="ALL">全部数据权限</el-radio>-->
        <!--    <el-radio label="SOLUTION">使用解决方案数据权限</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->

        <el-form-item label="数据权限" prop="dataPrivilegeType">
          <el-radio-group v-model="roleData.dataPrivilegeType">
            <el-radio label="ONLY_ME">仅本人</el-radio>
            <el-radio label="DEPARTMENT">本部门</el-radio>
            <el-radio label="DEPARTMENT_AND_BELOW">本部门及以下部门</el-radio>
            <el-radio label="ENTERPRISE">本企业</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="businessLabels.length !== 0" prop="tagIdList">
          <span slot="label">
            <el-tooltip class="item" effect="dark" placement="top">
              <span slot="content">
                <span>用户权限等级管控, 如请假审核</span>
              </span>
              <span>业务标签 <i class="iconfont iconquestion-circle" style="width: 16px;height: 16px;" />:</span>
            </el-tooltip>
          </span>

          <el-checkbox-group v-model="roleData.tagIdList">
            <template v-for="(label, index) of businessLabels">
              <el-tooltip :key="index" class="item" effect="dark" placement="top">
                <span slot="content">
                  <span>{{ label.remark }}</span>
                </span>
                <el-checkbox :label="label.id">
                  {{ label.name }}
                </el-checkbox>
              </el-tooltip>
            </template>

          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="功能权限" style="margin-bottom: 0;" />
      </el-form>

      <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
      <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
      <el-tabs v-model="activeName" class="role-tabs">

        <el-tab-pane
          v-for="(item, index) of solutionList"
          :key="index"
          :label="item.displayName"
          :name="item.displayName"
        >
          <div class="tabs-box">
            <div class="pc-box">
              <div class="title"><i class="iconfont iconbijiben" />电脑端</div>
              <el-tree
                v-if="convertData(item, 'PC').length !== 0"
                :ref="'tree_pc_'+item.displayName"
                node-key="id"
                :check-strictly="true"
                default-expand-all
                :data="convertData(item, 'PC')"
                show-checkbox
                :props="folderProps"
                @check="checkTreeNode(arguments, convertData(item, 'PC'),'tree_pc_'+item.displayName)"
              />
              <no-content v-else title="暂无数据" />
            </div>
            <div class="mobile-box">
              <div class="title"><i class="iconfont iconshoujiduan" />手机端</div>
              <el-tree
                v-if="convertData(item, 'MOBILE').length !== 0"
                :ref="'tree_mobile_'+item.displayName"
                node-key="id"
                :check-strictly="true"
                default-expand-all
                :data="convertData(item, 'MOBILE')"
                show-checkbox
                :props="folderProps"
                @check="checkTreeNode(arguments, convertData(item, 'MOBILE'),'tree_mobile_'+item.displayName)"
              />
              <no-content v-else title="暂无数据" />
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>

    </div>

  </div>
</template>

<script>
import { getCurrentSelectEnterpriseSolutionList } from '@/api/employee'
import { queryTagByEnterpriseId } from '@/api/base/org'
import NoContent from '@/components/NoContent/index'
import { findParentPathById } from '@/views/base/org/utils'

/**
 *  2020/4/9 9:31
 *  haijinsha
 */
export default {
  name: 'AddRole',
  components: { NoContent },
  filters: {},
  mixins: [],
  props: {
    role: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: '',
      solutionList: [],
      businessLabels: [],
      folderProps: {
        id: 'id',
        label: 'displayName',
        children: 'childList'
      },
      roleData: {
        parentName: '无',
        name: '',
        resourceIdList: [],
        description: '',
        dataPrivilege: 'ALL',
        dataPrivilegeType: 'ONLY_ME',
        tagIdList: []
      },
      rules: {
        name: [
          {
            required: true, message: '请输入岗位名称', trigger: 'blur'
          }
        ],
        dataPrivilege: [
          {
            required: true, message: '请选择数据权限', trigger: 'change'
          }
        ],
        dataPrivilegeType: [
          {
            required: true, message: '请选择数据权限类型', trigger: 'change'
          }
        ]
      },
      resourceIdList: []
    }
  },
  computed: {},
  watch: {
    role(val) {
      console.log('role val: ', val)
      this.roleData = val
      const parentName = val.parentName || '无'
      this.$set(this.roleData, 'parentName', parentName)
    }
  },
  created() {
    this.roleData = this.role
    this.init()
  },
  mounted() {
  },
  methods: {
    convertData(itemData, terminal) {
      return itemData.folderList.find(it => it.terminalType === terminal).resourceList
    },
    /**
     * @param data {Object}
     * @param node {TreeNode}
     * @param resource {array}
     * @param ref {string} refName
     */
    checkTreeNode([data, node] = arguments, resource, ref) {
      const isChecked = !!node.checkedNodes.find(item => item.id === data.id)
      // const currentResource = resource.find(item => item.id === data.id)
      const currentNode = this.$refs[ref][0]
      let parentId = findParentPathById(resource, data.id, [])
      parentId = parentId.length === 1 ? [] : parentId
      if (isChecked) {
        currentNode.setCheckedKeys([...currentNode.getCheckedKeys(), ...fn(data)].concat(parentId))
      } else {
        const checkedKeys = currentNode.getCheckedKeys()
        const currentKeys = fn(data)
        for (let i = 0; i < currentKeys.length; i++) {
          const currentKey = currentKeys[i]
          for (let j = 0; j < checkedKeys.length; j++) {
            const checkedKey = checkedKeys[j]
            if (currentKey === checkedKey) {
              checkedKeys.splice(j, 1)
            }
          }
        }
        currentNode.setCheckedKeys([...checkedKeys])
      }

      function fn(data) {
        const result = []

        function func(data) {
          result.push(data.id)
          if (data.childList && data.childList.length) {
            for (const childListElement of data.childList) {
              func(childListElement)
            }
          }
        }

        func(data)
        return result
      }
    },
    /**
     * 获取选中的ID
     * @returns {[]}
     */
    getTreeCheckedKeys() {
      const data = []
      this.solutionList.forEach((item, index) => {
        this.$refs['tree_pc_' + item.displayName] && this.$refs['tree_pc_' + item.displayName].forEach(ref => {
          data.push(...ref.getCheckedKeys())
          data.push(...ref.getHalfCheckedKeys())
        })
        this.$refs['tree_mobile_' + item.displayName] && this.$refs['tree_mobile_' + item.displayName].forEach(ref => {
          data.push(...ref.getCheckedKeys())
          data.push(...ref.getHalfCheckedKeys())
        })
      })
      return data
    },
    /**
     * 设置默认选中的项
     */
    setTreeCheckedKeys(selected = []) {
      this.$nextTick(() => {
        for (const ref in this.$refs) {
          if (ref.includes('tree')) {
            const refArr = this.$refs[ref]
            refArr.forEach(refObj => {
              const data = []
              this.solutionList.forEach(solution => {
                solution.folderList.forEach(folder => {
                  folder.resourceList.forEach(resource => {
                    if (resource.isSelected) {
                      data.push(resource.id)
                    }
                  })
                })
              })
              data.forEach(value => {
                refObj.setChecked(value, true, false)
              })
              this.roleData.resourceIdList.forEach(value => {
                refObj.setChecked(value, true, false)
              })
            })
          }
        }
      })
    },

    init() {
      queryTagByEnterpriseId({ id: this.role.enterpriseId, type: 'EMPLOYEE' }).then(res => {
        this.businessLabels = res.data
      })
      getCurrentSelectEnterpriseSolutionList(this.role.enterpriseId).then(res => {
        this.solutionList = res.data.solutionList || []
        if (this.solutionList.length) {
          this.activeName = this.solutionList[0].displayName
          // this.setTreeCheckedKeys(this.roleData.resourceIdList)
        }
        this.setTreeCheckedKeys()
      })
    },
    validator() {
      return this.$refs['rule'].validate()
    },
    emitData() {
      this.roleData.dataPrivilege = 'ALL'
      return {
        roleData: this.roleData,
        resourceIdList: this.getTreeCheckedKeys()
      }
    },
    resetFields() {
      for (const roleDataKey in this.roleData) {
        this.roleData[roleDataKey] = ''
      }
      this.$refs.rule.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.addRole-wrap {
  background-color: $white;
  /*height: 70vh;*/
  overflow: auto;
  /*padding: 24px;*/
  @include hiddenScrollBar();

  .bread {
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #F2F4F7;
  }

  .container {
    display: flex;
    flex-direction: column;

    .role-tabs {
      padding: 0 0 0 100px;
      position: relative;
      top: -32px;
      flex: 1 1 100%;

      & /deep/ {
        .el-tabs__nav-prev {
          line-height: 32px;
        }

        .el-tabs__nav-next {
          line-height: 32px;
        }

        .el-tabs__item {
          padding-right: 24px;
          height: 32px;
          line-height: 32px;

          &:not(.is-active) {
            font-size: 14px;
            color: #555;
          }
        }

        .el-tabs__content {
          margin-top: 16px;
        }
      }

      .tabs-box {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        height: 35vh;
        max-height: 35vh;
        overflow: hidden;

        .pc-box {
          padding-top: 46px;
          position: relative;
          margin-right: 16px;
          border: 1px solid #eee;
          flex: 1;
          height: 100%;
          overflow: auto;
          padding-bottom: 16px;
          -webkit-border-radius: 6px;
          -moz-border-radius: 6px;
          border-radius: 6px;

          & /deep/ .EtmStatus-wrap {
            height: auto;
            padding: 16px 24px;
          }

          .title {
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            padding-left: 10px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            background-color: #f9f9f9;
          }
        }

        .mobile-box {
          position: relative;
          padding-top: 46px;

          flex: 1;
          border: 1px solid #eee;
          height: 100%;
          overflow: auto;
          padding-bottom: 16px;
          -webkit-border-radius: 6px;
          -moz-border-radius: 6px;
          border-radius: 6px;

          & /deep/ .EtmStatus-wrap {
            height: auto;
            padding: 16px 24px;
          }

          .title {
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            padding-left: 10px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            background-color: #f9f9f9;
          }
        }
      }
    }

    & /deep/ .el-checkbox__label {
      color: #222;
    }

    /*& /deep/ .el-checkbox .el-checkbox__input.is-checked + .el-checkbox__label {*/
    /*  color: #222;*/
    /*}*/

  }
}
</style>
