// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.
var oParam = {};

//附图
thumbImgs = [].slice.apply(document.getElementById('J_UlThumb').getElementsByTagName('img'));
oParam.images = thumbImgs.map(function(element) {
	var src = element.getAttribute('src').split('.jpg_')[0]+'.jpg';
    return src;
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
var promoElm = document.getElementsByClassName('tm-promo-price')[0];
if (promoElm.getElementsByClassName('tm-price').length != 0) {
    oParam.promo_price = promoElm.getElementsByClassName('tm-price')[0].innerHTML.trim();
}

var hElm = document.getElementById('detail').getElementsByClassName('tb-detail-hd')[0];
//标题
oParam.title = hElm.getElementsByTagName('h1')[0].innerHTML.trim();
oParam.desc = hElm.getElementsByTagName('p')[0].innerHTML.trim();

//商品ID
oParam.item_id = document.getElementById('LineZing').attributes.itemid.value;

chrome.extension.sendRequest(oParam);

