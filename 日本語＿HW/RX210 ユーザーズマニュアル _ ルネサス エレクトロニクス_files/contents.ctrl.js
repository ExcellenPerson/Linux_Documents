;
var renesasWebManualApp = (function($){
	'use strict';
	jQuery.support.cors = true;
//	var DATA_SERVER="http://starless.artteknika.com/renesas_multi_manual2/proxy.php"


	var onDomLoaded = function(){
		var $categoryList={};

		if($("#property_language").html()=="en"){
			$(".lang").html("Japanese");
			$("#menu_tu .tab").addClass("eng");
		}else{
			$(".lang").html("English");
		}
		if($.cookie("menu") == "close"){
			$("#menu").toggleClass("menu_close");
			$("#content").toggleClass("content_menu_close");
		}

		// ajax error handling.
		$.ajaxSetup({
			cache: false,
			timeout: 30 * 100,
			//dataType: 'json',
			error: function(XMLHttpRequest, textStatus, errorThrown){
				if(textStatus == 'timeout'){
//					alert('Timeout.');
				}else{
					console.log(XMLHttpRequest.status);
					console.log(textStatus);
					console.log(errorThrown); // 403 で Forbidden
					
					if(XMLHttpRequest.status == 403){
						window.location = window.location.href;
					}else{
//						alert('エラーが発生しました');
					}
				}
			}
		});

		// set toc list
		var setNaviList = function(data,tgt,inapos){

			$(tgt).append("<ul>");
			for (var i=0;i < data.length;i++) {

				$(tgt).find("> ul:last").append("<li class=smenu>");
				$(tgt).find("li:last").append('<a>');
				$(tgt).find("a:last").attr('url' ,data[i]['href']);
				$(tgt).find("a:last").text(data[i]['title']);
				var apos = inapos===null?i:inapos + ',' + i;
				$(tgt).find("a:last").attr('apos' ,apos);
				if($.isArray(data[i]['child'])){
					$(tgt).find("a:last").after('<div class="open"></div>');
					setNaviList(data[i]['child'],$(tgt).find("li:last"),apos);
				}
			}

		}

		// left navi
		var getTocList = function(){

			var deferred = new $.Deferred();
			$.ajaxSetup({
				dataType: 'json'
			});
			$.get('__toc.json?' + Math.round(), function(data){
				if(typeof(data)=="string"){
					$categoryList={'current_lang': $.parseJSON(data)};
				}else{
					$categoryList = {'current_lang': data};
				}

				var urlparam = location.href.split("?")[1];
				setNaviList(data,$(".menu_index_list"),null);

				getContents(location.href);

				deferred.resolve();
			});
			return deferred.promise();
		};

		// get FAQ
		var getFAQ= function(){

			var layer_id={
				"RX110":"175377",
				"RX111":"175378",
				"RX210":"112384",
				"RX21A":"158110",
				"RX220":"167804",
				"RX62N_RX621":"3011",
				"RX62T":"106552",
				"RX610":"3010",
				"RX62G":"115925",
				"RX630":"112217",
				"RX63N_RX631":"112234",
				"RX63T":"115924",
				"RX64M":"186406",
				"RL78_G10":"175355",
				"RL78_G12":"115081",
				"RL78_G13":"115082",
				"RL78_G14":"115085",
				"RL78_G1A":"145847",
				"RL78_G1C":"169408",
				"RL78_G1E":"158211",
				"RL78_G1G":"187412",
				"RL78_L12":"158037",
				"RL78_L13":"167957",
				"RL78_L1C":"185668"
			};
			var lang_url={
				"ja":"japan",
				"en":"www"
			};
			var lang_cd={
				"ja":"jp",
				"en":"gl"
			};


			var data = {
				LOCATION:"",
				SCREEN_ID:"ViewFAQSearch",
				LAYER_LEVEL:4,
				LAYER_NAME:"undefined",
				FUNCTION_ID:"",
				FUNCTION_LEVEL:"",
				FUNCTION_NAME:"",
				KEYWORD:"",
				EXECUTE_ACTION:"narrowDown",
				DISP_PAGE:1,
				CONCEPTS:"",
				PUT_FQL:"layer",
				KEYWORD_FLG:0,
				INPUT_KEYWORD:"キーワード",
				SHOW_ITEM:200,
				SORT_KBN:"-issuedate",
				keywordFilter:"",
				layerNameFilter:"",
				functionNameFilter:""
			};

			data["LAYER_ID"] = layer_id[$("#property_product_name").html()];
			data["LANGUAGE_CD"] = layer_id[$("#property_language").html()];
			var url = "http://" +lang_url[$("#property_language").html()] + ".renesas.com/request"

			var param=""
			for (var key in data) {
				param += (param.length>0) ? "&":"";
				param += key + "=" + data[key];
			}

//			url=DATA_SERVER + "?u=" + encodeURIComponent (url+"?"+param);
//			url=encodeURIComponent (url+"?"+param);
			url = "./html/faq.html";
			$.ajaxSetup({
				dataType: 'html'
			});
			var deferred = new $.Deferred();
			$.post(url, function(data){
				var resNo = data.match(/(<li class=\"faqNo\">)([\s\S]*?)(<\/li>)/g);
				var resFunc = data.match(/<li class=\"faqFunctions\">.*<\/li>/g);
				var resQ = data.match(/<li class=\"faqQ\">.*<\/li>/g);
				var resA = data.match(/<li class=\"faqA\">.*<\/li>/g);
				for(var i=0;i<resQ.length;i++){
					var q=resQ[i].match(/<a[^>].*<\/a>/);
					$("<ul><li class=\"clearfix\"><div class=\"title\"></div><div class=\"faqbox\"></div></li></ul>").appendTo('#menu_faq .menubox');
					var no = resNo[i].match(/(FAQ NO : [^\s\r\n\t]+)([\r\n\t]*)([^\r\n\t<]*)/);
					$("<p>"+no[1]+"<br>"+no[3]+"</p>").appendTo("#menu_faq .menubox .title:last");
					$("<p>"+$(resFunc[i])[0].innerHTML+"</p>").appendTo("#menu_faq .menubox .title:last");
					$("<dl><dt class=\"q\">Q</dt><dd>"+resQ[i].match(/<a[^>].*<\/a>/)[0].replace("'/support","'http://" + lang_url[$("#property_language").html()] + ".renesas.com/support")+"</dd><dt class=\"a\">A</dt><dd>"+$(resA[i])[0].innerHTML+"<dd></dl>").appendTo("#menu_faq .menubox .faqbox:last");
				}
				$("#menu_faq .count").html( resQ.length );
				if($("#property_language").html()=="en") c = "Showing results for \""+$("#property_display_product_name").html() + "\"";
				else var c = $("#property_display_product_name").html() + "に関連するFAQを表示しています";
				$("#menu_faq .menubox h1").append( " <span>(" + c +")</span>" );
				deferred.resolve();
			}).fail(function() {
					$("<span class='count'>0</span>").appendTo("#global-header #faq");
					$("<li>FAQ is not found.</li>").appendTo('#menu_faq .menubox');
			});
			return deferred.promise();
		};


		// get Technical Update
		var getTechnical_Update = function(){

			var product_url={
				"RX110":"/rx/rx100/rx110",
				"RX111":"/rx/rx100/rx111",
				"RX210":"/rx/rx200/rx210",
				"RX220":"/rx/rx200/rx220",
				"RX21A":"/rx/rx200/rx21a",
				"RX610":"/rx/rx600/rx610",
				"RX62G":"/rx/rx600/rx62g",
				"RX62N_RX621":"/rx/rx600/rx62n_621",
				"RX62T":"/rx/rx600/rx62t",
				"RX630":"/rx/rx600/rx630",
				"RX63N_RX631":"/rx/rx600/rx63n_631",
				"RX63T":"/rx/rx600/rx63t",
				"RX64M":"/rx/rx600/rx64m",
				"RL78_G10":"/rl78/rl78g1x/rl78g10",
				"RL78_G12":"/rl78/rl78g1x/rl78g12",
				"RL78_G13":"/rl78/rl78g1x/rl78g13",
				"RL78_G14":"/rl78/rl78g1x/rl78g14",
				"RL78_G1A":"/rl78/rl78g1x/rl78g1a",
				"RL78_G1C":"/rl78/rl78g1x/rl78g1c",
				"RL78_G1E":"/rl78/rl78g1x/rl78g1e",
				"RL78_G1G":"/rl78/rl78g1x/rl78g1g",
				"RL78_L12":"/rl78/rl78l1x/rl78l12",
				"RL78_L13":"/rl78/rl78l1x/rl78l13",
				"RL78_L1C":"/rl78/rl78l1x/rl78l1c"

			};
			var lang_url={
				"ja":"japan",
				"en":"www"
			};

			var url = "http://" +lang_url[$("#property_language").html()] + ".renesas.com/products/mpumcu" + product_url[$("#property_product_name").html()] + "/Technical_Update.jsp"

//			url=DATA_SERVER + "?u=" + encodeURI(url);
//			url=encodeURI(url);
			url="./html/Technical_Update.html";
			$.ajaxSetup({
				dataType: 'html'
			});
			var deferred = new $.Deferred();
			$.post(url, function(data){

				var title = data.match(/<td[^>]*>[^<]*<div class=\"column_size_title\">([\s\S]*?)<\/div>[^<]*<\/td>/img);
				var docnumber = data.match(/<td[^>]*>[^<]*<div class=\"column_size_docnumber\">([\s\S]*?)<\/div>[^<]*<\/td>/img);
				var issue = data.match(/<td[^>]*>[^<]*<div class=\"column_size_issue\">([\s\S]*?)<\/div>[^<]*<\/td>/img);
				var resfunction = data.match(/<td[^>]*>[^<]*<div class=\"column_size_function\">([\s\S]*?)<\/div>[^<]*<\/td>/img);
				var size = data.match(/<td[^>]*>[^<]*<div class=\"column_size_size\">([\s\S]*?)<\/div>[^<]*<\/td>/img);
				var productname = data.match(/<td[^>]*>[^<]*<div class=\"column_size_productname\">([\s\S]*?)<\/div>[^<]*<\/td>/img);
				var flg = data.match(/<td[^>]*>[^<]*<div class=\"column_size_flg\">([\s\S]*?)<\/div>[^<]*<\/td>/img);

				$("<table></table>").appendTo('#menu_tu .menubox').addClass("technical_update_table");
				$(".technical_update_table").append(
						$("<tr></tr>")
							.append("<th>" + ($("#property_language").html()=="en"?"Document Title":"タイトル") + "</th>")
							.append("<th>" + ($("#property_language").html()=="en"?"Doc Number<br>(Previous Number)":"ドキュメントNo.<br>(旧ドキュメントNo.)") + "</th>")
							.append("<th>" + ($("#property_language").html()=="en"?"Issue Date<br>Revision":"発行日<br>リビジョン") + "</th>")
							.append("<th>" + ($("#property_language").html()=="en"?" Classification of Information":"情報分類") + "</th>")
							.append("<th>" + ($("#property_language").html()=="en"?" Size(KB)":"サイズ(KB)") + "</th>")
				);

				for(var i=0;i<title.length;i++){
					$("#menu_tu table").append(
						$("<tr></tr>")
							.append(title[i])
							.append(docnumber[i])
							.append(issue[i])
							.append(resfunction[i])
							.append(size[i])
					);
				}

				$("#menu_tu .count").html( title.length );
				if($("#property_language").html()=="en") c = "Showing results for \""+$("#property_display_product_name").html() + "\"";
				else var c = $("#property_display_product_name").html() + "に関連するテクニカルアップデートを表示しています";
				$("#menu_tu .menubox h1").append( " <span>(" + c +")</span>" );

				$("#menu_tu table").each(function(){
					$(this).find("tr:even").addClass("even");
				});
				deferred.resolve();
			}).fail(function() {
				$("<span class='count'>0</span>").appendTo("#global-header #tu");
				$("<li>Technical Update is not found.</li>").appendTo('#menu_tu .menubox');
			});
			return deferred.promise();
		};



		// get Another Toc
		var getAnotherToc= function(){
			var lang = $("#property_language").html()=="en"?"ja":"en";
			var url = "../" + $("#property_product_name").html() + "_" + lang + "/__toc.json";
			$.ajaxSetup({
				dataType: 'json'
			});
			var deferred = new $.Deferred();
			$.get(url, function(data){
				$(".langbox").show();
				if(typeof(data)=="string"){
					$categoryList["another_lang"] = $.parseJSON(data);
				}else{
					$categoryList["another_lang"]= data;
				}
				deferred.resolve();
			}).fail(function() {
				$(".logo").css('right','168');
				$(".langbox").hide();
			});
			return deferred.promise();
		};

		// get main contents
		var getContents = function(url){
			try{
				if( url.split("?").length<2){
					url = $categoryList['current_lang'][0].href
				}
				var capterdir = url.split("?")[1].split("#")[0];
				var hash = url.split("?").length==2?url.split("?")[1].split("#")[1]:undefined;
				var src = hash!==undefined?capterdir+'/index.html#'+hash:capterdir+'/index.html';
				$('.contentbox iframe').attr("src",src);

				var url = hash!==undefined?"?"+capterdir+ "#"+hash:"?"+capterdir ;
				history.pushState (null,null,url);


				$(".menu_index_list .smenu .current").removeClass("current");
				var baseurl = $(".menu_index_list  a:first")[0].getAttribute("url").split("?")[0];

				var furl= ((hash!==undefined) && hash.indexOf("XREF_")==-1) ? baseurl+"?"+capterdir+"#"+hash:baseurl+"?"+capterdir;
				setCurrentMenu(furl);
				return;


				var filter ="[url='"+furl+"']";

				$(filter,".menu_index_list .smenu").addClass("current");

				$(".current").next("div").next("ul").slideDown();
				$(".current").next("div").removeClass("open");

				$(".current").parents().each(function () {
					if(this.tagName=="UL"){
						$(this).slideDown();
						$(this).next("div").removeClass("open");
					}else if($(this).hasClass("menu_index_list")){
						return false;
					}
				});

				if( ($(window).height()-100 < $(".current").offset().top )|| ($(".current").offset().top < 50)){
					$('.menu_index_list').scrollTop($('.menu_index_list').scrollTop()+$(".current").offset().top-50);
				}
			}catch( e ){
			}
		};


		// set menu current
		var setCurrentMenu = function(url){
			try{


				var filter ="[url='"+url+"']";

				$(filter,".menu_index_list .smenu").addClass("current");

				$(".current").next("div").next("ul").slideDown();
				$(".current").next("div").removeClass("open");

				$(".current").parents().each(function () {
					if(this.tagName=="UL"){
						$(this).slideDown();
					}else if(this.tagName=="LI"){
						$(this).children("div").removeClass("open");
					}else if($(this).hasClass("menu_index_list")){
						return false;
					}
				});

				if( ($(window).height()-100 < $(".current").offset().top )|| ($(".current").offset().top < 50)){
					$('.menu_index_list').scrollTop($('.menu_index_list').scrollTop()+$(".current").offset().top-50);
				}
			}catch( e ){
			}
		};



		// 直列に処理
		getTocList().done(getTechnical_Update).done(getFAQ).done(function(){

			//set events

			//menu show/hide
			$(".menubtn").click(function() {

				if($("#menu").css("left") == "0px"){
					$.cookie("menu","close", { path: "/" });
					if( $(window).width() < 568 ){
						$(".logo").show();
						$(".btnbox").show();
					}
				}else{
					$.cookie("menu","open", { path: "/" });
					if( $(window).width() < 568 ){
						$(".logo").hide();
						$(".btnbox").hide();
					}
				}
				$("#menu").toggleClass("menu_close");
				$("#content").toggleClass("content_menu_close");
			});

			//menu list open/close
			$(".smenu div").click(function(){
				$(this).next("ul").slideToggle();
				$(this).toggleClass("open");
			});

			// menu list click
			$(".menu_index_list a").click(function(){
				$(this).next("div").next("ul").slideDown();
				$(this).next("div").removeClass("open");

				//get Contents HTML
				getContents($(this).attr("url"));
			});

			//chage language
			$(".lang").click(function(){
				return;
				var cid = $(".current").length > 0?$(".current:first")[0].getAttribute("apos").split(","):0;
				var $acl = $categoryList['another_lang'];
				var $href;
				$.each(cid,function(i,v){
					if(typeof($acl[v]) !="undefined"){
						$href = $acl[v].href;
						if(typeof($acl[v].child) !="undefined"){
							$acl = $acl[v].child;
						}
					}
				});
				window.location.href=typeof($href)!="undefined"?$href:$categoryList['another_lang'][0].href;
			});


			//Technical Update show/hide
			$("#menu_tu .tab").click(function(){
				$(this).toggleClass("open");
				$(this).next(".menubox").toggle();
				$(this).parent().css("z-index","1000");
				$(".menu_faq ,.menu_search").css("z-index","1001");
				$(".menu_faq .tab,.menu_search .tab").removeClass("open");
				$(".menu_faq .menubox,.menu_search .menubox").hide();
				$(".menu_faq,.menu_search").width(0);

				if($(this).hasClass('open')){
					$(this).parent().width(parseInt($("#content").width())-74);
				}else{
					$(this).parent().width(0);
				}
			});

			//FAQ show/hide
			$("#menu_faq .tab").click(function(){

				$(this).toggleClass("open");
				$(this).next(".menubox").toggle();
				$(this).parent().css("z-index","1000");
				$(".menu_tu ,.menu_search").css("z-index","1001");
				$(".menu_tu .tab,.menu_search .tab").removeClass("open");
				$(".menu_tu .menubox,.menu_search .menubox").hide();
				$(".menu_tu,.menu_search").width(0);

				if($(this).hasClass('open')){
					$(this).parent().width(parseInt($("#content").width())-74);
				}else{
					$(this).parent().width(0);
				}
			});

			//Search show/hide
			$(".menu_search .tab").click(function(){

				$(this).toggleClass("open");
				$(this).next(".menubox").toggle();
				$(this).parent().css("z-index","1000");
				$(".menu_tu ,.menu_faq").css("z-index","1001");
				$(".menu_tu .tab,.menu_faq .tab").removeClass("open");
				$(".menu_tu .menubox,.menu_faq .menubox").hide();
				$(".menu_tu,.menu_faq").width(0);

				if($(this).hasClass('open')){
					$(this).parent().width(parseInt($("#content").width())-74);
				}else{
					$(this).parent().width(0);
				}
			});


			//Technical Update show/hide
			$("#menu_tu .tab_tu").click(function(){
				$('#menu_faq').css("z-index","1001");
				$('#menu_tu').css("z-index","1000");
				$('#menu_tu .menubox').toggle();
				$("#menu_tu .tab_tu").toggleClass("open");

				if($("#menu_faq .tab_faq").hasClass("open")){
					$("#menu_faq .tab_faq").toggleClass("open");
					$('#menu_faq .menubox').toggle();
					$('#menu_faq').width(0);
				}

				if($('#menu_tu .menubox').css("display")=="none"){
					$('#menu_tu').width(0);
				}else{
					$('#menu_tu').width(parseInt($("#content").width())-74);
				}
			});

			//FAQ show/hide
			$("#menu_faq .tab_faq").click(function(){

				$('#menu_tu').css("z-index","1001");
				$('#menu_faq').css("z-index","1000");
				$('#menu_faq .menubox').toggle();
				$("#menu_faq .tab_faq").toggleClass("open");

				if($("#menu_tu .tab_tu").hasClass("open")){
					$("#menu_tu .tab_tu").toggleClass("open");
					$('#menu_tu .menubox').toggle();
					$('#menu_tu').width(0);
				}

				if($('#menu_faq .menubox').css("display")=="none"){
					$('#menu_faq').width(0);
				}else{
					$('#menu_faq').width(parseInt($("#content").width())-74);
				}
			});

			//Inquiry show/hide
			$(".inquiry").click(function(){

				if( $("#property_language").html()=="en" ) {
					var url="http://www.renesas.com/contact/index.jsp?campaign=gn_supp_home";
				}else{
					var url="http://japan.renesas.com/contact/contact_tech.html";
				}
				window.open(url);

			});

			//menu_close
			$(".allclose").click(function(){
				$(".smenu div").next("ul").hide();
				$(".smenu div").addClass("open");
			});


			//page nate
			$(".navibox .next").click(function(){
				var cid = $(".menu_index_list .current").length > 0?$(".current")[0].getAttribute("apos").split(","):0;
				var lv1_next_id = parseInt(cid[0])+1 < $categoryList['current_lang'].length ? parseInt(cid[0])+1 : $categoryList['current_lang'].length - 1;

				getContents($categoryList['current_lang'][lv1_next_id].href);

			});
			$(".navibox .prev").click(function(){
				var cid = $(".menu_index_list .current").length > 0?$(".current")[0].getAttribute("apos").split(","):0;
				var lv1_prev_id = cid[0] > 0 ? parseInt(cid[0])-1 : 0;
				getContents($categoryList['current_lang'][lv1_prev_id].href);
			});

			$(".pdf.btn").click(function(){
//				$(".doc_info").css("left",$(this).offset().left-140);
				$(".doc_info").toggle();
			});



			$('.contentbox iframe').load(function(){
				try{
					var url = $('.contentbox iframe')[0].contentDocument.location.href.replace(/\/([^\/]*)(\/index.html)/,"/?$1");
					history.pushState(null,null,url);
				}catch( e ){
				}

			});


		});


	};

	// Dom loaded.
	$(function(){
		onDomLoaded();
	});
	
	// public methods
	return {
	};
	
})(jQuery);