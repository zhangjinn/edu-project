<template>

  <div class="allApply">
    <div class="dragBody">
      <el-divider>电脑端</el-divider>
      <el-row v-if="listPc.length>0">
        <draggable
          class="dragArea dragList"
          :sort="false"
          disabled="true"
          :list="listPc"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="cloneDog"
          @start="dragStart"
          @end="dragEnd"
        >
          <el-col
            v-for="element in listPc"
            :key="element.appId"
            :span="spanNum"
            class="dragItem"
            :class="[element.isDrag ? '' : 'isDrag']"
          >

            <div class="fileBody" @click="showDrawer(element)">
              <div class="dragBox">
                <div class="dragIcon" :style="{backgroundColor: bgColor[Math.floor(Math.random() * bgColor.length)]}">
                  <i :class="element.icon" />
                </div>
                <div class="dragText">
                  <p>{{ element.name? element.name:element.appName }}</p>
                </div>
              </div>
            </div>
          </el-col>
        </draggable>
      </el-row>
      <div v-else class="noData">
        <no-content />
      </div>
    </div>
    <div class="dragBody">
      <el-divider>移动端</el-divider>
      <el-row v-if="listMobile.length>0">
        <draggable
          class="dragArea dragList"
          :sort="false"
          disabled="true"
          :list="listMobile"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="cloneDog"
          @start="dragStart"
          @end="dragEnd"
        >
          <el-col
            v-for="element in listMobile"
            :key="element.appId"
            :span="spanNum"
            class="dragItem"
            :class="[element.isDrag ? '' : 'isDrag']"
          >

            <div class="fileBody" @click="showDrawer(element)">
              <div class="dragBox">
                <div class="dragIcon" :style="{backgroundColor: bgColor[Math.floor(Math.random() * bgColor.length)]}">
                  <i :class="element.icon" />
                </div>
                <div class="dragText">
                  <p>{{ element.name? element.name:element.appName }}</p>
                </div>
              </div>
            </div>
          </el-col>
        </draggable>
      </el-row>
      <div v-else class="noData">
        <no-content />
      </div>
    </div>
  </div>

</template>

<script>
import draggable from 'vuedraggable'
import noContent from '../../../../../components/NoContent/index'

export default {
  name: 'AllApply',
  components: {
    draggable,
    noContent
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['dragList', 'spanNum', 'cloneData', 'hasClone'],
  data() {
    return {
      id: 111,
      list: [],
      listPc: [],
      listMobile: [],
      bgColor: ['#FF943E', '#3296FA', '#00A0E9', '#FFAC00', '#F15643', '#15BC83']
    }
  },
  watch: {
    dragList(newVal) {
      this.listPc = []
      this.listMobile = []
      this.list = newVal
      newVal.forEach(item => {
        if (item.type === 'PC') {
          this.listPc.push(item)
        } else {
          this.listMobile.push(item)
        }
      })
    }
  },
  created() {
  },
  methods: {
    handleSearch() {
    },
    dragStart(evt) {
      this.$emit('onStart', evt)
    },
    dragEnd(evt) {
      this.$emit('onEnd', evt)
    },
    cloneDog(evt) {
      this.$emit('dragClone', evt)
    },
    showDrawer(data) {
      this.$emit('installForm', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "src/styles/mixin";
  @import "src/styles/variables";
  .allApply {
    height: calc(100vh - 290px);
    overflow-y: auto;
    .dragBody {
      width: 100%;
      &>>>.el-carousel__container {
        height: 294px;
      }
      &>>>.el-divider--horizontal {
        margin: 17px 0 24px;
      }
      &>>>.el-divider__text {
        @include c_colorTextRegular();
      }
      .dragList {
        margin: 12px 24px;
        .dragItem {
          cursor: pointer;
          .fileBody {
            position: relative;
            margin: 0 auto 20px;
            height: 60px;
            @include border-radius(5px);

            .dragBox {
              position: relative;

              .dragIcon {
                float: left;
                position: relative;
                width: 44px;
                height: 44px;
                margin-right: 12px;
                border-radius: 50%;
                line-height: 1;
                text-align: center;
                i {
                  display: inline-block;
                  font-size: 20px;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%,-50%);
                  color: #fff;
                }
              }

              .dragText {
                position: relative;
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 14px;
                @include c_colorTextRegular();
              }
            }
          }
        }
        .isDrag {
          opacity: 0.4;
          .dragIcon{
            background: #CBCBCB!important
          }
        }
      }
    }
  }

</style>
