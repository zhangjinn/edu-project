<template>
  <div class="editClass-wrap">
    <etm-title
      :show-title="false"
      border
      size="big"
    >
      编辑班级
      <template slot="tool">
        <template>
          <el-button
            plain
            size="mini"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            plain
            size="mini"
            @click="save"
          >
            保存
          </el-button>
        </template>
      </template>
    </etm-title>
    <etm-form
      ref="form"
      type="dialog"
      :model="classDetail"
    >
      <el-form-item
        label="班级名称"
        prop="name"
        :rules="editFormRules.className"
      >
        <el-input v-model="classDetail.name" />
      </el-form-item>
      <el-form-item
        label="班级容量"
        prop="capacity"
        :rules="editFormRules.capacity"
      >
        <el-input
          v-model.number="classDetail.capacity"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="班级类型"
        prop="typeName"
        :rules="editFormRules.typeName"
      >
        <el-select
          v-model="classDetail.typeName"
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
          placeholder="最多输入20个字"
          maxlength="20"
          type="textarea"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'

/**
 * editClass create by Administrator
 * createTime 2020/12/8 13:47
 */
export default {
  name: 'EditClass',
  components: {},
  filters: {},
  mixins: [],
  props: {
    classDetail: {
      type: Object,
      default: () => {
        return {
          name: '',
          capacity: '',
          typeName: ''
        }
      }
    },
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
      editFormRules: {
        className: [
          { required: true, message: '班级名称不能为空', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '班级容量不能为空', trigger: 'blur' }
        ]
      },
      typeList: [
        {
          id: 1,
          name: '托育'
        },
        {
          id: 2,
          name: '早教'
        },
        {
          id: 3,
          name: '普通班'
        },
        {
          id: 4,
          name: '特色班'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
    },
    cancel () {
      this.$emit('editCancel', false)
    },
    save () {
      this.$refs.form.$children[0].validate(valid => {
        if (!valid) {

        } else {
          this.$emit('editSave', this.classDetail.id)
        }
      })
    },
    selectChange (e) {
      console.log(e, 'e')
      for (const clazz of this.clazzTypeList) {
        if (clazz.id === e) {
          console.log(clazz.name)
          this.classDetail.typeName = clazz.name
          this.classDetail.typeId = clazz.id
          console.log(this.classDetail.typeName)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
