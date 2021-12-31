


function save(data) {
    checkexist(data);
}

function firsttime(data){
    var fileContent = String(data); // As a sample, upload a text file.
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
        console.log(val);
        appendPre('Successfully saved all data. File ID: ' + val.id)
    });
}

function checkexist(data) {
        gapi.client.drive.files.list({
            spaces: 'appDataFolder',
            fields: 'nextPageToken, files(id, name)',
            pageSize: 100
        }).then(function(response) {
          appendPre('Files:');
          var files = response.result.files;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              if (file.name == 'Motcha_Data.json'){
                alert('save already exists: '+file.id)
                  getData(file.id)
              }
            }
          } else {
            appendPre('No files found.');
            firsttime(data);
          }
        });
}

function getData(ID){
    var accessToken = gapi.auth.getToken().access_token;

        var request = gapi.client.drive.files.get({
            fileId: ID,
            alt: 'media'
        })
        request.then(function(response) {
            console.log(response); //response.body contains the string value of the file
        }, function(error) {
            console.error(error)
        })
        return request;
}