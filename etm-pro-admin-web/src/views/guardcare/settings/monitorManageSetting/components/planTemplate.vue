<template>
  <div class="tempWrap">
    <drag-item
      :data.sync="dragData"
      :add-btn-text="btnText"
      :change="handleChange"
      @delete="handleDelete"
      @add="handleAdd"
    >
      <template v-slot:select="slotProps">
        <el-select v-model="dragData[slotProps.index].select" placeholder="请选择购买时长" @change="e => handleSelect(slotProps.index, e)">
          <el-option
            v-for="option in selectOption"
            :key="option.value"
            v-bind="option"
          />
        </el-select>
      </template>
      <template v-slot:priceI="slotProps">
        <el-input
          v-model="dragData[slotProps.index].priceI"
          :disabled="dragData[slotProps.index].editable === false"
          placeholder="请输入售卖金额"
          onkeyup="this.value = this.value.replace(/[^\d.]/g, '')"
          @blur="e => handleInputBlur(slotProps.index, 'priceI', e)"
          @focus="handleInputFocus(slotProps.index, 'priceI')"
        />
      </template>
      <template v-slot:unitI="slotProps">
        {{ dragData[slotProps.index].unitI || '元' }}
      </template>
      <template v-slot:priceII="slotProps">
        <el-input
          v-model="dragData[slotProps.index].priceII"
          :disabled="dragData[slotProps.index].editable === false"
          placeholder="请输入优惠金额"
          onkeyup="this.value = this.value.replace(/[^\d.]/g, '')"
          @blur="e => handleInputBlur(slotProps.index, 'priceII', e)"
          @focus="handleInputFocus(slotProps.index, 'priceII')"
        />
      </template>
      <template v-slot:unitII="slotProps">
        {{ dragData[slotProps.index].unitII || '元' }}
      </template>
      <template v-slot:delete>
        <i class="iconshanchu1 iconfont" />
      </template>
      <template v-slot:handle>
        <i class="icontuozhuai iconfont" />
      </template>
      <template v-slot:switch="slotProps">
        <el-switch :key="slotProps.index" v-model="dragData[slotProps.index].switch" @change="e => handleSwitch(slotProps.index, e)" />
      </template>
    </drag-item>
  </div>
</template>
<script>
import dragItem from './dragItem'
const optionList = [
  { label: '请选择购买时长', value: '' },
  { label: '1个月', value: '1' },
  { label: '2个月', value: '2' },
  { label: '3个月', value: '3' },
  { label: '4个月', value: '4' },
  { label: '5个月', value: '5' },
  { label: '6个月', value: '6' },
  { label: '7个月', value: '7' },
  { label: '8个月', value: '8' },
  { label: '9个月', value: '9' },
  { label: '10个月', value: '10' },
  { label: '11个月', value: '11' },
  { label: '12个月', value: '12' }
]
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
    optionFilter: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dragData: this.data,
      selectOption: []
    }
  },
  watch: {
    data: {
      handler(v) {
        this.dragData = v
      },
      deep: true
    },
    dragData(v) {
      this.$emit('update:data', v)
    },
    optionFilter: {
      handler(filter) {
        const copy = JSON.parse(JSON.stringify(optionList))
        copy.forEach(v => {
          if (filter.indexOf(v.value) !== -1) {
            v.disabled = true
          } else {
            v.disabled = false
          }
        })
        this.selectOption = copy
      },
      immediate: true
    }
  },
  methods: {
    handleSelect(index, e) {
      this.$emit('select', { index, e })
    },
    handleChange(...arg) {
      this.$emit('change', arg)
    },
    handleAdd(...arg) {
      this.$emit('add', arg)
    },
    handleDelete(...arg) {
      this.$emit('delete', arg)
    },
    handleInputBlur(index, type, e) {
      let value = e.target.value.replace(/[^\d.]/g, '') // 转为只能是数字
      if (value) {
        const REG = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/ // 验证是否是两位小数的数字
        if (/\./.test(value)) { // 有小数点
          if (!REG.test(value)) { // 不符合两位小数的
            this.$message.warning('请输入两位小数的数字类型')
            value = ''
          }
        } else { // 没有小数点，后面补两位小数0
          value += '.00'
        }
        e.target.value = value
      }
      this.$emit('blur', { index, type, value })
    },
    handleInputFocus(index, type) {
      this.$emit('focus', { index, type })
    },
    handleSwitch(index, e) {
      this.$emit('switch', { index, e })
    }
  }
}
</script>

<style scoped lang="scss">
.tempWrap {
  & >>> .el-input {
    width: 200px;
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
    // margin-left: 24px;
    font-size: 12px;
  }
  i.icontuozhuai {
    margin-left: 24px;
    margin-right: 16px;
    font-size: 12px;
  }
}
</style>
