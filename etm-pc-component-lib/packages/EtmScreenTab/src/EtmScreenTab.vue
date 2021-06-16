<template>
  <div class="EtmScreenTab-wrap">
    <span
      v-if="title"
      class="screenTabTitle"
    >
      {{ title }}:
    </span>
    <ul>
      <li
        v-for="(item, index) in options"
        :key="index"
        :class="{
          active: checkActive(item.value),
          'is-multiple': multiple,
          'not-click': disabled || ( !disabled && item.disabled ),
        }"
        @click="optionsClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'EtmScreenTab',
  model: {
    prop: 'currentValue',
    event: 'input'
  },
  props: {
    currentValue: { // 当前选中值多选为数组，单选为字符串或数值
      type: null,
      required: true
    },
    options: { // 选项列表
      type: Array,
      required: true
    },
    multiple: { // 是否多选（默认单选）
      type: Boolean,
      default: false
    },
    disabled: { // 是否禁止全部按钮点击
      type: Boolean,
      default: false
    },
    title: { // 是否添加标题
      type: String,
      default: ''
    }
  },
  methods: {
    optionsClick(item) {
      if (this.disabled) {
        return
      } else {
        if (item.disabled) {
          console.log(item.disabled)
          return
        }
      }

      if (this.multiple === false) { // 单选
        // 实时更新选中值
        this.$emit('input', item.value)
        this.$emit('change', item.value)
      } else { // 多选
        if (this.currentValue.indexOf(item.value) === -1) {
          // 当前数组中没有该值则push到数组
          this.currentValue.push(item.value)
        } else {
          // 当前数组中有该值，找到该值下标并删除
          this.currentValue.splice(this.currentValue.indexOf(item.value), 1)
        }
        this.$emit('change', this.currentValue)
      }
    },
    checkActive(val) {
      if (this.multiple === false) {
        return this.currentValue === val
      }
      return this.currentValue.indexOf(val) !== -1
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/src/etm/screenTab";

</style>
