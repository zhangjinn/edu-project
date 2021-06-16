<template>
  <div class="itemWrap">
    <drag-item
      :data.sync="dragData"
      :add-btn-text="btnText"
      :change="handleChange"
      :no-slot="noSlot"
      :has-slot="hasSlot"
      v-bind="$attrs"
      @delete="handleDelete"
      @add="handleAdd"
    >
      <template v-slot:color="slotProps">
        <etm-color
          v-model="dragData[slotProps.index].color"
          @change="(arg) => handleColorChange(slotProps.index, ...arg)"
        />
      </template>
      <template v-slot:input="slotProps">
        <el-input
          v-model="dragData[slotProps.index].label"
          maxlength="30"
          :disabled="dragData[slotProps.index].editable === false"
          @blur="handleInputBlur(slotProps.index)"
          @focus="handleInputFocus(slotProps.index)"
        />
      </template>
      <template v-slot:switch="slotProps">
        <el-switch
          v-model="dragData[slotProps.index].switch"
          @change="handleSwitchChange(slotProps.index)"
        />
      </template>
      <template v-slot:delete>
        <i class="iconshanchu1 iconfont" />
      </template>
      <template v-slot:handle>
        <i class="icontuozhuai iconfont" />
      </template>
      <slot />
    </drag-item>
  </div>
</template>
<script>
import dragItem from '../components/dragItem'
import EtmColor from './etmColor'

export default {
  components: {
    EtmColor,
    dragItem
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    args: {
      type: Object,
      default () {
        return {}
      }
    },
    noSlot: {
      type: Array,
      default () {
        return []
      }
    },
    hasSlot: {
      type: Array,
      default () {
        return []
      }
    },
    btnText: {
      type: String,
      default: undefined
    },
    colorFormat: {
      type: String,
      default: 'rgb'
    }
  },
  data () {
    return {
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      dragData: this.data
    }
  },
  watch: {
    dragData: {
      deep: true,
      immediate: true,
      handler (v) {
        this.$emit('update:data', v)
      }
    }
  },
  methods: {
    addItem (obj) {
      this.dragData.push(obj)
    },
    handleChange (...arg) {
      this.$emit('change', { arg, ...this.args })
    },
    handleColorChange (...arg) {
      this.$emit('colorChange', { arg, ...this.args })
    },
    handleAdd (...arg) {
      this.$emit('add', { arg, ...this.args })
    },
    handleDelete (...arg) {
      this.$confirm('确定要删除该数据吗?', {
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        this.$emit('delete', { arg, ...this.args })
      }).catch(() => {

      })
      this.$nextTick(() => {
        setTimeout(() => {
          document.activeElement.blur()
        }, 100)
      })
    },
    clickp () {
      const pickers = document.querySelectorAll('.colorPicker')
      Array.prototype.forEach.call(pickers, picker => {
        picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
        picker.querySelector('.el-color-dropdown__value').style.display = 'none'
        picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
      })
    },
    handleInputBlur (index) {
      this.$emit('blur', { index, ...this.args })
    },
    handleInputFocus (index) {
      this.$emit('focus', { index, ...this.args })
    },
    handleSwitchChange (index) {
      this.$emit('switch', { index, ...this.args })
    }
  }
}
</script>

<style scoped lang="scss">
.itemWrap {
  & ::v-deep .el-input {
    width: 420px;
  }

  & ::v-deep .el-color-picker {
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
