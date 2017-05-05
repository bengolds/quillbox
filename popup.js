let MQ = MathQuill.getInterface(2);

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
    autoCommands: 'alpha beta lambda pi int sqrt',
    handlers: {
        edit: onQuillEdit,
    },
});
quillField.focus();

document.addEventListener('keydown', event=> {
    if (event.key === 'Escape' || event.keyCode === 27) {
        window.close();
    }
});

document.getElementById('quillholder').addEventListener('mousedown', (e) => {
    quillField.focus();
    e.preventDefault();
});


