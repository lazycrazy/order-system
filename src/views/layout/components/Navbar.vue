<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>
      <!-- <div>
      <el-badge :value="200" :max="99" class="item">
        <el-button size="small">需三审单</el-button>
      </el-badge>
      </div> -->
      <el-alert :closable="false" v-if='IsHQ && show' title="有三审单据" type="error" class='item'> </el-alert>
      

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <!-- <lang-select class="international right-menu-item"></lang-select> -->

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
      <el-tooltip effect="dark" :content="store + ' ' +curUser.uname.split('-')[1].trim() +'['+ curUser.rolename.trim()+']' " placement="bottom-end">
          <div class="avatar-wrapper">
            <!--<img class="user-avatar" />{{SYS}}  :src="avatar || '/img/user.png'">-->
            <div class="user-avatar" >{{SYS}}</div>
            <i class="el-icon-caret-bottom"></i>
          </div>
      </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{$t('navbar.dashboard')}}
              </el-dropdown-item>
            </router-link>          
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>


    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  data(){
    return {
      IsHQ: process.env.SYS === "HQ",
      SYS: process.env.SYS === "HQ"?"总部":"店铺",
      show: false,
      timer: null,
      curUser: null,
      store: ''
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  async created(){
    const user = await this.$store.dispatch('SearchUserInfo')
    this.curUser = user[0]
    if(this.IsHQ){
      await this.refresh3Review()
    }
    else {
      const res = await this.$store.dispatch('GetCurShop')
      this.store = res[0].label
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    async refresh3Review() {
      const that = this
      await (async function cycle() {
        // if(that && !that._isDestroyed) {
          console.log('refresh3Review')
           try{
             const shopInfos = await that.$store.dispatch('GetShopServerInfos')
             that.show = shopInfos.some(s=> s.Need3ReviewCount > 0)
           }catch(ex){
             console.log('获取店铺信息列表失败')
             console.log(ex)
           }
           clearTimeout(that.timer)
           that.timer = setTimeout(cycle, 1 * 60 * 1000)
        // }
      })() 
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

.s-u-desc{
  display: flex;
    justify-content:center;
    align-items:Center;
}

.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    &:focus{
     outline: none;
    }
    .item {
      width: 120px;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          display: flex;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
