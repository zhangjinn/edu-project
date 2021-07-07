<template>
  <div class="food">
    <el-form v-for="(food, index) in dietInfos" :key="index" label-width="300px">
      <el-form-item :label="$t('memberManage.foodFormLabelFoodName') + ':'">
        <div class="foodname">
          <el-input v-model="food.foodName" style="width: 176px;" :placeholder="$t('memberManage.foodFormFoodNamePlaceHolderText')" />
          <span :class="index === 0 ? '' : 'delete'" @click.stop="handleFoodList(index)">
            <i :class="index === 0 ? 'el-icon-plus' : 'el-icon-minus'" />
            {{ index === 0 ? $t('memberManage.foodFormAddFoodBtnText') : $t('memberManage.foodFormDeleteFoodBtnText') }}
          </span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.foodFormLabelFoodDescription') + ':'">
        <el-input v-model="food.description" style="width: 560px;" :placeholder="$t('memberManage.foodFormFoodDescriptionPlaceHolderText')" type="textarea" />
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
      dietInfos: [
        {
          foodName: '',
          description: ''
        }
      ]
    }
  },
  watch: {
    dietInfos: {
      handler(v) {
        const lastItem = v[v.length - 1]
        if (lastItem.foodName && lastItem.description) {
          this.$store.commit('memberManageV2/SET_FOOD', true)
        } else if (!lastItem.foodName && !lastItem.description) {
          if (v.length === 1) {
            this.$store.commit('memberManageV2/SET_FOOD', true)
          } else {
            this.$store.commit('memberManageV2/SET_FOOD', false)
          }
        } else {
          this.$store.commit('memberManageV2/SET_FOOD', false)
        }
      },
      deep: true
    },
    modify: {
      handler(v) {
        if (this.$store.state.memberManageV2.method === 'modify') {
          if (v.length) {
            this.dietInfos = v
          } else {
            this.dietInfos = [
              {
                foodName: '',
                description: ''
              }
            ]
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleFoodList(index) {
      if (index) {
        this.dietInfos.splice(index, 1)
      } else {
        const lastOne = this.dietInfos[this.dietInfos.length - 1]
        if (lastOne.foodName && lastOne.description) {
          this.dietInfos.push({
            foodName: '',
            description: ''
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('memberManage.completeFoodInfoTip')
          })
        }
      }
    },
    validate() {
      // 用户无操作，初始的默认状态下可以通过验证
      if (this.dietInfos.length === 1 && this.dietInfos[0].foodName === '' && this.dietInfos[0].description === '') {
        return true
      }

      // 用户有操作，需要验证其输入内容
      for (let i = 0; i < this.dietInfos.length; i++) {
        const item = this.dietInfos[i]
        if (item.foodName && item.description) {
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
.food {
  height: calc(100vh - 234px);
  overflow-y: auto;
  & >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  & >>> .el-form-item {
    margin-bottom: 24px;
  }
  & >>> .el-form {
    // border-bottom: 1px solid;
    @include bc_divide_color();
    padding-top: 24px;
    &:first-of-type {
      padding-top: 0;
    }
  }
  .foodname {
    width: 560px;
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
  & >>> .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>
