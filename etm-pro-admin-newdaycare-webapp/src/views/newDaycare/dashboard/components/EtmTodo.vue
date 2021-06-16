<template>
  <div
    class="EtmTodo-wrap"
    @click="$emit('click')"
  >
    <span
      class="todo-type"
      :style="{color: typeObj.color, background: `${typeObj.color.replace(')', ', 0.12)')}`}"
    >{{ typeObj.text }}</span>
    <div class="todo-content">
      <span
        class="todo-text"
        v-html="content"
      />
      <span class="todo-date">{{ date }}</span>
    </div>
  </div>
</template>

<script>
/**
 * EtmTodo create by haijinsha
 * createTime 2020/11/4 15:20
 */

const typeMap = {
  CONFIRM: {
    text: '确认',
    color: 'rgba(245, 34, 45)'
  },
  AUDIT: {
    text: '审批',
    color: 'rgba(86, 158, 255)'
  },
  RECONCILIATION: {
    text: '对账',
    color: 'rgba(250, 173, 2)'
  },
  REMIND: {
    text: '提醒',
    color: 'rgba(250, 173, 2)'
  },
  NOTIFICATION: {
    text: '通知',
    color: 'rgba(255, 172, 77)'
  },
  UPGRADE: {
    text: '更新',
    color: 'rgba(255, 172, 77)'
  }
}
export default {
  name: 'EtmTodo',
  components: {},
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    count: {
      type: [Number, String],
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    typeObj () {
      return typeMap[this.type]
    },
    content () {
      return this.title
    }
  },
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .EtmTodo-wrap {
    align-items: center;
    cursor: pointer;
    display: flex;
    padding-bottom: 16px;

    .todo-type {
      border-radius: 2px;
      display: inline-block;
      font-size: 12px;
      padding: 4px;
    }

    .todo-content {
      color: $color-text;
      display: flex;
      flex: 1;
      font-size: 14px;
      justify-content: flex-end;
      padding-left: 8px;

      .todo-count {
        margin: 0 4px;
      }

      .todo-date {
        color: $color-secondary;
        display: flex;
        flex: 1;
        justify-content: flex-end;
        white-space: nowrap;
      }

    }
  }
</style>
