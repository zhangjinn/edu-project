<template>
  <div class="itemWrap">
    <drag-item
      :data.sync="dragData"
      :add-btn-text="btnText"
      :no-slot="noSlot"
      :change="handleChange"
      @delete="handleDelete"
      @add="handleAdd"
    >
      <template v-slot:input="slotProps">
        <el-input
          v-model="dragData[slotProps.index].text"
          :disabled="dragData[slotProps.index].editable === false"
          @blur="handleInputBlur(slotProps.index, 'input')"
          @focus="handleInputFocus(slotProps.index, 'input')"
        />
      </template>
      <template v-slot:unit="slotProps">
        <span v-if="dragData[slotProps.index].unit">{{ dragData[slotProps.index].unit }}</span>
      </template>
      <template v-slot:number="slotProps">
        <!--          v-if="dragData[slotProps.index].number !== ''"-->
        <el-input
          v-if="dragData[slotProps.index]['number'] !== false"
          v-model="dragData[slotProps.index].number"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'')"
          @blur="handleInputBlur(slotProps.index, 'number')"
          @focus="handleInputFocus(slotProps.index, 'number')"
        />
      </template>
      <template v-slot:delete>
        <i class="iconshanchu1 iconfont" />
      </template>
      <template v-slot:handle>
        <i class="icontuozhuai iconfont" />
      </template>
    </drag-item>
  </div>
</template>
<script>
import dragItem from '../../childManage/components/dragItem'
export default {
  components: {
    dragItem
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    btnText: {
      type: String,
      default: undefined
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
      dragData: this.data
    }
  },
  watch: {
    dragData(v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleChange(...arg) {
      this.$emit('change', arg)
    },
    handleAdd(...arg) {
      this.$emit('add', arg)
    },
    handleDelete(...arg) {
      this.$emit('delete', arg)
    },
    handleInputBlur(index, type) {
      this.$emit('blur', { index, type })
    },
    handleInputFocus(index, type) {
      this.$emit('focus', { index, type })
    }
  }
}
</script>

<style scoped lang="scss">
.itemWrap {
  & >>> .el-input {
    width: 420px;
  }
  & >>> .el-color-picker {
    .el-color-picker__empty, .el-color-picker__icon {
      display: none;
    }
  }
  i.iconfont {
    width: 16px;
    height: 16px;
    overflow: hidden;
  }
  i.iconshanchu1 {
    margin-left: 24px;
    font-size: 12px;
  }
  i.icontuozhuai {
    margin-left: 24px;
    margin-right: 16px;
    font-size: 12px;
  }
}
</style>
