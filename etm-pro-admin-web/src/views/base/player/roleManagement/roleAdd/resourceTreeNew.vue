<template>

  <div class="resourceTree">

    <el-row>
      <el-col class="treeBox" :span="7">
        <span>系统权限</span>
        <el-tree
          ref="systemTree"
          :data="systemList"
          show-checkbox
          node-key="id"
          :props="props"
          style="margin-top: 10px;margin-bottom: 10px"
          @check-change="selectSystemList"
        />
      </el-col>

      <el-col class="treeBox" :span="7">
        <span>PC端应用权限</span>
        <el-tree
          ref="pcTree"
          :data="pcList"
          show-checkbox
          node-key="id"
          :props="props"
          style="margin-top: 10px"
          @check-change="selectPcList"
        />
      </el-col>

      <el-col class="treeBox" :span="7">
        <span>移动端应用权限</span>
        <el-tree
          ref="appTree"
          :data="appList"
          show-checkbox
          node-key="id"
          :props="props"
          style="margin-top: 10px"
          @check-change="selectAppList"
        />
      </el-col>
    </el-row>
  </div>

</template>
<script>

import { enterpriseResourcde } from '@/api/role'
import { getOrganizationId } from '@/utils/auth'

export default {
  name: 'ResourceTreeNew',
  props: ['selectList'],
  data() {
    return {
      loading: false,
      allChecked: false,
      activeName: undefined,
      systemList: [],
      pcList: [],
      appList: [],
      systemSelectList: [],
      appSelectList: [],
      pcSelectList: [],
      props: {
        label: 'name'
      },
      currentItem: 0,
      currentType: 'BASIC'
    }
  },
  created() {
    const id = getOrganizationId()
    this.getEnterpriseResourcde(id)
  },
  methods: {

    setResUnSelect(data) {
      for (const i in data) {
        if (data[i].children != null && data[i].children.length < 1) {
          for (const j in data[i].children) {
            data[i].children[j].checked = false
          }
        }
      }
      return data
    },

    getEnterpriseResourcde(id) {
      enterpriseResourcde(id).then(response => {
        this.setList(response.data)
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    setList(array) {
      console.log(array)
      for (const index in array) {
        if (array[index].type === 'BASIC') {
          this.systemList.push(array[index])
        } else {
          if (array[index].appType === 'PC') {
            this.pcList.push(array[index])
          } else {
            this.appList.push(array[index])
          }
        }
      }
      this.setCurrentList()
    },

    getSelectList() {
      const array = []
      for (const index in this.systemSelectList) {
        array.push(this.systemSelectList[index].id)
      }
      for (const index in this.pcSelectList) {
        array.push(this.pcSelectList[index].id)
      }
      for (const index in this.appSelectList) {
        array.push(this.appSelectList[index].id)
      }
      return array
    },

    getSelectSize() {
      return this.systemSelectList.length + this.appSelectList.length
    },

    selectSystemList() {
      const keys = this.$refs.systemTree.getCheckedKeys(true)
      const selects = []
      for (const index in keys) {
        for (const index2 in this.systemList) {
          for (const index3 in this.systemList[index2].children) {
            if (keys[index] === this.systemList[index2].children[index3].id) {
              selects.push(this.systemList[index2].children[index3])
            }
          }
        }
      }
      this.systemSelectList = selects
    },

    selectAppList() {
      const keys = this.$refs.appTree.getCheckedKeys(true)
      const selects = []
      for (const index in keys) {
        for (const index2 in this.appList) {
          for (const index3 in this.appList[index2].children) {
            if (keys[index] === this.appList[index2].children[index3].id) {
              selects.push(this.appList[index2].children[index3])
            }
          }
        }
      }
      this.appSelectList = selects
    },

    selectPcList() {
      const keys = this.$refs.pcTree.getCheckedKeys(true)
      const selects = []
      for (const index in keys) {
        for (const index2 in this.pcList) {
          for (const index3 in this.pcList[index2].children) {
            if (keys[index] === this.pcList[index2].children[index3].id) {
              selects.push(this.pcList[index2].children[index3])
            }
          }
        }
      }
      this.pcSelectList = selects
    },

    deleteSysList(tag) {
      this.systemSelectList.splice(this.systemSelectList.indexOf(tag), 1)
      const keys = this.$refs.systemTree.getCheckedKeys(true)
      keys.splice(keys.indexOf(tag.id), 1)
      this.$refs.systemTree.setCheckedKeys(keys)
    },

    deleteAppList(tag) {
      this.appSelectList.splice(this.appSelectList.indexOf(tag), 1)
      const keys = this.$refs.appTree.getCheckedKeys(true)
      keys.splice(keys.indexOf(tag.id), 1)
      this.$refs.appTree.setCheckedKeys(keys)
    },

    setCurrentList() {
      if (this.selectList !== undefined && this.selectList != null && this.selectList.length > 0) {
        // 设置已选择的权限列表
        /* for (const temp in this.selectList) {
          for (const sysIndex in this.systemList) {
            if (this.selectList[temp] === this.systemList[sysIndex].id) {
              this.systemSelectList.put(this.systemList[sysIndex])
            }
          }
          for (const pcIndex in this.pcList) {
            if (this.selectList[temp] === this.pcList[pcIndex].id) {
              this.pcSelectList.put(this.pcList[pcIndex])
            }
          }
          for (const appIndex in this.appList) {
            if (this.selectList[temp] === this.appList[appIndex].id) {
              this.appSelectList.put(this.appList[appIndex])
            }
          }
        }*/
        debugger
        const array = ['233']
        this.$refs.systemTree.setCheckedNodes(this.selectList)
        this.$refs.pcTree.setCheckedNodes(array)
        this.$refs.pcTree.setCurrentKey(array)
        this.$refs.appTree.setCheckedNodes(this.selectList)
      }
    }
  }
}
</script>
<style lang="scss">

  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .resourceTree {

    .selectBox {
      @include bc_borderColorBase();
      border-radius: 5px;
      padding: 0 10px;
      border-width: 1px;
      border-style:solid;
      height: 600px;

      .title{
        @include c_themeColor();
      }

      .selectContent{
        margin-top: 20px;

        .tag{
          display: block;
          width: fit-content;
        }

      }

    }

    .treeBox {
      margin-right: 20px;

      .treeTitle {

      }

      .treeContent {
        .system {
          .systemDiv {
            margin: 0;
          }
          .el-collapse-item {
            .el-collapse-item__header {
              background-color: rgb(242, 242, 242) !important;
            }
            .el-collapse-item__wrap{
              background-color: rgb(242, 242, 242) !important;
            }
            .el-collapse-item__content{
              margin-right: 20px;
              padding:0;
            }
          }
        }

        .app {
          .systemDiv {
            background-color: blue;
            margin: 0 0 8px 0;
          }
          .el-collapse-item {
            .el-collapse-item__header {
              background-color: rgb(242, 242, 242) !important;
            }
            .el-collapse-item__wrap{
              background-color: rgb(242, 242, 242) !important;
            }
            .el-collapse-item__content{
              padding:0;
              margin-right: 20px;
            }
          }
        }
      }
    }

  }

</style>
