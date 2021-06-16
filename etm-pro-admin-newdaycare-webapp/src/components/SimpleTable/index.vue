<template>
  <div class="simpleTable">
    <el-table :data="data.data">
      <el-table-column
        v-for="i in data.setting.columns"
        :key="i"
        :prop="data.setting.prop[i-1]"
        :label="data.setting.label[i-1]"
        :width="data.setting.width[i-1]"
        :align="data.setting.align[i-1]"
        :header-align="data.setting.halign[i-1]"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
    @import '../../styles/variables';
    @import '../../styles/mixin';

    .simpleTable {
      .el-table {
        @include bgc_white();

        th {
          border-right: transparent !important;
        }
      }
    }
</style>
