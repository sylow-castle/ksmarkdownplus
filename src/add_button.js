const engine = typeof browser === 'undefined' ? chrome : browser;

polling();

function polling() {
    const importTarget = document.querySelectorAll('div.comment_box div.boxhead > div.h');
    if (importTarget.length > 0) {
        main(engine, document);
    } else {
        setTimeout(polling, 100);
    }
}

function main(browser, document) {
    var cancelTaskId = null;
    console.log("start");
    const importTarget = document.querySelectorAll('div.comment_box div.boxhead > div.h');
    const config = {
        //"sender": "console"
        "sender": "sendMessage"
    }
    importButtons();
    browser.runtime.onMessage.addListener(notify);

    var replyHandler = function (id, result) {
        console.log("do nothing");
        //何もしない
    };
    //newWindow(0, "markdown!");



    function importButtons() {
        const commentQuery = 'div.boxbody p';
        console.log(importTarget);
        importTarget.forEach(setup);

        function setup(elem, index) {
            console.log(index);
            const buttonElem = createMDButton(index);
            elem.appendChild(buttonElem);
            const id = buttonElem.dataset.ksMdPlustCommentId
            const text = getComment(elem).replace(/<br>/g, "\n");
            buttonElem.addEventListener('click', function () {
                MDViewerCheck();
                sender(id, text);
            });

        }

        function createMDButton(index) {
            const port = document.createElement('span');
            port.classList.add('ks_md_plus_port');

            /* portの中にこんな要素を作る
             * <span class="main_menu">
             *     <a class="ks_md_plus btn_blue">MD Viewer</a>
             * </span>
             */

            const area = document.createElement('span');
            area.classList.add('main_menu');

            const button = document.createElement('a');
            button.classList.add('btn_blue')
            button.classList.add('ks_md_plust_open_md_view')
            button.textContent = "MD Viewer";


            area.appendChild(button);
            port.setAttribute('data-ks-md-plus-comment-id', index);
            port.appendChild(area);

            return port;
        }

        function getComment(target) {
            const commentBlue = target.parentNode.parentNode;
            return commentBlue.querySelector(commentQuery).innerHTML;
        }

    }

    function sender(commentId, text) {
        switch (config.sender) {
            case "console":
            default:
                logComment();
                break;
            case "sendMessage":
                sendComment("MDViewer", text);
                break;
        }

        function logComment() {
            console.log(text);
        }

        function sendMessage() {
            // Unimplemented;
        }



    }

    let taskId = null;
    function sendComment(id, text) {
        browser.runtime.sendMessage({ "command": "sendComment", "id": id, "text": text });
        /*
        taskId = setTimeout(function() {
            newWindow(id)
        }, 100);
        */
    }

    function newWindow(id) {
        browser.runtime.sendMessage({ "command": "newWindow", "id": id });
        //browser.runtime.sendMessage({"command": "sendComment", "id": id, "text": text});
    }

    function cancelNewWindow() {
        clearTimeout(taskId);
    }

    function MDViewerCheck(id, text) {
        const mdViewer = "MDViewer";
        checkWindow(mdViewer);

        replyHandler = function (id, result) {
            console.log("called discoverHandler");
            console.log(result);
            if (result) {
                sender(mdViewer, text);
                browser.runtime.sendMessage({"command": "focusWindow", "id": mdViewer});
            } else {
                newWindow(mdViewer);
            }
        }

    }

    function checkWindow(id) {
        cancelTaskId = setTimeout(function() {
            console.log("not exist Window");
            console.log(cancelTaskId);
            releasedId(id);
        }, 500);
        const tabId = 0
        //browser.tabs.getCurrent().id;
        console.log(tabId);
        browser.runtime.sendMessage({ "command": "discoverWindow", "id": id, "tabId":tabId ,"cancelTaskId": cancelTaskId });
    }

    function releasedId(id) {
        cancelTaskId = null;
        replyHandler(id, false);
    }


    function notify(message, sender, sendResponse) {
        console.log(message);
        switch (message.command) {
            case "replyWindow":
                console.log("replyWindow");
                if (cancelTaskId === message.cancelTaskId) {
                    cancelTaskId = null;
                    clearTimeout(message.cancelTaskId);
                    replyHandler(message.id, true);
                }
                break;
            default:
                break;
        }

    }
}