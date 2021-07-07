<template>
  <div class="shareApp">
    <el-row>
      <el-col :span="11">
        <div class="title">企业</div>
        <div class="enterprise box">
          <el-tree
            ref="tree"
            :props="props"
            class="organization"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            :check-strictly="true"
            show-checkbox
            :load="loadTree"
            node-key="treeId"
            lazy
            @check-change="handleCheckChange"
          />
        </div>
      </el-col>
      <el-col :span="2">
        <div class="transfer">
          <span class="iconfont iconright" />
        </div>
      </el-col>
      <el-col :span="11">
        <div class="title">已选择企业</div>
        <div class="choosed box">
          <div v-for="(item,index) in chooseData" :key="index" class="chooseList">
            {{ item.organizationName }}
            <span class="iconfont iconclose" @click="remove(index)" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrganizationTreeChild } from '../../../../../api/organization'
import { getOrganizationId, getOrganization } from '../../../../../utils/auth'
import {
  getOrganizationRoot
} from '../../../../../api/address'

export default {
  name: 'ShareApp',
  data() {
    return {
      props: {
        label: 'organizationName',
        isLeaf: 'leaf'
      },
      organizationId: getOrganizationId(),
      orgLoading: true,
      exactOrgId: getOrganization()[0].organizationId, // 获取所在最近的部门的组织id
      rootOrgId: undefined,
      chooseData: []
    }
  },
  created() {

  },
  methods: {
    loadTree(node, resolve) {
      if (node.level === 0) {
        // 获取组织树顶部根节点
        getOrganizationRoot(this.exactOrgId).then(response => {
          this.rootOrgId = response.data.organizationId
          resolve([response.data])
        }).catch(error => {
          resolve([])
          console.log(error)
        })
      } else {
        const { organizationId } = node.data
        getOrganizationTreeChild(organizationId, { type: 'company' }).then(response => {
          const tree = response.data
          if (tree.length) {
            for (const v of tree) {
              v.leaf = !v.hasChildren
            }
            resolve(tree)
          } else {
            resolve([])
          }
        }).catch(error => {
          resolve([])
          console.log(error)
        })
      }
    },
    handleCheckChange(data, checked) {
      if (checked === true) {
        this.chooseData.push(data)
      } else {
        for (let i = 0; i < this.chooseData.length; i++) {
          if (this.chooseData[i].treeId === data.treeId) {
            this.chooseData.splice(i, 1)
            break
          }
        }
      }
      this.$store.commit('app/SET_SHARE', this.chooseData)
    },
    remove(index) {
      this.chooseData.splice(index, 1)
      const arr = []
      this.chooseData.forEach(item => {
        arr.push(item.treeId)
      })
      this.$refs.tree.setCheckedKeys(arr)
      this.$store.commit('app/SET_SHARE', this.chooseData)
    }
  }
}
</script>

<style lang="scss">

  .shareApp {
    padding-bottom: 48px;

    .title {
      padding: 0 0 16px;
      @include c_text_color;
    }

    .transfer {
      padding-top: 195px;
      text-align: center;

      .iconright {
        @include c_secondary_color;
      }
    }

    .box {
      padding: 12px 0;
      height: 342px;
      border: 1px solid $divide-color;
      border-radius: 2px;
      overflow-y: auto;

      .el-tree {
        .el-tree-node__content {
          padding: 12px 0;
          height: 40px;

          &:hover {
            @include c_text_color;
            background-color: $hover-color;
          }

          .el-tree-node__expand-icon {
            padding: 0;
            margin: 6px;
            border: none;

            &.is-leaf {
              border-color: transparent;
            }
          }
        }
      }

      .chooseList {
        position: relative;
        padding: 0 24px;
        height: 36px;
        line-height: 36px;

        &:hover {
          background-color: $hover-color;

          .iconfont {
            @include c_error_color;
          }
        }

        .iconfont {
          position: absolute;
          top: 0;
          left: 255px;
          @include c_secondary_color;
          font-size: 13px;
          cursor: pointer;
        }
      }
    }
  }
</style>
