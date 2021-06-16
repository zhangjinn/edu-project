<template>
  <div class="audition-wrap">
    <etm-pop
      :title="title"
      pop="complex"
      :visible="isShow"
      cancel-btn="取消"
      @cancel="close"
      @close="close"
      @confirm="confirm"
    >
      <etm-form
        ref="form"
        :model="form"
        type="dialog"
      >
        <el-form-item label="预约试听">
          <div
            v-for="(item, index) in form.list"
            :key="index"
            class="auditionItem"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item
                  :prop="`list.${index}.datetime`"
                  :rules="formValidate.nullValueRule(true,'请选择日期')"
                >
                  <el-date-picker
                    v-model="form.list[index].datetime"
                    type="datetime"
                    :clearable="false"
                    placeholder="选择日期"
                    @change="datePicker($event, index)"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="9"
                :offset="1"
              >
                <el-form-item
                  :prop="`list.${index}.clazzId`"
                  :rules="formValidate.nullValueRule(true,'请选择班级')"
                >
                  <el-select
                    v-model="form.list[index].clazzId"
                    @change="selectChange($event, index)"
                  >
                    <el-option
                      v-for="(i,k) in item.clazz"
                      :key="k"
                      :label="`${i.caeClazzName || ''} ${i.headTeacherName || ''}`"
                      :value="i.caeClazzId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                :offset="1"
              >
                <i
                  v-if="index === 0"
                  class="el-icon-plus"
                  @click="plus"
                />
                <i
                  v-else
                  class="el-icon-minus"
                  @click="reduce(index)"
                />
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
/**
 * aboutCourse create by Administrator
 * createTime 2020/9/28 16:05
 */
import {
  queryClazzLists
} from '@/api/newDaycare/childManage'
import { parseTime } from '@/utils'
// import { deepClone } from '@/views/daycare/contract/common'
import formValidate from '@/utils/rules'

export default {
  name: 'AboutCourse',
  components: {},
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default () {
        return {
          // childId
          // type
          // classType
          // childName
        }
      }
    }
  },
  data () {
    return {
      formValidate,
      title: '',
      isShow: false,
      allClazz: [],
      startTime: '',
      form: {
        list: [{
          datetime: '',
          clazzId: null,
          clazz: []
        }]
      }
    }
  },
  computed: {},
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler (n) {
        if (n.childId) {
          this.argument = n
          this.title = '托育试听' + ` (${this.prop.childName || ''})`
          this.init()
        }
      }
    }
  },
  created () {

  },
  mounted () {
  },
  methods: {
    selectChange (e, index) {
      this.form.list[index].clazz.forEach(cur => {
        if (cur.caeClazzId === e) {
          this.form.list[index].headTeacher = cur.headTeacherName
          this.form.list[index].courseName = cur.caeClazzName
        }
      })
    },
    datePicker (e, index) {
      if (e.getTime() < this.startTime) {
        this.$message.warning('不能选择之前的时间')
        this.form.list[index].datetime = ''
        return
      }

      if (this.form.list.some((cur, key) => {
        return key === index ? false : (parseTime(e, '{y}-{m}-{d}') === parseTime(cur.datetime, '{y}-{m}-{d}'))
      })) {
        this.$message.warning('不能选择重复的日期')
        this.form.list[index].datetime = ''
        return
      }

      this.getClazz(parseTime(e, '{y}-{m}-{d} {h}:{i}:{s}')).then(res => {
        if (!res.some(cur => {
          return this.form.list[index].clazzId === cur.caeClazzId
        })) {
          this.form.list[index].clazzId = null
        }
        this.form.list[index].clazz = res
      })
    },
    getClazz (time = null) {
      return new Promise((resolve) => {
        queryClazzLists({
          datetime: time
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    plus () {
      this.form.list.push({
        datetime: '',
        clazzId: null,
        clazz: this.allClazz
      })
    },
    reduce (index) {
      this.form.list.splice(index, 1)
    },
    init () {
      let current = new Date()
      current = new Date(parseTime(current, '{y}-{m}-{d} 00:00:00'))
      this.startTime = current.getTime()

      this.getClazz().then(res => {
        this.allClazz = res
        this.form.list[0].clazz = res
      })
    },
    close () {
      this.isShow = false
      this.form = {
        list: [{
          datetime: '',
          clazzId: null,
          clazz: []
        }]
      }
      this.$refs.form.$children[0].resetFields()
    },
    reset () {

    },
    show () {
      this.isShow = true
    },
    confirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          this.$emit('getIds', {
            ids: this.form.list.map(cur => {
              return {
                headTeacher: cur.headTeacher,
                courseName: cur.courseName,
                clazzId: cur.clazzId,
                datetime: parseTime(cur.datetime, '{y}-{m}-{d} {h}:{i}:{s}')
              }
            }),
            classType: this.prop.classType,
            id: this.prop.childId,
            type: this.prop.type
          })
          this.close()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

::v-deep {
  .el-date-editor.el-input.el-input--small.el-input--prefix.el-input--suffix.el-date-editor--datetime {
    width: 100%;
  }
}

.auditionItem {
  margin-bottom: 16px;

  i {
    @include etm-color();

    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
  }

  .el-icon-minus {
    color: #f00;
  }
}

</style>
