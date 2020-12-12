/**
 * BFF Tool v0.1
 * Copyright 2020 hqwhqwhq (https://github.com/hqwhqwhq/BFFTool)
 * Licensed under MIT (https://github.com/hqwhqwhq/BFFTool/blob/main/LICENSE)
 */
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        var xhr = new XMLHttpRequest();

        xhr.open(msg.requestMethod, msg.url)

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    port.postMessage(xhr.responseText)
                } else {
                    port.postMessage('{"error": "Failed, please check your input or network!"}')
                }
            }
        }

        var blob = new Blob([msg.params], {type: 'application/json'})
        xhr.send(blob)
    })
})