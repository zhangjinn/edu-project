<template>
  <div class="ItemNews-wrap" @click="$emit('click')">
    <span :style="{color: typeObj.color, background: `${typeObj.color.replace(')', ', 0.12)')}`}" class="News-type">{{ typeObj.text }}</span>
    <div class="News-content">
      <span class="News-text" v-html="content" />
      <span class="News-date">{{ date }}</span>
    </div>
  </div>

</template>

<script>
/**
 * ItemNews create by haijinsha
 * createTime 2020/11/4 15:21
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
  name: 'ItemNews',
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
.ItemNews-wrap {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  cursor: pointer;

  .News-type {
    display: inline-block;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 12px;
  }

  .News-content {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-left: 8px;
    font-size: 14px;
    color: $text-color;

    .News-count {
      margin: 0 4px;
    }

    .News-date {
      white-space: nowrap;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      color: $secondary-color;
    }

  }
}
</style>
