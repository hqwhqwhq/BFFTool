/**
 * BFF Tool v0.1
 * Copyright 2020 hqwhqwhq (https://github.com/hqwhqwhq/BFFTool)
 * Licensed under MIT (https://github.com/hqwhqwhq/BFFTool/blob/main/LICENSE)
 */
var port = chrome.runtime.connect({name: "postman"});

port.onMessage.addListener(function(msg) {
    objMsg = JSON.parse(msg)

    $("#response").jsonViewer(objMsg, {collapsed: false, withQuotes: true, withLinks: false})
    $("#responseCard").removeAttr("hidden")
})

$("#submit").click(function() {
    if ($("#url").val()) {
        msg = {"requestMethod": $("#requestMethod").val(), "url": $("#url").val(), "params": $("#params").val()}

        port.postMessage(msg)
    } else {
        alert("Please input url!");
    }
});

$("#params").blur(function() {
    var params = $("#params").val()

    if (params) {
        try {
            var obj = JSON.parse(params)
            var pretty = JSON.stringify(obj, undefined, 2);

            $("#params").val(pretty)
            $("#params").height(document.getElementById("params").scrollHeight)
        } catch (error) {
            alert("Please input valid json params!")
        }
    }
});