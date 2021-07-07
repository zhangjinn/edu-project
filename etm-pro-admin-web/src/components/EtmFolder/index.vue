<!--
折叠控件，例子参考客户线索应用设置--来源设置属性修改
-->
<template>
  <div class="disposeMenuContent">
    <draggable
      v-if="folderLists.length>0"
      tag="el-collapse"
      :list="folderLists"
      :component-data="collapseComponentData()"
    >
      <el-collapse-item v-for="(folderList,index) in folderLists" :key="index" :name="index">
        <template slot="title">
          <div class="menuTitleBox">
            <div class="menuTitle">
              <slot name="parentLabel" :row="folderList" :$index="index" />
            </div>
            <div class="menuBtn">
              <slot name="parentControl" :row="folderList" :$index="index" />
            </div>
          </div>
        </template>
        <draggable
          :list="folderList.child"
        >
          <div v-for="(cld, idx) in folderList.child" :key="idx" class="applyItem">
            <div>
              {{ cld.label }}
            </div>
            <div>
              <slot name="childControl" :row="cld" :$index="idx" />
            </div>
          </div>
        </draggable>
      </el-collapse-item>
    </draggable>

    <div v-else class="noContent">{{ noContent }}</div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'Folder',
  components: {
    draggable
  },
  props: {
    folderLists: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    activeNames: {
      type: Array,
      default: function() {
        return []
      }
    },
    noContent: {
      type: String,
      default: '暂无内容～'
    }
  },
  data() {
    return {
      activeNamesList: this.activeNames

    }
  },

  methods: {
    inputChanged(val) {
      this.activeNamesList = val
    },
    collapseComponentData() {
      return {
        on: {
          input: this.inputChanged
        },
        props: {
          value: this.activeNamesList
        }
      }
    }

  }
}
</script>

<style scoped lang="scss">
  .disposeMenuContent{
    flex: 1;
    overflow: auto;
  &::-webkit-scrollbar {
     display: none;

   }
    & /deep/ .el-collapse{
      border: 0;
      .el-collapse-item{
        .el-collapse-item__header{
          display: flex;
          border: 0;
          height: 35px;
          line-height: 35px;
          font-size: 14px;
          font-weight: 400;
          @include c_text_color();
          .el-collapse-item__arrow{
            display: none;
          }
          .menuTitleBox{
            flex: 1;
            display: flex;
            justify-content: space-between;
            .menuTitle{
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              span:first-child{
                padding: 0 16px;
              }
            }
            .menuBtn{
              .deleteControl{
                color: $error-color;
              }
            }
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
              height: 35px;
              line-height: 35px;
              margin-left: 30px;
              @include c_text_color();

              i{
                padding-right: 16px;
              }
            }
          }
        }
      }

    }
    .noContent{
      text-align: center;
    }
  }

</style>
