<template>
  <div class="ChooseRecipesTabs">
    <ul>
      <li
        v-for="(item, index) in options"
        :key="index"
        :class="{
          active: checkActive(item),
        }"
        @click="optionsClick(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChooseRecipesTabs',
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
    }
  },
  methods: {
    optionsClick (item) {
      // 实时更新选中值
      this.$emit('input', item)
      this.$emit('change', item)
    },
    checkActive (val) {
      return this.currentValue === val
    }
  }
}
</script>

<style lang="scss" scoped>
.ChooseRecipesTabs {
  margin-top: 8px;

  ul {
    li {
      cursor: pointer;
      height: 32px;
      padding: 4px 8px;

    }

    .active {
      @include etm-color();
      @include etm-bgc-rgba();
    }

  }

}
</style>
