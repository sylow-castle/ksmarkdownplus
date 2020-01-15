const envir = {};

let engine, type;
if(typeof browser === 'undefined') {
  engine = chrome;
  type = "popup"
} else {
  engine = browser;
  type = "detached_panel";
}

envir.engine = engine;
envir.type = type;

(function (browser) {
  browser.runtime.onMessage.addListener(notify);
  let mdViewer = "uncreated";
  return;

  function notify(message) {
    console.log(message.command);
    switch (message.command) {
      case "focusWindow":
        readyMdViewr(mdViewer);
        break;
      case "newWindow":
        var createData = {
          type: envir.type,
          url: "mdviewer.html",
          width: 640,
          height: 480
        };
        browser.windows.create(createData, function(window) {
          mdViewer = window.id;
        });
        console.log(mdViewer);
        break;

      default:
        return;
    }
  }

  function readyMdViewr(windowId) {
    if(windowId !== "uncreated") {
      browser.windows.update(windowId, {"focused": true}, noop);
    }
  }

  function noop(window) {
  }

})(typeof browser === 'undefined' ? chrome : browser);