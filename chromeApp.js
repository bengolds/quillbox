let idRoot='quillbox';
let id = '';

let openPanel = function() {
    id = idRoot + (new Date()).getTime();
    let width = 100;
    let height = 100;
    let left = screen.width/2 - width/2;
    let top = screen.height/2 - height/2;
    console.log(screen.width, screen.height);
    chrome.app.window.create("popup.html",
    {
        type: "shell",
        outerBounds: {
            top: top,
            left: left,
            height: height,
            width: width
        },
        alwaysOnTop: true,
        frame: "none",
        id: id
    });
}

let openOrFocusPanel = function() {
    let quillWindow = chrome.app.window.get(id);
    if(!quillWindow) {
        openPanel();
    }
    else {
        quillWindow.focus();
    }
}

let togglePanel = function() {
    let quillWindow = chrome.app.window.get(id);
    if(!quillWindow) {
        openPanel();
    } else {
        quillWindow.close();
    }
}

chrome.app.runtime.onLaunched.addListener(openOrFocusPanel);

chrome.commands.onCommand.addListener(function(command) {
    console.log(command);
    if (command === "toggle-panel") {
        togglePanel();
    }
});
