<template>
  <etm-layout-split>
    <div class="setting-wrap">
      <etm-title>晨午检设置</etm-title>
      <etm-form ref="form" :model="form" style="flex:1">
        <el-form-item label="检测模式:">
          <el-radio-group v-model="form.checkMode">
            <el-radio label="ONLY_MORNING_CHECK">仅晨检</el-radio>
            <el-radio label="BOTH_CHECK">晨检+午检</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="晨检时间:">
          <el-time-picker
            v-model="form.startDate"
            is-range
            value-format="HH:mm:ss"
            type="fixed-time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />

        </el-form-item>
        <el-form-item label="午检时间:">
          <el-time-picker
            v-model="form.endDate"
            is-range
            value-format="HH:mm:ss"
            type="fixed-time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />
        </el-form-item>
        <el-form-item label="检测项目:" style="margin-bottom: 0;">
          <el-checkbox-group v-model="checkedList">
            <el-checkbox v-for="(check, index) in checkList" :key="index" :label="check.value">{{ check.label }}</el-checkbox>
          </el-checkbox-group>
          <!--<el-input v-model="itemName" placeholder="输入检查项后回车进行添加" @keyup.enter.native="addItem" />-->
        </el-form-item>
        <!--<el-form-item label="注意:">-->
        <!--  1. 修改时间后, 次日开始生效-->
        <!--</el-form-item>-->

        <!--<el-form-item style="margin-top: 32px;">-->
        <!--  <el-button type="primary" @click="save">保存</el-button>-->
        <!--  <el-button plain style="margin-left: 12px;" @click="cancel">取消</el-button>-->
        <!--</el-form-item>-->
      </etm-form>
      <etm-form-foot @save="save" @cancel="cancel" />
    </div>
  </etm-layout-split>

</template>

<script>
import { addBodyCheckItem, queryBodyCheckItems, queryBodyCheckSettings, updateBodyCheckSettings } from '@/api/bodyCheck'

/**
   *  2020/4/17 10:30
   *  haijinsha
   */
export default {
  name: 'Setting',
  components: { },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      itemName: '',
      checkedList: [],
      form: {
        startData: [],
        endDate: [],
        checkSettingId: '',
        checkMode: '',
        morningCheckStart: '',
        morningCheckEnd: '',
        middleCheckStart: '',
        middleCheckEnd: ''
      },
      rules: {},
      checkList: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryBodyCheckSettings().then(res => {
        this.form = res.data
        this.$set(this.form, 'startDate', [res.data.morningCheckStart, res.data.morningCheckEnd])
        this.$set(this.form, 'endDate', [res.data.middleCheckStart, res.data.middleCheckEnd])
      })
      this.queryItems()
    },
    queryItems() {
      queryBodyCheckItems({ enable: '' }).then(res => {
        this.checkList = res.data.map(item => {
          return {
            label: item.checkProjectName,
            value: item.checkProjectId
          }
        })
        for (const datum of res.data) {
          if (datum.enable) {
            this.checkedList.push(datum.checkProjectId)
          }
        }
      })
    },
    save() {
      const { checkSettingId, checkMode } = this.form
      const [morningCheckStart, morningCheckEnd] = this.form.startDate
      const [middleCheckStart, middleCheckEnd] = this.form.endDate
      updateBodyCheckSettings({
        checkSettingId,
        checkMode,
        morningCheckStart,
        morningCheckEnd,
        middleCheckStart,
        middleCheckEnd,
        enabledCheckProjects: this.checkedList
      }).then(res => {
        console.log(res)
        this.$message.success('更新成功')
        this.cancel()
      })
    },
    cancel() {
      this.$emit('jump', 'bodyCheck')
    },
    addItem() {
      addBodyCheckItem({ checkProjectName: this.itemName, enable: false }).then(res => {
        this.itemName = ''
        this.queryItems()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .setting-wrap {
    /*height: calc(100% - 56px);*/
    /*height: 100%;*/
    /*overflow: auto;*/
    /*background-color: #fff;*/
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & /deep/ .el-date-editor {
      /*width: 200px;*/
    }
    & /deep/ .el-form-item__content {
      /*max-width: 500px;*/
      .el-checkbox {
        margin-right: 10px;
        min-width: 75px;
      }
    }
  }
</style>
