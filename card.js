
var saveID;
var data = {
    189902: {
        title: 'Welcome to Mocha',
        driveID: null,
        desc: 'Jayson Tian  |  Units 1 - 6 covering all topics',
        folder: 18832,
        cards: [
            {
                id: 88888,
                check: false,
                topic: '👋  Introduction',
                notes: [
                    {
                        id: 152423,
                        type:'text',
                        content:'<b>Mocha</b> is many things in one – a note-taking app, a study and learning tool, an outliner, a document editor, and much more!'
                    },
                    {
                        id: 1523556,
                        type:'text',
                        content:"It is packed with features and is suitable for anyone, whether you're a student, teacher, or a creative."
                    }
                ]
            },
            {
                id: 99999,
                check: false,
                topic: 'Cards',
                notes: [
                    {
                        id: 4124343,
                        type:'text',
                        content:'Cards are singular blocks that house checks, topics, and notes. This block of white text is a card.'
                    },
                    {
                        id: 124353524124,
                        type:'text',
                        content:'Add a new card by clicking the + New Card button at the bottom of the page or use the keyboard shortcut ⌘ + N'
                    },
                    {
                        id: 1242423248,
                        type:'text',
                        content:'Rearrange the order of cards on a page by hovering over the three dots on the right most corner of the card and dragging it to the desired location.'
                    },
                    {
                        id: 9747937892,
                        type:'text',
                        content:'Delete a card by clicking the X button below the three dots'
                    }
                ]
            },
            {
                id: 77777,
                check: false,
                topic: 'Google Drive',
                notes: [
                    {
                        id: 23328,
                        type:'text',
                        content:'Mocha is most powerful when connected with Google: you are able to send your pages directly to your google drive.'
                    },
                    {
                        id: 82765673,
                        type:'text',
                        content:'By clicking the Send to Drive button at the top right of the page, a PDF of your page will be generated in your google drive instantly'
                    },
                    {
                        id: 927363829872,
                        type:'text',
                        content:'Subsequent clicks will update the PDF file. Be sure not to delete it!'
                    },
                    {
                        id: 7636327887,
                        type:'text',
                        content:'Click on the PDF button to be redirected to the PDF in your drive. You can then share your page with friends, download, or print it.'
                    }
                ]
            }
        ]
    }
}


function load() {
    $(".app").empty();
    renderPage(189902);
}


function renderPage(pageId){
    var page = $('#page-template').clone().show().appendTo('.app').addClass('page-' + pageId).attr('id',pageId);
    page.find('#head-con h1').attr('id','title'+pageId).text(data[pageId].title).click(()=>{modify.title(pageId)});
    page.find('#head-con .desc').text(data[pageId].desc);
    page.find('#publish').click(()=>{publish(pageId)});
    page.find('#todocs').click(()=>{publishtodocs(pageId, title)});
    page.find('#save').click(()=>{if (saveID != null) update()});
    page.find('.newcard-btn').click(()=>{create.card(pageId)});
    page.find('.card-con').sortable({
        handle:'.move',
        items:'.card',
        cursor: "grabbing",
        axis:'y',
        opacity: 0.5,
        scroll: true,
        scrollSensitivity: 50,
        helper: "clone",
        placeholder: 'ui-state-highlight',
        over: function(event, ui) {
            var cl = ui.item.attr('class');
            $('.ui-state-highlight').addClass(cl);
            console.log(cl);
        }

    });
    render.pdflink(pageId);
    page.appendTo('.app').show();

    (data[pageId].cards).forEach((card, i)=>{
        console.log('rendering ' + i);
        console.log(data[pageId].cards[i].id)
        renderCard(pageId, i); // the cardIndex is... whereas the cardId = data[pageId].cards[cardIndex].id
    })

};

function renderCard(pageId, cardIndex){
    var cardData = data[pageId].cards[cardIndex];
    var card = $('#card-template').clone().appendTo($('.page-'+pageId).find('.card-con')).addClass('card-'+data[pageId].cards[cardIndex].id).attr('id',cardData.id);
    card.find('.delete').click(()=>{remove.card(pageId, cardIndex)});
    render.checkBox(pageId, cardIndex);
    render.topic(pageId, cardIndex);
    render.allnotes(pageId, cardIndex);
    card.show();
}

