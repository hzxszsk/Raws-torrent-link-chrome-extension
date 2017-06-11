'use strict';

/**
 * 简化document.querySelector
 * 
 * @param {String} selector 
 * @returns {HTMLElement}
 */
const $ = function (selector) {
  return document.querySelector(selector);
}

/**
 * 简化document.querySelectorAll
 * 
 * @param {String} selector 
 * @returns {HTMLCollection}
 */
const $$ = function (selector) {
  return document.querySelectorAll(selector);
}

let currentTab = null;

/**
 * 扩展加载时决定隐藏哪一个内容块
 */
function initContentAsync() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            currentWindow: true,
            active: true,
            highlighted: true
        }, (tabs) => {
            currentTab = tabs[0];
            if (currentTab.url.match(/leopard-raws.org/)) {
                $('#not-raw-page-content').classList.add('hide');
            } else {
                $('#raw-page-content').classList.add('hide');
            }
            resolve();
        })
    })
}

/**
 * 判断当前页面显示的是否是Leopard-Raw网站
 * 
 * @returns {Boolean}
 */
function isInLeopardRaw() {
    if (currentTab && currentTab.url.match(/leopard-raws.org/)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 渲染torrent列表
 * 
 * @param {Array} linkList 
 */
function renderLinkList(linkList) {
    let linkListHTML = '';
    linkList.forEach((link, index) => {
        linkListHTML += `
        <li>
            <label>
            <input type="checkbox" value="${link.url}">
            <span class="torrent-name">${link.name}</span>
            </label>
        </li>`;
    });
    $('#select-all').setAttribute('checked', true);
    $('#link-list').innerHTML = linkListHTML;
    $('#state-msg').innerText = '';
    $('#link-list-wrap').classList.remove('hide');
    $('#copy-torrent-links-btn').classList.remove('hide');
    selectAllToggle();
}

const selectAllToggle = (function () {
    let isSelect = false;
    let selectAllCheckbox = $('#select-all');
    let linkList = $('#link-list');

    /**
     * 全选
     */
    function select() {
        let checkedboxs = linkList.querySelectorAll('input[type=checkbox]');
        checkedboxs.forEach((checkbox) => {
            checkbox.checked = true;
        });
        isSelect = true;
    }

    /**
     * 取消全选
     */
    function cancel() {
        let checkedboxs = linkList.querySelectorAll('input[type=checkbox]');
        checkedboxs.forEach((checkbox) => {
            checkbox.checked = false;
        });
        isSelect = false;
    }

    function toggle() {
        if (isSelect) {
            cancel();
        } else {
            select();
        }
    }

    selectAllCheckbox.addEventListener('change', (event) => {
        toggle();
    });

    return toggle;
})()

window.addEventListener('load', function () {

    /**
     * 添加a标签click事件捕获
     */
    document.body.addEventListener('click', function (event) {
        let target = event.target;
        let nodeName = target.nodeName.toLowerCase();
        // 处理a跳转连接
        if (nodeName === 'a') {
            event.preventDefault();
            let href = target.href;
            //通过chrome打开新页面，并跳转到a标签所指页面
            if (href) {
                chrome.tabs.create({
                    url: href,
                    active: true
                }, (tab) => {})
            }
        }
    }, false);

    // 设置复制按钮
    let clipborad = new Clipboard('#copy-torrent-links-btn', {
        text() {
            let urlArr = [];
            $$('#link-list input:checked').forEach((checkbox) => {
                urlArr.push(checkbox.value);
            });
            let result = urlArr.join('\n');
            return result;
        }
    });
    clipborad.on('success', function (e) {
        $('#state-msg').innerText = '链接复制完毕';
    })

    initContentAsync().then(() => {
        if (isInLeopardRaw()) {
            chrome.tabs.sendMessage(currentTab.id, {
                type: 'getLinks'
            }, function (response) {
                renderLinkList(response);
            })
        }
    });
})
