<template>
  <div class="setting-wrap">
    <etm-layout-split>
      <course-type />
    </etm-layout-split>
  </div>
</template>

<script>
import CourseType from '@/views/sacc/course/components/courseType'

/**
   *  2020/4/16 14:54
   *  haijinsha
   */
export default {
  name: 'Setting',
  components: { CourseType },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'courseType'

    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    handleClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .setting-wrap {
    /*background-color: #fff;*/
    /*height: 100%;*/
  }
</style>
