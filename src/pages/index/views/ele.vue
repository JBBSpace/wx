<template>  
  <div class="menuview-main">
    <div class="menucategory-category" ref="menuWrapper">
      <ul>
        <li v-for="(menu,index) in goods" :key="menu.id" :class="{'current': currentIndex === index}"        @click = "selectMenu(index, $event)" >{{menu.title}}</li>
      </ul>
    </div>
    <section class="container" ref="foodsWrapper">
      <div class="scroller" >
        <dl v-for="item in goods" :key="item.id" class="food-list">
          <p class="title">{{item.title}}</p>
          <dd v-for="good in item.foods" :key="good.id" class="food-item">
            <div class="goodImg">
              <img :src="good.image_path" alt="">
            </div>
            <div class="dec">
              <p class="name">{{good.name}}</p>
              <p class="describe">{{good.describe}}</p>
            </div>
          </dd>
        </dl>
      </div>
    </section>
  </div>
</template>  
  
<script>
import BScroll from "better-scroll";

export default {
  data() {
    return {
      listHeight: [],
      goods: [
        {
          id: -1,
          title: "热销",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)波霸奶茶",
              describe: "奶茶搭配波霸，口感软Q。",
              image_path: require("../assets/ele/good.jpeg")
            },
            {
              id: "2",
              name: "(大杯)波霸奶茶",
              describe: "奶茶搭配波霸，口感软Q。",
              image_path: require("../assets/ele/good.jpeg")
            },
            {
              id: "3",
              name: "(大杯)波霸奶茶",
              describe: "奶茶搭配波霸，口感软Q。",
              image_path: require("../assets/ele/good.jpeg")
            },
            {
              id: "4",
              name: "(大杯)波霸奶茶",
              describe: "奶茶搭配波霸，口感软Q。",
              image_path: require("../assets/ele/good.jpeg")
            }
          ]
        },
        {
          id: 0,
          title: "找醇茶",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/b.jpeg")
            },
            {
              id: "2",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/b.jpeg")
            },
            {
              id: "3",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/b.jpeg")
            },
            {
              id: "4",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/b.jpeg")
            },
            {
              id: "5",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/b.jpeg")
            }
          ]
        },
        {
          id: 1,
          title: "找奶茶",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/c.jpeg")
            },
            {
              id: "2",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/c.jpeg")
            },
            {
              id: "3",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/c.jpeg")
            }
          ]
        },
        {
          id: 2,
          title: "找好茶",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/d.jpeg")
            },
            {
              id: "2",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/d.jpeg")
            },
            {
              id: "3",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/d.jpeg")
            },
            {
              id: "4",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/d.jpeg")
            }
          ]
        },
        {
          id: 3,
          title: "找口感",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/e.jpeg")
            },
            {
              id: "2",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/e.jpeg")
            },
            {
              id: "3",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/e.jpeg")
            }
          ]
        },
        {
          id: 4,
          title: "找鲜奶",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            },
            {
              id: "2",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            },
            {
              id: "3",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            },
            {
              id: "4",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            },
            {
              id: "5",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            },
            {
              id: "6",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            },
            {
              id: "7",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/f.jpeg")
            }
          ]
        },
        {
          id: 5,
          title: "找新鲜",
          description: "大家喜欢吃，才叫真好吃。",
          foods: [
            {
              id: "1",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/g.jpeg")
            },
            {
              id: "2",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/g.jpeg")
            },
            {
              id: "3",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/g.jpeg")
            },
            {
              id: "4",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/g.jpeg")
            },
            {
              id: "5",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/g.jpeg")
            },
            {
              id: "6",
              name: "(大杯)阿萨姆红茶",
              describe:
                "找醇茶系列饮品无法添加配料，需加配料请于「找好茶」订购!味甘温和略有果香。",
              image_path: require("../assets/ele/g.jpeg")
            }
          ]
        }
      ], //存储区块的高度
      scrollY: 0
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        //不要忘了加this引用
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        //获得了一个区间的上下范围，判断scrollY落到这个区间，!height2是判断最后一个区间
        //避免i溢出，>= 向下的是一个闭区间，这样第一个就会高亮了
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i; //映射到第5行menu的变化
        }
      }
      return 0;
    }
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        probeType: 3, //让better-scroll监听scroll事件
        click: true //允许better-scroll列表上的点击事件
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3, //让better-scroll监听scroll事件
        click: true //允许better-scroll列表上的点击事件
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      let foodList = document.getElementsByClassName("food-list");
      let height = 0;
      this.listHeight.push(height); //listHeight是一个递增的区间数组，是每个专区高度的累加
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        //浏览器直接return掉,去掉自带click事件的点击
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list"
      );
      let ref = foodList[index]; //取到index对应的DOM
      this.foodsScroll.scrollToElement(ref, 300); //滚动到DOM所在位置
    }
  },
  created() {
    //调用scroll函数，实现滚动
    this.$nextTick(() => {
      this._initScroll();
      //拿到数据以后计算高度
      this._calculateHeight();
    });
  }
};
</script>  
  
<style lang="scss" scoped>
.menuview-main {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  .menucategory-category {
    float: left;
    width: 20%;
    height: 100%;
    ul li {
      width: 100%;
      height: 80px;
      line-height: 80px;
      background: #fff;
      text-align: center;
      font-size: 28px;
      &.current {
        background: #51b8cb;
        color: #fff;
      }
    }
  }
  .container {
    float: left;
    position: relative;
    width: 80%;
    height: 100%;
    background: #03ccbb;
    .scroller {
      width: 100%;
      .food-list {
        height: auto;
        .title {
          height: 60px;
          line-height: 60px;
          text-indent: 20px;
          background: rgb(216, 214, 214);
          font-size: 24px;
        }
        .food-item {
          width: 100%;
          height: 190px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          .goodImg {
            img {
              width: 190px;
              height: 190px;
            }
          }
          .dec {
            width: 100%;
            height: 190px;
            box-sizing: border-box;
            padding: 10px 0 10px 10px;
            background: #fff;
            .name {
              font-size: 28px;
              color: #999;
            }
            .describe {
              font-size: 22px;
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
</style>  