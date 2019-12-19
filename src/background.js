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

  function notify(message) {
    switch (message.command) {
      case "sendComment":
        break;
      case "newWindow":
        var createData = {
          type: envir.type,
          url: "mdviewer.html",
          width: 640,
          height: 480
        };
        var creating = browser.windows.create(createData);
        break;

      default:
        return;
    }
  }
})(typeof browser === 'undefined' ? chrome : browser);