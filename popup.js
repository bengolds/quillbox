let MQ = MathQuill.getInterface(2);
let historyIndex = -1;
let history = [];
let currString = '';

function onQuillEdit(field) {
    let el = field.el();
    let w = Math.max(el.offsetWidth, 100)
    let h = Math.max(el.offsetHeight, 100);
    window.resizeTo(w, h);
    console.log(screen.width, screen.height);
    let l = screen.width/2 - w/2, t = screen.height/2 - h/2;
    window.moveTo(l, t);
}
let quillEl = document.getElementById('mathquill');
let quillField = MQ.MathField(quillEl, {
    autoCommands: 'alpha beta lambda gamma theta pi psi' 
        + 'Lambda Gamma Theta Pi'
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
    }
}

document.addEventListener('keydown', event=> {
    if (event.key === 'Escape') {
        saveToHistory();
        window.close();
    }
    if (event.key === 'ArrowUp') {
        goPrevious();
    }
    if (event.key === 'ArrowDown') {
        goNext();
    }
});

document.getElementById('quillholder').addEventListener('mousedown', (e) => {
    quillField.focus();
    e.preventDefault();
});

chrome.storage.local.get('history', (items) => {
    console.log(items);
    if (!chrome.runtime.lastError) {
        history = items.history || [];
    }
});

function saveToHistory() {
    currString = quillField.latex();
    if (currString === '') 
        return;
    history.unshift(quillField.latex());
    chrome.storage.local.set({
        history: history
    });
}


