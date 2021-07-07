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
              <el-radio disabled label="department">部门</el-radio>
              <el-radio disabled label="company">企业</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
      </el-row>

      <el-row style="height: 100px">

        <el-col :span="10">

          <el-form-item label="上级组织：" prop="treeParentIds">
            <el-cascader
              v-if="!appVisible"
              ref="organizationCas"
              v-model="addEntity.treeParentIds"
              :options="organizationList"
              :props="selectProps"
              :show-all-levels="false"
              clearable
              placeholder="请选择上级组织"
              @blur="blurOrganizationCas"
            />

            <el-select
              v-if="appVisible"
              ref="organizationSel"
              v-model="addEntity.treeParentIds"
              placeholder="请选择"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.organizationId"
                :label="item.organizationName"
                :value="item.organizationId"
              />
            </el-select>

          </el-form-item>

        </el-col>

        <el-col :span="10">
          <el-form-item label="组织地址：">
            <el-input v-model="addEntity.organizationAddress" />
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
                  <div class="dragIcon">
                    <i v-if="contain(element)" class="el-icon-circle-check selete" />
                    <i class="el-icon-platform-eleme" @click="selectBox(element)" />
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
  addRelationShipWithOrgAndPerson,
  appShare,
  getMyApply,
  getOrganizationTreeAll,
  getOrganizationTreeChild,
  organizationDefault1,
  organizationDefault2,
  updateOrganization
} from '@/api/organization'
import { getOrganizationId, getPersonId } from '@/utils/auth'

export default {
  name: 'OrganizationUpdata',
  // eslint-disable-next-line vue/require-prop-types
  props: ['currentRow'],
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

      organizationList: [],
      appryEntity: {
        personId: undefined
      },
      addEntity: {
        organizationName: undefined,
        treeParentIds: [],
        treeParentName: undefined,
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
        value: 'organizationId',
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
    if (this.currentRow != null || this.currentRow !== undefined) {
      console.log(this.currentRow)
      this.addEntity.organizationName = this.currentRow.organizationName
      this.addEntity.organizationType = this.currentRow.organizationType
      this.addEntity.organizationAddress = this.currentRow.organizationAddress
      this.addEntity.organizationId = this.currentRow.organizationId
      this.changeType(this.addEntity.organizationType)

      if (this.currentRow.parentOrganizationId != null) {
        this.addEntity.treeParentIds = this.currentRow.parentOrganizationId
        this.addEntity.treeParentName = this.currentRow.parentOrganizationName
      }
    }

    this.addEntity.belongCompany = getOrganizationId()

    this.appryEntity.personId = getPersonId()

    this.getOrganizations(this.appryEntity)
    this.getMyApply(getOrganizationId())
  },

  methods: {
    sure() {
      this.$refs['addCustomerForm'].validate((valid) => {
        if (valid) {
          // 上级组织用数组方式上传
          const ids = []
          ids.push(this.addEntity.treeParentIds)
          this.addEntity.treeParentIds = ids

          console.log(this.addEntity)
          updateOrganization(this.addEntity).then(response => {
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
      const that = this
      getOrganizationTreeAll(entry).then(response => {
        this.organizationList = this.getCascad(response.data)
      })

      this.$nextTick(() => {
        if (this.addEntity.organizationType === 'department') {
          that.$refs.organizationCas.presentText = that.addEntity.treeParentName
          that.$refs.organizationCas.inputValue = that.addEntity.treeParentName
        }
      })
    },

    // 上级组织失去焦点时触发
    blurOrganizationCas() {
      if (this.addEntity.organizationType === 'department' && this.markerDefaultText !== '') {
        this.$refs.organizationCas.presentText = this.addEntity.treeParentName
        this.$refs.organizationCas.inputValue = this.addEntity.treeParentName
      }
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
      if (node.data !== undefined && node.children.length === 0 && node.data.hasChildren) {
        getOrganizationTreeChild(node.data.organizationId, this.orgTypeEntry).then(response => {
          resolve(this.getCascad(response.data))
        })
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
      position: relative;
      .selete{
        position: absolute;
        z-index: 999;
        width:50px;
        font-size:14px;
        text-align:right;
        @include c_themeColor();
      }
      i{
        float: left;
        width: 50px;
        margin-right: 12px;
        text-align: center;
        font-size: 50px;
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
