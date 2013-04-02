define(function(){

	var toggleFullScreen = function() {

		// XXX Yucky I know
		if (typeof document.fullScreen != "undefined") {
			if (document.fullScreen) {
				document.cancelFullScreen();
			} else {
				document.getElementsByTagName("body")[0].requestFullScreen();
			}
		}
		else if (typeof document.webkitIsFullScreen != "undefined") {
			if (document.webkitIsFullScreen) {
				document.webkitCancelFullScreen();
			} else {
				document.getElementsByTagName("body")[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		}
		else if (typeof document.mozFullScreen != "undefined") {
			if (document.mozFullScreen) {
				document.mozCancelFullScreen();
			} else {
				document.getElementsByTagName("body")[0].mozRequestFullScreen();
			}
		}

	};

	return {
		toggleFullScreen: toggleFullScreen
	};

});