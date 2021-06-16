<template>
  <div class="dragItem">
    <draggable
      v-model="listData"
      :handle="handle"
      filter="._filter"
      @change="change"
    >
      <div
        v-for="(item, index) in data"
        :key="index"
        class="item"
      >
        <div
          v-if="slotArr.includes('title')"
          class="titleWrap"
        >
          <slot
            :index="index"
            name="title"
          />
        </div>
        <div class="greyWrap">
          <div
            v-if="slotArr.includes('default')"
            class="defaultWrap"
          >
            <slot
              :index="index"
              name="default"
            />
          </div>
          <div
            v-if="slotArr.includes('handle')"
            class="defaultWrap"
          >
            <slot
              :index="index"
              name="handle"
            />
          </div>
          <div
            v-if="slotArr.includes('style')"
            class="defaultWrap"
          >
            <slot
              :index="index"
              name="style"
            />
          </div>
          <div
            v-if="slotArr.includes('delete')"
            :class="item.editable === false ? 'defaultWrap deleteWrap _nodelete' : 'defaultWrap deleteWrap'"
            @click.stop="handleDelete(index)"
          >
            <slot name="delete" />
          </div>
          <div
            v-if="slotArr.includes('drag')"
            class="defaultWrap dragWrap"
          >
            <slot name="drag" />
          </div>
        </div>
      </div>
    </draggable>
    <el-button
      v-if="addBtnText"
      type="dashed"
      @click.stop="handleAdd"
    >
      <i class="iconplus iconfont" />
      {{ addBtnText }}
    </el-button>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    handle: {
      type: String,
      default: '.dragWrap'
    },
    addBtnText: {
      type: String,
      default: ''
    },
    change: {
      type: Function,
      required: true
    },
    slotArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      listData: this.data
    }
  },
  watch: {
    data: {
      handler (v) {
        if (v) {
          this.listData = v
          // console.log('dragData2', v)
        }
      },
      immediate: true,
      deep: true
    },
    listData (v) {
      this.$emit('update:data', v)
      // console.log(123123123)
    }
  },
  methods: {
    handleDelete (index) {
      // if (this.data[index].editable === false) return
      this.$emit('delete', index)
    },
    handleAdd () {
      this.$emit('add')
    }
  }
}
</script>

<style lang="scss" scoped>
.dragItem {
  padding-bottom: 16px;

  .item {
    //display: flex;
    //align-items: center;
    margin-bottom: 16px;

    .colorWra,
    .titleWrap {
      margin-right: 24px;
    }

    .titleWrap {
      margin-bottom: 24px;
    }

    .greyWrap {
      align-items: center;
      display: flex;
      height: auto;
      padding: 0 8px;

      .defaultWrap {
        //display: flex;
        align-items: center;
        cursor: move;
        //margin-bottom: 16px;
        margin-right: 24px;

        &._filter {
          cursor: default;
          opacity: 0.2;
        }
      }
    }

    .deleteWrap {
      align-items: center;
      cursor: pointer !important;
      display: flex;

      &._nodelete {
        cursor: default;
        opacity: 0.2;
      }
    }

    .dragWrap {
      align-items: center;
      cursor: move;
      display: flex;

      &._filter {
        cursor: default;
        opacity: 0.2;
      }
    }
  }

  .el-button {
    ::v-deep span {
      align-items: center;
      display: flex;
    }

    .iconfont {
      font-size: 12px;
      height: 12px;
      margin-right: 8px;
      overflow: hidden;
      width: 12px;
    }
  }
}
</style>
