<template>
  <div class="EtmAppBar-wrap">
    <span class="title"><slot>{{ title }}</slot></span>
    <el-button v-if="show" class="etm-button-plain" plain icon="el-icon-setting" @click="setting">{{ btnText }}</el-button>
  </div>
</template>

<script>
/**
   *  2020/4/17 14:57
   *  haijinsha
   */
export default {
  name: 'EtmAppBar',
  filters: {},
  mixins: [],
  props: {
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '应用设置'
    },
    show: {
      type: Boolean,
      default: true
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

<style lang="scss" scoped>
  .EtmAppBar-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;

    .title {
      color: $title-color;
      font-weight: bold;
      font-size: 16px;
    }
  }
</style>
