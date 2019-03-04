// Configs
S.cfga({
	defaultToCurrentScreen: true,
	secondsBetweenRepeat: 0.1,
	checkDefaultsOnLoad: true,
	focusCheckWidthMax: 3000,
	orderScreensLeftToRight: true
});

// Monitors
var monHome = "1440x900";
var monStudio = "1920x1200";
var monLaptop = "1280x800";

// Operations
var lapFull = S.op("move", {
	screen: monLaptop,
	x: "screenOriginX",
	y: "screenOriginY",
	width: "screenSizeX",
	height: "screenSizeY"
});
var lapLeft = lapFull.dup({
	width: "screenSizeX/2"
});
var lapRight = lapLeft.dup({
	x: "screenOriginX+(screenSizeX/2)"
});
var monDellFull = lapFull.dup({
	screen: monHome
});
var monDellLeft = monDellFull.dup({
	width: "screenSizeX/2"
});
var monDellRight = monDellLeft.dup({
	x: "screenOriginX+(screenSizeX/2)"
});
var monBigFull = lapFull.dup({
	screen: monStudio
});
var monBigLeft = monBigFull.dup({
	width: "screenSizeX/2"
});
var monBigRight = monBigLeft.dup({
	x: "screenOriginX+(screenSizeX/2)"
});

// common layout hashes
var lapFullHash = {
	operations: [lapFull],
	"ignore-fail": true,
	repeat: true
};
var lapLeftHash = {
	operations: [lapLeft],
	"ignore-fail": true,
	repeat: true
};
var lapRightHash = {
	operations: [lapRight],
	"ignore-fail": true,
	repeat: true
};
var monDellFullHash = {
	operations: [monDellFull],
	"ignore-fail": true,
	repeat: true
};
var monDellLeftHash = {
	operations: [monDellLeft],
	"ignore-fail": true,
	repeat: true
};
var monDellRightHash = {
	operations: [monDellRight],
	"ignore-fail": true,
	repeat: true
};
var monBigFullHash = {
	operations: [monBigFull],
	"ignore-fail": true,
	repeat: true
};
var monBigLeftHash = {
	operations: [monBigLeft],
	"ignore-fail": true,
	repeat: true
};
var monBigRightHash = {
	operations: [monBigRight],
	"ignore-fail": true,
	repeat: true
};
var genBrowserLapHash = function(regex) {
	return {
		operations: [
			function(windowObject) {
				var title = windowObject.title();
				if (title !== undefined && title.match(regex)) {
					windowObject.doop(monDellRightHash);
				} else {
					windowObject.doop(lapFullHash);
				}
			}
		],
		"ignore-fail": true,
		repeat: true
	};
};
var genBrowserBigHash = function(regex) {
	return {
		operations: [
			function(windowObject) {
				var title = windowObject.title();
				if (title !== undefined && title.match(regex)) {
					windowObject.doOperation(monBigRight);
				} else {
					windowObject.doOperation(lapFull);
				}
			}
		],
		"ignore-fail": true,
		repeat: true
	};
};

// 1 monitor layout
var oneMonitorLayout = S.lay("oneMonitor", {
	Mail: lapFullHash,
	iTerm2: lapRightHash,
	Skype: lapRightHash,
	Finder: lapLeftHash,
	Code: lapLeftHash,
	"IntelliJ IDEA": lapFullHash,
	"Sublime Text": lapLeftHash,
	"Google Chrome": genBrowserLapHash(/^Developer\sTools\s-\s.+$/)
});

// 2 monitor - Home
var twoMonitorLayout = S.lay("twoMonitor", {
	iTerm2: monDellRightHash,
	Skype: lapRightHash,
	Finder: lapLeftHash,
	CodeKit: lapRightHash,
	Code: monDellLeftHash,
	"Sublime Text": monDellLeftHash,
	"Google Chrome": genBrowserLapHash(/^Developer\sTools\s-\s.+$/)
});

