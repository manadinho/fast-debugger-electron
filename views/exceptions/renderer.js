

document.addEventListener('DOMContentLoaded', () => {
    const clearLogs = document.querySelector('#clear-logs');
    clearLogs.addEventListener('click', () => {
        document.querySelector('#logs').innerHTML = " ";
    })
})

window.ExceptionBridge.exceptionReceived((event, data) => {
    const _data = JSON.parse(data)

    drawException(_data.data);
});

function drawException(exceptionDetail) {
    const {  exceptionName, exceptionMessage, lines, startLine, endLine, surroundingLine, stackTrace } = exceptionDetail;
    document.querySelector('#exceptionName').innerHTML = exceptionName;
    document.querySelector('#exceptionMessage').innerHTML = exceptionMessage;

    drawFileContent(lines, startLine, endLine, surroundingLine)
    drawStackTrace(stackTrace);
}

function drawStackTrace(stackTrace) {
    let codeSection = ``;
    let = iterator = 1;
    for(const item in stackTrace) {
        for(const key in stackTrace[item]) {
            if(iterator === 1) {
                _class = `detail-left-section-card bg-red-500 p-2 mt-1 text-white`
                codeSection += `
            <div class="detail-left-section-card bg-red-500 p-2 mt-1 text-white" style="overflow-wrap: break-word; min-height: 84px">
                <p class=" ">${stackTrace[item][key]}: ${key}</p>
                <a href="vscode://File${stackTrace[item][key]}" class="vscode-btn">OPEN IN VSCODE</a>
            </div>
            `;
            } else {

            }
            codeSection += `
            <div class="detail-left-section-card bg-[#eff0f3] p-2 mt-1" style="overflow-wrap: break-word; min-height: 84px">
                <p class=" ">${stackTrace[item][key]}: ${key}</p>
                <a href="vscode://File${stackTrace[item][key]}" class="vscode-btn">OPEN IN VSCODE</a>
            </div>
            `;
        }
        iterator+=1;
    }

    document.querySelector('#stackTraceArea').innerHTML = codeSection
}

function drawFileContent(lines, startLine, endLine, surroundingLine) {
    console.log({lines, startLine, endLine, surroundingLine})
    let codeSection = ``;

            for (const key in lines) {
                if(key > startLine && key < endLine) {
                    const content = lines[key] === "==EMPTY==" ? " " : lines[key]
                    if (key == surroundingLine) {
                    codeSection += `<p class="bg-red-500">
                    <span class="text-white">${key} ${content}</span>
                        
                    </p>
                    `;
                    continue;
                }

                codeSection += `<p style="line-height:0px">
                    <span class="text-[#0d0d0d]">${key}</span>
                    <span class="text-[#0d0d0d]">
                        ${content}
                    </span>
                    </p>
                `;
                }
            }
            document.querySelector('#codeArea').innerHTML = codeSection
}
