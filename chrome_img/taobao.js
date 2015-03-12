// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.
var oParam = {};

//附图
thumbImgs = [].slice.apply(document.getElementById('J_UlThumb').getElementsByTagName('img'));
oParam.images = thumbImgs.map(function(element) {
    return element.getAttribute('src').split('.jpg_')[0]+'.jpg';
});

//主图
oParam.pic_url = oParam.images[0];

//原始价格
oParam.price = document.getElementById('J_StrPrice').getElementsByClassName('tb-rmb-num')[0].innerHTML.split('-')[0].trim();

//特价
var promoElm = document.getElementById('J_Price');
if (promoElm != null) {
    oParam.promo_price = promoElm.innerHTML.trim();
}

var volumeElm = document.getElementsByClassName('J_TDealCount')[0];
if (typeof volumeElm != 'undefined') {
    oParam.volume = volumeElm.innerText;
}

//标题
var hElm = document.getElementById('J_Title');
oParam.title = hElm.getElementsByTagName('h3')[0].innerHTML.replace(/<[^>].*?>/g,"");
oParam.desc = hElm.getElementsByTagName('p')[0].innerHTML.trim();

//商品ID
oParam.item_id = document.forms.J_FrmBid.item_id.value;

chrome.extension.sendRequest(oParam);

function hasClass(node, className) {
    var names = node.className.split(/\s+/);
    for (var i = 0; i < names.length; i++) {
      if (names[i] == className) return true;
    }
    return false;
}
