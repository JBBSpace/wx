<template>  
  <div class="alarmClockSeting">
    <van-picker :columns="columns" @change="onChange" />
    <van-cell-group>
      <van-cell title="周一   周二   周三   周五   周六   周日" is-link arrow-direction="down"/>
    </van-cell-group>
    <div class="weeks">
        <van-cell-group>
          <van-cell v-for="(item,index) in weeks" :key="index" :title="item.title">
            <input type="checkbox" :id="item.id" :value="item.id" v-model="weeksChecked">
          </van-cell>
        </van-cell-group>
    </div>
  </div>
</template>  
  
<script>
const time = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60
];
const citys = {
  上午: [
    { 1: time },
    { 2: time },
    { 3: time },
    { 4: time },
    { 5: time },
    { 6: time },
    { 7: time },
    { 8: time },
    { 9: time },
    { 10: time },
    { 11: time },
    { 12: time }
  ],
  下午: [
    { 13: time },
    { 14: time },
    { 15: time },
    { 16: time },
    { 17: time },
    { 18: time },
    { 19: time },
    { 20: time },
    { 21: time },
    { 22: time },
    { 23: time },
    { 24: time }
  ]
};

export default {
  data() {
    return {
      columns: [
        {
          values: Object.keys(citys),
          className: "active"
        },
        {
          values: Object.keys(citys["上午"]),
          className: "active"
        },
        {
          values: time
        }
      ],
      weeks: [
        {
          title: "周一",
          id: 1
        },
        {
          title: "周二",
          id: 2
        },
        {
          title: "周三",
          id: 3
        },
        {
          title: "周四",
          id: 4
        },
        {
          title: "周五",
          id: 5
        },
        {
          title: "周六",
          id: 6
        },
        {
          title: "周日",
          id: 7
        }
      ],
      weeksChecked: []
    };
  },
  methods: {
    onChange(picker, values) {
      console.log(values);
      const lv1 = values[0];
      const lv2 = values[1];
      const lv2Val = [];
      citys[lv1].map((item, index) => {
        lv2Val.push(JSON.parse(Object.keys(item)));
      });
      picker.setColumnValues(1, lv2Val);
    }
  }
};
</script>  
  
<style lang="scss" scoped>
.alarmClockSeting {
  .weeks {
    width: 700px;
    margin: 0 auto;
    input[type="checkbox"] {
      position: relative;
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }

    input[type="checkbox"]::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: white;
      font-size: 28px;
      background-color: white;
      border:1px solid #999;/*no*/
      box-sizing: border-box;
      border-radius: 4px;
    }

    input[type="checkbox"]:checked::before {
      color: white;
      border:1px solid #51B8CB;/*no*/
      background-color: #51B8CB;
      content: "✔";
      font-family: "微软雅黑";
    }

    .van-cell {
      font-size: 28px;
      color: #727171;
      padding: 20px;
    }
  }
}
</style>  