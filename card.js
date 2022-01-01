
var saveID;
var data = {
    189902: {
        title: 'SL Chemistry Review',
        driveID: null,
        desc: 'Jayson Tian  |  Units 1 - 6 covering all topics',
        folder: 18832,
        cards: [
            {
                id: 88888,
                check: false,
                topic: 'Distinguish between <b>compounds and mixtures</b>',
                notes: [
                    {
                        id: 152423,
                        type:'text',
                        content:'<b>Compounds</b>: two or more elements combined chemically in a fixed ratio'
                    },
                    {
                        id: 1523556,
                        type:'text',
                        content:'<b>Mixture</b>: not chemically bonded together but are mixed'
                    }
                ]
            },
            {
                id: 99999,
                check: true,
                topic: '<b>Archaeology</b> is the study of...',
                notes: [
                    {
                        id: 166342,
                        type:'text',
                        content:'Collections and sea levels rise and then you can know'
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
    page.find('.newcard-btn').click(()=>{create.card(pageId)})
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
            })
            
        }
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

function print(pageId, cardIndex){
    (data[pageId].cards[cardIndex].notes).forEach(note => {
        console.log(note.content);
    })
}

