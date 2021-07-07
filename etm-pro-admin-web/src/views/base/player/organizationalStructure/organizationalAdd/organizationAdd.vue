<template>
  <div>
    <el-form ref="addCustomerForm" label-width="100px" :model="addEntity" :rules="rules" class="demo-addCustomerForm">
      <el-row style="height: 100px">
        <el-col :span="10">
          <el-form-item label="组织名称：" prop="organizationName">
            <el-input v-model="addEntity.organizationName" />
          </el-form-item>

        </el-col>
        <el-col :span="10">

          <el-form-item label="组织属性：" prop="organizationType">
            <el-radio-group v-model="addEntity.organizationType" style="width: 150px;" @change="changeType">
              <el-radio :disabled="department" label="department">部门</el-radio>
              <el-radio :disabled="company" label="company">企业</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
      </el-row>

      <el-row style="height: 100px">

        <el-col :span="10">

          <el-form-item label="上级组织：" prop="treeParentIds">
            <el-cascader
              v-if="!appVisible"
              ref="organization"
              v-model="addEntity.treeParentIds"
              :options="organizationList"
              :props="selectProps"
              :show-all-levels="false"
              clearable
              placeholder="请选择上级组织"
            />
            <el-select
              v-else
              v-model="addEntity.treeParentIds"
              placeholder="请选择"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.treeId"
                :label="item.organizationName"
                :value="item.treeId"
              />
            </el-select>
            <!-- <el-select
              v-if="appVisible"
              v-model="addEntity.treeParentIds"
              placeholder="请选择"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.treeId"
                :label="item.organizationName"
                :value="item.treeId"
              />
            </el-select>-->

          </el-form-item>

        </el-col>

        <el-col :span="10">
          <el-form-item label="组织地址：">
            <el-input v-model="addEntity.organizationAddress" />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row style="height: 100px">
        <el-col :span="10">
          <el-form-item
            v-if="appVisible"
            label="企业负责人："
            prop="name"
          >
            <el-input v-model="addEntity.name" />
            <tool-tip :content="'在创建企业的时候，如果企业负责人没有账号<br/>会默认给企业负责人生成一个账号。'" :placement="'right'" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            v-if="appVisible"
            label="手机号码："
            prop="accountName"
          >
            <el-input v-model="addEntity.accountName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item
            v-if="appVisible"
            label="配置应用："
          >
            <el-row>
              <el-col
                v-for="element in dragList"
                :key="element.appId"
                :span="6"
                class="dragItem"
              >
                <div class="dragBox">
                  <div class="dragIcon" :style="{backgroundColor: bgColor[element.appId % bgColor.length]}" @click="selectBox(element)">
                    <i v-if="contain(element)" class="el-icon-circle-check selete" />
                    <i :class="element.icon" />
                  </div>
                  <div class="dragText">
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content" class="text-wrapper">
                        {{ element.appName+':'+element.appDescription }}
                      </div>
                      <p>{{ getElementName(element) }}</p>
                    </el-tooltip>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>

import {
  addEmployees,
  addMajorEmployees,
  addOrganization,
  addRelationShipWithOrgAndPerson,
  appShare,
  getMyApply,
  getOrganizationTreeAll,
  getOrganizationTreeChild,
  organizationDefault1,
  organizationDefault2
} from '@/api/organization'
import { getOrganization, getOrganizationId, getPersonId, isProperty } from '@/utils/auth'
import toolTip from '@/components/Tooltip/index'

