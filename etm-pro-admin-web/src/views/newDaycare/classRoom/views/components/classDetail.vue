<template>
  <div class="classDetail-wrap">
    <etm-layout-split>
      <el-carousel trigger="click" height="150px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
      <etm-title :show-line="false" border>1号教室
        <template slot="tool">
          <span>容量30人</span>
        </template>
      </etm-title>
      <p class="capacity">2楼101号，早教教室</p>
      <etm-title :show-line="false" border>教室信息
      </etm-title>
      <etm-field-label type="left" label="所属园区">22222</etm-field-label>
      <etm-field-label type="left" label="教室容量">22222</etm-field-label>
      <etm-field-label type="left" label="使用班级"><p>1</p><p>1</p><p>1</p></etm-field-label>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * classDetail create by Administrator
 * createTime 2020/08/28 16:51
 */
export default {
  name: 'ClassDetail',
  components: {
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.classDetail-wrap {
  .capacity {
    padding-bottom: 16px;
  }
}
</style>
