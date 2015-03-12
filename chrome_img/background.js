function getClickHandler() {
  return function(info, tab) {
    var url = tab.url;
    if (url.match(/item.taobao.com/g)) {
        chrome.tabs.executeScript(tab.id, {file: 'taobao.js', allFrames: true});
    } else if (url.match(/item.jd.com/g)) {
        chrome.tabs.executeScript(tab.id, {file: 'jingdong.js', allFrames: true});
    } else if (url.match(/detail.tmall.com/g)) {
        chrome.tabs.executeScript(tab.id, {file: 'tmall.js', allFrames: true});
    } else {
        alert('该页面不是商品详情页哦，换个页面试试');
        return false;
    }

    // The srcUrl property is only available for image elements.
    var url = 'popup.html#' + tab.url;
    // Create a new window to the info page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};
/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "获取商品信息",
  "type" : "normal",
  "contexts" : ["all"],
  "onclick" : getClickHandler()
});