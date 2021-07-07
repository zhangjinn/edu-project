<template>
  <div class="itemWrap">
    <drag-item
      :data.sync="dragData"
      :add-btn-text="btnText"
      :change="handleChange"
      :no-slot="noSlot"
      :show-color="showColor"
      @delete="handleDelete"
      @add="handleAdd"
    >
      <template v-if="showColor" v-slot:color="slotProps">
        <etm-color v-model="dragData[slotProps.index].color" @change="(arg) => handleColorChange(slotProps.index, ...arg)" />
      </template>
      <template v-slot:input="slotProps">
        <el-input
          v-model="dragData[slotProps.index].text"
          :disabled="dragData[slotProps.index].editable === false"
          @blur="handleInputBlur(slotProps.index)"
          @focus="handleInputFocus(slotProps.index)"
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
import dragItem from './dragItem'
import EtmColor from '@/views/newDaycare/courseTimeManageTeach/components/etmColor'

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
    noSlot: {
      type: Array,
      default() {
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
    },
    showColor: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
    dragData(v) {
      this.$emit('update:data', v)
    }
  },
  methods: {
    handleChange(...arg) {
      this.$emit('change', arg)
    },
    handleColorChange(...arg) {
      this.$emit('colorChange', arg)
    },
    handleAdd(...arg) {
      this.$emit('add', arg)
    },
    handleDelete(arg) {
      this.$confirm('确定要删除该数据吗?', {
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        const delData = this.dragData.splice(arg, 1)
        this.$emit('update:data', this.dragData)
        this.$emit('delete', delData[0])
      }).catch(() => {

      })
      this.$nextTick(() => {
        setTimeout(() => {
          document.activeElement.blur()
        }, 100)
      })
    },
    clickp() {
      const pickers = document.querySelectorAll('.colorPicker')
      Array.prototype.forEach.call(pickers, picker => {
        picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
        picker.querySelector('.el-color-dropdown__value').style.display = 'none'
        picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
      })
    },
    handleInputBlur(index) {
      this.dragData[index].text = this.dragData[index].text.trim()
      this.$emit('blur', index)
    },
    handleInputFocus(index) {
      this.$emit('focus', index)
    }
  }
}
</script>

<style scoped lang="scss">
.itemWrap {
  & > > > .el-input {
    width: 420px;
  }

  & > > > .el-color-picker {
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
