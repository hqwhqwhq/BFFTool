/**
 * BFF Tool v0.1
 * Copyright 2020 hqwhqwhq (https://github.com/hqwhqwhq/BFFTool)
 * Licensed under MIT (https://github.com/hqwhqwhq/BFFTool/blob/main/LICENSE)
 */
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(request) {

        var xhr = new XMLHttpRequest();

        var url = generateCompletedUrl(request.urlPrefix, request.url)

        if (request.requestMethod === "GET") {
            let urlSuffix = ""

            if (request.params) {
                Object.entries(JSON.parse(request.params)).forEach(([key, value]) => {
                    if (!!urlSuffix) {
                        urlSuffix += "&" + key + "=" + value
                    } else {
                        urlSuffix += key + "=" + value
                    }
                });

                url += "?" + urlSuffix
            }


            xhr.open(request.requestMethod, url)
            mergerHeadersIntoXHR(request.headers, xhr)

            xhr.send()
        } else {
            xhr.open(request.requestMethod, url)
            mergerHeadersIntoXHR(request.headers, xhr)

            var blob = new Blob([request.params], { type: 'application/json' })
            xhr.send(blob)
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                port.postMessage(xhr.responseText)
            }
        }
    })
})

function mergerHeadersIntoXHR(headers, xhr) {
    if (headers) {
        Object.entries(JSON.parse(headers)).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value)
        });
    }
}

function generateCompletedUrl(urlPrefix, url) {
    if (isStrEmpty(urlPrefix)) {
        return url
    }

    if (isStrEmpty(url)) {
        return urlPrefix
    }

    if (urlPrefix.charAt(urlPrefix.length - 1) == '\/') {
        urlPrefix = urlPrefix.substr(0, urlPrefix.length - 1)
    }

    if (url.charAt(0) == '\/') {
        url = url.substr(1, urlPrefix.length)
    }

    return urlPrefix + '\/' + url
}

const isStrEmpty = (str) => {
    return (str === null || str === undefined || str === '')
}