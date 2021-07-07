<template>
  <div class="screenTab">
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
        :class="{active: checkActive(item.value), notClick: disabled}"
        @click="optionsClick(item.value)"
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
    prop: 'currVal',
    event: 'input'
  },
  props: {
    currVal: { // 当前选中值多选为数组，单选为字符串或数值
      type: [Array, String, Number],
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
    disabled: {// 是否禁止点击
      type: Boolean,
      // default: false,
      default: true
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
      }
      if (this.multiple === false) { // 单选
        // 实时更新选中值
        this.$emit('input', item)
        this.$emit('change', item)
      } else { // 多选
        if (this.currVal.indexOf(item) === -1) {
          // 当前数组中没有该值则push到数组
          this.currVal.push(item)
        } else {
          // 当前数组中有该值，找到该值下标并删除
          this.currVal.splice(this.currVal.indexOf(item), 1)
        }
        this.$emit('change', this.currVal)
      }
    },
    checkActive(item) {
      if (this.multiple === false) {
        return this.currVal === item
      }
      return this.currVal.indexOf(item) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
  .screenTab{
    display: flex;
    font-size:14px;
    margin-bottom: 16px;
    @include c_text_color();

    .screenTabTitle{
      margin-right: 8px;
    }

    ul{
      display: flex;
      flex-wrap: wrap;
      margin: -4px;
      li {
        border-radius: 4px;
        padding: 0 4px;
        margin: 4px;
        cursor: pointer;
      }
    }
    .active{
      @include etm-color();
    }
    .notClick{
      cursor: not-allowed !important;
    }
  }
</style>
