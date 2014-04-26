chrome.windows.getCurrent(function (currentWindow) {
    console.log(currentWindow);
    chrome.tabs.getSelected(currentWindow.id, function(tab){
        var url = tab.url;
        if (url.match(/item.taobao.com/g)) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
                chrome.tabs.executeScript(activeTabs[0].id, {file: 'taobao.js', allFrames: true});});
        } else if (url.match(/item.jd.com/g)) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
                chrome.tabs.executeScript(activeTabs[0].id, {file: 'jingdong.js', allFrames: true});});
        } else if (url.match(/detail.tmall.com/g)) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
                chrome.tabs.executeScript(activeTabs[0].id, {file: 'tmall.js', allFrames: true});});
        }
    });
}); 
/*
 * 
 * 这个JS文件表示对popup.html文档的操作
 * 比如直接在这里写的document也是代表了popup.html的文档流
 */
var oItem = {},
    oTag = {},
    oMenu = {},
    oBanner = {},
    oTile = {};
var menuElm = document.getElementById('J_Menu');
var bannerElm = document.getElementById('J_Banner');
var tileElm = document.getElementById('J_Tile');
var tagElm = document.getElementById('J_Tag');
var subElm = document.getElementById('J_SubTag');
var sPicUrl = '';

//页面返回信息渲染
chrome.extension.onRequest.addListener(function(item) {
    // document.body.innerHTML = links.title;
    document.getElementById('item_id').value = item.item_id;
    document.getElementById('title').value = '♥'+item.title;
    document.getElementById('price').value = item.price;
    if (typeof item.promo_price != 'undefined') {
        document.getElementById('price').value = item.promo_price;
        item.price = item.promo_price;
    }
    if (typeof item.volume != 'undefined') {
        document.getElementById('volume').value = item.volume;
    }
    if (typeof item.recommend != 'undefined') {
        document.getElementById('recommend').value = item.recommend;
    }

    var imgBoxElm = document.getElementById('J_ItemImgs');
    if (item.images) {
        for (var i = 0, len = item.images.length; i < len; i++) {
            var img = new Image();
            img.src = item.images[i];
            img.className = 'img-polaroid';
            img.setAttribute('key', i);
            if (i == 0) {
                img.className = 'img-polaroid select';
                sPicUrl = item.images[i];
            }
            imgBoxElm.appendChild(img);
        }
    }
    var imgsElm = imgBoxElm.children;
    for (var i = 0, len = imgsElm.length; i < len; i++) {
        imgsElm[i].onclick = function(){
            imgBoxElm.getElementsByClassName('select')[0].className = 'img-polaroid';
            this.className = 'img-polaroid select';
            sPicUrl = this.src;
        }
    }
    get_tags();
    get_menus();

    menuElm.onchange = function(){
        var selectId = this.value;
        renderBanner(oMenu[selectId].banners, bannerElm);
        bannerElm.onchange();
    }
    bannerElm.onchange = function(){
        var selectId = this.value;
        tileElm.innerHTML = '';
        tileElm.appendChild(new Option('不设置tile', 0));
        get_tiles(this.value);
    }
    tagElm.onchange = function(){
        var selectId = this.value;
        subElm.innerHTML = '';
        renderTagSelect(oTag[selectId], subElm);
    }
});

function get_menus() {
    var oParam = {};
    oParam.action = 'get_menus';
    sendXhr(xhrSuccess, oParam);
    function xhrSuccess(oData) {
        tileElm.appendChild(new Option('不设置tile', 0));
        for (var i = 0, len = oData.menus.length; i < len; i++) {
            var menu = oData.menus[i];
            if (menu.menu_type != 1) {
                continue;
            }
            menuElm.appendChild(new Option(menu.menu_title, menu.menu_id));
            oMenu[menu.menu_id] = menu;
            if (i == 0) {
                renderBanner(oData.menus[0].banners, bannerElm);
            }
        }
    }
}
function renderBanner(banners, elm) {
    bannerElm.innerHTML = '';
    if (!banners || banners.length == 0) {
        return false;
    }
    for (var i = 0, len = banners.length; i < len; i++) {
        var banner = banners[i];
        var type = banner.banner_type;
        if (type == 0 || type == 1 || type == 2 || type == 5) {
            oBanner[banner.banner_id] = banner;
            elm.appendChild(new Option(banner.banner_title, banner.banner_id));
        }
    }
}

