'use strict';

const searchUrlPrefix = 'http://zh.leopard-raws.org/?search=';

function setDefaultSuggestion(text) {
    if (text && text.length > 0) {
        chrome.omnibox.setDefaultSuggestion({
            description: '搜索动漫：' + text
        });
    } else {
        chrome.omnibox.setDefaultSuggestion({
            description: '请输入你要搜索的动漫生肉的名称( ^_^ )'
        });
    }
}

chrome.omnibox.onInputStarted.addListener(function () {
    setDefaultSuggestion('');
});

chrome.omnibox.onInputCancelled.addListener(function () {
    setDefaultSuggestion('');
});

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
    setDefaultSuggestion(text);
});

chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
    let searchUrl = searchUrlPrefix + text;
    switch (disposition) {
        case 'currentTab':
            // 在当前标签页打开
            chrome.tabs.update({
                url: searchUrl
            });
            break;
        case 'newForegroundTab':
            // 在新标签页内打开，并将其设为当前标签页
            chrome.tabs.create({
                url: searchUrl,
                active: true
            }, function (tab) {

            });
            break;
        case 'newBackgroundTab':
            // 在新标签页内打开，但不将其设为当前标签页
            chrome.tabs.create({
                url: searchUrl,
                active: false
            }, function (tab) {

            });
            break;
        default:
            break;
    }
});