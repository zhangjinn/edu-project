<template>
  <div class="addClass-wrap">
    <etm-form
      ref="form"
      type="dialog"
      :model="classDetail"
    >
      <el-form-item
        label="班级名称"
        prop="name"
        :rules="addRules.className"
      >
        <el-input v-model="classDetail.name" />
      </el-form-item>
      <el-form-item
        label="班级容量"
        prop="capacity"
        :rules="addRules.capacity"
      >
        <el-input
          v-model="classDetail.capacity"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="班级类型"
        prop="id"
        :rules="addRules.typeName"
      >
        <el-select
          v-model="classDetail.id"
          style="width: 100%;"
          @change="selectChange"
        >
          <el-option
            v-for="(item, index) in clazzTypeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="classDetail.remark"
          type="textarea"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * addClass create by Administrator
 * createTime 2020/12/8 13:48
 */
import formValidate from '@/utils/rules'

export default {
  name: 'AddClass',
  components: {},
  filters: {},
  mixins: [],
  props: {
    clazzTypeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      formValidate,
      classDetail: {},
      typeList: [],
      addRules: {
        className: [
          { required: true, message: '班级名称不能为空', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '班级容量不能为空', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    selectChange (e) {
      for (const clazz of this.clazzTypeList) {
        if (clazz.id === e) {
          this.classDetail.typeName = clazz.name
        }
      }
      console.log(this.classDetail.typeName, 'name')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
