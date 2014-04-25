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
        } else {
            window.close();
        }
    });
}); 
/*
 * 
 * 这个JS文件表示对popup.html文档的操作
 * 比如直接在这里写的document也是代表了popup.html的文档流
 */
var oItem = {};

//页面返回信息渲染
chrome.extension.onRequest.addListener(function(item) {
    
    document.getElementById('item_id').value = item.item_id;
    document.getElementById('item_id').setAttribute('disabled', true);
    document.getElementById('price').value = item.price;
    if (typeof item.promo_price != 'undefined') {
        document.getElementById('price').value = item.promo_price;
    }
    if (typeof item.volume != 'undefined') {
        document.getElementById('volume').value = item.volume;
        oItem.volume = item.volume;
    }
    var imgBoxElm = document.getElementById('J_ItemImgs');
    if (typeof item.images != 'undefined') {
        for (var i = 0, len = item.images.length; i < len; i++) {
            var img = new Image();
            img.src = item.images[i];
            img.className = 'img-polaroid';
            img.setAttribute('key', i);
            if (i == 0) {
                img.className = 'img-polaroid select';
                oItem.pic_url = img.src;
            }
            imgBoxElm.appendChild(img);
        }
    }
    oItem.item_id = item.item_id;
    oItem.price = document.getElementById('price').value;
    var imgsElm = imgBoxElm.children;
    for (var i = 0, len = imgsElm.length; i < len; i++) {
        imgsElm[i].onclick = function(){
            imgBoxElm.getElementsByClassName('select')[0].className = 'img-polaroid';
            this.className = 'img-polaroid select';
            oItem.pic_url = this.src;
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
    document.getElementById('J_Submit').addEventListener('click', function(e){
        var action = 'updateItem';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", GRAB_URL, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Content-length", data.length);
        xhr.onreadystatechange = function() {
            console.log(xhr.responseText);
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                if (xhr.responseText == 1) {
                    if (confirm('更新完成，点击确认关闭窗口或者取消继续修改商品信息')) {
                        window.close();
                    }
                } else {
                    if (confirm('更新失败，点击确认关闭窗口或者取消继续修改商品信息')) {
                        window.close();
                    }
                }
            }
        } 
        var volumeElm = document.getElementById('volume');
        if (1*volumeElm.value > 0) {
            oItem.volume = volumeElm.value;
        } else {
            delete oItem.volume;
        }
        var priceElm = document.getElementById('price');
        if (1*priceElm.value > 0) {
            oItem.price = priceElm.value;
        } else {
            delete oItem.price;
        }
        if (typeof oItem.item_id == 'undefined' || oItem.item_id == 0 || oItem.item_id == '') {
            alert('没有拿到商品ID，不能进行提交');
            return false;
        }
        console.log('action='+action+'&data='+JSON.stringify(oItem));
        xhr.send('action='+action+'&data='+JSON.stringify(oItem));
    });        
});
