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
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="roleData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="roleData.description" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="数据权限：" prop="dataPrivilege">
          <el-radio-group v-model="roleData.dataPrivilege">
            <el-radio label="ALL">全部数据权限</el-radio>
            <el-radio label="SOLUTION">使用解决方案数据权限</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="功能权限：" style="margin-bottom: 0;" />
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
              <etm-status type="primary">电脑端</etm-status>
              <el-tree
                :ref="'tree'+item.displayName"
                node-key="id"
                default-expand-all
                :data="convertData(item, 'PC')"
                show-checkbox
                :props="folderProps"
              />
            </div>
            <div class="mobile-box">
              <etm-status type="primary">移动端</etm-status>
              <el-tree
                :ref="'tree'+item.displayName"
                node-key="id"
                default-expand-all
                :data="convertData(item, 'MOBILE')"
                show-checkbox
                :props="folderProps"
              />
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>

    </div>

  </div>
</template>

<script>
import { getCurrentSelectEnterpriseSolutionList } from '@/api/employee'

/**
   *  2020/4/9 9:31
   *  haijinsha
   */
export default {
  name: 'AddRole',
  components: {},
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
      folderProps: {
        id: 'id',
        label: 'displayName',
        children: 'childList'
      },
      roleData: {
        name: '',
        resourceIds: [],
        description: '',
        dataPrivilege: 'ALL'
      },
      rules: {
        name: [
          {
            required: true, message: '请输入角色名称', trigger: 'blur'
          }
        ],
        dataPrivilege: [
          {
            required: true, message: '请选择数据权限', trigger: 'change'
          }
        ]
      },
      resourceIds: []
    }
  },
  computed: {},
  watch: {
    role(val) {
      this.roleData = val
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
       * 获取选中的ID
       * @returns {[]}
       */
    getTreeCheckedKeys() {
      const data = []
      this.solutionList.forEach((item, index) => {
        this.$refs['tree' + item.displayName].forEach(ref => {
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
              this.roleData.resourceIds.forEach(value => {
                refObj.setChecked(value, true, false)
              })
            })
          }
        }
      })
    },

    init() {
      getCurrentSelectEnterpriseSolutionList('noSelect').then(res => {
        this.solutionList = res.data.solutionList || []
        if (this.solutionList.length) {
          this.activeName = this.solutionList[0].displayName
          // this.setTreeCheckedKeys(this.roleData.resourceIds)
        }
        this.setTreeCheckedKeys()
      })
    },
    validator() {
      return this.$refs['rule'].validate()
    },
    emitData() {
      return {
        roleData: this.roleData,
        resourceIds: this.getTreeCheckedKeys()
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

      .role-tabs {
        padding: 0 0 0 100px;
        position: relative;
        top: -42px;
        & /deep/ {
          .el-tabs__item {
            padding-right: 24px;
            height: 48px;
            line-height: 48px;
          }
        }

        .tabs-box {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          height: 35vh;
          max-height: 35vh;
          overflow: auto;

          .pc-box {
            flex: 1;

            & /deep/ .EtmStatus-wrap {
              height: auto;
              padding: 16px 24px;
            }
          }

          .mobile-box {
            flex: 1;

            & /deep/ .EtmStatus-wrap {
              height: auto;
              padding: 16px 24px;
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
