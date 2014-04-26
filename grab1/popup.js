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
var oItem = {};
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
    console.log();
    for (var i = 0, len = imgsElm.length; i < len; i++) {
        imgsElm[i].onclick = function(){
            imgBoxElm.getElementsByClassName('select')[0].className = 'img-polaroid';
            this.className = 'img-polaroid select';
            sPicUrl = this.src;
        }
    }
});

/*
 * 
 * 这个JS文件表示对popup.html文档的操作
 * 比如直接在这里写的document也是代表了popup.html的文档流
 */

// 这里的document代表了popup.html的文档流，所以也是注册这个页面中的dom事件
document.addEventListener('DOMContentLoaded', function(){
    var eSubmit = document.getElementById('J_Submit');
    eSubmit.addEventListener('click', function(e){
        var oItem = {};
        oItem.item_id = +document.getElementById('item_id').value;
        oItem.title = document.getElementById('title').value.trim();
        oItem.volume = +document.getElementById('volume').value;
        oItem.price = +document.getElementById('price').value;
        oItem.recommend = document.getElementById('recommend').value.trim();
        oItem.description = document.getElementById('description').value.trim();
        oItem.pic_url = sPicUrl;
        if (!oItem.title) {
            alert('商品标题不能为空');
            return false;
        }
        if (!oItem.price) {
            alert('商品价格为大于0的数');
            return false;
        }

        oItem.item_imgs = [];
        var eImgs = document.getElementById('J_ItemImgs').children;
        for (var i = 0, iLen = eImgs.length; i < iLen; i++) {
            if (eImgs[i].src != sPicUrl) {
                oItem.item_imgs.push({"url": eImgs[i].src});
            }
        }

        eSubmit.setAttribute('disabled',true);
        eNotice.innerHTML = '正在更新';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", GRAB_URL, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var data = JSON.stringify(oItem);
        var eNotice = document.getElementById('J_Notice');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                var resp = JSON.parse(xhr.responseText);
                if (resp.error_response == 0) {
                    eNotice.innerHTML = '更新成功';
                } else {
                    eNotice.innerHTML = '更新失败';
                }
                eSubmit.setAttribute('disabled',false);
            }
        }
        xhr.send('action=item&item='+data);
    });        
});
