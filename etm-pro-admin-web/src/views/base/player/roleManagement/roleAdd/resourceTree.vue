<template>

  <div class="resourceTree">

    <el-row>
      <el-col class="treeBox" :span="15">
        <div v-if="false" class="treeTitle">
          <el-input style="width: 100px" />
          <el-button>查询</el-button>
        </div>
        <div class="treeContent">
          <div class="system">
            <div v-for="(item,index) in (resourceList)" :key="index">
              <div v-if="item.type == currentType">
                <span style="border-radius:3px;background-color: white">{{ item.name }}</span>
                <el-divider class="systemDiv" />
                <el-row v-if="(item.children!=null)">

                  <el-col :span="22">
                    <el-row>
                      <el-col
                        v-for="(element , sanIndex) in item.children"
                        :key="sanIndex"
                        :span="6"
                      >
                        <el-tooltip
                          class="item"
                          effect="light"
                          :content="(element.name+(element.description==null?'':':'+element.description))"
                          placement="top-start"
                        >
                          <el-checkbox
                            ref="itemBox"
                            v-model="element.checked"
                            :label="getElementName(element)"
                            @change="selectItem(item , element)"
                          />
                        </el-tooltip>
                      </el-col>

                    </el-row>

                  </el-col>

                  <el-col :span="2">
                    <el-divider direction="vertical" />
                    <el-checkbox v-model="item.checked" @change="selectAll(item)" />
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="6" class="selectBox">
        <span>选中权限</span>
        <el-tree :data="selectList" :props="props" @node-click="handleNodeClick" />
      </el-col>

    </el-row>

  </div>

</template>
<script>

import { enterpriseResourcde } from '@/api/role'
import { getOrganizationId } from '@/utils/auth'

export default {
  name: 'ResourceTree',
  data() {
    return {
      allChecked: false,
      activeName: undefined,
      resourceList: [],
      selectList: [{
        name: '系统权限',
        children: []
      }, {
        name: '应用权限',
        children: []
      }],
      props: { label: 'name' },
      currentItem: 0,
      currentType: 'BASIC'
    }
  },
  created() {
    const id = getOrganizationId()
    this.getEnterpriseResourcde(id)
  },
  methods: {
    selectAll(data) {
      if (this.judgeSelectContainItem(data) !== -1) {
        const temp = this.judgeSelectContainItem(data)
        this.selectList[this.currentItem].children.splice(temp, 1)
        this.setResItemSelect(data, false)
      } else {
        this.selectList[this.currentItem].children.push(this.deepClone2(data))
        this.setResItemSelect(data, true)
      }
    },

    setResItemSelect(data, boolean) {
      data.checked = boolean
      if (data.children != null && data.children.length > 0) {
        for (const index in data.children) {
          data.children[index].checked = boolean
        }
      }
    },

    selectItem(item, element) {
      if (this.judgeSelectContainItem(item) !== -1) {
        // 当前子节点的父节点在选中列表里面
        // 判断子节点是否在选中列表里面对应父节点中
        const temp = this.judgeSelectContainItem(item)
        if (this.judgeChildrenItem(this.selectList[this.currentItem].children[temp].children, element) !== -1) {
          // 存在，则删除
          const tempChild = this.judgeChildrenItem(this.selectList[this.currentItem].children[temp].children, element)
          this.selectList[this.currentItem].children[temp].children.splice(tempChild, 1)
          // resourceList中设置为false
          this.setResItemSelect(element, false)

          // 删除了之后需要判断父节点的子节点是否为空，为空就删除父节点
          if (this.selectList[this.currentItem].children[temp].children == null ||
                          this.selectList[this.currentItem].children[temp].children.length === 0) {
            this.selectList[this.currentItem].children.splice(temp, 1)
            // 全部设置为空
            this.setResItemSelect(item, false)
          }
        } else {
          // 不存在，则添加
          this.selectList[this.currentItem].children[temp].children.push(this.deepClone2(element))
          // resourceList中设置为true
          this.setResItemSelect(element, true)
          // 判断子节点下是否是所有节点都被选中了，是就把子节点也设置为选中
          if (this.selectList[this.currentItem].children[temp].children.length === item.children.length) {
            this.setResItemSelect(item, true)
          }
        }
      } else {
        // 当前子节点的父节点不在列表上
        // 先添加父节点，然后删除父节点的所有子元素，再插入当前元素
        this.selectList[this.currentItem].children.push(this.deepClone2(item))

        const temp = this.judgeSelectContainItem(item)

        this.selectList[this.currentItem].children[temp].children = []
        this.selectList[this.currentItem].children[temp].children.push(element)

        this.setResItemSelect(element, true)
        if (item.children != null && item.children.length === 1) {
          item.checked = true
        }
      }
    },

    judgeSelectContainItem(item) {
      for (var index in this.selectList[this.currentItem].children) {
        if (this.selectList[this.currentItem].children[index].id === item.id) {
          return index
        }
      }
      return -1
    },

    judgeChildrenItem(list, item) {
      for (var index in list) {
        if (list[index].id === item.id) {
          return index
        }
      }
      return -1
    },

    setResUnSelect(data) {
      for (const i in data) {
        data[i].checked = false
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
        this.resourceList = this.setResUnSelect(response.data)
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },

    handleNodeClick(data) {
      if (data.name === '系统权限') {
        this.currentItem = 0
        this.currentType = 'BASIC'
      } else if (data.name === '应用权限') {
        this.currentItem = 1
        this.currentType = 'APP'
      }
    },

    deepClone2(obj) {
      var _obj = JSON.stringify(obj)
      var objClone = JSON.parse(_obj)
      return objClone
    },

    getElementName(element) {
      return element.name.length > 4 ? element.name.substring(0, 4) + '..' : element.name
    },

    getSelectList() {
      const array = []
      for (const index in this.selectList) {
        for (const childIndex in this.selectList[index].children) {
          if (this.selectList[index].children[childIndex].children != null) {
            for (const temp in this.selectList[index].children[childIndex].children) {
              array.push(this.selectList[index].children[childIndex].children[temp].id)
            }
          }
        }
      }
      if (array.length === 0) {
        return null
      } else {
        return array
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
