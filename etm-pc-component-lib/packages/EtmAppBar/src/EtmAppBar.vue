<template>
  <div class="EtmAppBar-wrap">
    <div class="title">
      <span class="title">
        <slot>{{ title }}</slot>
      </span>
    </div>
    <div v-if="show" class="tools">
      <slot name="tool">
        <el-button plain icon="el-icon-setting" @click="setting">{{ btnText }}</el-button>
      </slot>

    </div>
  </div>
</template>

<script>
/**
   *  2020/4/23 16:18
   *  haijinsha
   */

export default {
  name: 'EtmAppBar',
  filters: {},
  mixins: [],
  props: {
    show: {
      type: Boolean,
      default: true
    },
    btnText: {
      type: String,
      default: '应用设置',
      required: false
    },
    name: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    setting() {
      this.$emit('click')
      if (this.path) {
        this.$router.push({ path: this.path })
      }
      if (this.name) {
        this.$router.push({ name: this.name })
      }
    }
  }
}
</script>

<style lang="scss">
@import "~/styles/src/etm/appBar";
</style>
