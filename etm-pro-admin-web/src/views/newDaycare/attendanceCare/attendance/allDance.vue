<template>
  <div class="allDance-wrap">
    <etm-form ref="form" :model="form" type="dialog">
      <el-form-item
        label="签到学员"
        prop="stuNames"
        :rules="formValidate.nullValueRule(true,'请选择签到学员')"
      >
        <el-select v-model="form.stuNames" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="考勤状态"
        prop="statusId"
        :rules="formValidate.nullValueRule(true,'请选择考勤状态')"
      >
        <el-select v-model="form.statusId" placeholder="请选择考勤状态">
          <el-option
            v-for="item in danceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.statusId==='rest'"
        label="请假原因"
        prop="details"
        :rules="formValidate.nullValueRule(true,'请输入请假原因')"
      >
        <el-input
          v-model="form.details"
          type="textarea"
          :rows="3"
          show-word-limit
          resize="none"
          placeholder="请输入请假原因"
        />
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
/**
 * allDance create by Administrator
 * createTime 2020/09/08 16:33
 */
import formValidate from '@/utils/rules'

export default {
  name: 'AllDance',
  components: {},
  filters: {},
  mixins: [],
  props: {
    options: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      danceOptions: [{ label: '到园', value: 'IN_SCHOOL' },
        { label: '缺勤', value: 'ABSENT_FROM_WORK' },
        { label: '请假', value: 'ASK_FOR_LEAVE' }],
      form: {
        statusId: null,
        details: null,
        stuNames: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    for (let i = 0; i < this.options.length; i++) {
      this.form.stuNames.push(
        this.options[i].value
      )
    }
    // console.log(this.form.stuNames)
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.allDance-wrap {

}
</style>
