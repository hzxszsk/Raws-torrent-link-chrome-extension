'use strict';

const $ = function (selector) {
  return document.querySelector(selector);
}
const $$ = function (selector) {
  return document.querySelectorAll(selector);
}

window.addEventListener('load', function () {

    /**
     * 添加a标签click事件捕获
     */
    document.body.addEventListener('click', function (event) {
        let target = event.target;
        event.preventDefault();
        if (target.nodeName.toLowerCase() === 'a') {
            let href = target.href;
            //TODOS:添加chrome打开新页面功能
            chrome.tabs.create({
                url: href,
                active: true
            }, function (tab) {
                
            })
        }
    }, false);

    chrome.tabs.query({
        currentWindow: true,
        active: true,
        highlighted: true
    }, function (tabs) {
        let current = tabs[0];
        console.log(current);
        if (current.url.match(/leopard-raws.org/)) {
            $('#not-raw-page-content').classList.add('hide');
        } else {
            $('#raw-page-content').classList.add('hide');
        }
    })
    
})
