require.config({
    baseUrl: "../../common/",
    paths: {
        jquery: "js/jquery-2.1.4.min",
        h5utils: "js/h5_utils",
        vue: "js/vue221"
    }
});
define(function (require, exports, module) {
    var $ = require('jquery');
    var utils = require('h5utils');
    var Vue = require('vue');
    var url = utils.getBaseUrl();

    
    console.log(url);
    var is_admin = 0;

    $(function () {
          
           //获取用户id并判断是否是管理员
//          var union_id = "000803";
//             $.ajax({
//                 type:"get",
//                 url:url+"/doc-notify/v1/admin",
//                 async:false,
//                 success:function(data){
//                 	console.log(data);
//                     if(data.error_code == 1000){
//                     	for(var i=0;i<data.extra.length;i++){
//                         	if(union_id == data.extra[i].user_id){
//                     		    is_admin = 1;
//                             }
//                        }
//                     	console.log(is_admin);
//                     	if(is_admin){
//                			$(".loading").hide();     
//                     		$("#all_boxa").show();
//                     		all(union_id,is_admin);
//                     	}else{
//                     		$(".loading").hide();
//                     		$("#all_boxb").show();
//                     		all(union_id,is_admin);
//                     	}
//                     }
//             },
//            error:function(err){
//                 console.log(err);
//             }
//             });
        utils.getUserInfo(1, function (rsp) {
            if (!rsp.account_id) {
                utils.exitApp();
            }
            else {
                var union_id = rsp.union_id;
                $.ajax({
                    type: "get",
                    url: url + "/doc-notify/v1/admin",
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if (data.error_code == 1000) {
                            for (var i = 0; i < data.extra.length; i++) {
                                if (union_id == data.extra[i].user_id) {
                                    is_admin = 1;
                                }
                            }
                            console.log(is_admin);
                            if (is_admin) {
                            	$(".loading").hide();
                                $("#all_boxa").show();
                                all(union_id,is_admin);
                            } else {
                            	$(".loading").hide();
                                $("#all_boxb").show();
                                all(union_id,is_admin);
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
        });
        function all(union_id,is_admin){
        if(is_admin == 1){
         var dataApp = new Vue({
            el: "#all_boxa",
            data: {
                dataCon: null,
                dataTa: null,
            },
            mounted(){
            	
                //请求数据
                this.getdata();
                //点击导航栏
                this.centralize();
            },
            methods: {
                centralize: function () {
                    var that = this;
                    
                    //点击头部切换数据
                    that.dataCon = null;
                    $(document).on("click",".title", function () {
                    $(".con_admin").hide();
                    $(".info").hide();
                    $(".loading").show();
                    	
                        $(this).siblings().removeClass("toFocus");
                        $(this).addClass("toFocus");
                        var tag_id = $(this).attr("fid");
                        if(!tag_id){
                        	tag_id = 1;
                        }
                        $.ajax({
                            headers: {
                            union_id:union_id
                            },
                            type: "get",
                            url: url + "/doc-notify/v1/docs",
                            data: {
                                "is_admin": is_admin,
                                "tag_id": tag_id,
                            },
                            async: true,
                            success: function (data) {
                                if (data.error_code == 1000) {
                                	$(".info").hide();
				                    $(".loading").hide();  				                  
				                    $(".con_admin").show();                              	
                                    that.dataCon = data.extra.data;
                                    console.log(data);
                                }
                                if(data.error_code == 1002){
                                	$(".loading").hide(); 
                                	 $(".con_admin").hide();
                                	$(".info").show();
                                }

                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });

                    })
                    
                    $(document).on("click", ".mor", function (e) {
                        console.log("点击回执详情");
                        var fid = $(this).attr("fid");
                        var name = $(this).attr("fida");
                        console.log(fid);
                        var para = {"fid": fid,"name":name};
                        utils.openNewWindow("status.html", para);
                          e.stopPropagation(); 
                          //终止冒泡的方法

                    })
                    
                    $(document).on("click", "li", function () {
                        console.log("点击消息详情");
                        var fid = $(this).attr("fid");
                        var time = $(this).find(".time").text();
                        var name = $(this).find(".name").text();
                        console.log($(this).find(".time").text());
                        console.log(fid);
                        var para = {"fid": fid, "time": time,"name":name,"isReload":true};
                        utils.openNewWindow("detail.html",para);
                    })
                    
                    
                    
                },
                getdata: function () {
                    var that = this;
                    console.log("-----getdata------");
                    //获取头部列表
                    $.ajax({
                        headers: {
                            union_id:union_id
                        },
                        type: "get",
                        url: url + "/doc-notify/v1/tags",
                        data: {
                            "is_admin": is_admin
                        },
                        dataType: "json",
                        async: true,
                        success: function (data) {
                            console.log("------获取头部列表------");
                            console.log(data);
                            if (data.error_code == 1000) {
                            	that.dataTa = data.extra;
                            	if(document.body.clientWidth <= 500){
                            	setTimeout(function(){
                            		that.update(".conBox", ".title");
                            	},200); 
                            	}
                            	setTimeout(function(){
                            	$(".box .title:eq(0)").trigger("click");                               		
                            	},200);


                               
                        }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });


                },
                update: function (content, list) {

                    var boxWidth = $(".box").find(list).length * $(list).width() + 50;
                    console.log("--------" + boxWidth);
                    $(".box").width(boxWidth);
                    var _start = 0,
                        _end = 0,
                        _content = $(content)[0],
                        leftTip;
                    _content.addEventListener("touchstart", touchStart, false);
                    _content.addEventListener("touchmove", touchMove, false);
                    _content.addEventListener("touchend", touchEnd, false);
                    function touchStart(event) {
                        var touch = event.targetTouches[0];
                        _start = touch.pageX;
                        console.log(_start);
                    }

                    function touchMove(event) {
                        var touch = event.targetTouches[0];
                        _end = (_start - touch.pageX);
                        $(".box").css("margin-left", -_end + leftTip)
                    }

                    function touchEnd(event) {
                        leftTip = parseInt($(".box").css("margin-left"))
                        if (leftTip >= 20) {
                            $(".box").css("margin-left", "0");
                            leftTip = 0;
                        } else if (leftTip <= -boxWidth + $(window).width()) {
                            $(".box").css("margin-left", -boxWidth + $(window).width() + 15);
                            leftTip = -boxWidth + $(window).width();
                        }
                        console.log("最后" + leftTip);
                        if (parseInt(_end) > 0) {
                            console.log("左滑 " + _end);

                        } else if (parseInt(_end) < 0 && $(document).scrollTop() == 0) {
                            console.log("右滑 " + _end);
                        }
                    }
                }
                

            }

        });        		
        	}
        	else if(is_admin == 0){
        var dataApp_b = new Vue({
            el: "#all_boxb",
            data: {
                dataConb: null,
                dataTb:null

            },
            mounted(){
                //请求数据
                this.getdata();
                //点击导航栏
                this.centralize();
            },
            methods: {
                //设置点击滑动事件
                centralize: function () {
                    var that = this;
                    //点击切换数据
                    $(document).on("click",".title_con", function () {
                    	that.dataConb = null;
	                    $(".con_user").hide();
	                    $(".info").hide();
	                    $(".loading").show();                    	
                    	$(".title_con").removeClass("toFocus");
                        $(this).addClass("toFocus");
                        var tag_id = $(this).attr("fid");
                        console.log(tag_id);
                        $.ajax({
                            headers: {
                            union_id:union_id
                            },
                            type: "get",
                            url: url + "/doc-notify/v1/docs",
                            data: {
                                "is_admin": 0,
                                "tag_id": tag_id,
                            },
                            async: true,
                            success: function (data) {
                            	console.log(data);
                            	if(data.error_code == 1000){
                            	$(".info").hide();	
		 	                    $(".loading").hide();
			                    $(".con_user").show();                              		
                                that.dataConb = data.extra.data;                            		
                            	}
                            	if(data.error_code == 1002){
                            		$(".con_user").hide();
                                	$(".loading").hide(); 
                                	$(".info").show();
                                }

                               
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });

                    })
                    
                    $(document).on("click", "li", function () {
                        console.log("点击消息详情");
                        var fid = $(this).attr("fid");
                        var time = $(this).find(".time").text();
                        var name = $(this).find(".name").text();
                        console.log($(this).find(".time").text());
                        console.log(fid);
                        var para = {"fid": fid, "time": time,"name":name,"isReload":true};
                        utils.openNewWindow("detail.html", para);
                    })
                },
                getdata: function () {
                    var that = this;
                    console.log("-----getdatab------");
                    //获取头部列表
                    $.ajax({
                        headers: {
                            union_id:union_id
                        },
                        type: "get",
                        url: url + "/doc-notify/v1/tags",
                        data: {
                            "is_admin": 0
                        },
                        dataType: "json",
                        async: true,
                        success: function (data) {
                            console.log("------头部2------");
                            console.log(data);

                            if (data.error_code == 1000) {
                            	that.dataTb = data.extra;
                            	if(document.body.clientWidth <= 500){
	                            	setTimeout(function(){
	                            		that.update(".conBox", ".titleb");

	                            	},200);                             		
                            	}
                            	setTimeout(function(){
                                    $(".titleb .title_con:eq(0)").trigger("click");                     		
                            	},200);                         	
                          	
                            }


                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });


                },
                update: function (content, list) {

                    var boxWidth = $(".box").find(list).length * $(list).width() + 50;
                    console.log("--------" + boxWidth);
                    $(".box").width(boxWidth);
                    var _start = 0,
                        _end = 0,
                        _content = $(content)[0],
                        leftTip;
                    _content.addEventListener("touchstart", touchStart, false);
                    _content.addEventListener("touchmove", touchMove, false);
                    _content.addEventListener("touchend", touchEnd, false);
                    function touchStart(event) {
                        var touch = event.targetTouches[0];
                        _start = touch.pageX;
                        console.log(_start);
                    }

                    function touchMove(event) {
                        var touch = event.targetTouches[0];
                        _end = (_start - touch.pageX);
                        $(".box").css("margin-left", -_end + leftTip)
                    }

                    function touchEnd(event) {
                        leftTip = parseInt($(".box").css("margin-left"))
                        if (leftTip >= 20) {
                            $(".box").css("margin-left", "0");
                            leftTip = 0;
                        } else if (leftTip <= -boxWidth + $(window).width()) {
                            $(".box").css("margin-left", -boxWidth + $(window).width() + 15);
                            leftTip = -boxWidth + $(window).width();
                        }
                        console.log("最后" + leftTip);
                        if (parseInt(_end) > 0) {
                            console.log("左滑 " + _end);

                        } else if (parseInt(_end) < 0 && $(document).scrollTop() == 0) {
                            console.log("右滑 " + _end);
                        }
                    }
                },
    myfilter:function(content){
    	if(content<99){
    		return content;
    	}else{
    		var content = "99+";
    		return content;
    	}
    }

            }

        });             		
        	}

  	
        	
        }



    })


})