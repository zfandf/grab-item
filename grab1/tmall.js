// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.
var oParam = {};

//附图
thumbImgs = [].slice.apply(document.getElementById('J_UlThumb').getElementsByTagName('img'));
oParam.images = thumbImgs.map(function(element) {
    return element.getAttribute('src').replace('60x60', '400x400');
});

//主图
oParam.pic_url = oParam.images[0];

//原始价格
oParam.price = document.getElementById('J_StrPriceModBox').getElementsByClassName('tm-price')[0].innerHTML.trim();

function hasClass(node, className) {
    var names = node.className.split(/\s+/);
    for (var i = 0; i < names.length; i++) {
      if (names[i] == className) return true;
    }
    return false;
}

//特价
var promoElm = document.getElementById('J_PromoPrice');
if (promoElm.getElementsByClassName('tm-price').length != 0) {
    oParam.promo_price = promoElm.getElementsByClassName('tm-price')[0].innerHTML.trim();
}

//销量
var volumeElm = document.getElementsByClassName('J_TDealCount')[0];
if (typeof volumeElm != 'undefined') {
    oParam.volume = volumeElm.innerText;
}
if (oParam.volume == 0) {
    var volumeElm = document.getElementById('J_DetailMeta').getElementsByClassName('tm-ind-sellCount')[0].children[0];
    oParam.volume = volumeElm.innerText;
}


var hElm = document.getElementById('detail').getElementsByClassName('tb-detail-hd')[0];
//标题
oParam.title = hElm.getElementsByTagName('h3')[0].innerHTML.trim();
oParam.recommend = hElm.getElementsByTagName('p')[0].innerHTML.trim();

//商品ID
oParam.item_id = document.getElementById('LineZing').attributes.itemid.value;
console.log(oParam);

chrome.extension.sendRequest(oParam);
