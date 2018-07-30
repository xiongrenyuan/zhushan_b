require.config({
    paths: {
        "jquery": "../../../common/js/jquery-3.2.1.min",
        "mui": "../../../common/mui/js/mui",
        "utils": "../../../common/js/h5_utils"
    }
});

define(function (require, exports, module) {
    var $ = require('jquery');
    var utils = require('utils');
    require('mui');

    var request = {
        "start_id": 0,
        "type": 1
    };

    //初始刷新,点击刷新
    var init = function () {
        utils.getUserInfo(0, function (rsp) {
            loadData();
        });
    }

    $(".div1").load("../../common/html/load_more_container.html", function () {
        utils.showLoadState("", "loading");
        //点击刷新
        $(".div1").on("click", "#reload_btn", function () {
            init();
        });

        //上拉加载
        mui('.div1 #pullrefresh').pullRefresh({
            container: '#main_content #pullrefresh',
            up: {
                contentrefresh: '正在加载...',
                contentnomore: '没有更多数据了',
                callback: pullupRefresh

            }
        });

        $(".content").addClass("mui-table-view repairingul");

        $(".content").on("tap", ".list-cont", function () {
            var share_url = $(this).attr("share_url");
            if (utils.isWeixinBrowser()) {
                window.location.href = share_url;
            } else {
                utils.openNewWindow(share_url, {});
            }
        });

        //加载loading html初始加载方法
        init();
    });

    //第一次加载数据
    var loadData = function () {
        function onSuccess(data, textStatus, xhr) {
            if (data.error_code == 1000) {
                var res = data.extra.data;
                request.start_id = data.extra.next_id;
                if (res.length == 0) {
                    utils.showLoadState("", "nodata");
                    return
                }
                utils.showLoadState("", "data");
                eachData(res);
                //打开上拉
                if (data.extra.next_id > 0) {
                    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
                }
            } else {
                mui.toast(data.error_msg);
                utils.showLoadState("", "error");
            }
        };

        function onError(xhr, errorMsg, errorThrown) {
            utils.showLoadState("", "error");
            mui.toast("网络出错了");
        };

        //显示loading
        utils.showLoadState("", "loading");
        //重置加载更多
        mui('#pullrefresh').pullRefresh().refresh(true);
        mui('#pullrefresh').pullRefresh().disablePullupToRefresh();

        utils.ajaxGet("app/xiaowu", request, onSuccess, onError);
    }

    //上划加载数据
    var pullupRefresh = function () {
        var pullObj = this;

        function onSuccess(data, textStatus, xhr) {
            if (data.error_code == 1000) {
                request.start_id = data.extra.next_id;
                var res = data.extra.data;
                eachData(res);
                pullObj.endPullupToRefresh((data.extra.next_id < 0));
            } else {
                mui.toast(data.error_msg);
                pullObj.endPullupToRefresh(false);
            }
        };

        function onError(xhr, errorMsg, errorThrown) {
            mui.toast("网络出错了");
            pullObj.endPullupToRefresh(false);
        };

        utils.ajaxGet("app/xiaowu", request, onSuccess, onError);
    };

    var eachData = function (res) {
        var html = "";
        for (var i = 0; i < res.length; i++) {
            //          html += "<div class='div2' itemid='" + res[i].content_id + "'><a title='" + res[i].title + "' class='span1'>" + res[i].title + "</a><span class='span2'>" + res[i].date + "</span></div>";
            if (res[i].image_url) {
                html += "<div class='list-cont' share_url='" + res[i].share_url + "'><div class='title'>" + res[i].title + "</div><div class='cont-img'><img src='" + res[i].image_url + "' /></div><div class='note'>" + res[i].date + "</div></div>";
            } else {
                html += "<div class='list-cont' share_url='" + res[i].share_url + "'><div class='title'>" + res[i].title + "</div><div class='note'>" + res[i].date + "</div></div>";
            }
        }
        $(".content").append(html);
    }
});