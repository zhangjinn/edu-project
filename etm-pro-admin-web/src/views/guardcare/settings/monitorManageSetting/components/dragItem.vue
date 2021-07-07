<template>
  <div class="dragItem">
    <draggable v-model="listData" :handle="handle" filter="._filter" @change="change">
      <div v-for="(item, index) in listData" :key="index" class="item">
        <div class="greyWrap">
          <div v-if="noSlot.indexOf('select') === -1" class="selectWrap">
            <slot name="select" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('priceI') === -1" class="inputWrap">
            <slot name="priceI" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('unitI') === -1" class="unitWrap">
            <slot name="unitI" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('priceII') === -1" class="inputWrap">
            <slot name="priceII" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('unitII') === -1" class="unitWrap">
            <slot name="unitII" :index="index" />
          </div>
          <div v-if="noSlot.indexOf('delete') === -1" :class="item.editable === false ? 'deleteWrap _nodelete' : 'deleteWrap'" @click.stop="handleDelete(index)">
            <slot name="delete" />
          </div>
          <div v-if="noSlot.indexOf('handle') === -1" :class="item.move === false ? 'handleWrap _filter' : 'handleWrap'">
            <slot name="handle" />
          </div>
          <div v-if="noSlot.indexOf('switch') === -1" class="switchWrap">
            <slot name="switch" :index="index" />
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
    }
  },
  data() {
    return {
      listData: this.data
    }
  },
  watch: {
    data: {
      handler(v) {
        this.listData = v
      },
      deep: true
    },
    listData(v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
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
    .greyWrap {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 8px;
      @include bgc_bg_color();
      border-radius: 4px;
      .selectWrap {
        margin-right: 16px;
      }
      .unitWrap {
        padding: 0 16px;
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
      .switchWrap {

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
