;
var ua = window.navigator.userAgent.toLowerCase();
if( (window.parent.location.href == window.location.href) && (ua.indexOf('googlebot')==-1) ){
	urls=location.href.replace("index.html","").split("/");
	if(urls.length>2){
		window.location.href = location.href.replace("index.html","").replace("/"+urls[urls.length-2]+"/","?"+urls[urls.length-2])
	}
}
