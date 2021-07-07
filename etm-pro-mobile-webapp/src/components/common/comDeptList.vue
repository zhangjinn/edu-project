<template>
  <div class="comDeptList">
    <div
      v-for="(item,index) in deptList"
      :key="index"
      class="DeptItem textLeft"
      @click="getNextLevelOrganization(item)"
    >
      <van-row type="flex" justify="space-between">
        <van-col span="15">
          <div class="deptCard">
            <span class="van-ellipsis deptName left">{{ item.name }} </span>
            <span class="deptNum left">({{ item.employeeCount }})</span>
          </div>
        </van-col>
        <van-col span="3" class="icon textRight">
          <span class="iconfont iconright" />
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ComDeptList',
  props: {
    deptList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    // 获取下级组织
    getNextLevelOrganization(data) {
      const organization = {
        name: data.name,
        id: data.id
      }
      this.$emit('nextOrganization', organization)
    }
  }
}
</script>

<style lang="scss" scoped>

    .comDeptList {
        padding: 0 12px;

        .DeptItem {
            font-size: 15px;
            line-height: 50px;

            &:not(:last-child) {
                border-bottom: .5px solid $text-e;
            }

            .deptCard {
                .deptName {
                    max-width: 150px;
                }
            }

            .icon {
                line-height: 48px;

                .iconright {
                    font-size: 12px;
                    color: $text-b;
                }
            }
        }
    }
</style>
