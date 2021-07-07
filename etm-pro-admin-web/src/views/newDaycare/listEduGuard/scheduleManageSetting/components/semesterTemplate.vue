<template>
  <div class="itemWrap">
    <drag-item
      :data.sync="dragData"
      :add-btn-text="btnText"
      :change="handleChange"
      :no-slot="noSlot"
      @handleToTop="handleToTop"
      @delete="handleDelete"
      @add="handleAdd"
    >
      <template v-slot:color="slotProps">
        <el-color-picker
          v-model="dragData[slotProps.index].color"
          popper-class="colorPicker"
          :color-format="colorFormat"
          :predefine="predefineColors"
          :disabled="dragData[slotProps.index].editable === false"
          @click.native="clickp"
          @change="(...arg) => {
            handleColorChange(slotProps.index, ...arg)
          }"
        />
      </template>
      <template v-slot:input="slotProps">
        <el-input
          v-model="dragData[slotProps.index].name"
          :disabled="dragData[slotProps.index].editable === false"
          placeholder="学期名称"
          @blur="handleTimePicker(slotProps.index)"
        />
        <el-date-picker
          v-model="dragData[slotProps.index].time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :disabled="dragData[slotProps.index].editable === false"
          @change="handleTimePicker(slotProps.index)"
        />
      </template>
      <template v-slot:top>
        <i class="iconzhiding iconfont" />
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
export default {
  components: {
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
    handleDelete(...arg) {
      this.$confirm('确定要删除该数据吗?', {
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        this.$emit('delete', arg)
      }).catch(() => {

      })
      this.$nextTick(() => {
        setTimeout(() => {
          document.activeElement.blur()
        }, 100)
      })
    },
    handleToTop(...arg) {
      this.$emit('toTop', arg)
    },
    clickp() {
      const pickers = document.querySelectorAll('.colorPicker')
      Array.prototype.forEach.call(pickers, picker => {
        picker.querySelector('.el-color-dropdown__main-wrapper').style.display = 'none'
        picker.querySelector('.el-color-dropdown__value').style.display = 'none'
        picker.querySelector('.el-color-dropdown__link-btn').style.display = 'none'
      })
    },
    handleTimePicker(index) {
      this.$emit('timeChange', index)
    }

  }
}
</script>

<style scoped lang="scss">
.itemWrap {
  & >>> .el-input {
    width: 210px;
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
