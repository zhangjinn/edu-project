<template>
  <div class="enrollMiniSite-wrap">
    <component
      :is="comp"
      :expire-time="expireTime"
    />
  </div>
</template>

<script>
/**
 * EnrollMiniSite create by shangLu
 * createTime 2020/11/20 13:44
 */
import { queryEqxIsPay } from '@/api/newDaycare/eqx'
// import baseMixin from '@/layout/mixin/baseMixin'
import EnrollMiniSiteContent from '@/views/newDaycare/enrollMinisite/content'
import JoinVip from '@/views/newDaycare/enrollMinisite/joinVip'
import { parseTime } from '@/utils'

export default {
  name: 'EnrollMiniSite',
  components: {
    EnrollMiniSiteContent,
    JoinVip
  },
  // mixins: [baseMixin],
  data () {
    return {
      comp: '',
      expireTime: ''
    }
  },
  mounted () {
    queryEqxIsPay().then(res => {
      // console.log('isPay', res)
      if (!res.data.isPay) {
        this.comp = 'JoinVip'
      } else {
        this.comp = 'EnrollMiniSiteContent'
      }
      this.expireTime = parseTime(res.data.expireTime, '{y}-{m}-{d}')
    })
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
</style>
