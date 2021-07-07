<template>
  <div class="EtmTodo-wrap" @click="$emit('click')">
    <span class="todo-type" :style="{color: typeObj.color, background: `${typeObj.color.replace(')', ', 0.12)')}`}">{{ typeObj.text }}</span>
    <div class="todo-content">
      <span class="todo-text" v-html="content" />
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
  data() {
    return {}
  },
  computed: {
    typeObj() {
      return typeMap[this.type]
    },
    content() {
      return this.title
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .EtmTodo-wrap {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    cursor: pointer;

    .todo-type {
      display: inline-block;
      padding: 4px;
      border-radius: 2px;
      font-size: 12px;
    }

    .todo-content {
      flex: 1;
      display: flex;
      justify-content: flex-end;
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
