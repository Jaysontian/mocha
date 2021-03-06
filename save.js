

function checkexist() {
    gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id, name)',
        pageSize: 100
    }).then(function(response) {
        //console.log('checking...');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (file.name == 'Motcha_Data.json'){
                getData(file.id);
          }
        }
      } else {
        appendPre('New user, created config save log.');
        firsttime();
      }
    });
}

function firsttime(){
    var fileContent = JSON.stringify(data); // As a sample, upload a text file.
    var file = new Blob([fileContent], {type: 'application/json'});
    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();    

    var metadata = {
        'name':  'Motcha_Data.json', // Filename at Google Drive
        'parents': ['appDataFolder'], // mimeType at Google Drive
    };
    
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form,
    }).then((res) => {
        return res.json();
    }).then(function(val) {
        saveID = val.id;
        appendPre('Successfully created new piece of data. File ID: ' + val.id);
        load();
    });
}


function getData(ID){
    var accessToken = gapi.auth.getToken().access_token;
        var request = gapi.client.drive.files.get({
            fileId: ID,
            alt: 'media'
        });
        request.then(function(response) {
            data = JSON.parse(response.body); //response.body contains the string value of the file
            saveID = ID;
            load();
        }, function(error) {
            console.error(error)
        });
        return request;
}

function update(){
    var content = JSON.stringify(data);
    //console.log(content);
    var contentBlob = new Blob([content], {
        'type': 'text/plain'
    });
    updateFileContent(saveID, contentBlob, function(response) {
        appendPre('Saved.');
    });
}


function updateFileContent(fileId, contentBlob, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
       if (xhr.readyState != XMLHttpRequest.DONE) {
          return;
       }
       callback(xhr.response);
    };
    xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media');
    xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
    xhr.send(contentBlob);
}

function createFileContent(contentBlob, callback){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
       if (xhr.readyState != XMLHttpRequest.DONE) {
          return;
       }
       callback(xhr.response);
    };
    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=media');
    xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
    xhr.send(contentBlob);
}

function deleteSave(){
        var request = gapi.client.drive.files.delete({
          'fileId': saveID
        });
        request.execute(function(resp) { console.log(resp)});
}