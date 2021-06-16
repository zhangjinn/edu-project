<template>
  <div class="etm-nav-wrap">
    <el-radio-group v-model="theme" @change="change">
      <el-radio label="etm-rainBlue">青出于蓝</el-radio>
      <el-radio label="etm-pink">粉妆玉砌</el-radio>
      <el-radio label="etm-purple">紫气东来</el-radio>
      <el-radio label="etm-warmOrange">温暖橘红</el-radio>
      <el-radio label="etm-blackGold">尊贵黑金</el-radio>
      <el-radio label="etm-yellow">凌霄黄</el-radio>
      <el-radio label="etm-blue">碧空如洗</el-radio>
      <el-radio label="etm-green">郁郁葱葱</el-radio>
      <el-radio label="etm-girlPink">粉红少女</el-radio>
      <el-radio label="etm-lavenderPurple">薰衣草紫</el-radio>
      <el-radio label="etm-brown">凌霄黄</el-radio>
      <el-radio label="etm-iceBlue">凌霄黄</el-radio>
      <el-radio label="null">清空</el-radio>
    </el-radio-group>
  </div>

</template>

<script>
/**
 * /etm-nav create by haijinsha
 * createTime 2020/6/1 15:14
 */
export default {
  name: 'EtmNav',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      theme: 'etm-purple'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.change('etm-purple')
  },
  methods: {
    change(e) {
      this.toggleClass(document.body, e)
      console.log(e)
      // dynamicLoadCss(e)
    },
    toggleClass(element, className) {
      if (!element || !className) {
        return
      }
      element.className = className
    }
  }
}
</script>
<style lang="scss" scoped>
  .etm-nav-wrap {

  }
</style>
