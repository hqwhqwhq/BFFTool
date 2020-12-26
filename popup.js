/**
 * BFF Tool v0.1
 * Copyright 2020 hqwhqwhq (https://github.com/hqwhqwhq/BFFTool)
 * Licensed under MIT (https://github.com/hqwhqwhq/BFFTool/blob/main/LICENSE)
 */
var port = chrome.runtime.connect({name: "postman"});

port.onMessage.addListener(function(response) {
    objResponse = JSON.parse(response)

    $("#response").jsonViewer(objResponse, {collapsed: false, withQuotes: true, withLinks: false})
    $("#responseCard").removeAttr("hidden")
})

window.onload = function() {
    chrome.storage.sync.get(['requestMethod', 'url', 'params'], function(request){
        if (request.requestMethod) {
            $("#requestMethod option[value=" + request.requestMethod +"]").attr("selected", true)
        } else {
            $("#requestMethod option[value=GET").attr("selected", true)
        }

        if (request.url) {
            $("#url").val(request.url)
        }

        if (request.params) {
            $("#params").val(request.params)

            try {
                prettyParams()
            } catch(error) {
            }
        }
    })
}

$("#submit").click(function() {
    try {
        prettyParams()
    } catch (error) {
        alert("Please input valid json params!")

        return
    }

    if ($("#url").val()) {
        var request = generateRequest()

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
        prettyParams()
    } catch (error) {
    }
}

$("#params").blur(function() {
    try {
        prettyParams()
    } catch (error) {
    } 
})

function generateRequest() {
    return {"requestMethod": $("#requestMethod").val(), "url": $("#url").val(), "params": $("#params").val()}
}

function prettyParams() {
    var params = $("#params").val()

    if (params) {
        try {
            var obj = JSON.parse(params)
            var pretty = JSON.stringify(obj, undefined, 2);

            $("#params").val(pretty)
            $("#params").height(document.getElementById("params").scrollHeight)
        } catch (error) {
            $("#params").val(handleUselessBlankLines(params))
            $("#params").height(document.getElementById("params").scrollHeight)
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