const engine = typeof browser === 'undefined' ? chrome : browser;

polling();

function polling() {
    const importTarget = document.querySelectorAll('div.comment_box div.boxhead > div.h');
    if(importTarget.length > 0) {
        console.log(importTarget.length);
        main(engine, document);
    } else {
        setTimeout(polling, 500);
    }
}

function main(browser, document) {
    console.log("start");
    const importTarget = document.querySelectorAll('div.comment_box div.boxhead > div.h');
    const config = {
        //"sender": "console"
        "sender": "sendMessage"
    }
    importButtons();
    newWindow(0, "markdown!");

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
            console.log("sendMessage: id:" + commentId + ",text :" + text);
                sendComment(0, text);
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
        browser.runtime.sendMessage({ "command": "sendComment", "id": id, "text": text});
        /*
        taskId = setTimeout(function() {
            newWindow(id)
        }, 100);
        */
    }

    function newWindow(id, text) {
        browser.runtime.sendMessage({"command": "newWindow", "id": id});
        //browser.runtime.sendMessage({"command": "sendComment", "id": id, "text": text});
    }

    function cancelNewWindow() {
        clearTimeout(taskId);
    }

    /* sendMessageのプロトコル：バックグラウンドの各ウィンドウへのブロードキャストなので注意
     * Discoverメッセージ：指定したIDのウィンドウが確認する。
     * 各ウィンドウが受信：Reply返信
     * 返信がない（まだウィンドウがない）ときはNewWindowメッセージを送る。
     * 改めてDiscoverメッセージを送信。
     */
}