<template>
  <div class="preview-wrap">
    <img
      :src="preview"
      alt=""
    >
  </div>
</template>

<script>

/**
 * preview create by haijinsha
 * createTime 2021/3/15 09:55
 */
import { name } from '../../../package.json'

export default {
  name: 'Preview',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      preview: ''
    }
  },
  computed: {},
  watch: {
    $route: {
      handler () {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    init () {
      const path = this.$route.path
      const routeGroup = JSON.parse(localStorage.getItem('routeGroup'))
      const find = routeGroup[name].find(item => '/' + item.name === path)
      if (find.isPreviewed) {
        this.preview = find.preview
      }
    }
  }
}
</script>
