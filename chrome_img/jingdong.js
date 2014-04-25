// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.
var oParam = {};
console.log(111);

//附图
thumbImgs = [].slice.apply(document.getElementById('spec-list').getElementsByTagName('img'));
oParam.images = thumbImgs.map(function(element) {
    return element.src.replace('/n5/', '/n1/');
});
//主图
oParam.pic_url = oParam.images[0];

//原始价格
oParam.price = document.getElementById('page_maprice').innerHTML.replace('￥','').trim();

//特价
oParam.promo_price = document.getElementById('jd-price').innerHTML.replace('￥','').trim();

//标题
oParam.title = document.getElementById('name').getElementsByTagName('h1')[0].innerHTML.trim();

//商品ID
oParam.item_id = document.getElementById('choose-btn-coll').childNodes[1].attributes.id.value.replace('coll', '').trim();
console.log(oParam);

chrome.extension.sendRequest(oParam);

function hasClass(node, className) {
    var names = node.className.split(/\s+/);
    for (var i = 0; i < names.length; i++) {
      if (names[i] == className) return true;
    }
    return false;
}
