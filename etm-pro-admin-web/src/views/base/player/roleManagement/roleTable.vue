<template>

  <div class="container">
    <div class="filter-container filter-flex">
      <div class="titleCenter" style="width: fit-content; text-align:center;">
        <span style="width: fit-content;line-height: 2.5;font-size: 14px">
          角色列表
        </span>

      </div>
      <div style="width: fit-content;">
        <el-button style="width: fit-content;" type="primary" @click="roleAddVisible">
          添加角色
        </el-button>
      </div>
    </div>

    <div class="roletable">
      <el-table
        :data="roleList"
        style="width: 100%"
        border
        height="calc(100vh - 255px)"
        row-key="id"
      >
        <template solt="empty">
          <no-content />
        </template>
        <el-table-column
          prop="name"
          label="角色名称"
          width="300"
        />
        <el-table-column
          prop="employeeNum"
          label="角色员工"
          width="200"
        >
          <template slot-scope="{row}">
            <el-button
              class="clickBtn"
              type="text"
              size="small"
              @click="handleView(row.index,row.id)"
            >{{ row.employeeNum == null?'无':row.employeeNum }}员工</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="student"
          label="创建时间"
          width="200"
        >
          <template slot-scope="{row}">
            <span>{{ handleTime(row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="resources"
          label="配置权限"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <span>{{ handleResources(row.resources) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
            <el-button type="text" size="small" @click="handleView(row.index,row.id)">角色名单</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>

import tips from '../tips'
import NoContent from '../../../../components/NoContent/index'

export default {
  name: 'RoleTable',
  components: { NoContent },
  props: ['roleList'],
  methods: {
    handleView(index, id) {
      this.$emit('roleStaffView', id)
    },
    handleEdit(role) {
      this.$emit('roleEditView', role)
    },
    handleDelete() {
      this.$emit('deleteRole')
    },
    handleTime(time) {
      return tips.handleTimeStr(time)
    },
    handleResources(resources) {
      let resourcesStr = '没有配置权限'
      if (resources != null) {
        resourcesStr = ''
        for (let i = 0; i < resources.length; i++) {
          if (resources[i] != null) {
            resourcesStr += resources[i].name + '、'
          }
        }
        if (resourcesStr.length > 0) {
          resourcesStr = resourcesStr.substring(0, resourcesStr.length - 1)
        }
      }
      return resourcesStr
    },
    roleAddVisible() {
      this.$emit('roleAddVisible')
    }
  }
}
</script>

<style lang="scss">

  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables";

  .container {
    @include bgc_white();
    border-radius: 5px;

    .filter-container {
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 16px;
    }

    .filter-flex {
      @include flex();
    }

    .titleCenter {
      display: table-cell;
      vertical-align: middle;
    }
    .roletable {
      padding: 0px 16px 16px 16px;
      .clickBtn{
        @include c_themeColor();
      }
    }
  }

</style>
