<template>
  <div class="list-content">
    <div class="title">
      <span class="settingTitle">{{ titleText[settingState] }}</span>
      <el-button v-show="settingState !== 'time'" type="primary" @click.stop="handlePopOpen">{{ addBtnText[settingState] || '' }}</el-button>
    </div>
    <div class="table">
      <time-table />
    </div>
    <etm-pop
      :visible="pop"
      pop="simple"
      :title="addBtnText[settingState] || '新增'"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form :model="form" type="dialog">
        <el-form-item label="所属班级：">
          <el-select placeholder="请选择所属班级">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标时间：">
          <el-select placeholder="请选择目标时间">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import etmPop from '@/layout/main/EtmPop'
import timeTable from './timeTable'
export default {
  components: {
    etmPop,
    timeTable
  },
  data() {
    const _this = this
    return {
      loading: false,
      pop: false,
      titleText: {
        time: _this.$t('schedule.scheduelTimeTitle'),
        type: _this.$t('schedule.formLabelScheduleType'),
        content: '日程内容'
      },
      addBtnText: {
        type: '新增类型',
        content: '新增内容'
      },
      form: {
      }
    }
  },
  computed: {
    settingState() {
      return this.$store.state.schedule.settingState
    }
  },
  methods: {
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
    },
    handlePopConfirm() {
      this.handlePopClose()
    },
    handlePopCancel() {
      this.handlePopClose()
    }
  }
}
</script>

<style scoped lang="scss">
.list-content {
  width: 100%;
  height: 100%;
  /*padding: 16px 24px 0;*/
  /*border-radius: 4px;*/
  //@include bgc_white();
  font-family: "Microsoft YaHei", sans-serif;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    .el-button {
      span {
        font-weight: 400;
      }
    }
    span.settingTitle {
      display: inline-block;
      font-size: 14px;
      @include c_text_color();
    }
  }
  .table {
    margin-top: 16px;
    .el-button {
      span {
        &:hover {
          @include c_main_color();
        }
      }
    }
    .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
      padding-left: 20px!important;
    }
    .el-table {
      .el-table__body-wrapper {
        tr {
          cursor: move;
          &.filtered {
            cursor: default;
          }
        }
      }
    }
  }
  .el-radio-group {
    .el-radio {
      margin-right: 5px;
    }
    .el-radio__label {
      padding-left: 5px;
    }
  }
}
</style>