function get_tiles(banner_id) {
    var oParam = {};
    oParam.action = 'get_tiles';
    oParam.banner_id = banner_id;
    oParam.current = 0;
    oParam.size = 10000;
    sendXhr(xhrSuccess, oParam);
    function xhrSuccess(oData) {
        tileElm.innerHTML = '';
        if (oData.hasOwnProperty('tiles')) {
            for (var i = 0, len = oData.tiles.length; i < len; i++) {
                var tile = oData.tiles[i];
                var type = tile.type;
                if (type == 0 || type == 1 || type == 2 || type == 5) {
                    tileElm.appendChild(new Option(tile.title, tile.tile_id));
                    oTile[tile.tile_id] = tile;
                }
            }
        }
        if (tileElm.childNodes.length == 0) {
            tileElm.appendChild(new Option('不设置tile', 0));
        }
    }
}

function get_tags() {
    var oParam = {};
    oParam.action = 'get_tags';
    sendXhr(xhrSuccess, oParam);
    function xhrSuccess(oData) {
        tagElm.appendChild(new Option('不设置一级标签', 0));
        for (var i = 0, len = oData.tags.length; i < len; i++) {
            var tag = oData.tags[i];
            tagElm.appendChild(new Option(tag.tag_name, tag.tag_id));
            oTag[tag.tag_id] = tag.sub_tags;
            if (i == 0) {
                tagElm.value = tag.tag_id;
                renderTagSelect(oData.tags[0].sub_tags, subElm);
                oItem.tag_id = tag.tag_id;
            }
        }
    }
}
function renderTagSelect(tags, elm) {
    elm.appendChild(new Option('不设置二级标签', 0));
    for (var i = 0, len = tags.length; i < len; i++) {
        var tag = tags[i];
        elm.appendChild(new Option(tag.tag_name, tag.tag_id));
        if (i == 0) {
            elm.value = tag.tag_id;
            oItem.sub_tag_id = tag.tag_id;
        }
    }
}

function sendXhr(xhrSuccess, oParam) {
    console.log(oParam);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", GRAB_URL, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    // xhr.setRequestHeader("Content-length", data.length);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON解析器不会执行攻击者设计的脚本.
            var resp = JSON.parse(xhr.responseText);
            xhrSuccess(resp);
            console.log(resp);
        }
    }
    var data = [];
    for (p in oParam) {
        data.push(p+'='+oParam[p]); 
    }
    xhr.send(data.join('&'));
}

/*
 * 
 * 这个JS文件表示对popup.html文档的操作
 * 比如直接在这里写的document也是代表了popup.html的文档流
 */

// 这里的document代表了popup.html的文档流，所以也是注册这个页面中的dom事件
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('J_Submit').addEventListener('click', function(e){
        var oItem = {};
        oItem.item_id = +document.getElementById('item_id').value;
        oItem.title = document.getElementById('title').value.trim();
        oItem.volume = +document.getElementById('volume').value;
        oItem.price = +document.getElementById('price').value;
        oItem.recommend = document.getElementById('recommend').value.trim();
        oItem.menu_id = +document.getElementById('J_Menu').value;
        oItem.banner_id = +document.getElementById('J_Banner').value;
        oItem.tile_id = +document.getElementById('J_Tile').value;
        oItem.tag_id = +document.getElementById('J_Tag').value;
        oItem.sub_tag_id = +document.getElementById('J_SubTag').value;
        oItem.is_online = +document.getElementById('is_online').value;
        oItem.description = +document.getElementById('description').value.trim();
        oItem.pic_url = sPicUrl;
        if (!oItem.title) {
            alert('商品标题不能为空');
            return false;
        }
        if (!oItem.price) {
            alert('商品价格为大于0的数');
            return false;
        }

        var aPics = [].slice.apply(document.getElementById('J_ItemImgs').children).map(function(e){
            if (e.src != sPicUrl) {
                return e.src;
            }
        });
        oItem.item_images = aPics.join(',');

        if (oItem.banner_id != 0) {
            oItem.banner_type = oBanner[oItem.banner_id].banner_type;
        }
        if (oItem.tile_id != 0) {
            oItem.tile_type = oTile[oItem.tile_id].type;
        }
        document.getElementById('J_Submit').setAttribute('disabled',true);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", GRAB_URL, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var data = JSON.stringify(oItem);
        // xhr.setRequestHeader("Content-length", data.length);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                var resp = JSON.parse(xhr.responseText);
                if (resp.error_response.code == 0) {
                    if (confirm('新增成功，点击确认关闭窗口')) {
                        window.close();
                    }
                } else {
                    alert('挑频失败，可能商品已经存在了哦，或者再试一次吧');
                }
            }
        }
        xhr.send('action=add_item&item='+data);
    });        
});
