<template>
  <div class="oddSure-wrap">
    <etm-form type="dialog">
      <el-alert
        title="开启异常确认后，若幼儿检查状态为异常，将在异常明细列表确认后才能将检查结果通过消息推送给相应的家长"
        type="warning"
        :closable="false"
      />
      <el-form-item label="开启异常确认">
        <el-switch
          v-model="value"
          @change="update"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * oddSure create by Administrator
 * createTime 2020/09/18 13:49
 */
import { queryConfig, createConfig } from '@/api/newDaycare/bodyCheck'

export default {
  name: 'OddSure',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      value: false,
      enterpriseConfigId: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    update () {
      createConfig({ enterpriseConfigId: this.enterpriseConfigId, content: this.value }).then(() => {
        this.init()
      })
    },
    init () {
      queryConfig().then(res => {
        // console.log(res)
        this.value = res.data.content
        this.enterpriseConfigId = res.data.enterpriseConfigId
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
