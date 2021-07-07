<template>
  <div class="dragItem">
    <draggable v-model="listData" :handle="handle" filter="._filter" @change="change">
      <div v-for="(item, index) in listData" :key="index" class="item">
        <div v-if="noSlot.indexOf('color') === -1" class="colorWrap">
          <slot name="color" :index="index" />
        </div>
        <div class="greyWrap">
          <div v-if="noSlot.indexOf('input') === -1" class="inputWrap">
            <slot name="input" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('unit') === -1" class="unitWrap">
            <slot name="unit" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('number') === -1" class="numberWrap">
            <slot name="number" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('top') === -1 && !item.currentTerm" :class="item.editable === false ? 'topWrap _noTop' : 'topWrap'" @click.stop="handleToTop(index)">
            <slot name="top" :index="index" />
          </div>
          <div v-if="hasSlot.indexOf('switch') !== -1" class="switchWrap">
            <slot name="switch" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('delete') === -1 && !item.currentTerm" :class="item.editable === false ? 'deleteWrap _nodelete' : 'deleteWrap'" @click.stop="handleDelete(index)">
            <slot name="delete" />
          </div>
          <div v-if="noSlot.indexOf('handle') === -1 && !item.currentTerm" :class="item.move === false ? 'handleWrap _filter' : 'handleWrap'">
            <slot name="handle" />
          </div>
        </div>
      </div>
    </draggable>
    <el-button v-if="addBtnText" type="dashed" @click.stop="handleAdd">
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
      default() {
        return []
      }
    },
    hasSlot: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      listData: this.data
    }
  },
  watch: {
    listData(v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleToTop(index) {
      if (this.data[index].editable === false) return
      this.$emit('handleToTop', { index })
    },
    handleDelete(index) {
      if (this.data[index].editable === false) return
      this.$emit('delete', { index })
    },
    handleAdd() {
      this.$emit('add')
    }
  }
}
</script>

<style scoped lang="scss">
.dragItem {
  padding-bottom: 16px;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .colorWrap {
      margin-right: 24px;
    }
    .greyWrap {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 8px;
      @include bgc_bg_color();
      border-radius: 4px;
      .unitWrap {
        padding: 0 16px;
      }
      .topWrap{
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #bbb;
        &:hover{
          //color: $error-color;
          @include etm-color();
        }
        &._noTop {
          cursor: default;
          opacity: .7;
        }
      }
      .deleteWrap {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #bbb;
        &:hover{
          color: $error-color;
        }
        &._nodelete {
          cursor: default;
          opacity: .7;
        }
      }
      .handleWrap {
        display: flex;
        align-items: center;
        cursor: move;
        color: #bbb;
        &._filter {
          cursor: default;
          opacity: .7;
        }
      }
    }
  }
  .el-button {
    & >>> span {
      display: flex;
      align-items: center;
    }
    i.iconfont {
      width: 12px;
      height: 12px;
      overflow: hidden;
      font-size: 12px;
      margin-right: 8px;
    }
  }
}
</style>
