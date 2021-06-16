<template>
  <div class="tabs-wrap">
    <etm-layout-split>
      <etm-tabs>
        <el-tab-pane label="测试1">测试1</el-tab-pane>
        <el-tab-pane label="测试2">测试2</el-tab-pane>
        <el-tab-pane label="测试3">测试3</el-tab-pane>
      </etm-tabs>

      <etm-tabs :show-toggle="false" tab-position="left">
        <el-tab-pane label="测试1">show-toggle = false</el-tab-pane>
        <el-tab-pane label="测试2测试2测试2">
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
            <li>8</li>
            <li>9</li>
            <li>10</li>
            <li>11</li>
            <li>12</li>
            <li>13</li>
            <li>14</li>
            <li>15</li>
            <li>16</li>
            <li>17</li>
            <li>18</li>
            <li>19</li>
            <li>20</li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="测试3">测试3</el-tab-pane>
      </etm-tabs>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * tabs create by haijinsha
 * createTime 2020/8/20 18:37
 */
export default {
  name: 'Tabs',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .tabs-wrap {
    background-color: #fff;
    padding-bottom: 16px;

  }
</style>
