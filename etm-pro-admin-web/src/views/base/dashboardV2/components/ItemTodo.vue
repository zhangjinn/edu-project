<template>
  <div class="ItemTodo-wrap" @click="navigateTo">
    <span
      v-if="prop.config && prop.config.text"
      :style="{color: prop.config.color, background: `${prop.config.color.replace(')', ', 0.12)')}`}"
      class="todo-type"
    >
      {{ prop.config.text }}
    </span>
    <div class="todo-content">
      <span class="todo-text" v-html="content" />
    </div>
  </div>

</template>

<script>/**
 * ItemTodo create by haijinsha
 * createTime 2020/11/4 15:20
 */

import { queryDashboardTodoList } from '@/api/base/dashboard'

export default {
  name: 'ItemTodo',
  components: {},
  filters: {},
  mixins: [],
  props: {
    date: {
      type: String,
      default: ''
    },
    prop: {
      type: Object,
      default() {
        return {
          color: '',
          text: ''
        }
      }
    }
  },
  data() {
    return {
      num: '',
      content: ''
    }
  },
  computed: {},
  watch: {
    prop: {
      handler() {
        this.init()
      },
      immediate: true,
      defer: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    init() {
      try {
        this.prop.dataApi = JSON.parse(this.prop.dataApi)
        this.prop.config = JSON.parse(this.prop.config)
      } catch (err) {
        console.log('JSON解析错误: ', err)
      }

      queryDashboardTodoList({ url: this.prop.dataApi.url, type: this.prop.dataApi.params.type }).then(res => {
        this.content = this.prop.config.content.replace(/\$/g, `<span style="color: ${this.prop.config.color}"> ${res.data.result} </span>`)
      })
    },
    navigateTo() {
      if (!this.prop.detailUri) {
        return this.$message.warning('请在手机端操作')
      }
      this.$router.push({ path: '/' + this.prop.detailUri })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ItemTodo-wrap {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    cursor: pointer;

    .todo-type {
      display: inline-block;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 12px;
    }

    .todo-content {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      padding-left: 8px;
      font-size: 14px;
      color: $text-color;

      .todo-count {
        margin: 0 4px;
      }

      .todo-date {
        white-space: nowrap;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        color: $secondary-color;
      }

    }
  }
</style>
