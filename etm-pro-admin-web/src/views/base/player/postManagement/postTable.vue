<template>
  <div class="container">
    <div class="filter-container filter-flex">
      <div class="titleCenter" style="width: fit-content; text-align:center;">
        <span style="width: fit-content;line-height: 2.5;font-size: 14px">
          岗位列表
        </span>

      </div>
      <div style="width: fit-content;">
        <el-button style="width: fit-content;" type="primary" @click="handlePostAddVisible">
          添加岗位
        </el-button>
      </div>
    </div>

    <div class="posttable">
      <el-table
        :data="postList"
        row-key="positionId"
        height="calc(100vh - 255px)"
        lazy
        border
        :load="load"
        :tree-props="{children: 'children' ,hasChildren:'hasChildren'}"
      >

        <template slot="empty">
          <no-content />
        </template>

        <el-table-column
          prop="positionName"
          label="岗位名称"
          width="300"
        />
        <el-table-column
          prop="employeeNum"
          label="岗位员工"
          width="200"
        >
          <template slot-scope="{row}">
            <el-button
              class="clickBtn"
              type="text"
              size="small"
              @click="handleView(row.$index, row.positionId)"
            >
              {{ row.employeeNum }}员工
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="positionCreateTime"
          label="创建时间"
        >
          <template slot-scope="{row}">
            <span>{{ handleTime(row.positionCreateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
            <el-button type="text" size="small" @click="handleView(row.$index, row.positionId)">岗位名单</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { getPositionListByPostId } from '@/api/post'
import NoContent from '../../../../components/NoContent/index'

import tips from '../tips'

export default {
  name: 'PostTable',
  components: {
    NoContent
  },
  props: ['postList'],
  methods: {
    handleView(index, id) {
      this.$emit('handleView', id)
    },
    handleEdit(post) {
      this.$emit('handleEdit', post)
    },
    handleAdd() {
      this.$emit('handleAdd')
    },

    load(tree, treeNode, resolve) {
      if (tree.children == null && tree.hasChildren) {
        getPositionListByPostId(tree.positionId).then(response => {
          resolve(response.data)
        })
      } else {
        resolve(tree.children)
      }
    },
    handleTime(time) {
      return tips.handleTimeStr(time)
    },
    handlePostAddVisible() {
      this.$emit('handlePostAddVisible')
    }
  }
}
</script>

<style lang="scss" >
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

    .posttable {
      padding: 0px 16px 16px 16px;
      .clickBtn{
        @include c_themeColor();
      }
    }
  }
</style>