// 2 monitor - Studio
var twoMonitorBigLayout = S.lay("twoMonitorBig", {
	Mail: lapFullHash,
	Skype: lapRightHash,
	iTunes: lapFullHash,
	Atom: monBigLeftHash,
	Evernote: lapFullHash,
	iTerm2: monBigRightHash,
	Finder: monBigLeftHash,
	Code: monBigLeftHash,
	"Git Gui": monBigLeftHash,
	"Sequel Pro": lapFullHash,
	"IntelliJ IDEA": monBigFullHash,
	"Sublime Text": monBigLeftHash,
	Safari: genBrowserBigHash(/^Web\sInspector\s.+$/),
	"Google Chrome": genBrowserBigHash(/^Developer\sTools\s-\s.+$/)
});

// Defaults
// TODO: use second monitor size as variable
// S.def(2, twoMonitorLayout);
// S.def(1, oneMonitorLayout);

// Layout Operations
var twoMonitorBig = S.op("layout", {
	name: twoMonitorBigLayout
});
var twoMonitor = S.op("layout", {
	name: twoMonitorLayout
});
var oneMonitor = S.op("layout", {
	name: oneMonitorLayout
});
var universalLayout = function() {
	S.log("SCREEN COUNT: " + S.screenCount());

	if (S.screenCount() === 2) {
		S.eachScreen(function(screenObject) {
			var screenRect = screenObject.rect(),
				screenWidth = screenRect.width;

			// TODO: use second monitor size variable
			if (screenWidth !== 1280) {
				if (screenWidth > 1440) {
					twoMonitorBig.run();
				} else {
					twoMonitor.run();
				}
			}
		});
	} else if (S.screenCount() === 1) {
		oneMonitor.run();
	}
};

// Misc Functions
var switchScreen = function() {
	var screenId,
		currentScreen = S.screen();

	S.eachScreen(function(screenObject) {
		if (currentScreen.id() !== screenObject.id()) {
			screenId = screenObject.id().toString();
		}
	});
	return screenId;
};

var switchLR = function() {
	var pos,
		win = S.window(),
		scr = win.screen(),
		winRect = win.rect(),
		scrRect = scr.vrect(),
		winPos = winRect.x,
		winWidth = winRect.width;

	if (typeof scrRect === "undefined" || winWidth !== scrRect.width / 2) {
		pos = "top-left";
	} else {
		pos = winPos === scrRect.x ? "top-right" : "top-left";
	}

	return pos;
};

