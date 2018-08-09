<template>  
<div class="alarmClockList">
  <div class="banner">
    <img src="../assets/alarmClock.png">
  </div>
  <ul>
    <li class="cell">
      <div class="left">
        <p class="time">08:00</p>
        <p class="name">公司销售表</p>
        <p class="week">周一   周二   周三   周五   周六   周日</p>
      </div>
      <div class="right">
        <van-switch v-model="checked" />
      </div>
    </li>
    <li class="cell">
      <div class="left">
        <p class="time">08:00</p>
        <p class="name">公司销售表</p>
        <p class="week">周一   周二   周三   周五   周六   周日</p>
      </div>
      <div class="right">
        <van-switch v-model="checked" />
      </div>
    </li>
    <li class="cell">
      <div class="left">
        <p class="time">08:00</p>
        <p class="name">公司销售表</p>
        <p class="week">周一   周二   周三   周五   周六   周日</p>
      </div>
      <div class="right">
        <van-switch v-model="checked" />
      </div>
    </li>
  </ul>
</div>
</template>  
<script>
export default {
  data() {
    return {
      checked: true
    };
  },
  methods: {}
};
</script>  
  
<style lang="scss" scoped>
.alarmClockList {
  .banner {
    width: 750px;
    height: 460px;
    background: #51b8cb;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 380px;
      height: 365px;
    }
  }
  ul {
    .cell {
      display: flex;
      justify-content: space-between;
      padding: 40px 20px 30px 20px;
      border-bottom: 1px solid #989898; /*no*/
      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .time {
          font-size: 56px;
          color: rgba(81, 184, 203, 1);
        }
        .name {
          font-size: 32px;
          color: rgba(0, 0, 0, 1);
        }
        .week {
          font-size: 28px;
          color: rgba(114, 113, 113, 1);
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .van-switch--on {
          background-color: #51b8cb;
        }
      }
    }
  }
}
</style>  