export default {
  name: 'OrganizationAdd',
  components: {
    toolTip
  },
  data() {
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const that = this
    return {
      department: false,
      company: false,
      appVisible: false,
      bgColor: ['#FF943E', '#3296FA', '#00A0E9', '#FFAC00', '#F15643', '#15BC83'],
      organizationList: [],
      appryEntity: {
        personId: undefined
      },
      addEntity: {
        organizationName: undefined,
        treeParentIds: [],
        organizationAddress: undefined,
        organizationType: undefined,
        organizationId: undefined,
        belongCompany: undefined,
        name: undefined,
        accountName: undefined
      },

      addPersonEntity: {
        name: undefined,
        accountName: undefined,
        employeeType: 1,
        servingSchoolId: undefined
      },

      addMajorEntity: {
        servingSchoolId: undefined,
        employeeId: undefined,
        employeeType: 1
      },

      addRelationEntity: {
        type: 2,
        personId: undefined,
        organizationIds: []
      },
      orgTypeEntry: {
        type: 'department'
      },
      appShareEntry: {
        ownerId: undefined,
        sharedId: undefined,
        appIds: undefined
      },
      rules: {
        organizationName: { required: true, message: '请输入组织名称', trigger: 'blur' },
        treeParentIds: { required: true, message: '请选择上级组织', trigger: 'blur' },
        organizationType: { required: true, message: '请选择组织属性', trigger: 'blur' },
        name: { required: true, message: '请输入企业负责人', trigger: 'blur' },
        accountName: [{ required: true, message: '请输入负责人手机号', trigger: 'blur' },
          { validator: checkUser, trigger: 'blur' }]
      },
      selectProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'treeId',
        label: 'organizationName',
        emitPath: false,
        lazy: true,
        lazyLoad(node, resolve) {
          that.getOrganizationChild(node, resolve)
        },
        children: 'children',
        hasChildren: 'hasChildren'
      },
      selectPropsect: {
        value: 'treeId',
        label: 'organizationName'
      },
      dragList: [],
      selectList: []
    }
  },
  computed: {
    orgName: function(data) {
      return data.name
    }
  },
  created() {
    this.addEntity.belongCompany = getOrganizationId()

    this.appryEntity.personId = getPersonId()

    this.getOrganizations(this.appryEntity)
    this.getMyApply(getOrganizationId())

    if (!isProperty()) {
      this.company = true
    }
  },

  methods: {
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 上级组织用数组方式上传
          const ids = []
          ids.push(this.addEntity.treeParentIds)
          this.addEntity.treeParentIds = ids

          // 添加组织
          addOrganization(this.addEntity).then(response => {
            if (response.code === 0) {
              // 组织添加管辖关系
              this.addRelationEntity.personId = getPersonId()
              this.addRelationEntity.organizationIds.push(response.data[0].organizationId)
              this.addRelationShipWithOrgAndPerson(this.addRelationEntity)

              // 组织分享应用
              this.appShareEntry.ownerId = getOrganizationId()
              this.appShareEntry.sharedId = response.data[0].organizationId
              this.appShareEntry.appIds = this.getSelectApp()
              if (this.appShareEntry.appIds != null && this.appShareEntry.appIds.length > 0) {
                // 分享的应用不为空时， 分享应用
                this.appShare(this.appShareEntry)
              }
              this.organizationDefault(this.addRelationEntity) // 添加默认数据
              if (this.addEntity.organizationType === 'company') { // 当前创建的是企业的时候需要添加这个管理员
                this.addPersonEntity.name = this.addEntity.name
                this.addPersonEntity.accountName = this.addEntity.accountName
                this.addPersonEntity.servingSchoolId = response.data[0].organizationId
                this.addPerson(this.addPersonEntity)

                const array = getOrganization()
                this.addMajorEntity.employeeId = array[0].employeeId
                this.addMajorEntity.servingSchoolId = response.data[0].organizationId
                this.addMajorPerson(this.addMajorEntity)
              }
            }
            setTimeout(() => {
            }, 1.5 * 1000)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addRelationShipWithOrgAndPerson(data) {
      addRelationShipWithOrgAndPerson(data).then(response => {
        if (response.code === 0) {
          this.$emit('uplodeOrganization')
        } else {
          this.$emit('uplodeOrganization')
        }
      })
    },
    // 添加员工
    addPerson(data) {
      addEmployees(data).then(response => {
      })
    },
    addMajorPerson(data) {
      addMajorEmployees(data).then(response => {
      })
    },
    getCascad(data) {
      for (const index in data) {
        delete data[index].children
        if (data[index].hasChildren) {
          data[index].children = []
        } else {
          this.getCascad(data[index].children)
        }
      }
      return data
    },
    getOrganizations(entry) {
      getOrganizationTreeAll(entry).then(response => {
        this.organizationList = this.getCascad(response.data)
      })
    },
    getMyApply(id) {
      getMyApply(id).then(response => {
        this.dragList = response.data
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    getElementName(element) {
      return element.appName.length > 6 ? element.appName.substring(0, 6) + '...' : element.appName
    },

    selectBox(element) {
      if (this.selectList.indexOf(element) !== -1) {
        this.selectList.splice(this.selectList.indexOf(element), 1)
      } else {
        this.selectList.push(element)
      }
    },

    contain(element) {
      if (this.selectList.indexOf(element) !== -1) {
        return true
      } else {
        return false
      }
    },

    getSelectApp() {
      const ids = []
      if (this.selectList != null && this.selectList.length > 0) {
        for (const index in this.selectList) {
          ids.push(this.selectList[index].appId)
        }
      }
      return ids
    },

    appShare(appShareEntry) {
      appShare(appShareEntry).then(response => {
        setTimeout(() => {
          if (response.code === 0) {
            this.$emit('uplodeOrganization')
          }
        }, 1.5 * 1000)
      })
    },

    changeType(val) {
      this.selectList = []
      if (val === 'department') {
        this.appVisible = false
      } else {
        this.appVisible = true
      }
    },
    getOrganizationChild(node, resolve) {
      if (node.children === undefined || (node.children.length === 0 && node.data.hasChildren)) {
        if (node.data !== undefined && node.data != null) {
          getOrganizationTreeChild(node.data.organizationId, this.orgTypeEntry).then(response => {
            resolve(this.getCascad(response.data))
          })
        }
      } else {
        resolve(node.children)
      }
    },
    // 添加默认字段
    organizationDefault(entry) {
      organizationDefault1(entry).then({

      })
      organizationDefault2(entry).then({

      })
    }

  }

}
</script>
<style lang="scss" scoped>
  @import 'src/styles/variables';
  @import "~@/styles/mixin.scss";
  .dragBox {
    position: relative;

    .dragIcon {
      float: left;
      position: relative;
      width: 44px;
      height: 44px;
      margin-right: 12px;
      border-radius: 50%;
      line-height: 1;
      text-align: center;
      .selete{
        position: absolute;
        z-index: 999;
        width:50px;
        font-size:14px;
        text-align:right;
        top:0px;
        @include c_themeColor();
      }
      i{
        display: inline-block;
        font-size: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff;
      }
    }

    .dragText {
      position: relative;
      width: 100px;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      @include c_themeColor();
    }
  }
</style>
