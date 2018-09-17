<template>
  <div class="menuSet"> 
    <div class="weeks">
      <div class="allChecked-contain">
        <div class="allChecked_title"><van-icon name="ren"/> 用户列表</div>
        <span class="sanjiao"></span>
        <div v-if="users.length">
          <label for="menuSet_allChecked" class="allChecked_label">
          {{this.usersChecked.length == this.users.length?"取消全选":"全选"}}
          </label>
          <input type="checkbox" id="menuSet_allChecked" v-model="allChecked">
        </div>
      </div>
      <div class="userList">
        <div class="userItem" v-for="(item,index) in users" :key="index" @click="selectUser(item.wx_user_id)">
          <div class="name">{{item.name}}<span class="wxid"> ({{item.wx_user_id}})</span></div>
          <div><input type="checkbox" :id="item.wx_user_id" :value="item.wx_user_id" v-model="usersChecked">
          </div>
        </div>
      </div>
      <div class="nextStep-contain"><span class="nextStep" @click="toggleShow">下一步</span></div>
      <van-popup v-model="show" position="right">
        <div class="menuList">
          <div class="title"><van-icon name="caidan"/> 菜单列表 
            <span class="sanjiao"></span>
          </div>
          <div class="list">
            <div class="userItem" v-for="(item) in menus" :key="item.id" @click="selectMenu(item.id)">
              <div class="name">
                <span :class="[menusChecked.includes(item.id) ? 'active' : '']">
                {{item.title}}</span></div>
              <div><input type="checkbox" :id="item.id" :value="item.id" v-model="menusChecked">
              </div>
            </div>
          </div>
          <div class="nextStep-contain"><span class="nextStep backBtn" @click="toggleShow">上一步</span><span class="nextStep" @click="save">完 成</span></div>
        </div>
      </van-popup>
    </div>
  </div> 
</template>  
  
<script>
import "../assets/style/iconfont.css";
import menuSetApi from "@/pages/index/services/menuSet";
import util from "@/pages/index/helper/util";
export default {
  data() {
    return {
      users: [],
      usersChecked: [],
      show: false,
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
          title: "报表闹钟",
          id: 10
        }
      ],
      menusChecked: []
    };
  },
  computed: {
    allChecked: {
      get() {
        return this.usersChecked.length == this.users.length;
      },
      set() {
        if (this.usersChecked.length == this.users.length) {
          this.usersChecked = [];
        } else {
          this.users.map(item => {
            this.usersChecked.includes(item.wx_user_id)
              ? ""
              : this.usersChecked.push(item.wx_user_id);
          });
        }
      }
    }
  },
  methods: {
    init() {
      menuSetApi
        .WXuserlist({
          params: { company_id: window.localStorage.getItem("company_id") }
        })
        .then(res => {
          const { status, message, data } = res.data;
          if (status != "0") {
            this.$toast(message);
          } else {
            this.users = data;
          }
        });
    },
    selectUser(id) {
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
    selectMenu(id) {
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
    toggleShow() {
      if (this.usersChecked.length) {
        this.show = !this.show;
      } else {
        this.$toast("请选择用户！");
      }
    },
    save() {
      if (this.menusChecked.length) {
        menuSetApi
          .usermenulist({
            data: {
              company_id: window.localStorage.getItem("company_id"),
              user_list: this.usersChecked,
              menu_list: this.menusChecked
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
  mounted() {
    this.init();
  }
};
</script>  
  
<style lang="scss" scoped>
.menuSet {
  width: 100%;
  background: #f2f2f2;
  .weeks {
    width: 750px;
    margin: 0 auto;
    .allChecked-contain {
      height: 100px;
      padding: 10px 30px;
      box-sizing: border-box;
      line-height: 100px;
      color: #696161;
      display: flex;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      align-items: center;
      .allChecked_title {
        font-size: 34px;
        padding-top: 14px;
      }
      .sanjiao {
        width: 40px;
        height: 40px;
        background: #fff;
        position: absolute;
        top: 85px;
        left: 120px;
        z-index: 100;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
      }
      .allChecked_label {
        font-size: 34px;
        padding-right: 10px;
      }
    }
    .userList,
    .list {
      width: 750px;
      background: #fff;
      font-size: 30px;
      height: calc(100vh - 260px);
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
      height: 160px;
      line-height: 160px;
      text-align: center;
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
        .sanjiao {
          width: 60px;
          height: 60px;
          background: #fff;
          position: absolute;
          top: 80px;
          left: 90px;
          z-index: 100;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
        }
      }
    }
  }
}
</style>  