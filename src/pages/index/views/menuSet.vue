<template>
  <div class="menuSet">
    <div class="weeks">
      <div class="allChecked-contain">
        <div class="allChecked_title">
          <van-icon name="ren" />用户列表
        </div>
        <div v-if="rearchUser.length">
          <label for="menuSet_allChecked"
                 class="allChecked_label">{{this.usersChecked.length == this.rearchUser.length?"取消全选":"全选"}}</label>
          <input type="checkbox"
                 id="menuSet_allChecked"
                 v-model="allChecked">
        </div>
      </div>
      <div class="userRoleSelect">
        <span v-for="item in userRoles"
              :key="item.role"
              :class="[item.roleType ==userRoleType? 'active' : '', 'roleItem']"
              @click="toggleUserType(item.roleType)">{{item.text}}</span>
      </div>
      <!-- <div class="wrapper" ref="wrapper"> -->
      <div class="userList content">
        <van-cell-group>
          <van-field v-model="keyWord"
                     @input="fSearch"
                     placeholder="请输入检索关键字"
                     left-icon="search" />
        </van-cell-group>
        <div class="userItem"
             v-for="(item) in rearchUser"
             :key="item.id"
             @click="selectUser(item.id)">
          <div class="name">
            {{item.name}}
            <span class="wxid">({{item.wx_user_id}})</span>
          </div>
          <div>
            <input type="checkbox"
                   :id="item.id"
                   :value="item.id"
                   v-model="usersChecked">
          </div>
        </div>
      </div>
      <!-- </div> -->
      <div class="nextStep-contain">
        <span class="nextStep"
              @click="toggleShow">下一步</span>
      </div>
      <van-popup v-model="show"
                 position="right">
        <div class="menuList">
          <div class="title">
            <van-icon name="caidan" />菜单列表
          </div>
          <div class="roleSelect">
            <span v-for="item in menusRoles"
                  :key="item.role"
                  :class="[item.role ==role? 'active' : '', 'roleItem']"
                  @click="toggleMenuType(item.role)">{{item.text}}</span>
          </div>
          <!-- <div class="wrapper02" ref="wrapper02"> -->
          <div class="list content">
            <div class="userItem"
                 v-for="(item) in menus"
                 v-show="isShow(item.id)"
                 :key="item.id"
                 @click="selectMenu(item.id)">
              <div class="name">
                <span :class="[menusChecked.includes(item.id) ? 'active' : '']">{{item.title}}</span>
              </div>
              <div>
                <input type="checkbox"
                       :id="item.id"
                       :value="item.id"
                       v-model="menusChecked">
              </div>
            </div>
          </div>
          <!-- </div> -->
          <div class="nextStep-contain">
            <span class="nextStep backBtn"
                  @click="back">上一步</span>
            <span class="nextStep"
                  @click="save">完 成</span>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>  
  
<script>
import "../assets/style/iconfont.css";
import homeApi from "@/pages/index/services/home";
import menuSetApi from "@/pages/index/services/menuSet";
import util from "@/pages/index/helper/util";
import BScroll from "better-scroll";
const userTypeMap = {  top: [],
  mid: [],
  clerk: [],
  none: []}
