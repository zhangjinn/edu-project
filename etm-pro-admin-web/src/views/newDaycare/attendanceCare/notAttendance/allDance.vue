<template>
  <div class="allDance-wrap">
    <etm-form ref="form" :model="form" type="dialog">
      <el-form-item
        label="签到学员"
        prop="stuNames2"
        :rules="formValidate.nullValueRule(true,'请选择签到学员')"
      >
        <el-select v-model="form.stuNames2" multiple placeholder="请选择" @change="changeItem">
          <el-option
            v-for="(item,index) in options"
            :key="item.value"
            :label="item.label"
            :value="index"
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
      showMsg: [],
      form: {
        statusId: null,
        details: null,
        stuNames: [],
        stuNames2: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // for (let i = 0; i < this.options.length; i++) {
    //   this.form.stuNames.push(
    //     this.options[i].value
    //   )
    // }
    for (let i = 0; i < this.options.length; i++) {
      this.form.stuNames2.push(
        i
      )
      this.form.stuNames.push(
        this.options[i].value
      )
    }
    // console.log(this.form.stuNames)
  },
  mounted() {
  },
  methods: {
    changeItem() {
      // console.log(this.form.stuNames2)
      // for (let i = 0; i < this.stuNames2.length; i++) {
      //   console.log(this.options[this.stuNames2[i]])
      // }
      this.form.stuNames = []
      this.showMsg = []
      this.form.stuNames2.forEach(item => {
        // console.log(this.options[item])
        this.showMsg.push(
          this.options[item]
        )
        this.form.stuNames.push(
          this.options[item].value
        )
      })
      // console.log(this.showMsg)
      // console.log(this.form.stuNames)
      for (let i = 0; i < this.showMsg.length; i++) {
        if (!this.showMsg[i].modify) {
          this.danceOptions = [
            { label: '请假', value: 'ASK_FOR_LEAVE' }
          ]
          return
        } else {
          this.danceOptions = [{ label: '到园', value: 'IN_SCHOOL' },
            { label: '缺勤', value: 'ABSENT_FROM_WORK' },
            { label: '请假', value: 'ASK_FOR_LEAVE' }]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.allDance-wrap {

}
</style>
