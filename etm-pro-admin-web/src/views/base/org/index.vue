<template>
  <div class="index-wrap">
    <etm-main-body>
      <EtmLayoutSplit resize-x>
        <div slot="left" class="left-box">
          <etm-title>组织架构</etm-title>
          <div class="tab-btn">
            <el-radio-group v-model="tab" @change="changePanel">
              <el-radio-button :label="1">组织管理</el-radio-button>
              <el-radio-button :label="2">岗位权限</el-radio-button>
            </el-radio-group>
          </div>

          <div class="tree">
            <!--企业-->
            <el-tree
              v-show="tab === 1"
              accordion
              :data="orgTreeData"
              :props="orgProps"
              node-key="id"
              :default-expanded-keys="ortNodeIds"
              :expand-on-click-node="false"
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">

                <span :class="{active: currentId === data.id}" @click.prevent="handleOrgTreeNode(node, data)">
                  <i v-if="data.type === 'ENTERPRISE'" class="iconfont icongongsi" />
                  <i v-else class="iconfont iconzuzhijiagou" />
                  <etm-tool-tip :min="7" :max="9" :text="node.label" />
                </span>

                <!--企业-->
                <!-- v-if="data.type === 'ENTERPRISE' && currentId === data.id" -->
                <span v-if="data.type === 'ENTERPRISE'" class="handel-btn">
                  <i
                    v-has="{authId: 'basic.organization.query'}"
                    title="查看企业"
                    class="iconfont iconeye"
                    @click="orgDetail(node,data)"
                  />
                  <i
                    v-has="{authId: 'basic.organization.update'}"
                    title="编辑企业"
                    class="iconfont iconedit-square1"
                    @click="orgEdit(node,data)"
                  />
                  <i
                    v-if="node.level !== 1"
                    v-has="{authId: 'basic.organization.remove'}"
                    title="删除企业"
                    class="iconfont iconshanchu"
                    @click="removeOrg(node,data)"
                  />
                  <i
                    v-has="{authId: 'basic.department.create'}"
                    title="添加部门"
                    class="iconfont iconAddsuborganization"
                    @click="depAdd(node,data)"
                  />
                  <i
                    v-has="{authId: 'basic.organization.create'}"
                    title="添加子企业"
                    class="iconfont iconplus-square"
                    @click="orgAddSub(node,data)"
                  />

                </span>

                <!--部门-->
                <!-- v-else-if="data.type !== 'ENTERPRISE' && currentId === data.id" -->
                <span v-else class="handel-btn">
                  <i
                    v-has="{authId: 'basic.department.query'}"
                    title="查看部门"
                    class="iconfont iconeye"
                    @click="depDetail(node, data)"
                  />
                  <i
                    v-has="{authId: 'basic.department.update'}"
                    title="编辑部门"
                    class="iconfont iconedit-square1"
                    @click="depEdit(node, data)"
                  />
                  <i
                    v-has="{authId: 'basic.department.remove'}"
                    title="删除部门"
                    class="iconfont iconshanchu"
                    @click="depRemove(node, data)"
                  />
                  <i
                    v-has="{authId: 'basic.department.create'}"
                    title="添加子部门"
                    class="iconfont iconAddsuborganization"
                    @click="depAdd(node,data)"
                  />
                </span>
              </span>
            </el-tree>

            <!--岗位-->
            <el-tree
              v-show="tab === 2"
              accordion
              :default-expanded-keys="positionNodeIds"
              :props="positionProps"
              :data="positionTreeData"
              node-key="id"
              :expand-on-click-node="false"
            >
              <span
                :key="data.id"
                slot-scope="{ node, data }"
                class="custom-tree-node"
                :class="{active: tab === 2 && currentClassNameId === data.id}"
                @click.prevent="handlePositionTreeNode(node, data)"
              >

                <span class="label-icon">
                  <i v-if="data.admin" class="iconfont iconstar" title="管理员" />
                  <i v-else-if="data.position" title="查看岗位" class="iconfont iconidcard1" />
                  <i v-else title="查看组织" class="iconfont icongongsi" />
                </span>
                <etm-tool-tip :min="7" :max="9" :text="node.label" />
                <!--<span class="tree-label">{{ node.label }}</span>-->

                <!-- v-if="data.type === 'ENTERPRISE' && currentClassNameId === data.id" -->
                <span v-if="!data.position">
                  <span class="handel-btn">
                    <i
                      v-has="{authId: 'basic.position.create'}"
                      title="添加岗位"
                      class="iconfont iconplus-square"
                      @click="positionAdd(node, data)"
                    />
                  </span>
                </span>

                <span v-else class="handel-btn">
                  <i
                    v-if="!data.admin"
                    v-has="{authId: 'basic.position.update'}"
                    title="编辑岗位"
                    class="iconfont iconedit-square1"
                    @click="positionEdit(node, data)"
                  />
                  <i
                    v-if="!data.admin"
                    v-has="{authId: 'basic.position.remove'}"
                    title="删除岗位"
                    class="iconfont iconshanchu"
                    @click="positionRemove(node, data)"
                  />
                  <i
                    v-has="{authId: 'basic.position.create'}"
                    title="添加子岗位"
                    class="iconfont iconAddsuborganization"
                    @click.stop="positionAddSub(node, data)"
                  />
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <div slot="right" class="right-box">
          <etm-table-page :data="tableData" :columns="columns" :offset-top="offsetTop" @currentChange="currentChange">
            <etm-table-tool-bar slot="tool" @submit.native.prevent>
              <div class="text">
                <etm-tool-tip :min="9" :max="14" :text="activeName" />
              </div>
              <div slot="right" class="right">
                <div style="display: flex" class="search-btn">
                  <div class="file-search-box">
                    <el-input v-model="username" placeholder="请输入昵称或手机号搜索" @change="search" />
                    <i class="iconfont iconsousuo" />
                  </div>
                </div>
                <el-button slot="right" v-has="{authId: 'basic.employee.create'}" type="primary" @click="addEmployee"><i
                  class="el-icon-plus"
                />&nbsp;&nbsp;添加员工
                </el-button>
              </div>

            </etm-table-tool-bar>
            <el-table-column slot="right" label="账号状态" width="120">
              <template v-slot="{row}">
                <etm-status v-if="!row.enable" type="danger">已禁用</etm-status>
                <etm-status v-if="row.enable" type="primary">使用中</etm-status>
              </template>
            </el-table-column>
            <el-table-column slot="right" width="210" label="操作">
              <template v-slot="{row}">
                <etm-text type="primary" @click="employeeDetail(row)">详情
                </etm-text>
                <etm-text v-has="{authId: 'basic.employee.update'}" type="primary" @click="employeeEdit(row)">编辑
                </etm-text>
                <etm-text
                  v-if="!row.enable"
                  v-has="{authId: 'basic.employee.remove'}"
                  type="danger"
                  @click="employeeRemove(row)"
                >删除
                </etm-text>
                <etm-text
                  v-if="!row.enable"
                  v-has="{authId: 'basic.employee.active'}"
                  type="primary"
                  @click="employeeEnable(row)"
                >启用
                </etm-text>
                <etm-text
                  v-if="row.enable"
                  v-has="{authId: 'basic.employee.disable'}"
                  type="danger"
                  @click="employeeEnable(row)"
                >禁用
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </EtmLayoutSplit>

      <!--查看企业-->
      <!--
         confirm-btn="修改"
        :confirm="handleEditBtnOrg"
      -->
      <etm-pop
        title="查看企业"
        :visible="orgVisibleDetail"
        pop="complex"
        cancel-btn="取消"
        confirm-btn="修改"
        :confirm="handleEditBtnOrg"
        @cancel="orgVisible = false"
        @close="orgVisible = false"
      >
        <etm-form :model="orgDetailData" type="dialog">
          <el-form-item label="企业LOGO">
            <el-avatar v-if="orgDetailData.avatar" class="etm-avatar" :size="40" :src="orgDetailData.avatar" />
            <span v-else style="display:flex; align-items: center; width:40px; height: 40px;">
              <i style="font-size: 40px; color: #C1C4CC;" class="iconfont icondangqianqiye" />
            </span>
          </el-form-item>
          <el-form-item label="上级企业">
            <span>{{ orgDetailData.parentName }}</span>
          </el-form-item>
          <el-form-item label="企业名称">
            <span>{{ orgDetailData.name }}</span>
          </el-form-item>
          <el-form-item label="企业地址">
            <span>{{ orgDetailData.address }}</span>
          </el-form-item>
          <el-form-item label="企业负责人">
            <span>{{ orgDetailData.principalName }}</span>
          </el-form-item>
          <el-form-item label="手机号码">
            <span>{{ orgDetailData.principalTelephone }}</span>
          </el-form-item>
          <el-form-item label="选择方案">
            <span>{{ orgDetailData.solutionName }}</span>
          </el-form-item>
        </etm-form>
      </etm-pop>

      <!--新建/编辑企业-->
      <etm-pop
        v-if="orgVisibleCreate"
        :title="orgStatus === 'create' ? '新建子企业' : '修改企业'"
        :visible="orgVisibleCreate"
        pop="complex"
        cancel-btn="取消"
        :confirm="handleOrg"
        @cancel="orgVisible = false"
        @close="orgVisible = false"
      >
        <etm-form ref="orgForm" :model="orgDetailData" type="dialog" :rules="orgRules">
          <el-form-item label="企业LOGO">
            <etm-upload-avatar
              v-model="orgDetailData.avatar"
              :resource-name="'basic/org'"
              upload-type="organization"
              media-type="image"
              @success="uploadAvatarSuccess"
            />
          </el-form-item>
          <el-form-item label="上级企业">
            <span>{{ orgDetailData.parentName }}</span>
          </el-form-item>
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="orgDetailData.name" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="企业地址" prop="areaCode">
            <etm-address v-if="orgVisibleCreate" v-model="orgDetailData.areaCode" :area-id="orgDetailData.areaCode" />
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="orgDetailData.address" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="企业负责人" prop="principalName">
            <el-input v-model="orgDetailData.principalName" placeholder="请输入负责人" />
          </el-form-item>
          <el-form-item label="手机号码" prop="principalTelephone">
            <el-input v-model="orgDetailData.principalTelephone" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="选择方案" prop="solutionIds">
            <el-checkbox-group
              v-model="orgDetailData.solutionIds"
              :disabled="topEnterprise.id === orgDetailData.id"
              @change="changeCheckBox"
            >
              <el-checkbox
                v-for="(solution, index) of solutionList"
                :key="index"
                :label="solution.solutionId"
              >{{ solution.displayName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </etm-form>
      </etm-pop>

      <!--查看部门-->
      <etm-pop
        :visible="depVisible && depStatus === 'detail'"
        title="查看部门"
        pop="complex"
        class="dep-pop"
        cancel-btn="取消"
        confirm-btn="修改"
        :confirm="handleEditBtnDep"
        @cancel="depVisible = false"
        @close="depVisible = false"
      >
        <etm-form :model="depDetailData" type="dialog">
          <el-form-item label="应用企业">
            <span>{{ parentEnterprise.name }}</span>
          </el-form-item>
          <el-form-item label="上级部门">
            <span>{{ parentDepForDetail.name }}</span>
          </el-form-item>
          <el-form-item label="部门名称">
            <span>{{ depDetailData.name }}</span>
          </el-form-item>
          <el-form-item v-if="depDetailData.tagList && depDetailData.tagList.length>0" label="业务标签:">
            <!--TODO: <span>{{ depDetailData.tagList.map(item => item).join(',') }}</span>-->

            <span v-for="(tag, index) of depDetailData.tagList" :key="index">{{ tag.name }}</span>
          </el-form-item>
        </etm-form>
      </etm-pop>

      <!--新建/编辑部门-->
      <etm-pop
        :visible="depVisible && depStatus !== 'detail'"
        :title="depStatus === 'create' ? '新建部门' : '修改部门'"
        pop="complex"
        class="dep-pop"
        cancel-btn="取消"
        :confirm="handleBtnDep"
        @cancel="depVisible = false"
        @close="depVisible = false"
      >
        <etm-form ref="depForm" :model="depDetailData" type="dialog">
          <el-form-item label="应用企业">
            <span>{{ parentEnterprise.name }}</span>
          </el-form-item>
          <el-form-item label="上级部门">
            <el-input v-if="depStatus === 'create'" v-model="parentDep.name " disabled />
            <el-input v-else v-model="depDetailData.parentName " disabled />
          </el-form-item>
          <el-form-item label="部门名称">
            <el-input v-model="depDetailData.name" placeholder="请输入部门名称" />
          </el-form-item>
          <el-form-item v-if="tagList.length">
            <el-tooltip slot="label" class="item" effect="dark" placement="top">
              <span slot="content">部门业务类型区分</span>
              <span style="position:relative;">业务标签<i class="iconfont iconquestion-circle" />:</span>
            </el-tooltip>
            <el-checkbox-group v-model="depDetailData.tags" @change="() => {$forceUpdate()}">

              <el-tooltip
                v-for="(tag, idx) of tagList"
                :key="idx"
                class="item"
                effect="dark"
                :content="tag.remark"
                placement="top"
              >
                <el-checkbox :label="tag.id">{{ tag.name }}</el-checkbox>
              </el-tooltip>
            </el-checkbox-group>
          </el-form-item>
        </etm-form>
      </etm-pop>

      <!--新建岗位-->
      <etm-pop
        :visible="positionVisible"
        pop="big"
        :title="positionStatus === 'create' ? '添加岗位' : '编辑岗位'"
        cancel-btn="取消"
        :confirm="handlePosition"
        @close="positionVisible = false"
        @cancel="positionVisible = false"
      >

        <add-role v-if="positionVisible" ref="addRole" :role="positionData" />
      </etm-pop>

      <!--新增/修改员工-->
      <etm-pop
        :visible="employeeVisible && employeeStatus === 'create'"
        :title="employeeStatus === 'create' ? '新增员工': '修改员工'"
        pop="complex"
        class="employee-pop"
        cancel-btn="取消"
        :confirm="handleEmployee"
        @cancel="employeeVisible = false"
        @close="employeeVisible = false"
      >
        <etm-form v-if="employeeStatus === 'create'" ref="employeeForm" :model="employeeDetailData" type="dialog" :rules="employeeRules">
          <el-form-item label="任职企业">
            <el-input v-model="parentEnterprise.name" disabled aria-placeholder="应用企业" />
          </el-form-item>
          <el-form-item label="手机号码" prop="telephone">
            <el-input v-model="employeeDetailData.telephone" :disabled="employeeStatus === 'edit'" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input v-model="employeeDetailData.name" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="岗位权限" prop="positionIdList">
            <!--<el-select v-model="employeeDetailData.positionIdList" multiple @change="() => {$forceUpdate()}">-->
            <!--  <el-option v-for="(pos, idx) of positionList" :key="idx" v-bind="{...pos}" />-->
            <!--</el-select>-->
            <el-cascader
              v-model="employeeDetailData.positionIdList"
              class="no-close"
              :options="positionList"
              :props="{ multiple: true, checkStrictly: true, label: 'name', value: 'id', children: 'childList' }"
              clearable
              @change="handlePositionChange"
            />
            <!--            @blur="handlePositionChange"-->

          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <!--<el-select v-model="employeeDetailData.departmentId" @change="() => {$forceUpdate()}">-->
            <!--  <el-option v-for="(pos, idx) of departments" :key="idx" v-bind="{...pos}" />-->
            <!--</el-select>-->
            <el-cascader
              v-model="employeeDetailData.departmentId"
              :options="departments"
              :props="{ checkStrictly: true, label: 'name', value: 'id', children: 'childList' }"
              clearable
              @change="() => $forceUpdate()"
            />

          </el-form-item>
        </etm-form>
      </etm-pop>

      <!--查看员工-->
      <!--      <etm-pop-->
      <!--        :visible="employeeVisible && employeeStatus === 'detail'"-->
      <!--        title="查看员工"-->
      <!--        pop="complex"-->
      <!--        class="employee-pop"-->
      <!--        cancel-btn="取消"-->
      <!--        confirm-btn="修改"-->
      <!--        :confirm="handleEditEmployee"-->
      <!--        @cancel="employeeVisible = false"-->
      <!--        @close="employeeVisible = false"-->
      <!--      >-->
      <!--        <etm-form ref="employeeForm" class="viewEmployees" :model="employeeDetailData" type="dialog">-->
      <!--          <el-form-item label="任职企业">-->
      <!--            <span>{{ parentEnterprise.name }}</span>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="手机号码" prop="telephone">-->
      <!--            <span>{{ employeeDetailData.telephone }}</span>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="昵称" prop="name">-->
      <!--            <span>{{ employeeDetailData.name }}</span>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="岗位权限" prop="positionIdList">-->
      <!--            <span>{{ employeeDetailData.positionName }}</span>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="部门" prop="departmentId">-->
      <!--            <span>{{ employeeDetailData.departmentName }}</span>-->
      <!--          </el-form-item>-->
      <!--        </etm-form>-->
      <!--      </etm-pop>-->

      <etm-drawer :before-close="() => { employeeVisible = false}" :visible.sync="readDrawer" type="small">
        <etm-layout-split>
          <etm-title :show-line="false" border size="big">
            {{ employeeStatus === 'edit' ? '编辑员工' : '查看员工' }}

            <template slot="tool">
              <el-button v-if="employeeStatus === 'edit'" plain size="mini" @click="employeeVisible = false">取消</el-button>
              <el-button v-if="employeeStatus === 'edit'" type="primary" size="mini" @click="handleEmployee">保存</el-button>
              <el-button v-if="employeeStatus === 'detail'" plain size="mini" @click="handleEditEmployee">编辑</el-button>
            </template>
          </etm-title>
          <etm-form v-if="employeeStatus === 'detail'" ref="employeeForm" class="viewEmployees" :model="employeeDetailData" type="dialog">
            <etm-field-label type="left" label="任职企业">
              <span>{{ parentEnterprise.name }}</span>
            </etm-field-label>
            <etm-field-label type="left" label="手机号码" prop="telephone">
              <span>{{ employeeDetailData.telephone }}</span>
            </etm-field-label>
            <etm-field-label type="left" label="昵称" prop="name">
              <span>{{ employeeDetailData.name }}</span>
            </etm-field-label>
            <etm-field-label type="left" label="岗位权限" prop="positionIdList">
              <span>{{ employeeDetailData.positionName }}</span>
            </etm-field-label>
            <etm-field-label type="left" label="部门" prop="departmentId">
              <span>{{ employeeDetailData.departmentName }}</span>
            </etm-field-label>
          </etm-form>

          <etm-form v-if="employeeStatus === 'edit'" ref="employeeForm" :model="employeeDetailData" type="dialog" :rules="employeeRules">
            <el-form-item label="任职企业">
              <el-input v-model="parentEnterprise.name" disabled aria-placeholder="应用企业" />
            </el-form-item>
            <el-form-item label="手机号码" prop="telephone">
              <el-input v-model="employeeDetailData.telephone" :disabled="employeeStatus === 'edit'" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
              <el-input v-model="employeeDetailData.name" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="岗位权限" prop="positionIdList">
              <!--<el-select v-model="employeeDetailData.positionIdList" multiple @change="() => {$forceUpdate()}">-->
              <!--  <el-option v-for="(pos, idx) of positionList" :key="idx" v-bind="{...pos}" />-->
              <!--</el-select>-->
              <el-cascader
                v-model="employeeDetailData.positionIdList"
                class="no-close"
                :options="positionList"
                :props="{ multiple: true, checkStrictly: true, label: 'name', value: 'id', children: 'childList' }"
                clearable
                @change="handlePositionChange"
              />
              <!--            @blur="handlePositionChange"-->

            </el-form-item>
            <el-form-item label="部门" prop="departmentId">
              <!--<el-select v-model="employeeDetailData.departmentId" @change="() => {$forceUpdate()}">-->
              <!--  <el-option v-for="(pos, idx) of departments" :key="idx" v-bind="{...pos}" />-->
              <!--</el-select>-->
              <el-cascader
                v-model="employeeDetailData.departmentId"
                :options="departments"
                :props="{ checkStrictly: true, label: 'name', value: 'id', children: 'childList' }"
                clearable
                @change="() => $forceUpdate()"
              />

            </el-form-item>
          </etm-form>
        </etm-layout-split>
      </etm-drawer>

    </etm-main-body>
  </div>

</template>

<script>
import EtmUploadAvatar from '@/components/EtmUploadAvatar'
// import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import {
  createDepartment,
  createSubOrganization,
  queryDepartmentCascader,
  queryDepartmentDetailById,
  queryDepartmentSelect,
  queryOrganizationDetailById,
  queryOrganizationTree,
  queryTagByEnterpriseId,
  removeDepartmentById,
  removeSubOrganization,
  updateDepartment,
  updateSubOrganization
} from '@/api/base/org'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  createEmployee,
  queryEmployeeById,
  queryEmployeePageByOrgIdOrRoleIdOrName,
  removeEmployeeById,
  updateEmployee,
  updateEmployeeStatus
} from '@/api/base/employee'
import {
  createPosition,
  queryPositionById,
  queryPositionCascader,
  queryPositionSelect,
  queryPositionTree,
  removePositionById,
  updatePosition
} from '@/api/base/position'
import AddRole from '@/views/base/org/component/addRole'
import { getImgUrlRelativePath, parseTime } from '@/utils'
import { queryAreaInfoByAreaId, queryCurrentAccountHaveSolutionSelect } from '@/api/base/base'
import EtmAddress from '@/views/base/org/EtmAddress'
import EtmMainBody from '@/views/sacc/schedule/components/EtmMainBody/src/EtmMainBody'
import { findParentPathById } from '@/views/base/org/utils'
import EtmToolTip from '@/views/base/org/component/EtmToolTip'