// Batch bind everything. Less typing.
S.bnda({
	// Layout Bindings
	//   "padEnter:ctrl" : universalLayout,
	"space:ctrl": universalLayout,

	//   // Basic Location Bindings
	//   "pad0:ctrl" : lapLeft,
	//   "[:ctrl" : lapLeft,
	//   "pad.:ctrl" : lapRight,
	//   "]:ctrl" : lapRight,
	//   "pad1:ctrl" : tboltLLeftBot,
	//   "pad2:ctrl" : tboltLMidBot,
	//   "pad3:ctrl" : tboltLRightBot,
	//   "pad4:ctrl" : tboltLLeftTop,
	//   "pad5:ctrl" : tboltLMidTop,
	//   "pad6:ctrl" : tboltLRightTop,
	//   "pad7:ctrl" : tboltLLeft,
	//   "pad8:ctrl" : tboltLMid,
	//   "pad9:ctrl" : tboltLRight,
	//   "pad=:ctrl" : tboltLFull,
	//   "pad1:alt" : tboltRLeftBot,
	//   "pad2:alt" : tboltRMidBot,
	//   "pad3:alt" : tboltRRightBot,
	//   "pad4:alt" : tboltRLeftTop,
	//   "pad5:alt" : tboltRMidTop,
	//   "pad6:alt" : tboltRRightTop,
	//   "pad7:alt" : tboltRLeft,
	//   "pad8:alt" : tboltRMid,
	//   "pad9:alt" : tboltRRight,
	//   "pad=:alt" : tboltRFull,

	//   // Resize Bindings
	//   // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
	//   "right:ctrl" : S.op("resize", { "width" : "+10%", "height" : "+0" }),
	//   "left:ctrl" : S.op("resize", { "width" : "-10%", "height" : "+0" }),
	//   "up:ctrl" : S.op("resize", { "width" : "+0", "height" : "-10%" }),
	//   "down:ctrl" : S.op("resize", { "width" : "+0", "height" : "+10%" }),
	//   // "right:alt" : S.op("resize", { "width" : "-10%", "height" : "+0", "anchor" : "bottom-right" }),
	//   // "left:alt" : S.op("resize", { "width" : "+10%", "height" : "+0", "anchor" : "bottom-right" }),
	//   // "up:alt" : S.op("resize", { "width" : "+0", "height" : "+10%", "anchor" : "bottom-right" }),
	//   // "down:alt" : S.op("resize", { "width" : "+0", "height" : "-10%", "anchor" : "bottom-right" }),

	//   // Push Bindings
	//   // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
	//   "right:cmd;alt" : S.op("push", { "direction" : "right", "style" : "bar-resize:screenSizeX/2" }),
	//   "left:cmd;alt" : S.op("push", { "direction" : "left", "style" : "bar-resize:screenSizeX/2" }),
	//   "up:ctrl;shift" : S.op("push", { "direction" : "up", "style" : "bar-resize:screenSizeY/2" }),
	//   "down:ctrl;shift" : S.op("push", { "direction" : "down", "style" : "bar-resize:screenSizeY/2" }),

	//   // Nudge Bindings
	//   // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
	//   "right:ctrl;alt" : S.op("nudge", { "x" : "+10%", "y" : "+0" }),
	//   "left:ctrl;alt" : S.op("nudge", { "x" : "-10%", "y" : "+0" }),
	//   "up:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "-10%" }),
	//   "down:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "+10%" }),

	// Throw Bindings
	"1:alt;cmd": S.op("corner", {
		direction: "top-left",
		width: "screenSizeX",
		height: "screenSizeY"
	}),
	"2:alt;cmd": S.op("corner", {
		direction: switchLR,
		width: "screenSizeX/2",
		height: "screenSizeY"
	}),
	"9:alt;cmd": S.op("throw", {
		screen: switchScreen,
		x: "(screenSizeX-windowSizeX)/2"
	}),
	"0:alt;cmd": S.op("throw", {
		screen: switchScreen,
		width: "screenSizeX",
		height: "screenSizeY"
	}),

	//   // Focus Bindings
	//   // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
	//   // "l:cmd" : S.op("focus", { "direction" : "right" }),
	//   // "h:cmd" : S.op("focus", { "direction" : "left" }),
	//   // "k:cmd" : S.op("focus", { "direction" : "up" }),
	//   // "j:cmd" : S.op("focus", { "direction" : "down" }),
	//   // "k:cmd;alt" : S.op("focus", { "direction" : "behind" }),
	//   // "j:cmd;alt" : S.op("focus", { "direction" : "behind" }),
	//   // "right:cmd" : S.op("focus", { "direction" : "right" }),
	//   // "left:cmd" : S.op("focus", { "direction" : "left" }),
	//   // "up:cmd" : S.op("focus", { "direction" : "up" }),
	//   // "down:cmd" : S.op("focus", { "direction" : "down" }),
	//   // "up:cmd;alt" : S.op("focus", { "direction" : "behind" }),
	//   // "down:cmd;alt" : S.op("focus", { "direction" : "behind" }),

	// Window Hints
	"esc:cmd": S.op("hint"),

	//   // Switch currently doesn't work well so I'm commenting it out until I fix it.
	//   //"tab:cmd" : S.op("switch"),

	// Grid
	"esc:ctrl": S.op("grid"),

	// Relaunch Slate
	"space:alt;cmd": S.op("relaunch")
});

// // Test Cases
// // S.src(".slate.test", true);
// // S.src(".slate.test.js", true);

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");
