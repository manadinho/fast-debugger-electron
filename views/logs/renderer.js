const jsnViewOptions = {
    showLen: false,
    showType: false,
    showBrackets: true,
    showFoldmarker: false,
    colors: { boolean: '#ff2929', null: '#ff2929', string: '#690', number: '#905', float: '#002f99' }
}

document.addEventListener('DOMContentLoaded', () => {
    const clearLogs = document.querySelector('#clear-logs');
    clearLogs.addEventListener('click', () => {
        document.querySelector('#logs').innerHTML = " ";
    })
})

window.Bridge.logReceived((event, data) => {
    const _data = JSON.parse(data);
    
    if(_data.logType === 'js') {
        drawJsLogs(_data.data);
    }

    if(_data.logType === 'laravel') {
        const content = `<div class="log-div">
        <div class="logo-section"> <img src="../../images/laravel.svg" width="20px" height="auto" alt=""><span>LARAVEL</span></div>
        <div>${_data.data}</div>
        </div>`;
        document.querySelector('#logs').innerHTML += content;
    }
});

/**
 * METHOD TO DRAW JS LOGS
 * 
 */
function drawJsLogs(logs) {
    logs.forEach((item) => {
        const type = Object.keys(item)[0];
        const value = item[Object.keys(item)[0]];
        if(type === 'string') {
            const log = `<div class="string-log-section"><span class="string-qouts">"</span>${value}<span class="string-qouts">"</span></div>`;

            const content = `<div class="log-div">
            <div class="logo-section"> <img src="../../images/javascript.svg" width="20px" height="auto" alt=""><span>JAVASCRIPT</span></div>
            <div>${log}</div>
            </div>`;

            document.querySelector('#logs').innerHTML += content;
        }
        else if(type === 'number') {
            const log = `<div class="number-log-section">${value}</div>`;
            
            const content = `<div class="log-div">
            <div class="logo-section"> <img src="../../images/javascript.svg" width="20px" height="auto" alt=""><span>JAVASCRIPT</span></div>
            <div>${log}</div>
            </div>`;

            document.querySelector('#logs').innerHTML += content;
        } else{
            const tree = jsonview.create(value);
            const content = `<div class="log-div">
            <div class="logo-section"> <img src="../../images/javascript.svg" width="20px" height="auto" alt=""><span>JAVASCRIPT</span></div>
            <div>${tree}</div>
            </div>`;
            // document.querySelector('#logs').innerHTML += content;
            jsonview.render(tree, document.querySelector('#logs'));
        }
    })
}
