<template>
  <div
    class="placeholderItem-wrap"
    :style="{'background-image': videoItem.openStatus === 'OPEN' && videoItem.onlineStatus ==='UP' ? 'url('+ videoItem.photoUrl +')': 'url('+ require('@/assets/images/noSteam.png')+')'}"
  >
    <el-tag
      class="tag"
      effect="dark"
      :type="videoItem.onlineStatus ==='UP' ? '': 'danger'"
    >
      {{ videoItem.onlineStatus === 'UP' ? '在线' : '离线' }}
    </el-tag>

    <div class="tip">
      <div v-if="videoItem.openStatus === 'OPEN' && videoItem.onlineStatus === 'UP'">
        <i class="iconfont iconplay-circle" />
      </div>
      <div v-else-if="videoItem.openStatus === 'NOT_OPEN' && videoItem.onlineStatus === 'UP'">
        <i class="iconfont iconweidaoshijian" />
        <p>未到开放时间</p>
      </div>
      <div v-else-if="videoItem.onlineStatus === 'DOWN'">
        <i class="iconfont iconwuxian" />
        <p>摄像头处于离线状态<br>请检查电源或网络是否已连接</p>
      </div>
    </div>

    <div class="bottom">
      <span>{{ videoItem.cameraName }}</span>
      <el-dropdown @command="$emit('deauthorize', videoItem)">
        <span class="el-dropdown-link">
          ...
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>取消授权</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
/**
 * placeholderItem create by zhangbanxian
 * createTime 2020/10/22 14:44
 */
export default {
  name: 'PlaceholderItem',
  props: {
    videoItem: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.placeholderItem-wrap {
  background-color: #77839f;
  background-position: 0 bottom;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 4px;
  position: relative;

  .tag {
    left: 5px;
    position: absolute;
    top: 5px;
    z-index: 1;
  }

  .bottom {
    bottom: -30px;
    display: flex;
    height: 20px;
    justify-content: space-between;
    position: absolute;
    width: 100%;
  }

  .tip {
    @include c_white();
    font-size: 12px;
    left: 50%;
    position: absolute;
    text-align: center;
    top: 50%;
    transform: translate(-50%, -55%);
    width: 100%;

    i {
      font-size: 40px;
      width: auto;
    }
  }
}
</style>
