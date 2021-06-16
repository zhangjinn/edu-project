<template>
  <div class="EtmEmpty-wrap">
    <div class="img">
      <img :src="placeholderImage" alt="">
    </div>
    <div class="text">{{ emptyText }}</div>
  </div>

</template>

<script>
/**
 * EtmEmpty create by haijinsha
 * createTime 2020/8/10 18:28
 */
// import emptyImg from '../../assets/images/empty.png'

export default {
  name: 'EtmEmpty',
  components: {},
  filters: {},
  mixins: [],
  props: {
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    image: {
      type: String,
      default: require('../../assets/images/empty.png')
    }
  },
  data() {
    return {
      placeholderImage: this.image
    }
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
<style lang="scss">
    @import "../../styles/src/etm/empty.scss";
</style>
