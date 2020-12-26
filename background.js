/**
 * BFF Tool v0.1
 * Copyright 2020 hqwhqwhq (https://github.com/hqwhqwhq/BFFTool)
 * Licensed under MIT (https://github.com/hqwhqwhq/BFFTool/blob/main/LICENSE)
 */
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(request) {

        var xhr = new XMLHttpRequest();

        if (request.requestMethod === "GET") {
            let urlSuffix = ""

            Object.entries(JSON.parse(request.params)).forEach(([key, value]) => {
                if (!!urlSuffix) {
                    urlSuffix += "&" + key + "=" + value
                } else {
                    urlSuffix += key + "=" + value
                }
            });

            request.url += "?" + urlSuffix

            xhr.open(request.requestMethod, request.url)

            xhr.send()
        } else {
            xhr.open(request.requestMethod, request.url)

            var blob = new Blob([request.params], {type: 'application/json'})
            xhr.send(blob)
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    port.postMessage(xhr.responseText)
                } else {
                    port.postMessage('{"error": "Failed, please check your input or network!"}')
                }
            }
        }
    })
})