/**
 * index create by haijinsha
 * createTime 2020/7/6 10:49
 */
export default {
  name: 'Index',
  components: { EtmToolTip, EtmMainBody, EtmAddress, AddRole, EtmUploadAvatar },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    const validatorPosition = (rule, value, callback) => {
      if (this.employeeDetailData.positionIdList.length <= 0) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      offsetTop: 74,
      tab: 1,
      // 默认展开的ID
      positionNodeIds: [],
      ortNodeIds: [],
      orgProps: {
        children: 'childList',
        label: 'name'
      },
      positionProps: {
        children: 'childList',
        label: 'name'
      },
      orgTreeData: [],
      positionTreeData: [],
      data: [],
      text: 'text',
      username: '',
      columns: [
        {
          label: '手机号码',
          prop: 'telephone'
        },
        {
          label: '昵称',
          prop: 'name'
        },
        {
          label: '所属部门',
          prop: 'departmentName'
        },
        {
          label: '岗位权限',
          prop: 'positionNameList'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ],
      tableData: {
        content: []
      },
      orgVisible: false,
      orgStatus: '',
      solutionList: [],
      orgDetailData: {
        areaCode: null,
        solutionIds: []
      },
      orgRules: {
        name: { required: true, message: '请输入企业名称', trigger: 'blur' },
        areaCode: { required: true, message: '请选择地区', trigger: 'change' },
        principalName: { required: true, message: '请输入负责人', trigger: 'blur' },
        principalTelephone: { required: true, message: '请输入手机号码', trigger: 'blur' },
        solutionIds: { required: true, message: '请选择解决方案', trigger: 'blur' }
      },

      depVisible: false,
      depDetailData: {
        tags: [],
        tagList: []
      },
      currentEmployee: {},
      employeeVisible: false,
      employeeStatus: 'create',
      employeeDetailData: {
        departmentId: '',
        departmentName: '',
        positionIdList: []
      },
      employeeRules: {
        telephone: { message: '请输入手机号码', required: true, trigger: 'blur' },
        name: { message: '请输入昵称', required: true, trigger: 'blur' },
        positionIdList: { type: 'array', message: '请选择岗位', required: true, trigger: 'change', validator: validatorPosition },
        departmentId: { message: '请选择部门', required: false, trigger: 'change' }
      },
      provinces: [],
      citys: [],
      areas: [],
      // 部门
      departments: [],
      // 当前部门, 用于新增
      parentDep: {},
      // 当前部门, 用于查看
      parentDepForDetail: {},
      // 岗位
      positionList: [],
      depStatus: '',
      tagList: [],
      // 添加岗位
      positionStatus: 'create',
      positionVisible: false,
      positionData: {
        parentName: '',
        enterpriseId: '',
        name: '',
        resourceIdList: [],
        description: '',
        dataPrivilege: 'ALL',
        tagIdList: []
      },
      // 状态
      currentOrganization: {
        name: ''
      },
      currentDepartment: {
        name: ''
      },
      currentId: '',
      currentClassNameId: '',
      // 当前选中的企业
      parentEnterprise: {},
      parentPosition: {},
      // 当前选中的岗位
      currentPosition: {},
      // 当前点击的节点
      activeNode: {},
      // 顶级企业
      topEnterprise: {},
      activePosition: {},
      activeEnterprises: {},
      activeName: ''
    }
  },
  computed: {
    orgVisibleDetail() {
      return this.orgStatus === 'detail' && this.orgVisible
    },
    orgVisibleCreate() {
      return this.orgStatus !== 'detail' && this.orgVisible
    },
    readDrawer() {
      return this.employeeVisible && this.employeeStatus !== 'create'
    }
  },
  watch: {
    // 企业
    orgVisible(visible) {
      if (this.$refs['orgForm'] && !visible) {
        this.orgDetailData = {
          solutionIds: [],
          address: null
        }
        this.$refs['orgForm'].$children[0].resetFields()
      }
    },
    // 员工
    employeeVisible(visible) {
      if (!visible) {
        if (this.$refs['employeeForm']) {
          this.employeeDetailData = {
            departmentId: '',
            departmentName: '',
            positionIdList: []
          }
          this.$refs['employeeForm'].$children[0].resetFields()
        }
        return
      }

      // 企业
      if (this.tab === 1) {
        // 部门
        if (this.activeNode.type === 'DEPARTMENT') {
          this.employeeDetailData.departmentId = this.activeNode.id
        }
      } else {
        // 岗位
        if (this.activeNode.position) {
          this.employeeDetailData.positionIdList.push(this.activeNode.id)
        }
      }
      queryPositionSelect({ id: this.parentEnterprise.id }).then(res => {
        // this.positionList = this.convertDataToOptions(res.data, 'name', 'id')
      })

      function iter(data) {
        for (const datum of data) {
          if (datum.childList.length < 1) {
            datum.childList = null
          } else {
            iter(datum.childList)
          }
        }
        return data
      }

      queryPositionCascader({ id: this.parentEnterprise.id }).then(res => {
        this.positionList = res.data.rootList

        this.positionList = iter(this.positionList)
      })
      queryDepartmentSelect({ id: this.parentEnterprise.id }).then(res => {
        // this.departments = this.convertDataToOptions(res.data, 'name', 'id')
      })
      queryDepartmentCascader({ id: this.parentEnterprise.id }).then(res => {
        console.log(res)
        this.departments = iter(res.data.rootList)
      })
    },
    'currentClassNameId': {
      handler() {
        this.handlerTitle()
      },
      deep: true,
      immediate: true
    },
    'currentId': {
      handler() {
        this.handlerTitle()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    handlerTitle() {
      if (this.tab === 1) {
        this.activeName = this.activeEnterprises.name
      } else {
        this.activeName = this.activePosition.name
      }
    },
    async init() {
      // 查询组织树
      await queryOrganizationTree().then(async res => {
        console.log(res)
        this.orgTreeData = [res.data.root]
        console.log(this.orgTreeData)
        // this.ortNodeIds = [this.orgTreeData[0].id]
        this.setDefaultNode('enterprise', this.orgTreeData[0].id)

        const { id } = res.data.root
        // 默认选中第一个
        const node = {
          data: { type: 'ENTERPRISE', ...res.data.root }
        }
        const data = { id, type: 'ENTERPRISE' }
        this.topEnterprise = data
        this.handleOrgTreeNode(node, data)
      })
      // 查询岗位树
      this.positionTreeData = this.data
      await queryPositionTree().then(res => {
        this.positionTreeData = [res.data.root]
        // this.positionNodeIds = [this.positionTreeData[0].id]
        this.setDefaultNode('position', this.positionTreeData[0].id)
      })
    },
    /**
     * 切割字符串 大于7个时切割
     * @param {string} str
     * @param {number} count
     */
    sliceStr(str, count) {
      if (!str) {
        return str
      }
      if (str.length > count) {
        return str.slice(0, count) + '...'
      } else {
        return str
      }
    },
    /**
     * 格式化字符串, 每隔count个时加一个换行符
     * @param {string} str
     * @param {number} count 个数
     */
    formatStr(str, count) {
      if (!str) {
        return str
      }
      let result = ''
      for (let i = 0; i < str.length; i++) {
        if (i && i % count === 0) {
          result += '</br>' + str[i]
        } else {
          result += str[i]
        }
      }
      return result
    },
    /**
     * 设置默认展开节点
     * @param {('enterprise'|'position')} type
     * @param {string|number} nodeId
     */
    setDefaultNode(type, nodeId) {
      if (type === 'enterprise') {
        this.ortNodeIds = [nodeId]
      } else if (type === 'position') {
        this.positionNodeIds = [nodeId]
      }
    },
    // 企业logo上传成功回调
    uploadAvatarSuccess(val, key, url) {
      this.orgDetailData.avatar = url
      this.orgDetailData.commitAvatar = key
    },
    clearEtmForm(form) {
      this.$nextTick(() => {
        this.$refs[form] && this.$refs[form].$children[0].resetFields()
      })
    },
    changePanel(val) {
      this.tab = val
      console.log(val)
    },
    // TODO: 企业
    orgDetail(node, data) {
      this.setParent(node)
      console.log(node, data)
      this.currentOrganization = data
      this.showOrg({ orgStatus: 'detail', id: data.id })
    },
    handleEditBtnOrg() {
      this.orgVisible = false
      this.orgDetailData.address = this.orgDetailData.originAddress
      this.$nextTick().then(res => {
        this.orgVisible = true
        this.orgStatus = 'edit'
      })
    },
    /**
     * 显示企业操作弹窗
     * @param orgStatus {string} detail=详情, edit=修改, create=新建
     * @param id {string} 企业ID
     */
    showOrg({ orgStatus, id }) {
      this.orgStatus = orgStatus
      this.orgVisible = true
      if (orgStatus !== 'create') {
        queryOrganizationDetailById({ id }).then(res => {
          this.orgDetailData = res.data
          this.orgDetailData.solutionIds = this.orgDetailData.solutionList.map(item => item.id)
          this.orgDetailData.solutionName = this.orgDetailData.solutionList.map(item => item.displayName).join()
          this.orgDetailData.originAddress = res.data.address

          if (res.data.logo) {
            this.orgDetailData.avatar = res.data.logo
            this.orgDetailData.commitAvatar = getImgUrlRelativePath(res.data.logo)
          }

          queryAreaInfoByAreaId({ areaId: this.orgDetailData.areaCode }).then(result => {
            const { provinceName, cityName, countyName } = result.data
            if (orgStatus === 'detail') {
              this.orgDetailData.address = (provinceName + cityName + countyName) + (res.data.address || '')
            }
          })
        })
      } else {
        this.orgDetailData.solutionIds = []
      }
    },
    async orgEdit(node, data) {
      // 查询解决方案
      let parentId = null
      if (node.parent) {
        // 树顶级
        if (Array.isArray(node.parent.data)) {
          parentId = node.parent.data[0].id
        } else {
          parentId = node.parent.data.id
        }
      }
      await queryCurrentAccountHaveSolutionSelect(parentId).then(res => {
        this.solutionList = res.data
      })
      this.setParent(node)
      this.currentOrganization = data
      this.showOrg({ orgStatus: 'edit', id: data.id })
    },
    async orgAddSub(node, data) {
      // 查询解决方案
      await queryCurrentAccountHaveSolutionSelect(data.id).then(res => {
        this.solutionList = res.data
      })
      this.clearEtmForm('orgForm')
      this.setParent(node)
      this.currentOrganization = data
      this.showOrg({ orgStatus: 'create', id: data.id })
      this.orgDetailData.parentName = data.name
    },
    removeOrg(node, data) {
      // this.setParent(node)
      console.log(node, data)
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该企业？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeSubOrganization({ id: data.id }).then(res => {
            console.log(res)
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    /**
     * 处理编辑员工岗位权限时的change事件没触发校验的问题
     */
    handlePositionChange() {
      this.$refs.employeeForm.$children[0].validateField('positionIdList')
    },
    // 企业弹窗按钮
    handleOrg() {
      console.log(this.$refs['orgForm'])
      this.$refs['orgForm'].$children[0].validate(async valid => {
        if (valid) {
          const { commitAvatar, name, areaCode, address, principalName, principalTelephone, solutionIds } = this.orgDetailData
          if (this.orgStatus === 'create') {
            await createSubOrganization({
              id: this.currentOrganization.id,
              logo: commitAvatar,
              name,
              areaCode,
              address,
              principalName,
              principalTelephone,
              solutionIdList: solutionIds
            }).then(async res => {
              console.log(res)
              this.$message.success('创建企业')
              await this.init()
              this.setCurrentId(this.currentOrganization.id)
              this.setDefaultNode('enterprise', this.currentId)
            })
          } else if (this.orgStatus === 'edit') {
            await updateSubOrganization({
              id: this.currentOrganization.id,
              logo: commitAvatar,
              name,
              areaCode,
              address,
              principalName,
              principalTelephone,
              solutionIdList: solutionIds
            }).then(async res => {
              this.$message.success('编辑企业')
              await this.init()
              this.setCurrentId(this.currentOrganization.id)
              this.setDefaultNode('enterprise', this.currentId)
            })
          }
          this.orgVisible = false
          this.clearEtmForm('orgForm')
        } else {
          this.$message.warning('信息不完整')
        }
      })
    },
    changeCheckBox(e) {
      this.$forceUpdate()
    },
    // TODO: 部门

    handleEditBtnDep() {
      this.depVisible = false
      this.$nextTick().then(res => {
        this.depVisible = true
        this.depStatus = 'edit'
      })
    },
    handleBtnDep() {
      this.depVisible = false
      this.$refs['depForm'].$children[0].validate(async valid => {
        const { name, tags } = this.depDetailData
        if (this.depStatus === 'create') {
          await createDepartment({
            id: this.parentEnterprise.id,
            parentId: this.parentDep.id,
            name,
            tagIdList: tags
          }).then(async res => {
            this.$message.success('操作成功')
            await this.init()
            this.setCurrentId(this.parentDep.id)
            this.setDefaultNode('enterprise', this.currentId)
          })
        } else if (this.depStatus === 'edit') {
          await updateDepartment({
            id: this.depDetailData.id,
            parentId: this.parentDep.parentId,
            name,
            tagIdList: tags
          }).then(async res => {
            console.log(res)
            this.$message.success('操作成功')
            await this.init()
            this.setCurrentId(this.depDetailData.id)
            this.setDefaultNode('enterprise', this.currentId)
          })
        }
      })
    },
    setCurrentId(id) {
      this.currentId = id
    },
    async showDep({ depStatus, id }) {
      this.depVisible = true
      this.depStatus = depStatus
      if (depStatus !== 'create') {
        await queryDepartmentDetailById({ id }).then(res => {
          this.parentDep.parentId = res.data.parentId
          this.depDetailData = Object.assign({}, res.data)
          this.depDetailData.tags = this.depDetailData.tagList.map(item => item.id)
        })
      } else {
        const { belongEnterpriseName, belongEnterpriseId } = this.depDetailData
        // Object.keys(this.depDetailData).forEach(key => (this.depDetailData[key] = ''))
        this.depDetailData.belongEnterpriseName = belongEnterpriseName
        this.depDetailData.belongEnterpriseId = belongEnterpriseId
      }
      // 查询该企业的业务标签
      await queryTagByEnterpriseId({ id: this.parentEnterprise.id, type: 'DEPARTMENT' }).then(res => {
        this.tagList = res.data
      })
      this.updateView()
    },
    async showEmployee({ employeeStatus, id }) {
      this.employeeVisible = true
      this.employeeStatus = employeeStatus
      if (employeeStatus !== 'create') {
        await queryEmployeeById({ id }).then(res => {
          this.employeeDetailData = res.data
          this.employeeDetailData.positionIdList = this.employeeDetailData.positionList.map(item => item.id)
          const result = []
          this.employeeDetailData.positionIdList.forEach(item => {
            result.push(findParentPathById(this.positionList, item, []))
          })
          this.employeeDetailData.positionIdList = result
          const findResult = this.departments.find(item => item.value === this.employeeDetailData.departmentId)
          this.employeeDetailData.departmentName = findResult && findResult.label
          this.employeeDetailData.positionName = this.employeeDetailData.positionList.map(item => item.name).join()
        })
      } else {
        this.employeeDetailData = {
          positionIdList: []
        }
      }
      this.updateView()
    },
    async showEmployee2({ employeeStatus, id }) {
      // this.employeeVisible = true
      this.employeeStatus = employeeStatus
      if (employeeStatus !== 'create') {
        await queryEmployeeById({ id }).then(res => {
          this.employeeDetailData = res.data
          this.employeeDetailData.positionIdList = this.employeeDetailData.positionList.map(item => item.id)
          const result = []
          this.employeeDetailData.positionIdList.forEach(item => {
            result.push(findParentPathById(this.positionList, item, []))
          })
          this.employeeDetailData.positionIdList = result
          const findResult = this.departments.find(item => item.value === this.employeeDetailData.departmentId)
          this.employeeDetailData.departmentName = findResult && findResult.label
          this.employeeDetailData.positionName = this.employeeDetailData.positionList.map(item => item.name).join()
        })
      } else {
        this.employeeDetailData = {
          positionIdList: []
        }
      }
      this.updateView()
    },
    /**
     * 设置顶级企业
     */
    setParent(node) {
      let hasParent = node
      while (hasParent && hasParent.data.type !== 'ENTERPRISE') {
        hasParent = hasParent.parent
      }
      this.parentEnterprise = hasParent.data || hasParent
      console.log('this.parentEnterprise', this.parentEnterprise)
    },
    depAdd(node, data) {
      console.log(node, data)
      this.setParentDep(node)
      this.setParent(node)
      this.currentDepartment = data
      this.showDep({ depStatus: 'create', id: data.id })
      this.depDetailData = {
        tags: []
      }
      // let parentId = ''
      // if (data.type === 'ENTERPRISE') {
      //   this.currentDepartment = {}
      //   parentId = data.id
      // } else if (data.type === 'DEPARTMENT') {
      //   parentId = data.belongEnterpriseId
      // }
      // // 查询该企业的业务标签
      // queryTagByEnterpriseId({ id: parentId + '---', type: 'DEPARTMENT' }).then(res => {
      //   this.tagList = res.data
      // })
    },
    /**
     * 设置上级部门
     */
    setParentDep(node) {
      // 只有部门才需要设置上级部门
      if (node.data.type !== 'DEPARTMENT') {
        console.log('当前不是部门')
        this.parentDep = {
          name: '无'
        }
      } else {
        // 自己就是部门, 添加子部门时 自己就是要添加部门的上级部门
        this.parentDep = node.data
      }
      // console.log(node.data)
      // let hasParent = node
      // let flag = true
      // while (flag && hasParent.parent.data.type === 'DEPARTMENT') {
      //   hasParent = hasParent.parent
      //   flag = false
      // }
      // this.parentDep = hasParent.data
    },
    depDetail(node, data) {
      this.setParentDep(node)
      this.setParent(node)
      this.currentDepartment = data
      this.showDep({ depStatus: 'detail', id: data.id })
      if (node.parent && node.parent.data.type === 'DEPARTMENT') {
        this.parentDepForDetail = node.parent.data
      } else {
        this.parentDepForDetail = {
          name: '无'
        }
      }
      // 查询该企业的业务标签
      /*    queryTagByEnterpriseId({ id: data.id, type: 'DEPARTMENT' }).then(res => {
                  this.tagList = res.data
                })*/
    },
    depEdit(node, data) {
      this.setParentDep(node)
      this.setParent(node)
      this.depDetailData = {
        tags: []
      }
      this.currentDepartment = data
      this.showDep({ depStatus: 'edit', id: data.id })
    },
    depRemove(node, data) {
      // this.setParent(node)
      this.currentDepartment = data
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该部门？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeDepartmentById({ id: data.id }).then(res => {
            this.$message.success('操作成功')
            this.init()
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    search() {
      console.log(this.username)
      this.pageInfo.pageNum = 1
      this.queryEmployee({ organizationId: '', positionId: '', keyword: this.username })
    },
    addEmployee() {
      if (!this.parentEnterprise.name) {
        return this.$message.warning('请先选择一个企业或部门')
      }
      this.showEmployee({ employeeStatus: 'create', id: '' })
    },
    handleEditEmployee() {
      // this.employeeVisible = false
      // setTimeout(() => {
      this.showEmployee2({ employeeStatus: 'edit', id: this.currentEmployee.id })
      // }, 500)
    },
    employeeDetail(row) {
      this.currentEmployee = row

      this.showEmployee({ employeeStatus: 'detail', id: row.id })
    },
    employeeEdit(row) {
      this.showEmployee({ employeeStatus: 'edit', id: row.id })
    },
    employeeRemove(row) {
      console.log(row)
      this.$etmTip.init({
        type: 'warn',
        title: `确认删除员工${row.name}？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeEmployeeById({ id: row.id }).then(res => {
            this.$message.success('操作成功')
            this.queryEmployee(this.currenrQuery)
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    employeeEnable(row) {
      console.log(row)
      updateEmployeeStatus({ id: row.id, enable: !row.enable }).then(res => {
        this.$message.success('操作成功')
        this.queryEmployee(this.currenrQuery)
      })
    },
    // TODO: 组织树
    handleOrgTreeNode(node, data) {
      this.activeEnterprises = node.data
      this.activeNode = data
      // this.currentId = data.id
      this.setCurrentId(data.id)
      this.setParent(node)
      this.pageInfo.pageNum = 1
      this.currenrQuery = { organizationId: data.id, positionId: '', name: '' }
      this.queryEmployee({ organizationId: data.id, positionId: '', name: '' })
    },
    // TODO: 岗位
    setParentForPosition(node) {
      let hasParent = node
      while (hasParent.data.position) {
        hasParent = hasParent.parent
      }
      this.parentEnterprise = hasParent.data
    },
    handlePositionTreeNode(node, data) {
      this.activePosition = node.data
      this.activeNode = data
      this.setParentForPosition(node)
      this.setParentPosition(node)
      this.currentClassNameId = data.id
      const { id, name } = data
      this.employeeDetailData = Object.assign({
        id,
        name,
        enterpriseId: this.parentEnterprise.id
      }, this.employeeDetailData)
      this.pageInfo.pageNum = 1
      // 查岗位
      if (data.position) {
        this.currentPosition = data
        this.queryEmployee({ organizationId: '', positionId: data.id, name: '' })
      } else {
        // 查企业
        this.currentPosition = {}
        this.queryEmployee({ organizationId: data.id, positionId: '', name: '' })
      }
    },
    async showPosition({ status, id }) {
      if (status !== 'create') {
        await queryPositionById({ id }).then(res => {
          this.positionData = Object.assign({
            name: '',
            resourceIdList: [],
            description: '',
            dataPrivilege: 'ALL',
            tagIdList: []
          }, res.data)
        })
      } else {
        this.positionData = {
          tagIdList: [],
          resourceIdList: []
        }
      }
      // 把当前组织带过去
      this.positionData.enterpriseId = this.parentEnterprise.id
      // 当前是岗位, 而非组织才显示上级岗位
      if (this.parentPosition.position) {
        this.positionData.parentName = this.parentPosition.name
      }

      if (!this.parentPosition.position) {
        this.positionData.parentName = '无'
      }
      this.positionVisible = true
      this.positionStatus = status
    },
    /**
     * 设置上级岗位
     * @param node
     */
    setParentPosition(node) {
      // if (!node.data.position) {
      //   return
      // }
      let hasParent = node
      let flag = true
      while (flag && hasParent.parent && hasParent.parent.data.position) {
        hasParent = hasParent.parent
        flag = false
      }
      if (hasParent.data === node.data) {
        this.parentPosition = {}
      } else {
        this.parentPosition = hasParent.data
      }
    },
    positionAdd(node, data) {
      // this.setParentPosition(node)
      this.positionData = {
        ...data
      }
      this.showPosition({ status: 'create', id: data.id })
    },
    handlePosition() {
      this.$nextTick(() => {
        this.$refs['addRole'].$children[0].validate(async valid => {
          if (valid) {
            const { roleData, resourceIdList } = this.$refs['addRole'].emitData()
            console.log(roleData, resourceIdList)
            if (this.positionStatus === 'create') {
              await createPosition({
                // 组织id
                id: this.parentEnterprise.id,
                parentId: this.parentPosition.id,
                name: roleData.name,
                description: roleData.description,
                resourceIdList: resourceIdList,
                dataPrivilege: roleData.dataPrivilege,
                dataPrivilegeType: roleData.dataPrivilegeType,
                tagIdList: roleData.tagIdList
              })
              await this.init()
              this.setCurrentClassNameId(this.parentPosition.id)
              this.setDefaultNode('position', this.currentClassNameId)
            } else if (this.positionStatus === 'edit') {
              const { id } = this.positionData
              await updatePosition({
                // 岗位ID
                id,
                // 上级岗位ID, 如果有的话
                parentId: this.parentPosition.id,
                name: roleData.name,
                description: roleData.description,
                resourceIdList: resourceIdList,
                dataPrivilege: roleData.dataPrivilege,
                dataPrivilegeType: roleData.dataPrivilegeType,
                tagIdList: roleData.tagIdList
              })
              await this.init()
              this.setCurrentClassNameId(this.positionData.id)
              this.setDefaultNode('position', this.currentClassNameId)
            }

            this.$message.success('操作成功')
            this.positionVisible = false
          }
        })
      })
    },
    setCurrentClassNameId(id) {
      this.currentClassNameId = id
    },
    positionEdit(node, data) {
      this.setParentPosition(node)
      this.showPosition({ status: 'edit', id: data.id })
    },
    positionRemove(node, data) {
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该岗位？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removePositionById({ id: data.id }).then(res => {
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
    positionAddSub(node, data) {
      /**
       * 添加子岗位时, 该岗位的上级岗位就的当前点击的node
       */
      this.parentPosition = data
      // this.positionData = {
      //   resourceIdList: [],
      //   tagIdList: [],
      //   dataPrivilege: 'ALL'
      // }
      // // 岗位
      // if (data.position) {
      //   this.positionData.parentName = data.name
      // } else {
      //   this.positionData.parentName = '无'
      // }
      this.showPosition({ status: 'create', id: data.id })
    },
    // TODO: 员工
    handleEmployee() {
      this.$nextTick(() => {
        this.$refs['employeeForm'].$children[0].validate(async valid => {
          if (valid) {
            const { id, name, telephone, gender } = this.employeeDetailData
            let { departmentId, positionIdList } = this.employeeDetailData
            if (Array.isArray(departmentId)) {
              departmentId = departmentId.flat().pop()
            }
            for (let positionIdListElement of positionIdList) {
              if (positionIdListElement.length > 1) {
                positionIdListElement = positionIdListElement.splice(0, positionIdListElement.length - 1)
              }
            }
            positionIdList = positionIdList.flat(2)
            if (this.employeeStatus === 'create') {
              await createEmployee({
                id: this.parentEnterprise.id,
                name,
                telephone,
                positionIdList,
                departmentId,
                gender
              }).then(res => {
                this.$message.success('操作成功')
              })
            } else {
              await updateEmployee({ id, telephone, name, positionIdList, departmentId, gender }).then(res => {
                this.$message.success('操作成功')
              })
            }
            this.employeeVisible = false
            this.search()
          } else {
            this.$message.error('信息不完整')
          }
        })
      })
    },
    queryEmployee({ organizationId, positionId, keyword }) {
      if (organizationId) {
        this.currenrQuery = { organizationId, positionId: '', keyword }
      }
      if (positionId) {
        this.currenrQuery = { organizationId: '', positionId, keyword }
      }

      const { pageNum, pageSize } = this.pageInfo
      queryEmployeePageByOrgIdOrRoleIdOrName({
        organizationId: this.currenrQuery.organizationId,
        positionId: this.currenrQuery.positionId,
        keyword,
        pageNum,
        pageSize
      }).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.positionNameList = item.positionNameList.join(',')
          item.departmentName = item.departmentName || '-'
          // TODO: 等后台改成返回枚举
          item.gender = item.gender === 'MALE' ? '男' : '女'
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d}')
        })
      })
    },
    currentChange(pageNum, pageSize) {
      console.log(pageNum, pageSize)
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.queryEmployee(this.currenrQuery)
    },
    // TODO: 组织树拖拽
    handleDragStart(node, ev) {
      // console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('拖完了')
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(draggingNode, dropNode, type)
      // 同级拖
      if (draggingNode.data.level === dropNode.data.level) {
        return type !== 'inner'
      } else {
        return false
      }
    },
    // 顶级组织不能拖动
    allowDrag(draggingNode) {
      return draggingNode.level !== 1
    },
    updateView() {
      console.log('updated')
      this.$forceUpdate()
    }

  }
}
</script>
<style lang="scss">
.index-wrap {
  .tree {
    .el-tree-node__content {
      height: 32px;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .etm-avatar img {
  width: 100%;
}

.index-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    .layout-left {
      margin-right: 0;
      border-right: 1px solid #eeeeee;
      border-radius: 4px 0 0 4px;
    }

    .layout-right {
      padding-left: 24px;
      border-radius: 0 4px 4px 0;
    }
  }

  .left-box {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;

    .tab-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tree {
      width: 100%;
      margin-top: 16px;
      flex: 1;
      /*overflow: auto;*/
      padding-bottom: 16px;

      ::v-deep .el-tree-node__content {
        width: 100%;

      }

      ::v-deep .el-tree-node > .el-tree-node__children {
        overflow: visible;
      }

      ::v-deep .el-tree-node__content {
        position: relative;

        &:hover {
          .tree-label {
            @include c_main_color();
          }

          .handel-btn {
            transition: all .5s;
            /*display: inline-block !important;*/
            background-color: #f9f9f9;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }

        .custom-tree-node {
          display: inline-block;

          .label-icon {
            width: 100%;
          }

          .handel-btn {
            transition: all .5s;
            opacity: 0;
            /*position: absolute;*/
            /*right: 0px;*/
            margin-left: 24px;
            width: auto;
            height: 100%;
            /*display: none;*/
            visibility: hidden;

            & i:hover {
              @include c_main_color();
            }
          }
        }

        .active {
          @include c_main_color();
        }
      }
    }
  }

  .right-box {
    .search-btn {
      .file-search-box {
        width: 314px;
        height: 34px;
        overflow: hidden;
        position: relative;

        ::v-deep {
          .el-input {
            height: 100%;
            width: 100%;
            background: transparent;

            input {
              display: block;
              padding: 0 8px;
              width: 100%;
              height: 100%;
              background: #ffffff;
              //border: 1px solid #dcdfe6;
              border-radius: 4px;
              line-height: 32px;
            }
          }
        }

        i {
          top: 50%;
          cursor: pointer;
          transform: translate(0, -50%);
          position: absolute;
          right: 10px;
          font-size: 14px;
          color: #697277;
        }

        i:hover {
          @include c_main_color();
        }
      }
    }
  }

}
</style>

<style lang="scss">
.label_content {
  line-height: 1.5;
  @include c_main_color();
}

.employee-pop {
  .no-close {
    .el-tag__close {
      display: none;
    }
  }
}

.el-tree {
  width: 380px;
}

.el-popup-parent--hidden > .tooltip {
  background: #FFFFFF;
  font-size: 12px;
  max-width: 400px;
  border-color: red;
}

.viewEmployees {
  ::v-deep .el-form .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