export default {
  data () {
    return {
      users: [],
      usersChecked: [],
      show: false,
      userRoleType: '',
      role: '',
      userRoles: [{
        roleType: 'top',
        text: '高层领导'
      }, {
        roleType: 'mid',
        text: '中层管理'
      }, {
        roleType: 'clerk',
        text: '普通员工'
      }, {
        roleType: 'none',
        text: '其他'
      }],
      menusRoles: [{
        role: 't',
        text: '高层领导'
      }, {
        role: 'm',
        text: '中层管理'
      }, {
        role: 'c',
        text: '普通员工'
      }],
      keyWord: '',
      rearchUser: [],
      menus: [
        {
          title: "我的折扣券",
          id: 1
        },
        {
          title: "生成 折扣券",
          id: 2
        },
        {
          title: "商品类别销售",
          id: 3
        },
        {
          title: "周期销售表",
          id: 4
        },
        {
          title: "公司销售分析",
          id: 5
        },
        {
          title: "公司销售表",
          id: 6
        },
        {
          title: "类别销售对比表",
          id: 7
        },
        {
          title: "用户菜单配置",
          id: 9
        },
        {
          title: "报表闹钟",
          id: 10
        },
        {
          title: "门店销售表",
          id: 13
        },
        {
          title: "周销售报表",
          id: 14
        },
        {
          title: "供应商排名",
          id: 15
        },
        // {
        //   title: "公告通知",
        //   id: 16
        // }, 
        {
          title: "顾客评价",
          id: 19
        },
        {
          title: "客单价走势图",
          id: 17
        },
        {
          title: "我的顾客",
          id: 18
        },
        {
          title: "快递列表",
          id: 20
        }
      ],
      menulist: [],
      menusChecked: [],

    };
  },
  computed: {
    allChecked: {
      get () {
        return this.usersChecked.length == this.rearchUser.length;
      },
      set () {
        if (this.usersChecked.length == this.rearchUser.length) {
          this.usersChecked = [];
        } else {
          this.rearchUser.map(item => {
            this.usersChecked.includes(item.id)
              ? ""
              : this.usersChecked.push(item.id);
          });
        }
      }
    }
  },
  methods: {
    _initScroll () {
      this.init();
    },
    init () {
      menuSetApi
        .WXuserlist({
          params: { company_id: window.localStorage.getItem("company_id") }
        })
        .then(res => {
          const { status, message, data } = res.data;
          if (status) {
            this.$toast(message);
          } else {
            this.users = data.users;
            this.menulist = data.menulist;
            userTypeMap.top = data.top
            userTypeMap.mid = data.mid
            userTypeMap.clerk = data.clerk
            userTypeMap.none = data.none
            this.fSearch()
          }
        });
    },
    fSearch () {
      const flag = this.keyWord.length > 0 ? true : false;
      if (flag) {
        this.usersChecked = []
        this.rearchUser = this.users.filter((value) => {  //过滤数组元素

          return value.filter.indexOf(this.keyWord.toLowerCase()) > -1; //如果包含字符返回true
        });
      } else {
        this.rearchUser = this.users
      }
    },
    selectUser (id) {
      var e = e || window.event;
      if (e.target.nodeName == "INPUT") {
        e.cancelBubble = true;
        e.stopPropagation();
      } else {
        this.usersChecked.includes(id)
          ? this.usersChecked.splice(this.usersChecked.indexOf(id), 1)
          : this.usersChecked.push(id);
      }
    },
    toggleUserType (userRoleType) {
      if (userRoleType == this.userRoleType) return
      this.keyWord = ''
      this.fSearch()
      this.userRoleType = userRoleType;
      this.usersChecked = [].concat(userTypeMap[userRoleType])
    },
    isShow (id) {
      return this.menulist.includes(id);
    },
    selectMenu (id) {
      var e = e || window.event;
      if (e.target.nodeName == "INPUT") {
        e.cancelBubble = true;
        e.stopPropagation();
      } else {
        this.menusChecked.includes(id)
          ? this.menusChecked.splice(this.menusChecked.indexOf(id), 1)
          : this.menusChecked.push(id);
      }
    },
    toggleShow () {
      if (this.usersChecked.length) {
        this.show = !this.show;
        // if(this.show){
        //   this.$nextTick(() => {
        //     if (!this.scroll02) {
        //       this.scroll02 = new BScroll(this.$refs.wrapper02, {
        //         click: true //允许better-scroll列表上的点击事件
        //       });
        //     } else {
        //       this.scroll02.refresh();
        //     };
        //   });
        // }
        if (this.usersChecked.length == 1) {
          const curUser = this.users.filter(
            item => item.id == this.usersChecked[0]
          )[0];
          const params = {
            company_id: localStorage.getItem("company_id"),
            usermenu_sign: 1,
            wx_user_id: curUser.wx_user_id,
            hg_user_id: curUser.hg_user_id
          };
          homeApi.menus({ params: params }).then(res => {
            const { data } = res.data;
            this.menusChecked = data.menu_list;
          });
        }
      } else {
        this.$toast("请选择用户！");
      }
    },
    toggleMenuType (role) {
      if (this.role == role) return
      this.role = role;
      switch (role) {
        case "t":
          this.menusChecked = [1, 2, 4, 5, 6, 7, 10, 13, 15, 19];
          break;
        case "m":
          this.menusChecked = [5, 7, 10, 13, 17, 19];
          break;
        case "c":
          this.menusChecked = [10, 18, 19];
          break;
        default:
          break;
      }
    },
    back () {
      this.show = !this.show;
      this.menusChecked = [];
    },
    save () {
      if (this.menusChecked.length) {
        menuSetApi
          .usermenulist({
            data: {
              company_id: window.localStorage.getItem("company_id"),
              user_list: this.usersChecked,
              menu_list: this.menusChecked,
              role: this.role
            }
          })
          .then(res => {
            const { status, message, data } = res.data;
            this.$router.push({
              name: "home"
            });
          });
      } else {
        this.$toast("请选择菜单！");
      }
    }
  },
  mounted () {
    //调用scroll函数，实现滚动
    // this.$nextTick(() => {
    this._initScroll();
    // });
  }
};
</script>  
  
