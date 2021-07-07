<template>
  <div class="orgContainer">
    <div class="filter-container filter-flex">
      <div class="titleCenter" style="width: fit-content; text-align:center;">
        <span style="width: fit-content;line-height: 2.5 ; font-size: 14px">
          {{ company }}
        </span>
      </div>
      <div style="width: fit-content;">
        <el-button style="width: fit-content;" type="primary" @click="handleAddOrg">
          添加组织
        </el-button>
        <el-button style="width: fit-content;" type="primary" @click="handleAddStaff">
          添加员工
        </el-button>
      </div>
    </div>

    <div class="orgtable">
      <el-table
        ref="orgTable"
        :data="tableData"
        highlight-current-row
        row-key="organizationId"
        height="calc(100vh - 255px)"
        lazy
        border
        :load="load"
        :tree-props="{children: 'children' ,hasChildren:'hasChildren'}"
        @current-change="handleCurrentChange"
      >

        <template slot="empty">
          <no-content />
        </template>

        <el-table-column
          prop="organizationName"
          label="组织名称"
          width="300"
        />

        <el-table-column
          prop="employeeNum"
          label="员工"
          width="200"
          text-align="right"
        >
          <template slot-scope="{row}">
            <el-button
              class="clickBtn"
              type="text"
              size="small"
              @click="handleView(row.$index, row.organizationId)"
            >
              {{ row.employeeNum }}员工
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationAddress"
          label="地址"
          show-overflow-tooltip
        />

        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="{row}">

            <el-button type="text" size="small" @click="handleEdit(row.$index, row)">修改</el-button>
            <el-button type="text" size="small" @click="handleView(row.$index, row.organizationId)">员工名单</el-button>

          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>

import { employeeCount, getOrganizationTreeChild } from '@/api/organization'
import NoContent from '../../../../components/NoContent/index'

export default {
  name: 'OrganizationTable',
  components: {
    NoContent
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['tableData', 'company'],
  data() {
    return {
      currentRow: undefined,
      employeeCountEntry: {
        organizationIds: []
      },
      orgTypeEntry: {
        type: 'department'
      }
    }
  },
  methods: {

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    handleAddOrg() {
      this.$emit('handleAddOrg')
    },
    handleAddStaff() {
      this.$emit('handleAddStaff')
    },

    handleEdit(index, org) {
      this.$emit('handleEdit', org)
    },

    handleView(index, id) {
      this.$emit('handleView', id)
    },

    handleCurrentChange(val) {
      this.currentRow = val
      this.$emit('selectRow')
    },

    getCurrentRow() {
      return this.currentRow
    },

    load(tree, treeNode, resolve) {
      if (tree.children == null && tree.hasChildren) {
        getOrganizationTreeChild(tree.organizationId, this.orgTypeEntry).then(response => {
          this.employeeCountEntry.organizationIds = []
          for (const index in response.data) {
            response.data[index].employeeNum = 0
            this.employeeCountEntry.organizationIds.push(response.data[index].organizationId)
          }
          this.employeeCount(this.employeeCountEntry, response.data)
          resolve(response.data)
        })
      } else {
        resolve(tree.children)
      }
    },
    employeeCount(entry, data) {
      // 根据组织id集合获取员工数量
      employeeCount(entry).then(response => {
        if (response.code === 0 && response.data != null && response.data.length > 0) {
          for (const index in data) {
            for (const index2 in response.data) {
              if (response.data[index2].organizationId === data[index].organizationId) {
                data[index].employeeNum = response.data[index2].employeeCount
              }
            }
          }
        }
      })
    }

  }
}
</script>

<style lang="scss">
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables";

  .orgContainer {
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

    .orgtable {
      padding: 0px 16px 16px 16px;
      .clickBtn{
        @include c_themeColor();
      }
    }
  }

</style>
