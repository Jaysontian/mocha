
window.jsPDF = window.jspdf.jsPDF;
const doc = new jsPDF();

var pdfoutput;

function publish(pageId){ // generates PDF in users google drive


    var con = $('<div>').attr('id', 'file-render').prependTo('html');
    $('#'+pageId).clone().appendTo(con).attr('id', 'clone');
    $('#clone .toolbar').remove();
    $('#clone .btn2').remove();
    console.log('deltede tocsnin')

     
    doc.html(document.getElementById('clone'), {
        callback: function (doc) {
            pdfoutput = doc.output('arraybuffer');
            //var fileContent = 'sample text'; // As a sample, upload a text file.
            var file = new Blob([pdfoutput], {type: 'application/pdf'});
            var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
            var form = new FormData();

            if (data[pageId].driveID == null){
                console.log('this file doesnt exist, created a new file.');
                var metadata = {
                    'name':  data[pageId].title + '.pdf', // Filename at Google Drive
                    'mimeType': 'application/pdf', // mimeType at Google Drive
                };
                
                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                form.append('pdf', file);
    
                fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
                    method: 'POST',
                    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                    body: form,
                }).then((res) => {
                    return res.json();
                }).then(function(val) {
                    console.log(val);
                    data[pageId].driveID = val.id;
                    render.pdflink(pageId);
                    appendPre('This note has been uploaded as a PDF to your google drive.')
                });
            } else {
                console.log('this file exists, updating.');
                var metadata = {
                    'name':  data[pageId].title + '.pdf', // Filename at Google Drive
                    'mimeType': 'application/pdf', // mimeType at Google Drive
                };
                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                form.append('pdf', file);
                fetch('https://www.googleapis.com/upload/drive/v3/files/' + String(data[pageId].driveID) + '?uploadType=multipart', {
                    method: 'PATCH',
                    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                    body: form,
                }).then((res) => {
                    return res.json();
                }).then(function(val) {
                    console.log(val);
                    appendPre('This note has been updated.')
                });
                
            }
        },
        x: 17,
        y: 10,
        html2canvas: {
            scale:0.25,
        }
     });
}


function publishtodocs(pageId, title){
    console.log(title);
    var con = $('<div>').attr('id', 'file-render').prependTo('html');
    $('#'+pageId).clone().appendTo(con).attr('id', 'clone');
    $('#clone .btn').remove();


    var aFileParts = $('#clone').html() + "<style>main{width:100%;height:fit-content;padding:20px 15px}article{max-width:700px;width:100%;margin:auto}#file-render{opacity:0;position:fixed;z-index:-100;background-color:#fff;width:100vw;height:100vh;top:0;left:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased}#head-con{display:block}.card{background-color:#fff;padding:20px 25px;border-radius:5px;border:2px solid #e2dddd;margin-bottom:20px;display:flex}.card input{border:solid 2px #cfc9c9;border-radius:3px;cursor:pointer;margin-top:10px}.card .checkbox[checkmark=visible]:after{content:'✓';position:absolute;margin-top:-3px;color:#818181}.card .checkbox[checkmark=invisible]:after{content:'';position:absolute;margin-top:-3px;color:#818181}.card .topic{width:30%;height:fit-content;margin:0 8px;padding:5px;border:solid 2px #fff;border-radius:3px;min-height:20px}.card .topic .editor{width:100%;min-height:20px;height:100%;font-size:10.5pt;line-height:13pt;outline:0;cursor:text}.card .topic .editor:empty:before{content:'Enter topic or question';color:#b9b9b9}.note-con{width:70%;height:fit-content;margin:0 8px;padding:5px}.card .note{border:solid 2px #fff;border-radius:3px;min-height:20px;display:flex}.card .note .bullet{margin:0;margin-right:8px;color:#a8a8a8}.card .note:focus-within .bullet{color:#4d4d4d}.card .note .editor{width:100%;min-height:20px;height:100%;font-size:10.5pt;line-height:13pt;outline:0;cursor:text}.card .note .editor:empty:before{content:'Enter answer or press / for menu;;color:#b9b9b9}</style>";
    //var fileContent = 'sample text'; // As a sample, upload a text file.
    var file = new Blob([aFileParts], {type: 'text/html'});
    var metadata = {
        'name':  title, // Filename at Google Drive
        'mimeType': 'application/vnd.google-apps.document', // mimeType at Google Drive
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form,
    }).then((res) => {
        return res.json();
    }).then(function(val) {
        console.log(val);
    });

}