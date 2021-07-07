<template>
  <div class="EtmCard-wrap">
    <div v-if="type === 'department'" class="department">
      <div class="dep-info">
        <span>{{ data.name }}</span>
        <span>（{{ data.employeeCount }}人）</span>
      </div>
      <div class="next" @click="$emit('next', data)">下级</div>
    </div>
    <div v-if="type === 'user'" class="user">
      <div class="user-avatar">{{ name2avatar(data.name) }}</div>
      <div class="user-info">
        <div class="user-name-role">
          <span class="name">{{ data.name }}</span>
          <span v-for="(role, index) of data.roleNames" :key="index" class="rule">{{ role }}</span>
        </div>
        <div class="user-position">
          <span v-for="(post,index) of data.positionNames" :key="index">
            <span v-if="index !== 0">/</span>{{ post }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   *  2020/4/7 16:58
   *  haijinsha
   */
export default {
  name: 'EtmCard',
  filters: {},
  mixins: [],
  props: {
    type: {
      type: String,
      required: true,
      default: 'department',
      validator(val) {
        return ['department', 'user'].includes(val)
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    name2avatar(val) {
      return val.slice(val.length - 2, val.length)
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmCard-wrap {
    padding: 0 ;

    .department {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $divide-color;

      .dep-info {

        color: $text-color;
      }

      .next {
        //color: $main-color;
        @include c-main_color();

        cursor: pointer;
      }
    }

    .user {
      display: flex;
      align-items: center;
      height: 75px;

      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        width: 40px;
        min-width: 40px;
        height: 40px;
        color: $white;
        font-size: 14px;
        @include bgc_main_color();
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
      }

      .user-info {
        .user-name-role {
          .name {
            margin-right: 5px;
          }

          .rule {
            display: inline-block;
            padding: 2px 4px;
            border: 1px solid;
            @include bc_main_color();
            margin-right: 8px;
            //color: $main-color;
            @include c-main_color();
            font-size: 12px;
          }

        }

        .user-position {
          margin-top: 10px;
          font-size: 12px;
          color: $secondary-color;
        }
      }
    }
  }
</style>
