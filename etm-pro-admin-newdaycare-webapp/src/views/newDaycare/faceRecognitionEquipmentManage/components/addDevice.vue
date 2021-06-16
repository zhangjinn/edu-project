<template>
  <div class="addDevice-wrap">
    <etm-form
      ref="add"
      :model="addForm"
      type="dialog"
    >
      <el-form-item
        label="品牌"
        prop="brand"
        :rules="addRules.brand"
      >
        <el-select v-model="addForm.brand">
          <el-option
            v-for="(item) in brandOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        class="device-item"
        label="型号"
        prop="model"
      >
        <div
          v-for="item in modelList"
          :key="item.model"
          class="item"
          :class="{'isActive' : addForm.model === item.model}"
          @click="switchDevice(item.model,item.temperatureDetection)"
        >
          <img
            :src="item.src"
            style="width: 100%;"
          >
          <span>{{ item.model }}</span>
        </div>
      </el-form-item>
      <el-form-item
        label="体温检测功能"
        prop="temperatureDetection"
      >
        <span>{{ addForm.temperatureDetection === 0 ? '有' : '无' }}</span>
      <!--<span>无</span>-->
      </el-form-item>

      <el-form-item
        label="名称"
        prop="deviceName"
        :rules="addRules.deviceName"
      >
        <el-input
          v-model="addForm.deviceName"
          placeholder="请输入设备名称"
        />
      </el-form-item>

      <el-form-item
        label="序列号(SN)"
        prop="deviceKey"
        :rules="addRules.deviceKey"
      >
        <el-input
          v-model="addForm.deviceKey"
          placeholder="请输入序列号"
        />
      </el-form-item>
      <el-form-item
        label="设备位置"
        prop="position"
      >
        <el-input v-model="addForm.position" />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * addDevice create by Administrator
 * createTime 2021/3/9 10:56
 */
export default {
  name: 'AddDevice',
  components: {},
  filters: {},
  mixins: [],
  props: {
    addForm: {
      type: Object,
      default: () => {
        return {
          deviceName: '',
          temperatureDetection: 0
        }
      }
    }
  },
  data () {
    return {
      brandOption: [
        { label: '宇泛', value: 'UNI_UBI' }
      ],
      modelList: [
        { model: 'M355C1', temperatureDetection: 0, src: require('@/assets/images/system1.png') },
        { model: 'M35DM1', temperatureDetection: 1, src: require('@/assets/images/system2.png') }
      ],
      addRules: {
        brand: [
          { required: true, message: '请选择设备品牌', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceKey: [
          { required: true, message: '请选择序列号', trigger: 'blur' }
        ]
      },
      staffRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
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
    switchDevice (model, temperatureDetection) {
      this.addForm.model = model
      this.addForm.temperatureDetection = temperatureDetection
      console.log(this.addForm)
    }
  }
}
</script>
<style lang="scss" scoped>
  .device-item {
    display: flex;

    .item {
      border: 1px solid #ddd;
      border-radius: 4px;
      display: flex;
      flex-basis: 40%;
      flex-direction: column;
      margin-right: 15px;
      text-align: center;

      &:hover {
        @include etm-bdc; }
    }

    ::v-deep .el-form-item__content {
      display: flex;
      margin-left: 20px !important;
    }

    .isActive {
      @include etm-bdc; }
  }
</style>
