<template>
  <div class="solutions-wrapper">
    <div
      v-for="(row, index) in solutions"
      :key="index"
      class="row"
    >
      <div v-for="(sol, solIndex) in row" :key="solIndex" class="sol">
        <div class="avatar">
          <img :src="sol.avatar" width="46px" height="46px" alt="">
        </div>
        <div class="content">
          <div class="title">
            <div class="name">
              {{ sol.name }}
            </div>
            <div class="state">
              {{ sol.state }}
            </div>
          </div>
          <div class="desc">
            {{ sol.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SolutionItem',
  props: {
    solutions: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.solutions-wrapper {
  background: url("../../assets/images/solutions/background.png") no-repeat top right;
  background-clip: border-box;
  padding: 24px;
  .row {
    display: flex;
    align-items: center;
    justify-content: left;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .sol {
      width: 216px;
      display: flex;
      align-items: start;
      .avatar {
        width: 46px;
        height: 46px;
      }
      .content {
        padding-left: 12px;
        padding-top: 7px;
        .title {
          height: 14px;
          line-height: 14px;
          margin-bottom: 10px;
          .name {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: #555555;
            display: inline-block;
            margin-right: 6px;
          }
          .state {
            line-height: 14px;
            display: inline-block;
            height: 14px;
            font-size: 12px;
            font-family: arial, sans-serif;
            font-weight: 400;
            color: #FF2030;
          }
        }
        .desc {
          line-height: 12px;
          font-size: 12px;
          color: #A0A0A0;
        }
      }
    }
  }
}

</style>
