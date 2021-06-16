<template>
  <div class="dragItem">
    <draggable
      v-model="listData"
      :handle="handle"
      filter="._filter"
      @change="change"
    >
      <div
        v-for="(item, index) in listData"
        :key="index"
        class="item"
      >
        <div
          v-if="noSlot.indexOf('color') === -1"
          class="colorWrap"
        >
          <slot
            name="color"
            :index="index"
          />
        </div>
        <div class="greyWrap">
          <div
            v-if="noSlot.indexOf('input') === -1"
            class="inputWrap"
          >
            <slot
              name="input"
              :index="index"
            />
          </div>
          <div
            v-if="noSlot.indexOf('unit') === -1"
            class="unitWrap"
          >
            <slot
              name="unit"
              :index="index"
            />
          </div>
          <div
            v-if="noSlot.indexOf('number') === -1"
            class="numberWrap"
          >
            <slot
              name="number"
              :index="index"
            />
          </div>
          <div
            v-if="noSlot.indexOf('delete') === -1"
            :class="item.editable === false ? 'deleteWrap _nodelete' : 'deleteWrap'"
            @click.stop="handleDelete(index)"
          >
            <slot name="delete" />
          </div>
          <div
            v-if="noSlot.indexOf('handle') === -1"
            :class="item.move === false ? 'handleWrap _filter' : 'handleWrap'"
          >
            <slot name="handle" />
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
      default: '.handleWrap'
    },
    // eslint-disable-next-line vue/require-default-prop
    addBtnText: {
      type: String
    },
    change: {
      type: Function,
      required: true
    },
    noSlot: {
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
    listData (v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleDelete (index) {
      if (this.data[index].editable === false) return
      this.$emit('delete', { index })
    },
    handleAdd () {
      this.$emit('add')
    }
  }
}
</script>

<style scoped lang="scss">
.dragItem {
  padding-bottom: 16px;

  .item {
    align-items: center;
    display: flex;
    margin-bottom: 16px;

    .colorWrap {
      margin-right: 24px;
    }

    .greyWrap {
      @include bgc-bg-color();
      align-items: center;
      border-radius: 4px;
      display: flex;
      height: 48px;
      padding: 0 8px;

      .unitWrap {
        padding: 0 16px;
      }

      .deleteWrap {
        align-items: center;
        color: #bbb;
        cursor: pointer;
        display: flex;

        &:hover {
          color: $color-error;
        }

        &._nodelete {
          cursor: default;
          opacity: 0.7;
        }
      }

      .handleWrap {
        align-items: center;
        color: #bbb;
        cursor: move;
        display: flex;

        &._filter {
          cursor: default;
          opacity: 0.7;
        }
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