var render = {
    pdflink: (pageId)=>{
        if (data[pageId].driveID != null){
            $('#'+pageId+' .pdflink').click(()=>{window.open('https://drive.google.com/file/d/'+data[pageId].driveID)});
        }
    },
    checkBox: (pageId, cardIndex)=>{
        if (data[pageId].cards[cardIndex].check) {$('#'+ data[pageId].cards[cardIndex].id).addClass('checked'); $('.card-'+ data[pageId].cards[cardIndex].id + ' input').attr('checked','checked');} else {$('.card-'+ data[pageId].cards[cardIndex].id + ' input').removeAttr('checked');}
        $('.card-'+ data[pageId].cards[cardIndex].id + ' input').click(()=>{
            data[pageId].cards[cardIndex].check = !data[pageId].cards[cardIndex].check;
            if (data[pageId].cards[cardIndex].check) {
                $('.card-'+ data[pageId].cards[cardIndex].id + ' input').attr('checked','checked');
                $('#'+ data[pageId].cards[cardIndex].id).addClass('checked'); 
            } else {$('.card-'+ data[pageId].cards[cardIndex].id + ' input').removeAttr('checked');$('#'+ data[pageId].cards[cardIndex].id).removeClass('checked')};
            update();
        })
    },
    topic: (pageId, cardIndex) => {
        var topic = $('.card-'+ data[pageId].cards[cardIndex].id + ' .topic .editor');
        topic.html(data[pageId].cards[cardIndex].topic);

        topic.keyup(()=>{
            if (topic.text()==''||topic.text()==null){topic.html('');}
            data[pageId].cards[cardIndex].topic = topic.html();
            console.log(data[pageId].cards[cardIndex]);
        })
    },
    allnotes: (pageId, cardIndex) => {
        //console.log(pageId, cardId);
        var previousNoteId = null;
        for (noteId in data[pageId].cards[cardIndex].notes){
            if (data[pageId].cards[cardIndex].notes[noteId].type == "text"){
                //console.log('rendering...'+data[pageId].cards[cardId].notes[noteId].id);
                render.note.text(pageId, cardIndex, data[pageId].cards[cardIndex].notes[noteId].id, previousNoteId);
            }
            previousNoteId = data[pageId].cards[cardIndex].notes[noteId].id;
        }
    },
    note: {
        text: (pageId, cardIndex, noteId, prevId) => { // prevId refers to the Id of the note that is before this note
            var notecontainer;
            var noteDIV;
            if (prevId == null){
                notecontainer = $('#note-template').clone().show().appendTo('.card-'+ data[pageId].cards[cardIndex].id + ' .note-con').attr('id',noteId);
            } else {
                notecontainer = $('#note-template').clone().show().attr('id',noteId);
                $('#'+prevId).after(notecontainer);
            }
            noteDIV = $('#'+noteId).find('.editor').focus();
            var noteIndex = data[pageId].cards[cardIndex].notes.findIndex(function(note) {
                return note.id == noteId
              });
            noteDIV.html(data[pageId].cards[cardIndex].notes[noteIndex].content);
            noteDIV.keyup((e)=>{
                var noteIndexNew = data[pageId].cards[cardIndex].notes.findIndex(function(note) {
                    return note.id == noteId
                  });
                if (noteDIV.text()==''||noteDIV.text()==null){noteDIV.html('');}
                data[pageId].cards[cardIndex].notes[noteIndexNew].content = $('#'+noteId+' .editor').html();
            });
            noteDIV.keydown((e)=>{
                if (e.keyCode == 13){
                    e.preventDefault();
                    e.stopPropagation();
                    create.note.text(pageId, cardIndex, noteId);
                    update();
//save point
                }
                if (e.keyCode == 8 && noteDIV.text()==''){
                    if ($('.card-'+ data[pageId].cards[cardIndex].id + ' .note-con').children().length < 3){
                        // do nothing because there are no notes before it 
                    } else {
                        $('#'+noteId).remove();
                        var noteIndexNew = data[pageId].cards[cardIndex].notes.findIndex(function(note) {
                            return note.id == noteId
                        });
                        data[pageId].cards[cardIndex].notes.splice(noteIndexNew, 1);
                        update(); 
//save point
                    }
                    //print(pageId, cardId);
                    
                }
            });
            noteDIV.on("paste", function(e){
                if(e.clipboardData == false){
                    if(typeof(callback) == "function"){
                        callback(undefined);
                    }
                };
                var items = (e.clipboardData || e.originalEvent.clipboardData).items;;
                if(items == undefined){
                    if(typeof(callback) == "function"){
                        callback(undefined);
                    }
                };
                for (var i = 0; i < items.length; i++) {
                    if ((items[i].type).includes('image')){
                        var image = items[i].getAsFile();
            
                        const formData = new FormData();
                        formData.append('image', image);
                        fetch('https://api.imgur.com/3/image', {
                            method: 'POST',
                            headers: new Headers({ 'Authorization': 'Client-ID b8578be85341600'}),
                            body: formData,
                        }).then((res) => {
                            return res.json();
                        }).then(function(val) {
                            appendPre('<a href="'+ val.data.link +'">Image</a> Uploaded');
                            create.note.image(pageId, cardIndex, noteId, val.data.link);
                        });
                    }
                }
            } );
            
        },
        image: (pageId, cardIndex, noteId, replaceId)=>{
            var noteIndex = data[pageId].cards[cardIndex].notes.findIndex(function(note) {
                return note.id == noteId
            });

            var img = $('<img>').attr('src', data[pageId].cards[cardIndex].notes[noteIndex].link).css('width','50%');
            $('#'+replaceId).replaceWith(img);
            
        },
    }
}
var modify = {
    title: (pageId)=>{
        $('#title'+pageId).attr('contenteditable','true').focus();
        $('#title'+pageId).focusout(()=>{
            if (data[pageId].title != $('#title'+pageId).text()){
                $('#title'+pageId).attr('contenteditable','false');
                data[pageId].title = $('#title'+pageId).text();
                $('#title'+pageId).text(data[pageId].title).click(()=>{modify.title(pageId)});
                update();
            }
        }).keydown((e)=>{
            if(e.keyCode == 13) {
                $('#title'+pageId).attr('contenteditable','false');
                data[pageId].title = $('#title'+pageId).text();
                $('#title'+pageId).text(data[pageId].title).click(()=>{modify.title(pageId)});
                update();
            }
        });
    },


};

