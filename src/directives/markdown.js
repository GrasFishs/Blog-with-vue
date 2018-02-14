import Vue from "vue";
import marked from "marked";
import highlight from "highlight.js";
import "../directives/atom-one-light.css";

const insertAfter = function(newEle, tarEle) {
  const parent = tarEle.parentNode;
  if (parent.lastChild == tarEle) {
    parent.appendChild(newEle);
  } else {
    parent.insertBefore(newEle, tarEle.nextSibling);
  }
};

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

const markdown = Vue.directive("markdown", {
  bind: function(el, binding) {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function(code) {
        return highlight.highlightAuto(code).value;
      }
    });
    el.innerHTML = marked(el.innerHTML);
    if (binding.value === "page") {
      const imgList = el.querySelectorAll("img");
      for (const img of imgList) {
        const parent = img.parentNode;
        parent.style.display = "flex";
        parent.style.justifyContent = "center";
        parent.style.flexDirection = "column";
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

export { markdown };
