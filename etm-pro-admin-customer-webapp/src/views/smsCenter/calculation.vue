<template>
  <div class="key-container">
    <div class="input-box">
      <el-input
        v-model="phone"
        clearable
        placeholder="请输入电话号码"
      />
    </div>
    <div class="keyboard">
      <el-row>
        <el-col
          v-for="(item,index) in buttons"
          :key="index"
          :span="8"
        >
          <div
            class="cellBox"
            :data-num="item"
            @click="traceNumber(item)"
          >
            <div
              class="key-cell"
              :class="{'activeBg':item===active}"
            />
            <div
              class="key-cell key-text"
              :class="{'activeC':item===active}"
            >
              {{ item }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="keyControl">
      <el-row>
        <el-col :span="16">
          <div
            class="key-cell confirm"
            data-num="S"
            @click="handleConfirm"
          >
            <el-button
              type="primary"
              class="confirmInner"
            >
              <i class="iconfont iconphone" />
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="key-cell delete"
            data-num="D"
            @click="handleDelete"
          >
            <el-button
              type="info"
              class="clearInner"
            >
              <i class="iconfont iconclose" />
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calculation',
  data () {
    return {
      active: '',
      phone: '',
      buttons: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#']
    }
  },
  methods: {

    // 处理按键
    traceNumber (val) {
      const S = this.phone
      this.phone = S + val
      this.active = val
    },
    handleConfirm () {
      const S = this.phone
      // 未输入
      if (!S.length) {
        this.$message.error('请输入电话号码')
        return false
      }
      this.$emit('confirm', S)
    },
    handleDelete () {
      const S = this.phone
      // 如果没有输入，直接返回
      if (!S.length) return false
      // 否则删除最后一个
      this.phone = S.substring(0, S.length - 1)
    }
  }
}
</script>

<style scoped lang="scss">
  .key-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .input-box {
    width: 100%;

    ::v-deep.el-input--small .el-input__inner {
      font-size: 26px;
      height: 62px;
      line-height: 62px;

      &::placeholder {
        font-size: 26px;
      }
    }
  }

  .keyboard {
    margin: 16px 0;
    width: 100%;

    .cellBox {
      position: relative;
    }

    .key-cell {
      border-radius: 24px;
      color: #656565;
      cursor: pointer;
      font-size: 26px;
      height: 48px;
      line-height: 48px;
      position: relative;
      text-align: center;
    }

    .key-text {
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .activeC {
      @include etm-color();
    }

    .activeBg {
      @include etm-bgc();
      opacity: 0.2;
    }
  }

  .keyControl {
    width: 100%;

    .delete {
      padding-left: 8px;

      .clearInner {
        align-items: center;
        background: #cbcbcb;
        border-radius: 24px;
        color: $white;
        cursor: pointer;
        display: flex;
        height: 50px;
        justify-content: center;
        width: 100%;

        .iconfont {
          font-size: 24px;
        }
      }
    }

    .confirm {
      flex: 2;
      padding-right: 8px;

      .confirmInner {
        align-items: center;
        border-radius: 24px;
        cursor: pointer;
        display: flex;
        height: 50px;
        justify-content: center;
        width: 100%;

        .iconfont {
          font-size: 24px;
          transform: rotateY(180deg);
        }
      }
    }
  }

</style>
