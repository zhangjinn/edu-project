<template>
  <div class="itemWrap">
    <drag-item
      :add-btn-text="btnText"
      :change="handleChange"
      :data.sync="dragData"
      :no-slot="noSlot"
      @add="handleAdd"
      @delete="handleDelete"
    >
      <template v-slot:color="slotProps">
        <el-color-picker
          v-model="dragData[slotProps.index].color"
          :color-format="colorFormat"
          :disabled="dragData[slotProps.index].edit === false"
          :predefine="predefineColors"
          popper-class="colorPicker"
          @change="(...arg) => {
            handleColorChange(slotProps.index, ...arg)
          }"
          @click.native="clickp"
        />
        <!--        <etm-color-->
        <!--          v-model="dragData[slotProps.index].color"-->
        <!--          @change="(...arg) => {-->
        <!--            handleColorChange(slotProps.index, ...arg)-->
        <!--          }"-->
        <!--        />-->
      </template>
      <template v-slot:input="slotProps">
        <el-input
          v-model="dragData[slotProps.index].text"
          :disabled="dragData[slotProps.index].edit === false"
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
      <template v-slot:enable="slotProps">
        <el-switch v-model="dragData[slotProps.index].enable" @change="handleEnable(slotProps.index)" />
      </template>
      <template v-slot:number="slotProps">
        <el-input
          v-model="dragData[slotProps.index].generationName"
          :disabled="dragData[slotProps.index].edit === false"
          type="input"
          @blur="handleInputBlur(slotProps.index)"
          @focus="handleInputFocus(slotProps.index)"
        />
      </template>
    </drag-item>
  </div>
</template>
<script>
import dragItem from '../components/dragItem'

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
      console.log(arg)
      this.$emit('colorChange', arg)
    },
    handleAdd(...arg) {
      this.$emit('add', arg)
    },
    handleDelete(...arg) {
      this.$emit('delete', arg)
    },
    handleEnable(index) {
      // console.log('templeate', arg)
      this.$emit('enable', index)
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
      this.$emit('blur', index)
    },
    handleInputFocus(index) {
      this.$emit('focus', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.itemWrap {
  & > > > .el-input {
    width: 420px;
  }

  & > > > .el-input.el-input--mini {
    width: 120px;
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

  .cut{
    margin: 0 15px;
  }
}

</style>
