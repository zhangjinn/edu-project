<template>
  <div class="page-collapse">
    <etm-title
      :border="true"
      show-toggle
      size="big"
      open-text="全部展开"
      close-text="全部折叠"
      @toggle="toggle"
    >
      班级设置
    </etm-title>
    <el-collapse
      v-if="listArray.length>0"
      v-model="activeNames"
    >
      <div
        v-for="(list, index) in listArray"
        :key="index"
      >
        <el-collapse-item
          :name="index"
        >
          <template slot="title">
            <div class="titleBox">
              <div class="left">
                <el-checkbox
                  v-model="list.checkAll"
                  :indeterminate="list.isIndeterminate"
                  @change="handleCheckAllChange($event,index)"
                >
                  {{ list.type }}
                </el-checkbox>
                <span class="checkNum"><span class="checkedClazzLength">{{ list.checkedClazz.length }}</span>/{{ list.clazzList.length }}</span>
              </div>
            </div>
          </template>
          <el-checkbox-group
            v-model="list.checkedClazz"
            @change="handleCheckedClazzChange($event,index)"
          >
            <el-checkbox
              v-for="(clazz,i) in list.clazzList"
              :key="i"
              :label="clazz.id"
            >
              {{ clazz.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>
<script>
import {
  queryCareClazzList
} from '@/api/standardcare/clazzScheduleCare'
export default {
  data () {
    return {
      activeNames: [],
      listArray: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    allUnfold (type) {
      this.activeNames = []
      if (type) {
        for (let i = 0; i < this.listArray.length; i++) {
          this.activeNames.push(i)
        }
      }
    },
    newItemUnfold () {
      this.activeNames.push(this.listArray.length - 1)
    },
    getData () {
      queryCareClazzList().then(res => {
        const { data } = res
        this.listArray = []
        data.forEach((item, index) => {
          this.listArray.push({
            type: item.type,
            checkAll: false,
            checkedClazz: [],
            clazzList: [],
            isIndeterminate: true
          })
          item.clazzList.forEach((child, i) => {
            this.listArray[index].clazzList.push({
              id: child.id,
              name: child.name,
              enable: child.enable
            })
            if (child.enable) {
              this.listArray[index].checkedClazz.push(child.id)
            }
          })
          const checkedClazz = this.listArray[index].checkedClazz
          this.handleCheckedClazzChange(checkedClazz, index)
        })

        this.allUnfold(true)
      }).catch(err => {
        console.log(err)
      })
    },
    toggle (t) {
      this.allUnfold(t)
    },
    handleCheckAllChange (val, index) {
      if (val) {
        const clazzList = this.listArray[index].clazzList.map((item) => {
          return item.id
        })
        this.listArray[index].checkedClazz = clazzList
      } else {
        this.listArray[index].checkedClazz = []
      }
      this.listArray[index].isIndeterminate = false
    },
    handleCheckedClazzChange (value, index) {
      const checkedCount = value.length
      this.listArray[index].checkAll = checkedCount === this.listArray[index].clazzList.length
      this.listArray[index].isIndeterminate = checkedCount > 0 && checkedCount < this.listArray[index].clazzList.length
    }

  }
}
</script>

<style scoped lang="scss">

.page-collapse,
.el-tabs.el-tabs--left .page-collapse {
  width: 564px;

  .titleBox {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .categoryType {
      margin-left: 8px;
    }

    .checkNum {
      padding-left: 8px;
    }

    .checkedClazzLength {
      @include etm-color();
    }
  }

  ::v-deep .el-collapse {
    border-bottom-color: transparent;
    border-top-color: transparent;

    .is-active {
      background-color: transparent;
    }

    .el-collapse-item__header {
      border-bottom-color: $divide-color;

    }

    .el-collapse-item__header.is-active {
      border-bottom-color: $divide-color;

    }

    .el-collapse-item:last-child {
      margin-bottom: 0;
    }

    .el-collapse-item__wrap {
      border: 0;
      padding-top: 10px !important;
    }

    .el-icon-arrow-right::before {
      content: '\E6DF';
    }

    .el-collapse-item__arrow.is-active {
      transform: rotate(180deg);
      //transform: rotate(180deg);
    }

    .el-collapse-item__content {
      padding-bottom: 0;

    }

    .el-checkbox-group {
      display: flex;
      flex-direction: column;

      .el-checkbox {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
