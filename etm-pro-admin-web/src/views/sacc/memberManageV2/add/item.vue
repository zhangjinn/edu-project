<template>
  <div class="item">
    <el-form v-for="(item, index) in belongings" :key="index" label-width="300px">
      <el-form-item :label="$t('memberManage.itemFormLabelItem') + ':'">
        <div class="items">
          <el-select v-model="item.type" :placeholder="$t('memberManage.itemFormItemTypePlaceHolderText')">
            <el-option label="无" value="" />
            <el-option :label="$t('memberManage.itemFormLabelConsumable')" value="CONSUMABLE" />
            <el-option :label="$t('memberManage.itemFormLabelNonConsumable')" value="NON_CONSUMABLE" />
          </el-select>
          <el-input v-model="item.name" style="width: 368px;" :placeholder="$t('memberManage.itemFormItemNamePlaceHolderText')" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.itemFormLabelQuantity') + ':'">
        <div class="quantity">
          <el-input-number v-model="item.num" :min="1" :label="$t('memberManage.itemFormLabelQuantity')" />
          <span :class="index === 0 ? '' : 'delete'" @click.stop="handleItems(index)">
            <i :class="index === 0 ? 'el-icon-plus' : 'el-icon-minus'" />
            {{ index === 0 ? $t('memberManage.itemFormAddItemBtnText') : $t('memberManage.itemFormDeleteItemBtnText') }}
          </span>
        </div>
      </el-form-item>
      <div class="border" />
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    modify: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      belongings: [
        {
          type: '',
          name: '',
          num: 1
        }
      ]
    }
  },
  watch: {
    belongings: {
      handler(v) {
        const lastItem = v[v.length - 1]
        if (lastItem.name && lastItem.type) {
          this.$store.commit('memberManageV2/SET_ITEM', true)
        } else if (!lastItem.name && !lastItem.type) {
          if (v.length === 1) {
            this.$store.commit('memberManageV2/SET_ITEM', true)
          } else {
            this.$store.commit('memberManageV2/SET_ITEM', false)
          }
        } else {
          this.$store.commit('memberManageV2/SET_ITEM', false)
        }
      },
      deep: true
    },
    modify: {
      handler(v) {
        if (this.$store.state.memberManageV2.method === 'modify') {
          if (v.length) {
            this.belongings = v
          } else {
            this.belongings = [
              {
                type: '',
                name: '',
                num: 1
              }
            ]
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleItems(index) {
      if (index) {
        this.belongings.splice(index, 1)
      } else {
        const lastOne = this.belongings[this.belongings.length - 1]
        if (lastOne.name && lastOne.type) {
          this.belongings.push({
            type: '',
            name: '',
            num: 1
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('memberManage.completeItemInfoTip')
          })
        }
      }
    },
    validate() {
      // 用户无操作，初始的默认状态下可以通过验证
      if (this.belongings.length === 1 && this.belongings[0].type === '' && this.belongings[0].name === '') {
        return true
      }

      // 用户有操作，需要验证其输入内容
      for (let i = 0; i < this.belongings.length; i++) {
        const item = this.belongings[i]
        if (item.type && item.name) {
          continue
        } else {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  height: calc(100vh - 234px);
  overflow-y: auto;
  & >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  & >>> .el-form-item {
    margin-bottom: 24px;
  }
  .items {
    font-size: 0;
    & >>> .el-input {
      width: 176px;
      margin-right: 16px;
    }
  }
  & >>> .el-form {
    // border-bottom: 1px solid;
    @include bc_divide_color();
    padding-top: 24px;
    &:first-of-type {
      padding-top: 0;
    }
  }
  .quantity {
    width: 560px;
    & >>> .el-input-number {
      width: 120px;
    }
    & >>> .el-input-number .el-input{
      width: 120px;
    }
    & >>> .el-input-number__decrease {
      top: 1px;
      height: 32px;
      line-height: 32px;
    }
    & >>> .el-input-number__increase {
      top: 1px;
      height: 32px;
      line-height: 32px;
    }
    & >>> .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) {
      @include bc_main_color();
    }
    & >>> .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) {
      @include bc_main_color();
    }
    span {
      cursor: pointer;
      float: right;
      font-size: 14px;
      @include c_main_color();
      &.delete {
        @include c_secondary_color();
      }
    }
  }
  .border {
    width: 640px;
    @include bgc_divide_color();
    margin-left: 244px;
    transform: translateX(-15px);
    height: 1px;
  }
}
</style>
