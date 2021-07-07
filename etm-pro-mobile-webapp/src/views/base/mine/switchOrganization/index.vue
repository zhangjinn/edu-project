<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">切换组织</etm-mobile-title>
    <div class="content">
      <van-radio-group v-model="radio" checked-color="#10C2C4">
        <template v-for="(item,index) in list">
          <universal-card
            :key="index"
            :index="index"
            type="organization"
            :icon="item.logo"
            :name="item.name"
            :content="item.role"
            :no-cotent="item.role === '暂无岗位'"
            @click.native="getOrganizationIndexs(index, item.id)"
          >
            <van-radio :name="index" icon-size="0.42667rem" />
          </universal-card>
        </template>
      </van-radio-group>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="switchOrg">
          <control-btn text="保存" type="primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import { getOrganization, removeSolution, setOrganizationId } from '../../../../js/localStore'
import { switchOrganizations } from '../../../../service/base/mine'
import { getOrgMsg } from '../../../../js/organization'
import { getMenuList } from '@/js/menu'
import EtmMobileTitle from '@/components/EtmMobileTitle'

export default {
  name: 'SwitchOrganization',
  components: {
    EtmMobileTitle,
    universalCard,
    controlBtn
  },
  data() {
    return {
      list: [],
      radio: 0,
      organizationId: ''
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.list = getOrganization()
    this.organizationId = getOrgMsg('id')
    this.radio = getOrgMsg('index')
    this.setPosition()
  },
  methods: {
    setPosition() {
      this.list.forEach((item, index) => {
        this.list[index].role = this.setRole(item.positionNameList)
      })
    },
    setRole(data) {
      if (!data || !data.length) return '暂无岗位'
      return data.join('、')
    },
    getOrganizationIndexs(index, id) {
      this.radio = index
      this.organizationId = id
    },
    switchOrg() {
      const param = {
        organizationId: this.organizationId
      }
      switchOrganizations(param).then(() => {
        setOrganizationId(this.organizationId)
        removeSolution()
        this.$store.commit('route/SET_ROUTER', false)
        const flag = this.$store.state.org.orgChange
        this.$store.commit('org/SET_CHANGE', !flag)
        getMenuList()
      })
    },
    reback() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.index-wrap {
  .bottomFixed {
    .bottomBtn {
      bottom: 0;
      background-color: transparent;
    }
  }
}

</style>
