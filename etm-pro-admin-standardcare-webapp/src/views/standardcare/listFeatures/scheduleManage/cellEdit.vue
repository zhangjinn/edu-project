<template>
  <div>
    <etm-form
      ref="form"
      :model="form"
      type="dialog"
    >
      <el-form-item
        v-if="type!=='batchAdd'"
        label="日程时段"
      >
        <span>
          {{ labelName }}
        </span>
      </el-form-item>

      <el-form-item
        v-else
        label="日程时段"
        prop="timePeriod"
        :rules="formValidate.nullValueRule(true,'请选择日程时段')"
      >
        <el-select
          v-model="form.timePeriod"
          placeholder="请选择日程时段"
        >
          <el-option
            v-for="item in timePeriodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="日程类目"
        prop="subject"
        :rules="formValidate.nullValueRule(true,'请选择日程类目')"
      >
        <el-select
          v-model="form.subject"
          placeholder="请选择日程类目"
          @change="changeSubject"
        >
          <el-option
            v-for="item in subjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="type==='batchAdd'"
        prop="repeatDay"
        label="重复日"
        :rules="formValidate.nullValueRule(true,'请选择重复日',['blur', 'change'],'array')"
      >
        <etm-screen-tab
          v-model="form.repeatDay"
          :options="checkList"
          multiple
          :disabled="type==='edit'"
        />
      </el-form-item>
      <el-form-item
        label="设置颜色"
        prop="color"
        :rules="formValidate.nullValueRule(true,'请选择设置颜色')"
      >
        <etm-color v-model="form.color" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import etmColor from '@/components/etmColor.vue'
import {
  // queryScheduleIntervalList,
  queryScheduleCategoryList
} from '@/api/standardcare/listFeatures/scheduleManage'

export default {
  name: 'Edit',
  components: {
    etmColor
  },
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator (val) {
        return ['add', 'batchAdd', 'edit'].includes(val)
      }
    },
    labelId: {
      type: Number,
      default: 0
    },
    labelName: {
      type: String,
      default: ''
    },
    cellList: {
      type: Object,
      default () {
        return {}
      }
    },
    timePeriodOptions: {
      type: Array,
      default: function () {
        return []
      }
    }

  },
  data () {
    return {
      formValidate,
      form: {
        timePeriod: '',
        subject: '',
        subjectName: '',
        repeatDay: [],
        color: ''

      },
      // timePeriodOptions: [],
      subjectOptions: [],

      checkList: [
        {
          name: '星期一',
          value: 'MONDAY'
        },
        {
          name: '星期二',
          value: 'TUESDAY'
        },
        {
          name: '星期三',
          value: 'WEDNESDAY'
        },
        {
          name: '星期四',
          value: 'THURSDAY'
        },
        {
          name: '星期五',
          value: 'FRIDAY'
        },
        {
          name: '星期六',
          value: 'SATURDAY'
        },
        {
          name: '星期日',
          value: 'SUNDAY'
        }
      ]

    }
  },

  created () {
    this.init()
  },

  methods: {
    async init () {
      // if (this.type === 'batchAdd') {
      //   // 获取时段
      //   await queryScheduleIntervalList().then((res) => {
      //     this.timePeriodOptions = []
      //     res.data.map(item => {
      //       this.timePeriodOptions.push(
      //         {
      //           label: item.startTime + '~' + item.endTime,
      //           value: item.id
      //         }
      //       )
      //     })
      //   })
      // }

      // 获取类目
      await queryScheduleCategoryList().then(res => {
        this.subjectOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })

      if (this.type === 'edit') {
        this.detail()
      }
    },
    changeSubject (v) {
      this.subjectOptions.map((val, index) => {
        if (v === val.id) {
          this.form.subjectName = val.name
        }
      })
    },
    // 修改回显
    detail () {
      this.form.timePeriod = this.labelId
      this.form.subject = this.cellList.scheduleTypeId
      this.form.subjectName = this.cellList.scheduleType
      this.form.repeatDay = []
      this.form.color = this.cellList.bgcolor
    }

  }
}
</script>

<style scoped lang="scss">

  .clazz {
    display: flex;

    .el-form-item {
      flex: 1;
    }
  }

</style>
