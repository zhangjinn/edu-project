<template>
  <div class="screenTab-wrap">
    <etm-screen-tab v-model="value1" title="单选" :options="options" @change="change" />
    <etm-screen-tab v-model="value2" title="多选" multiple :options="options" @change="change" />

    <etm-screen-tab v-model="value3" title="单选(选择性禁用)" :options="selectOptions" @change="change" />
    <etm-screen-tab v-model="value4" title="多选(选择性禁用)" multiple :options="selectOptions" @change="change" />

    <etm-screen-tab v-model="value5" title="单选(全部禁用快捷方式)" disabled :options="options" @change="change" />
    <etm-screen-tab v-model="value6" title="多选(全部禁用快捷方式)" disabled multiple :options="options" @change="change" />

  </div>
</template>

<script>
/**
 * screenTab create by haijinsha
 * createTime 2020/9/21 10:50
 */
export default {
  name: 'ScreenTab',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value1: null,
      value2: ['1', '2'],
      value3: '1',
      value4: ['1', '3'],
      value5: '1',
      value6: ['1', '3'],
      options: [
        {
          value: '1',
          name: '测试11'
        },
        {
          value: '2',
          name: '测试22'
        },
        {
          value: '3',
          name: '测试33'
        },
        {
          value: '4',
          name: '测试44'
        }
      ],
      selectOptions: [
        {
          value: '1',
          name: '测试11',
          disabled: true
        },
        {
          value: '2',
          name: '测试22',
          disabled: true
        },
        {
          value: '3',
          name: '测试33'
        },
        {
          value: '4',
          name: '测试44'
        }
      ]
    }
  },

  methods: {

    change(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss">
  .screenTab-wrap {
    height: 100vh;
    background-color: #fff;
  }
</style>
