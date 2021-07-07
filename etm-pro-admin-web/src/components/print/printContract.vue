<template>
  <div class="printContract-wrap">
    <component :is="components[type]" :key="Date.now()" v-bind="{...prop, print: true}" />
  </div>

</template>

<script>
/**
   * printContract create by 油麦菜
   * createTime 2021/3/2 11:47
   */
import careChargeDetailText from '@/views/newDaycare/contract/careContract/components/chargeDetailText'
import teachChargeDetailText from '@/views/newDaycare/contract/teachContract/components/chargeDetailText'

export default {
  name: 'PrintContract',
  components: {
    careChargeDetailText,
    teachChargeDetailText
  },
  filters: {},
  mixins: [],
  props: {
    // type: {
    //   type: String,
    //   required: true,
    //   validator(val) {
    //     return ['care', 'teach'].includes(val)
    //   }
    // }
  },
  data() {
    return {
      type: '',
      components: {
        care: careChargeDetailText,
        teach: teachChargeDetailText
      },
      prop: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    const obj = this.$route.query
    this.prop = JSON.parse(this.$route.query.props)
    const types = ['care', 'teach']
    if (!types.includes(obj.type)) {
      alert('参数错误')
      window.close()
    }
    this.type = obj.type
    this.$nextTick(_ => {
      setTimeout(_ => {
        window.print()
        window.close()
      }, 1000)
    })
  },
  methods: {}
}
</script>
<style lang="scss">
  @media print {
    @page { size: A4 portrait; }

    .printContract-wrap {
      padding: 16px;
      .chargeDetailText-wrap {
        .row.el-row {
          min-height: 111px!important;
          max-height: 111px!important;
        }
        .row-body {
          .box:nth-child(11n) {
            margin-bottom: 150px;
          }
        }
      }
    }
  }
  #app {
    overflow: unset;
    background: none;
  }
</style>
