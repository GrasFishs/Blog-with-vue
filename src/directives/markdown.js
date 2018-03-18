import Vue from "vue";
import marked from "marked";
import highlight from "highlight.js";
import "./atom-one-light.css";

const insertAfter = function (newEle, tarEle) {
  const parent = tarEle.parentNode;
  if (parent.lastChild == tarEle) {
    parent.appendChild(newEle);
  } else {
    parent.insertBefore(newEle, tarEle.nextSibling);
  }
};

const wrap = function (img) {
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

const showPic = img => {
  document.body.style.overflow = "hidden"; //禁止滚动
  const imgClone = img.cloneNode(false);
  imgClone.style.transition = '0.2s all ease';
  let clickCount = 0;
  let wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.top = "0";
  wrapper.style.bottom = "0";
  wrapper.style.left = "0";
  wrapper.style.right = "0";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.backgroundColor = "rgba(0,0,0,0.8)";
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  wrapper.style.alignItems = "center";
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
  bind: function (el, binding) {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });
    el.innerHTML = marked(el.innerHTML);
    if (binding.value === "page") {
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
    } else if (binding.value === "image") {
      const firstImg = el.querySelector("img");
      if (firstImg) {
        firstImg.style.width = "100%";
        //firstImg.style.transform = "translateY(-50%)";
        el.innerHTML = firstImg.outerHTML;
      } else {
        el.innerHTML = "";
      }
    } else if (binding.value === "card") {
      el.innerHTML = el.innerText;
    }
  }
});

export {
  markdown
};
