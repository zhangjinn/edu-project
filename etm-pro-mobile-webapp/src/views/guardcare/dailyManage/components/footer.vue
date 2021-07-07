<template>
  <div class="footer">
    <div>
      <slot />
    </div>
    <div v-show="hasBtn" class="btn" @click.stop="$emit('click')">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '按键名字'
    },
    hasBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 52px;
  width: 100%;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $white;
  .btn {
    width: 84px;
    height: 28px;
    border-radius: 15px;
    background-color: $theme;
    color: $white;
    line-height: 28px;
    font-size: 12px;
    text-align: center;
  }
}
</style>
