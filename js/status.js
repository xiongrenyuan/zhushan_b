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
    console.log(url);
    var fid = utils.getQueryParam("fid");
    var name =  utils.getQueryParam("name");
//
//  var fid = 2;
    console.log(fid);
    
    $(function(){
    	$("title").text(name);
    	var dataApp = new Vue({
    		el:"#all_box",
    		data:{
    			dataCon:null,
    		},
    		mounted(){
    			this.getdata();
    		},
    		methods:{
    			getdata:function(){
    				var that = this;
    				$.ajax({
    					type:"get",
    					url:url+"/doc-notify/v1/+"+fid+"/receipt",
    					async:true,
    					success:function(data){
    						console.log(data);
    				       if(data.error_code == 1000&&data.extra!=null){
    				   
    				       	    $(".loading").hide();
    				       	    $(".info").hide();
    				       	    $(".all_box").show();
    				       		that.dataCon = data.extra;
    				       		console.log(that.dataCon);
    				       }
    				       else{
    				       	    $(".loading").hide();
    				       	    $(".all_box").hide();
    				       	    $(".info").show();
    				       }
    						
    					},
    					error:function(err){
    						console.log(err);
    					}
    				});
    			}
    			
    		}
    		
    		
    	})
    })
    
    
    
    
    
    
    
    
    
    
})