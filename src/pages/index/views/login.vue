<template>
  <div class="loginPage">
    <div class="logo"></div>
    <div class="form">
      <div class="username"
           :class="[username.length ? 'active' : '', '']">
        <div class="iconLeft">
          <van-icon name="ren2" />
        </div>
        <div class="ipt">
          <input type="text"
                 placeholder="汉高账号"
                 v-model="username">
        </div>
        <div class="iconRight">
          <van-icon name="clear"
                    v-show="username.length"
                    @click="username=''" />
        </div>
      </div>
      <div class="password"
           :class="[password.length ? 'active' : '']">
        <div class="iconLeft">
          <van-icon name="suo" />
        </div>
        <div class="ipt">
          <input :type="flag?'':'password'"
                 placeholder="密码"
                 v-model="password">
        </div>
        <div class="iconRight"
             @click="toggleFlag()">
          <van-icon :name="flag?'password-view':'password-not-view'"
                    v-show="password.length" />
        </div>
      </div>
      <div :class="[username.length&&password.length ? '':'disabled' , 'submitBtn']"
           @click="login">绑定账号</div>
    </div>
  </div>
</template>  
  
<script>
import "../assets/style/iconfont.css";
import loginApi from "@/pages/index/services/login";
import homeApi from "@/pages/index/services/home";
import util from "@/pages/index/helper/util";
export default {
  data () {
    return {
      flag: false,
      username: "",
      password: "",
      // http://hgworker.7psj.cn:9000/?code=IPd7xfaaUaI8jovEXc_D9D_JzkB90vAO53bga_M_0yw&state=binding#/login/
      code: util.getRequest().code
    };
  },
  created () {
    if (!this.code) {
      this.redirect();
    }
  },
  methods: {
    toggleFlag () {
      this.flag = !this.flag;
    },
    login () {
      if (this.username.length && this.password.length) {
        const data = {
          erp_user_id: this.username,
          erp_user_password: this.password,
          code: this.code,
          company_id: localStorage.getItem("company_id")
        };
        setTimeout(() => {
          loginApi.login({ data: data }).then(res => {
            const { status, message, data } = res.data;
            if (status) {
              this.$dialog
                .alert({
                  message: message
                })
                .then(() => {
                  this.redirect();
                });
            } else {
              this.$router.push({
                name: "home"
              });
            }
          });
        }, 500)
      } else {
        this.$toast("请输入用户名或密码");
      }
    },
    redirect () {
      homeApi
        .check({ params: { company_id: localStorage.getItem("company_id") } })
        .then(res => {
          const { status, uri, message } = res.data;
          if (status == "0") {
            window.location.href = uri;
          } else {
            this.$toast(message);
          }
        });
    }
  }
};
</script>  
  
<style lang="scss" scoped>
.loginPage {
  .logo {
    width: 750px;
    height: 400px;
    background: url("../assets/login/logo.png") no-repeat center;
    background-size: 166px 166px;
  }
  .username,
  .password {
    width: 540px;
    box-sizing: border-box;
    padding: 30px 30px 20px 10px;
    margin: 0 105px;
    border-bottom: 1px solid #bfbfbf; /*no*/
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #bfbfbf;
    font-size: 30px;
    .iconLeft,
    .iconRight {
      width: 40px;
      height: 40px;
      padding: 5px 0;
      font-size: 40px;
      line-height: 40px;
    }
    .iconRight {
      color: #bfbfbf;
      font-size: 25px;
      line-height: 55px;
    }
    .ipt {
      width: 460px;
      height: 50px;
      align-self: flex-start;
      font-size: 28px;
      text-indent: 20px;
      input {
        height: 50px;
        color: #51b8cb;
        border: 0px;
        outline: none;
      }
    }
  }
  .submitBtn {
    width: 540px;
    height: 88px;
    margin: 80px auto;
    text-align: center;
    line-height: 88px;
    border-radius: 44px;
    font-size: 30px;
    color: #ffffff;
    background: #51b8cb;
    &.disabled {
      opacity: 0.3;
    }
  }
  .active {
    color: #51b8cb;
  }
}
</style>  