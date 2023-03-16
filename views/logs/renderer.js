

let COUNTER = 0;
let FLAG_CLASSES = [];
let clearLogs = null;
let platform = null;
let jsLogDiv = null;
let laravelLogDiv = null;
let SETTINGS = {};
let errorMessage = null;

document.addEventListener('DOMContentLoaded', () => {
    clearLogs = document.querySelector('#clear-logs');
    platform = document.querySelector('#platform');
    jsLogDiv = document.querySelector('#logs');
    laravelLogDiv = document.querySelector('#laravel-logs');
    clearLogs.addEventListener('click', () => {
        jsLogDiv.innerHTML = " ";
        document.querySelector('#laravel-logs').innerHTML = " ";
        FLAG_CLASSES = [];
    })

    platform.addEventListener('change', () => {
        handleLogDivHideAndShow(platform.value);
    })
})

function handleLogDivHideAndShow(platform){
    if(platform === 'ALL'){
        jsLogDiv.style.display = 'block';
        laravelLogDiv.style.display = 'block';
    }

    if(platform === 'JAVASCRIPT'){
        jsLogDiv.style.display = 'block';
        laravelLogDiv.style.display = 'none';
    }

    if(platform === 'LARAVEL'){
        jsLogDiv.style.display = 'none';
        laravelLogDiv.style.display = 'block';
    }
}

window.Bridge.logReceived((event, data) => {
    COUNTER++;
    const _data = JSON.parse(data);

    if(_data.logType === 'js') {
        drawJsDebug(_data.data, _data.filePath, _data.flag);
    }

    if(_data.logType === 'js-exception') {
        drawFileContent(_data.data);
    }

    if(_data.logType === 'laravel') {
        drawLaravelDebug(_data.data, _data.flag, _data.filePath, _data.lineNumber)
    }
});

/**
 * METHOD TO DRAW LARAVEL LOGS
 */
function drawLaravelDebug(logs, flag, filePath, lineNumber) {
    const time = generateTime();
    let flagContent = ``;
    let filePathContent = ``;
    let wrapper = document.createElement('div');
    wrapper.classList.add('debug-wrapper')
    if(flag) {
        flagContent = `<p class="flag">${flag}</p>`;
        const flagClass = flag.toLowerCase().replace(/ /g, "-")+'-FLAG';
        wrapper.classList.add(`${flagClass}`);
        FLAG_CLASSES.push(flagClass)
    }

    if(filePath !== ''){
        const link = getLaravleFilePathLink(filePath, lineNumber)
        filePathContent = `<div class="file-path-wrapper"><a href="${link}" title="Open in Editor" class="file-path" >${filePath.split('/').pop()}:${lineNumber}</a></div>`
    }

    wrapper.innerHTML+= `
        <div class="log-div">
            <div class="logo-section"> 
                <div class="log-section-left">
                    <img src="../../images/laravel.svg" width="20px" height="auto" alt="">
                        ${flag ? flagContent : ''}
                </div>
                <div class="log-section-right">
                    <span class="time-section">${time}</span>
                </div>
            </div>
            ${filePathContent}
            `;
    logs.forEach((log) => {
        const scriptRegex = /<script>(.*?)<\/script>/gs;
        const preRegex = /<pre .*?> (.*?)<\/pre>/gs;
        const scriptMatches = log.match(scriptRegex);
        let preMatches = log.match(preRegex);
        if(!preMatches) {
            const preRegex = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
            preMatches = log.match(preRegex);
        }

        const script = document.createElement('script');
        script.innerHTML = scriptMatches[0].replace(/<script>/gi, "").replace(/<\/script>/gi, "")
        wrapper.innerHTML+= preMatches[0];
        setTimeout(() => {
            wrapper.appendChild(script);
        }, 0);
    })

    laravelLogDiv.insertBefore(wrapper, laravelLogDiv.firstChild);

}