var create = {
    note: {
        text: (pageId, cardIndex, prevId) => {
            var newID = Math.random().toString(16).slice(2);
            var index = data[pageId].cards[cardIndex].notes.findIndex(function(note) {
                return note.id == prevId
            });
            (data[pageId].cards[cardIndex].notes).splice(parseInt(index)+1, 0, {
                id: newID,
                type: 'text',
                content: ''
            })
            
            render.note.text(pageId, cardIndex, newID, prevId);
            //console.log(data[pageId].cards[cardId].notes, data[pageId].cards[cardId].topic);
        },
        image: (pageId, cardIndex, replaceId, imglink) => {
            var index = data[pageId].cards[cardIndex].notes.findIndex(function(note) {
                return note.id == replaceId
            });
            (data[pageId].cards[cardIndex].notes).splice(index, 1);
            var newID = Math.random().toString(16).slice(2);

            (data[pageId].cards[cardIndex].notes).splice(index, 0, {
                id: newID,
                type: 'image',
                link: imglink,
                height: 100,
            });

            render.note.image(pageId, cardIndex, newID, prevId);
        }
    },
    card: (noteId) =>{
        var newID = Math.random().toString(16).slice(2);
        var newID2 = Math.random().toString(16).slice(2);
        var newcard = {
            id: newID,
            check: false,
            topic: '',
            notes: [{
                id: newID2,
                type: 'text',
                content: ''
            }]
        };
        (data[noteId].cards).push(newcard);
        renderCard(noteId, (data[noteId].cards).length - 1)
    }
}

var remove = {
    card: (pageId, cardIndex) =>{
        cardId = data[pageId].cards[cardIndex].id;
        $('#'+cardId).remove();
        (data[pageId].cards).splice(cardIndex, 1);
        console.log(data[pageId].cards);
        update();
    }
}

function print(pageId, cardIndex){
    (data[pageId].cards[cardIndex].notes).forEach(note => {
        console.log(note.content);
    })
}



