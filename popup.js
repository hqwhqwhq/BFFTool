/**
 * BFF Tool v0.1
 * Copyright 2020 hqwhqwhq (https://github.com/hqwhqwhq/BFFTool)
 * Licensed under MIT (https://github.com/hqwhqwhq/BFFTool/blob/main/LICENSE)
 */
var port = chrome.runtime.connect({ name: "postman" });

port.onMessage.addListener(function(response) {
    try {
        objResponse = JSON.parse(response)

        $("#response").jsonViewer(objResponse, { collapsed: false, withQuotes: true, withLinks: false })
    } catch (error) {
        $("#response").val(response)
    }

    $("#responseCard").removeAttr("hidden")
})

window.onload = function() {
    chrome.storage.sync.get(['requestMethod', 'urlPrefix', 'url', 'params', 'headers'], function(request) {
        if (request.requestMethod) {
            $("#requestMethod option[value=" + request.requestMethod + "]").attr("selected", true)
        } else {
            $("#requestMethod option[value=GET").attr("selected", true)
        }

        if (request.urlPrefix) {
            $("#urlPrefix").val(request.urlPrefix)
        }

        if (request.url) {
            $("#url").val(request.url)
        }

        if (request.params) {
            $("#params").val(request.params)

            try {
                prettyInput("params")
            } catch (error) {}
        }

        if (request.headers) {
            $("#headers").val(request.headers)

            try {
                prettyInput("headers")
            } catch (error) {}
        }
    })
}

$("#submit").click(function() {
    try {
        prettyHeadersAndParams()
    } catch (error) {
        alert("Please input valid json params!")

        return
    }

    if ($("#url").val() || $("#urlPrefix").val()) {
        var request = generateRequest()

        console.log(request)

        chrome.storage.sync.set(request)

        port.postMessage(request)
    } else {
        alert("Please input url!");
    }
});

window.onblur = function() {
    var request = generateRequest()

    chrome.storage.sync.set(request)

    try {
        prettyHeadersAndParams()
    } catch (error) {}
}

$("#params").blur(function() {
    try {
        prettyInput("params")
    } catch (error) {}
})

$("#headers").blur(function() {
    try {
        prettyInput("headers")
    } catch (error) {}
})

function generateRequest() {
    return {
        "requestMethod": $("#requestMethod").val(),
        "urlPrefix": $("#urlPrefix").val(),
        "url": $("#url").val(),
        "params": $("#params").val(),
        "headers": $("#headers").val()
    }
}

const prettyHeadersAndParams = () => {
    prettyInput("headers")
    prettyInput("params")
}

const prettyInput = (inputName) => {
    var input = $(`#${inputName}`)

    var data = input.val()

    if (data) {
        try {
            var obj = JSON.parse(data)
            var pretty = JSON.stringify(obj, undefined, 2);

            input.val(pretty)
            input.height(document.getElementById(inputName).scrollHeight)
        } catch (error) {
            input.val(handleUselessBlankLines(data))
            input.height(document.getElementById(inputName).scrollHeight)

            throw error
        }
    }
}

const handleUselessBlankLines = (data) => {
    data = data.trim()

    var vaildData = ""

    var preChar = "\n"

    for (let c of data) {
        if (c != "\n" || preChar != "\n") {
            vaildData += c
        }
        preChar = c
    }

    return vaildData
}