<style lang="scss" scoped>
.menuSet {
  width: 100%;
  position: relative;
  .weeks {
    width: 750px;
    height: calc(100vh);
    background: #f2f2f2;
    margin: 0 auto;
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    .allChecked-contain {
      height: 100px;
      padding: 5px 30px;
      box-sizing: border-box;
      color: #696161;
      display: flex;
      justify-content: space-between;
      .allChecked_title {
        font-size: 34px;
        padding-top: 14px;
      }
      .allChecked_label {
        font-size: 34px;
        padding-right: 10px;
      }
    }
    .roleSelect {
      width: 100%;
      position: fixed;
      left: 0;
      z-index: 1000;
      top: 100px;
      margin: 0 6px;
      display: flex;
      height: 70px;
      line-height: 65px;
      .roleItem {
        height: 68px;
        flex: 1;
        background-color: #fff;
        border-right: 1px solid #51b8cb;
        border-top: 1px solid #51b8cb;
        border-bottom: 1px solid #51b8cb;
        font-size: 32px;
        color: #51b8cb;
        text-align: center;
        transition: color 0.3s;
        &.active {
          color: white;
          background-color: #51b8cb;
        }
        &:nth-child(1) {
          border-left: 1px solid #51b8cb;
        }
      }
    }
    .userRoleSelect {
      margin: 0 6px;
      width: 100%;
      display: flex;
      width: 100%;
      height: 70px;
      line-height: 70px;
      position: fixed;
      left: 0;
      z-index: 1000;
      background: #f2f2f2;
      top: 100px;
      .roleItem {
        margin: 0 8px;
        height: 66px;
        flex: 1;
        background-color: #fff;
        border: 1px solid #51b8cb; /*no*/
        border-radius: 10px;
        font-size: 32px;
        color: #51b8cb;
        text-align: center;
        transition: color 0.3s;
        &.active {
          color: white;
          background-color: #51b8cb;
        }
      }
    }
    .wrapper {
      width: 100%;
      height: 75%;
      position: absolute;
      left: 0;
      top: 180px;
      bottom: 180px;
      overflow: hidden;
      .content {
        width: 100%;
      }
    }
    .userList,
    .list {
      width: 750px;
      margin-top: 75px;
      background: #fff;
      font-size: 30px;
      height: calc(100vh - 330px);
      overflow-y: scroll;
      .userItem {
        padding: 25px 10px;
        margin: 0 20px;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #e6dede;
        .name {
          flex-grow: 2;
          color: #696161;
        }
        .active {
          color: #51b8cb;
        }
      }
      .wxid {
        color: #51b8cb;
      }
    }
    .userList::-webkit-scrollbar {
      display: none;
    }
    .nextStep-contain {
      width: 100%;
      height: 160px;
      line-height: 160px;
      text-align: center;
      position: absolute;
      bottom: 0;
      .nextStep {
        padding: 20px 100px;
        background-color: #51b8cb;
        border-radius: 50px;
        border: #51b8cb solid 1px; /*no*/
        color: white;
        font-size: 32px;
        letter-spacing: 4px;
      }
      .backBtn {
        background: #fff;
        border: #fff solid 1px; /*no*/
        color: #696161;
        margin-right: 20px;
      }
    }
    input[type="checkbox"] {
      position: relative;
      width: 40px;
      height: 40px;
      vertical-align: middle;
      color: white;
      border: none;
    }

    input[type="checkbox"]::before {
      content: "";
      position: absolute;
      z-index: 800;
      top: -2px;
      left: -2px;
      width: 44px;
      height: 44px;
      line-height: 40px;
      text-align: center;
      color: white;
      font-size: 28px;
      background-color: white;
      border: 1px solid #999; /*no*/
      box-sizing: border-box;
      border-radius: 4px;
    }

    input[type="checkbox"]:checked::before {
      color: white;
      border: 1px solid #51b8cb; /*no*/
      background-color: #51b8cb;
      content: "✔";
      font-family: "微软雅黑";
    }

    .menuList {
      width: 750px;
      height: calc(100vh);
      background: #f2f2f2;
      .title {
        position: relative;
        height: 100px;
        line-height: 100px;
        font-size: 32px;
        padding: 0 20px;
        color: #696161;
        overflow: hidden;
      }
      .wrapper02 {
        width: 100%;
        height: 75%;
        position: absolute;
        left: 0;
        top: 180px;
        bottom: 180px;
        overflow: hidden;
        .content {
          width: 100%;
        }
      }
    }
  }
}
</style>  