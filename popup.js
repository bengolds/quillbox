let MQ = MathQuill.getInterface(2);
let historyIndex = -1;
let history = [];
let currString = '';

function onQuillEdit(field) {
    resize(field);
}
function resize(field) {
    let oldWidth = window.innerWidth, oldHeight = window.innerHeight;
    let center = {x: window.screenX + oldWidth/2, y: window.screenY + oldHeight/2};

    let el = field.el();
    let newWidth = Math.max(el.offsetWidth, 100)
    let newHeight = Math.max(el.offsetHeight, 100);
    window.resizeTo(newWidth, newHeight);
    let left = screen.width/2 - newWidth/2, top = center.y - newHeight/2;
    window.moveTo(left, top);
}
let quillEl = document.getElementById('mathquill');
let quillField = MQ.MathField(quillEl, {
    autoCommands: 'alpha beta lambda gamma theta pi psi ' 
        + 'Lambda Gamma Theta Pi '
        + 'int sum sqrt choose neq',
    handlers: {
        edit: onQuillEdit,
        enter: (field) => {
            field.select();
            document.execCommand('copy');
            saveToHistory();
            window.close();
        }
    },
});
quillField.focus();

function goPrevious() {
    if (!history || historyIndex >= history.length-1) 
        return;
   
    if (historyIndex == -1) {
        currString = quillField.latex();
    }

    historyIndex++;
    if (historyIndex < history.length) {
        quillField.latex(history[historyIndex]);
        resize();
    }
}
function goNext() {
    if (!history || history.length == 0 || historyIndex <= -1)
        return;
    
    historyIndex--;
    if (historyIndex == -1) {
       quillField.latex(currString); 
    } 
    else {
        quillField.latex(history[historyIndex]);
        resize(quillField);
    }
}

document.addEventListener('keydown', event=> {
    if (event.key === 'Escape') {
        saveToHistory();
        window.close();
    }
    if (event.key === 'ArrowUp' && event.ctrlKey) {
        goPrevious();
    }
    if (event.key === 'ArrowDown' && event.ctrlKey) {
        goNext();
    }
});

document.getElementById('quillholder').addEventListener('mousedown', (e) => {
    quillField.focus();
    e.preventDefault();
});

loadHistory();

function loadHistory() {
    if (typeof chrome !== 'undefined') {
        chrome.storage.local.get('history', (items) => {
            console.log(items);
            if (!chrome.runtime.lastError) {
                history = items.history || [];
            }
        });
    } else {
        history = JSON.parse(window.localStorage.getItem('history')) || [];
    }
}

function saveToHistory() {
    currString = quillField.latex();
    if (currString === '') 
        return;
    history.unshift(quillField.latex());
    if (typeof chrome !== 'undefined') {
        chrome.storage.local.set({
            history: history
        });
    } 
    else {
        window.localStorage.setItem('history', JSON.stringify(history));
    }
}


