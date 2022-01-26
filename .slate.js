// Log that we're starting configuration
S.log("[SLATE] ----------- Started Loading Config from .slate.js -----------");

// Configs
S.cfga({
  defaultToCurrentScreen: true,
  secondsBetweenRepeat: 0.1,
  checkDefaultsOnLoad: true,
  focusCheckWidthMax: 3000,
  orderScreensLeftToRight: true,
});

// Monitors
// var monitors = {
//   laptop: "1440x900",
//   iPad: "1692x3008",
// };

// var genBrowserLapHash = function (regex) {
//   return {
//     operations: [
//       function (windowObject) {
//         var title = windowObject.title();
//         if (title !== undefined && title.match(regex)) {
//           windowObject.doop(monDellRightHash);
//         } else {
//           windowObject.doop(lapFullHash);
//         }
//       },
//     ],
//     "ignore-fail": true,
//     repeat: true,
//   };
// };

// 1 monitor layout
// var oneMonitorLayout = S.lay("oneMonitor", {
//   iTerm: lapRightHash,
//   Skype: lapRightHash,
//   Finder: lapLeftHash,
//   Code: lapLeftHash,
//   "IntelliJ IDEA": lapFullHash,
//   "Sublime Text": lapLeftHash,
//   "Google Chrome": genBrowserLapHash(/^Developer\sTools\s-\s.+$/),
// });

// 2 monitor - iPad
// var twoMonitorLayout = S.lay("twoMonitor", {
//   iTerm2: monDellRightHash,
//   Skype: lapRightHash,
//   Finder: lapLeftHash,
//   CodeKit: lapRightHash,
//   Code: monDellLeftHash,
//   "Sublime Text": monDellLeftHash,
//   "Google Chrome": genBrowserLapHash(/^Developer\sTools\s-\s.+$/),
// });

// Defaults
// S.def(2, twoMonitorLayout);
// S.def(1, oneMonitorLayout);

// Layout Operations
// var twoMonitor = S.op("layout", { name: twoMonitorLayout });
// var oneMonitor = S.op("layout", { name: oneMonitorLayout });
// var universalLayout = function () {
//   // Should probably make sure the resolutions match but w/e
//   S.log("SCREEN COUNT: " + S.screenCount());

//   // NOTE: I only have y iPad as a second onitor right now
//   if (S.screenCount() === 2) {
//     twoMonitor.run();
//   } else if (S.screenCount() === 1) {
//     oneMonitor.run();
//   }
// };

// Misc Functions
var switchScreen = function () {
  var currentScreen = S.screen();
  var nextScreen = currentScreen.id().toString();

  S.eachScreen(function (screenObject) {
    if (currentScreen.id() !== screenObject.id()) {
      nextScreen = screenObject.id().toString();
    }
  });

  return nextScreen;
};

var switchLR = function () {
  var win = S.window();
  var scr = win.screen();
  var winRect = win.rect();
  var scrRect = scr.vrect();
  var winPos = winRect.x;
  var winWidth = winRect.width;

  if (typeof scrRect === "undefined" || winWidth !== scrRect.width / 2) {
    return "top-left";
  }

  return winPos === scrRect.x ? "top-right" : "top-left";
};

S.bindAll({
  // Layout Bindings
  // "space:ctrl": universalLayout,

  // Screen bindings
  "1:alt;cmd": S.op("corner", {
    direction: "top-left",
    width: "screenSizeX",
    height: "screenSizeY",
  }),
  "2:alt;cmd": S.op("corner", {
    direction: switchLR,
    width: "screenSizeX/2",
    height: "screenSizeY",
  }),

  //   Throw bindings
  "0:alt;cmd": S.op("throw", {
    screen: switchScreen,
    width: "screenSizeX",
    height: "screenSizeY",
  }),

  // Window Hints
  "esc:cmd": S.op("hint"),

  // Grid
  "esc:ctrl": S.op("grid"),

  // Relaunch Slate
  "space:alt;cmd": S.op("relaunch"),
});

// Log that we're done configuring
S.log("[SLATE] ----------- Finished Loading Config -----------");
