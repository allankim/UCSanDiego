Ti.include("settings.js");

var webview1 = Ti.UI.createWebView({ 
	url:'loading.html'
});

function loadHomePage(myWindow) {
	if (Ti.Platform.osname == 'ipad') {
		startUrl += "?override=full";
		Ti.API.debug(startUrl);		
	}
	if (Ti.Network.online) {
		//webview1 = Ti.UI.createWebView({ url : startUrl });
		webview1.url = startUrl;
	} else {
        alert("This application requires your device to be online. Please enable an Internet connection or try again later.");
        var reloadButton = Titanium.UI.createButton({
        	title: 'Tap to reload',
        	eventListener: function(e) {
        		e.source.parentWindow.remove(e.source);
        		loadHomePage(e.source.parentWindow);
        	} 
        });
        myWindow.add(reloadButton);
	}
}


function loadYouTubeAsRTSP(ytc) {
	var gdataUrl = 'https://gdata.youtube.com/feeds/api/videos/' + ytc + '?v=2';
	Titanium.API.debug(gdataUrl);
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET", gdataUrl);
	xhr.onload = function()
	{
		try
		{
			var doc = this.responseXML.documentElement;
			var cList = doc.getElementsByTagName("media:content");
			Titanium.API.debug(cList.length);
			for (var i=0; i < cList.length; i++) {
				if (cList.item(i).getAttribute("yt:format") == '6') {
					Titanium.Platform.openURL(cList.item(i).getAttribute("url"));
				}
			}
		}
		catch(E)
		{
			alert(E);
		}
	};
	xhr.send();
}

// Menu

var createMenu = null;

if (Titanium.Platform.osname == 'android') {
	createMenu = function(e) {
		var menu = e.menu;
		var back = menu.add({ title: 'Back' });
		back.addEventListener("click", function(e) {
			if (webview1.canGoBack()) {
				webview1.goBack();
			}
		});
		var home = menu.add({ title: 'Home' });
		home.addEventListener("click", function(e) {
			loadHomePage();
		});
		var fwd = menu.add({ title: 'Forward' });
		fwd.addEventListener("click", function(e) {
			if (webview1.canGoForward()) {
				webview1.goForward();
			}
		});
	}
}


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//Ti.UI.setBackgroundColor(bgcolor);

var win1 = Ti.UI.createWindow({
	orientationModes : orientations,
	navBarHidden : true,
	fullscreen : false,
	exitOnClose : true,
	activity: {
		onCreateOptionsMenu: createMenu
	}
});


// Android hardware back button
win1.addEventListener('android:back',function() { 
	if (webview1 == null)  {
		win1.close();
	} else if (webview1.canGoBack()) {
		webview1.goBack();
	} else {
		win1.close();
	}
});

// Repaint on scroll for ios
win1.addEventListener('scroll',function() {
	if (Ti.Platform.osname != 'android')
		webview1.repaint();
});

// Orientation change listener: repaints on change
Ti.Gesture.addEventListener('orientationchange', function() {
	if (Ti.Platform.osname != 'android')
		webview1.repaint();
    if (bb2 != null) {
    	bb2.width = win1.width;
    }
});


// Activity indicator -- spinning thingy
// Android behavior: displays on each new page load
// iPhone behavior: displays on initial startup
// It's just that way. Blame the respective native event models.

var actInd = Titanium.UI.createActivityIndicator({
	bottom:10, 
	height:50,
	width:10,
	message: waitmsg,
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

webview1.addEventListener('beforeload', function() {
	Ti.API.debug('beforeload');
	actInd.show();
});

webview1.addEventListener('load', function() {
	Ti.API.debug('load');
	actInd.hide();
});


// iOS button bar
Ti.API.debug(Ti.Platform.osname);

if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
	var bb2 = Titanium.UI.createButtonBar({
		labels:[
		//'Back', 'Home', 'Forward'
		
			{ title: 'Back', image: 'icon_arrow_left.png' },
			{ title: 'Home', image: 'icon_home.png' },
			{ title: 'Reload', image: 'icon_refresh.png' },
			{ title: 'Forward', image: 'icon_arrow_right.png' }
		],
		backgroundColor:'#333',
		style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height: 45,
		width: win1.width,
		bottom: 0,
		borderWidth: 3,
		borderRadius: 0
	});
	bb2.addEventListener('click',function(ce)
	{
		if (ce.index == 0)
		{
			if (webview1.canGoBack()) {
				webview1.goBack();
			}
		}
		else if (ce.index == 1)
		{
			loadHomePage();
		}
		else if (ce.index == 2)
		{
			webview1.reload();
		}
		else
		{
			if (webview1.canGoForward()) {
				webview1.goForward();
			}
		}
	});

	
}

if (Ti.Platform.osname == 'android') {


	// YouTube URL override
	// Note this won't work on iOS because of how beforeload is implemented
	
	webview1.addEventListener(
		'beforeload',
		function(e) {
			Titanium.API.debug("Loading URL " + e.url);
			if (e.url.indexOf('http://www.youtube.com/watch') === 0) {
				var ytcode = e.url.substring(e.url.indexOf('v=') + 2);
				if (ytcode.indexOf('&') !== 0) {
					ytcode = ytcode.substring(0, ytcode.indexOf('&'));
				}
				Titanium.API.debug("YouTube code: " + ytcode);
				e.source.goBack();
				
				try {
					var intent = Titanium.Android.createIntent({ action: Titanium.Android.ACTION_VIEW, data: "vnd.youtube:" + ytcode });
					Titanium.Android.currentActivity.startActivity(intent);
					//Titanium.Platform.openURL("vnd.youtube:" + ytcode);
				} catch (ytexception) {
					Titanium.API.debug(ytexception);
					loadYouTubeAsRTSP(ytcode);
				}
			}
		}
	);
}


win1.add(webview1);
if (bb2 != null) {
	win1.add(bb2);
}
win1.open();
loadHomePage(win1);

