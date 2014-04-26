// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.
var oParam = {};

//附图
thumbImgs = [].slice.apply(document.getElementById('J_UlThumb').getElementsByTagName('img'));
oParam.images = thumbImgs.map(function(element) {
    var src = element.src;
    return src.match(/^(\S*)_\d/)[1];
});

//主图
oParam.pic_url = oParam.images[0];

//原始价格
oParam.price = document.getElementById('J_StrPrice').getElementsByClassName('tb-rmb-num')[0].innerHTML.split('-')[0].trim();
console.log(oParam);

//特价
var promoElm = document.getElementById('J_PromoPrice');
if (promoElm != null && typeof promoElm.style != 'undefined' && promoElm.style.display != 'none' && !hasClass(promoElm, 'tb-hidden')) {
    oParam.promo_price = promoElm.getElementsByClassName('tb-rmb-num')[0].innerHTML.split('</em>')[1].trim();
}

//销量
var volumeElm = document.getElementsByClassName('J_TDealCount')[0];
if (typeof volumeElm != 'undefined') {
    oParam.volume = volumeElm.innerText;
}

//标题
oParam.title = document.getElementById('detail').getElementsByTagName('h3')[0].innerHTML.replace(/<[^>].*?>/g,"");

//商品ID
oParam.item_id = document.forms.J_FrmBid.getElementsByTagName('input')[2].value;
console.log(oParam);

chrome.extension.sendRequest(oParam);

function hasClass(node, className) {
    var names = node.className.split(/\s+/);
    for (var i = 0; i < names.length; i++) {
      if (names[i] == className) return true;
    }
    return false;
}
