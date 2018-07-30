require.config({
	baseUrl:"../../common/",
	paths:{
		jquery:"js/jquery-2.1.4.min",
		h5utils: "js/h5_utils",
		vue:"js/vue221"		
	}
});
define(function(require,exports,module){
	var $ = require('jquery');
	var utils = require('h5utils');
	var Vue = require('vue');
	var url = utils.getBaseUrl();
    
    var fid = utils.getQueryParam("fid");
//  var time = utils.getQueryParam("time").replace("%3A",":");
    var name = utils.getQueryParam("name");

//  var fid = "33";
//  var name = "test";

  utils.setTitle(name);
 
    $(function(){
    	var is_admin = 0;
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
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
//       var union_id = "000804";
   


    				$.ajax({
                         headers: {
                            union_id:union_id
                        },   					
    					type:"get",
    					url:url+"/doc-notify/v1/+"+fid+"/details",
    					async:true,
    					dataType:"json",
    					data:{
    						"is_admin": is_admin
    					},
    					success:function(data){
    					    console.log(data.error_code);
    				        if(data.error_code == 1000){
    				       		var title = data.extra.title;
    				       		var body =  data.extra.body;
//  				       		var new_body = " ";
//  				       	    var start = 0;
//  				       	        if((start = body.indexOf("<img",start)+4)!=-1){
//	    				       			console.log(start);
//	    				       			var end = body.indexOf("/>",start);
//	    				       			if((body.substring(start,end).indexOf(".png",0))!= -1){
//	    				       				console.log("change-----a");
//	    				       				var a = body.substring(0,start);
//	    				       				var b = ' class="class_big"';
//	    				       			    var c = body.substring(start);
//	    				       				new_body = a+b+c;
//	    				       			}
//	    				       			if((body.substring(start,end).indexOf(".gif",0))!= -1){
//	    				       				var a = body.substring(0,start);
//	    				       				var b = 'class="class_big"';
//	    				       			    var c = body.substring(start);
//	    				       			    new_body = a+b+c;
//	    				       			        				       			    
//	    				       			}
//	    				       			body = new_body;	    				       			
//	    				       		}       				       			   				       				

    				            $(".loading").hide(); 	
    				            $(".info").hide();
    				            $(".con_top").append('<div class="con">'+body+'</div>');

    				       	    $("#all_box").show();
    				       }else{
    				       	    $(".loading").hide();
    				       	    $("#all_box").hide();
    				       	    $(".info").show();
    				       }
    						
    					},
    					error:function(err){
    						$("#all_box").append("<p>"+ err +"</p>");
    						console.log(err);
    					}
    				});
}
           })
})
    })