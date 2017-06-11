'use strict';

const basicUrl = 'http://zh.leopard-raws.org';
const $ = function (selector) {
  return document.querySelector(selector);
}
const $$ = function (selector) {
  return document.querySelectorAll(selector);
}

/**
 * 解析页面获取种子链接
 * 
 * @returns 
 */
function parseLinks() {
  let links = [];
  let torrents = $$('.torrent_name a');
  torrents.forEach(function (torrent, index) {
    let link = torrent.href;
    let torrentName = torrent.innerText;
    links.push({
      name: torrentName,
      url: link
    });
  });
  return links;
}

/**
 * 获取页面内下载链接集合
 * 
 * @returns {String}
 */
function getTorrentLinkS() {
  let links = parseLinks() || [];
  return links;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message && message.type === 'getLinks') {
    let links = getTorrentLinkS();
    sendResponse(links);
  } else {
    sendResponse('no response');
  }
});