(function (browser) {
  browser.runtime.onMessage.addListener(notify);
  let viewId = "MDViewer";
  console.log("subscriber");

  function notify(message) {
    if (message.id !== viewId) {
      return;
    }

    switch (message.command) {
      case 'sendComment':
        sendCommentHandler(message.text);
        break;
      case 'discoverWindow':
        discoverWindowHandler(message.cancelTaskId, message.tabId);
        break;
      default:
        break;
    }


  }

  function discoverWindowHandler(cancelTaskId, tabId) {
    console.log("called discoverHandler");
    console.log("cancelTaskId:" + cancelTaskId);
    console.log("tabId:" + tabId);
    if (cancelTaskId < 0) {
      return;
    }

    browser.tabs.query({}, function (tabs) {
      for (let tab of tabs) {
        console.log("tab.id: "+ tab.id);
        browser.tabs.sendMessage(tab.id, { "command": "replyWindow", "id": viewId, "cancelTaskId": cancelTaskId });
      }
    });

    //browser.tabs.sendMessage(tabId, {"command": "replyWindow", "id": id, "cancelTaskId": cancelTaskId});
  }


  function sendCommentHandler(text) {
    if (text) {
      var compile = function (content) {
        return DOMPurify.sanitize(marked(content));
      };

      setContent(text);
    }

    function setContent(content) {
      document.querySelector('#content_parent').innerHTML = compile(content);
    }
  }


})(typeof browser === 'undefined' ? chrome : browser);