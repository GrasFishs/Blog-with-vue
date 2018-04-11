import Vue from "vue";
import marked from "marked";
import highlight from "highlight.js";
import "./atom-one-light.css";
import './markdown.css'

const insertAfter = function(newEle, tarEle) {
  const parent = tarEle.parentNode;
  if (parent.lastChild == tarEle) {
    parent.appendChild(newEle);
  } else {
    parent.insertBefore(newEle, tarEle.nextSibling);
  }
};
/**
 * 将图片包装在一个div里
 * 让图片水平居中并显示alt信息
 */

const wrap = function(img) {
  let wrapper = document.createElement("div");
  let parent = img.parentNode;
  const imgAlt = document.createElement("div");
  parent.insertBefore(wrapper, img);
  wrapper.appendChild(img);
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  if (img.getAttribute("alt")) {
    imgAlt.innerHTML = img.getAttribute("alt");
    imgAlt.style.color = "gray";
    imgAlt.style.textAlign = "center";
    insertAfter(imgAlt, wrapper);
  }
};

/**
 * 点击图片后弹出放大的图片
 */

const showPic = img => {
  document.body.style.overflow = "hidden"; //禁止滚动
  const imgClone = img.cloneNode(false);
  imgClone.style.transition = "0.2s all ease";
  let clickCount = 0;
  let wrapper = document.createElement("div");
  wrapper.classList.add('imgWrapper');
  wrapper.addEventListener("click", e => {
    if (e.target === wrapper) {
      document.body.removeChild(wrapper);
      document.body.style.overflow = "visible";
    }
  });
  wrapper.appendChild(imgClone);
  document.body.appendChild(wrapper);
};

const markdown = Vue.directive("markdown", {
  bind: function(el, binding) {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true, //git hub标准的markdown
      tables: true, //表格语法
      breaks: false, //允许回车换行
      pedantic: false, //尽可能地兼容 markdown.pl的晦涩部分。不纠正原始模型任何的不良行为和错误。
      sanitize: false, //对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
      smartLists: true, //用比原生markdown更时髦的列表。 旧的列表将可能被作为pedantic的处理内容过滤掉.
      smartypants: false, //使用更为时髦的标点，比如在引用语法中加入破折号。
      highlight: function(code) {
        return highlight.highlightAuto(code).value;
      }
    });
    el.innerHTML = marked(el.innerHTML);
    if (binding.value === "page") {
      //详细文章页
      /**
       * 图片的大小根据屏幕的大小进行约束。
       */
      const imgList = el.querySelectorAll("img");
      const windowWidth = window.innerWidth;
      const MINWIDTH =
        windowWidth > 968 ? windowWidth - 300 : windowWidth - 100; // 大屏-300，小屏-100
      for (const img of imgList) {
        let image = new Image();
        image.src = img.src;
        if (image.width > MINWIDTH) {
          img.style.width = MINWIDTH + "px";
          img.style.height = MINWIDTH / image.width * image.height + "px";
        }
        img.addEventListener("click", e => {
          showPic(img);
        });
        wrap(img);
      }
    } else if (binding.value === "card") {
      //文章列表显示
      el.innerHTML = el.innerText;
    }
  }
});

export { markdown };
