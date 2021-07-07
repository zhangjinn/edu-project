<template>
  <div class="disposeApply">
    <etm-title>配置应用</etm-title>
    <div class="disposeContent">
      <div class="applyNav">
        <div class="applyNavTitle">
          当前导航栏
        </div>
        <div class="applyNavList">
          <el-collapse v-if="folderList.length>0">
            <el-collapse-item v-for="(item,index) in folderList" :key="index">
              <template slot="title">
                <span>{{ item.name }}</span>
              </template>
              <div v-for="(lign, idx) in item.apps" :key="idx">{{ lign.appName }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="disposeMenu">
        <div class="disposeMenuTitle">
          <div class="disposeMenuTitleText">
            配置菜单
          </div>
          <div class="disposeMenuTitleBtn">
            <el-button type="primary" @click.stop="newFolderOpen()">新增文件夹</el-button>
            <el-button type="success" @click.stop="saveFileList">保存</el-button>
          </div>
        </div>
        <div class="disposeMenuContent">
          <draggable
            v-if="folderList.length>0"
            tag="el-collapse"
            :list="folderList"
            :component-data="collapseComponentData"
          >
            <el-collapse-item v-for="(item,index) in folderList" :key="index">
              <template slot="title">
                <div class="menuTitleBox">
                  <div class="menuTitle">
                    <span><i class="el-icon-s-operation" /></span>{{ item.name }}
                  </div>
                  <div class="menuBtn">
                    <el-button type="text" icon="el-icon-edit-outline" @click.stop="changeFolderName(index)">修改标题</el-button>
                    <el-button type="text" @click.stop="delFolder(index)">删除</el-button>
                  </div>
                </div>
              </template>
              <draggable
                :list="item.text"
              >
                <div v-for="(lign, idx) in item.apps" :key="idx" class="applyItem">
                  <div>
                    <span><i class="el-icon-s-operation" /></span>{{ lign }}
                  </div>
                  <div>
                    <el-button type="text">卸载</el-button>
                  </div>
                </div>
              </draggable>
            </el-collapse-item>
          </draggable>

          <no-content v-else />
        </div>
      </div>
    </div>

    <!--新增文件夹和修改文件夹弹框-->
    <etm-pop
      :visible="newFolderPop"
      pop="simple"
      :title="newFolderTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="newFolderClose"
      @confirm="newFolderConfirm"
      @cancel="newFolderCancel"
    >
      <new-folder v-if="newFolderPop" :folder-name="folderName" @getFolderName="getFolderName" />
    </etm-pop>
  </div>
</template>

<script>
import etmTitle from '@/layout/main/EtmTitle'
import draggable from 'vuedraggable'
import etmPop from '@/layout/main/EtmPop'
import newFolder from './newFolder'
import noContent from '@/components/NoContent/index'
import { getEnterpriseFolder, postEnterpriseFolder } from '@/api/apply.js'

export default {
  name: 'Index',
  components: {
    draggable,
    etmTitle,
    etmPop,
    newFolder,
    noContent
  },
  data() {
    return {
      newFolderTitle: '',
      activeNames: [1],
      folderList: [],
      flList: 0,
      folderName: '',
      isNewFolder: true,
      collapseComponentData: {
        on: {
          input: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      },
      newFolderPop: false,
      newFolder: newFolder
    }
  },
  computed: {
    disposeType() {
      return this.$store.state.applyCenter.disposeType
    }
  },
  created() {
    this.getFileName()
  },
  methods: {
    inputChanged(val) {
      this.activeNames = val
    },
    getFolderName(val) { // 从自组件获取问价夹名称
      this.folderName = val
    },
    newFolderOpen() {
      this.newFolderTitle = '新增文件夹'
      this.folderName = ''
      this.isNewFolder = true
      this.newFolderPop = true
    },
    newFolderClose() {
      this.newFolderPop = false
    },
    newFolderConfirm() { // 新建文件夹确认
      if (this.folderName === '') {
        this.$message({
          message: '文件夹名称不能为空哦～',
          type: 'warning'
        })
        return
      }
      if (this.isNewFolder === true) {
        this.newFolderPop = false
        this.newFileName()
      } else {
        this.folderList[this.flList].name = this.folderName
        this.newFolderPop = false
      }
    },
    newFolderCancel() { // 新增文件夹
      this.newFolderPop = false
    },
    changeFolderName(index) { // 修改文件名
      console.log(this.folderList)
      this.newFolderTitle = '修改标题'
      this.flList = index
      this.folderName = this.folderList[this.flList].name
      this.isNewFolder = false
      this.newFolderPop = true
    },
    delFolder(index) { // 删除文件夹
      this.folderList.splice(index, 1)
    },
    saveFileList() { // 保存文件列表
      this.postFileName()
    },
    getFileName() { // 菜单文件接口
      const param = {
        type: 'PC'
      }
      getEnterpriseFolder(param).then(res => {
        this.folderList = res.data
        console.log(this.folderList)
      })
    },
    postFileName() { // 保存更新文件夹
      if (this.folderList.length === 0) {
        this.$message({
          message: '文件列表不能为空哦～',
          type: 'warning'
        })
        return
      }
      const params = {
        pcFolders: []
      }
      this.folderList.forEach((item, index) => {
        const newArr = {
          name: item.name,
          sort: index,
          apps: []
        }
        item.apps.forEach((res, idx) => {
          newArr.apps.push({
            appId: res.app.appId,
            sort: idx
          })
        })
        params.pcFolders.push(newArr)
      })
      console.log(params)
      postEnterpriseFolder(params).then(res => {
        console.log(res.data)
      })
    },

    newFileName() { // 新增文件夹，并在文件夹列表中添加一条数据
      this.folderList.push({
        name: this.folderName,
        type: 'PC',
        apps: []
      })
      console.log(this.folderList)
    }

  }

}
</script>

<style lang="scss" scoped>
  .disposeApply{
    height: 100%;
    .applyNavTitle{
      @include c_title_color();
    }
    .disposeContent{
      display:flex;
      height: calc(100vh - 218px);
      overflow: hidden;
      padding: 15px 24px;
      font-size: 14px;
      .applyNav{
        width:224px;
        height:100%;
        border:1px solid rgba(238,238,238,1);
        @include bc_divide_color();
        padding: 0 16px;
        border-radius:2px;
        display: flex;
        flex-direction: column;

        & /deep/ .el-collapse{
          border: 0;
          .el-collapse-item__header{
            border: 0;
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            font-weight: 400;
          }
          .el-collapse-item__wrap{
            border: 0;
            .el-collapse-item__content{
              border: 0;
              padding-bottom:0;
              div{
                height: 44px;
                line-height: 44px;
                padding-left: 12px;
                @include c_text_color();
              }
            }
          }

        }

        .applyNavTitle{
          height: 56px;
          line-height: 56px;
          font-size:16px;
        }
        .applyNavList{
          flex: 1;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          & /deep/ .el-collapse-item__header{
            display: flex;
            span{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

      }
      .disposeMenu{
        padding-left: 17px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .disposeMenuTitle{
          display: flex;
          justify-content: space-between;
          height: 67px;
          align-items: center;
          .disposeMenuTitleText{
            font-size: 16px;
            @include c_title_color()
          }
        }
        .disposeMenuContent{
          flex: 1;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;

          }
        }
        & /deep/ .el-collapse{
          border: 0;
          .el-collapse-item{
            margin-bottom: 24px;
            .el-collapse-item__header{
              display: flex;
              border: 0;
              height: 38px;
              line-height: 38px;
              font-size: 14px;
              font-weight: 400;
              background: $hover-color;
              padding-right: 26px;
              .el-collapse-item__arrow{
                display: none;
              }
            }
            .el-collapse-item__wrap{
              border: 0;
              .el-collapse-item__content{
                border: 0;
                padding-bottom:0;

                .applyItem{
                  display: flex;
                  justify-content: space-between;
                  height: 46px;
                  line-height: 46px;
                  padding-right: 26px;
                  margin-left: 46px;
                  @include c_text_color();
                  border-bottom: 1px solid $divide-color;

                  i{
                    padding-right: 16px;
                  }
                }
              }
            }
          }

        }

        .menuTitleBox{
          flex: 1;
          display: flex;
          justify-content: space-between;
          border-left: 3px solid  $main-color;
          .menuTitle{
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span:first-child{
              padding: 0 16px;
            }
          }
        }

      }

    }

  }

</style>