function drawFileContent(data) {
    const {lines, startLine, endLine, surroundingLine, filePath, exceptionName,  exceptionMessage} = data;
    const time = generateTime();
    const link = getLaravleFilePathLink(filePath, surroundingLine)
    const wrapper = document.createElement('div');
    wrapper.classList.add('debug-wrapper')
    wrapper.innerHTML+= `
    <div class="log-div">
        <div class="logo-section"> 
            <div class="log-section-left">
                <img src="../../images/javascript.svg" width="20px" height="auto" alt="">
                <p class="flag">Exception</p>
            </div>
            <div class="log-section-right">
                <span class="time-section">${time}</span>
            </div>
        </div>
        <div class="file-path-wrapper"><a href="${link}" title="Open in Editor" class="file-path" >${filePath.split('/').pop()}</a></div>
        <div class="exception-detail"><h2><u>${exceptionName}</u>: <span>${exceptionMessage}</span></h2></div>
        `;

    let codeSection = `<pre><code>`;

    for (const key in lines) {
        
        if(key > startLine && key < endLine) {
            const content = lines[key] === "==EMPTY==" ? " " : lines[key]
            const _class = key == surroundingLine ? `class="error-line"` : '';
            codeSection += `<p ${_class}>
                <span>${key}</span>${content}
                </p>
            `;
        }
    }
    codeSection+='</code></pre>';
    wrapper.innerHTML += codeSection;
    jsLogDiv.insertBefore(wrapper, jsLogDiv.firstChild);
}

/**
 * METHOD TO DRAW JS LOGS
 * 
 */
function drawJsDebug(logs, path, flag) {
    let _counter = 1;
    let flagContent = ``
    if(flag) {
        flagContent = `<p class="flag">${flag}</p>`
    }
    
    const wrapper = document.createElement('div');
    wrapper.classList.add('debug-wrapper')
    if(flag) {
        const flagClass = flag.toLowerCase().replace(/ /g, "-")+'-FLAG';
        wrapper.classList.add(`${flagClass}`);
        FLAG_CLASSES.push(flagClass)
    }
    logs.forEach((item) => {

        if(_counter > 1){
            path = null;
            flag = null;
        }
        _counter++;

        const type = Object.keys(item)[0];
        const value = item[Object.keys(item)[0]];
        if(type === 'string') {
            jsonTree.create(value, wrapper, flag, path, true);
        }
        else if(type === 'number') {
            jsonTree.create(value, wrapper, flag, path, true);
        } else{
            jsonTree.create(value, wrapper, flag, path);
            
        }
    })

    jsLogDiv.insertBefore(wrapper, jsLogDiv.firstChild);
}

/**
 * GENERATE LOG TIME
 */

function generateTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function getLaravleFilePathLink(path, lineNumber){
    const encodedPath = encodeURIComponent(path);
    if(SETTINGS.EDITOR === 'VSCODE'){
        return `vscode://file/${encodedPath}:${lineNumber}`;
    }

    if(SETTINGS.EDITOR === 'SUBLIME'){
        return `subl://open?url=file/${encodedPath}:${lineNumber}`;
    }

    if(SETTINGS.EDITOR === 'PHPSTORM'){
        return `phpstorm://open?file/${encodedPath}:${lineNumber}`;
    }

    //DEFAULT RETURN 
    return `vscode://file/${encodedPath}:${lineNumber}`;
}

//********************  SETTINGS  ******************//
window.Bridge.getSettings((event, data) => {
    SETTINGS = data;
    localStorage.setItem('SETTINGS', SETTINGS);
})

function toggleSettingsModal(modalID){
    setSettings();
    document.getElementById(modalID).classList.toggle("hidden");
    document.getElementById(modalID).classList.toggle("flex");
}

/**
 * SET SETTINGS FORM STORE VALUES
*/
function setSettings() {
    document.querySelector('#port').value = SETTINGS.PORT || 23518;
    document.querySelector('#editor').value = SETTINGS.EDITOR || 'VSCODE';
}

/**
 * UPDATE SETTINS
 */
function updateSettings() {
    const pipes = [
        {form: 'port', settings: 'PORT'},
        {form: 'editor', settings: 'EDITOR'},
    ];
    let validationStatus = true

    const SETTINGS_TEMP = {};
    for(let pipe  of pipes) {
        const value = document.querySelector(`#${pipe.form}`).value;
        if(!validate(pipe.form, value)) {
            validationStatus = false 
        }

        SETTINGS_TEMP[pipe.settings] = value
    }

    if(validationStatus){
        SETTINGS = {...SETTINGS_TEMP};
        localStorage.setItem('SETTINGS', SETTINGS);
        window.Bridge.updateSettings(SETTINGS);
        toggleSettingsModal('settingsModal');
        new Notification('Success', { body: 'General settings saved.' })
    }

}

/**
 * VALIDATE SETTINGS FORM
 */

function validate(name, value){
    const _value = value.trim()
    if(name === 'port'){
        if (_value !== '' && /^\d+$/.test(_value)) {
            return true
        }

        alert("PORT should be number")
        return false;
    }

    if(name === 'editor'){
        if(['VSCODE', 'PHPSTORM'].includes(value)){
            return true;
        }

        alert("Editor's value is not correct")
        return false;
    }
}
