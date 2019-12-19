(function (browser) {
  browser.runtime.onMessage.addListener(notify);
  let id = 0;
  console.log("subscriber");

  function notify(message) {
    if (message.command !== 'sendComment') {
      return;
    }

    if (message.id !== id) {
      return;
    }

    if (message.text) {
      var compile = marked;
      setContent(message.text);
    }

    function setContent(content) {
      document.querySelector('#content_parent').innerHTML = compile(content);
    }

  }
})(typeof browser === 'undefined' ? chrome : browser);