
var data = {
    189902: {
        title: 'SL Chemistry Review',
        driveID: null,
        desc: 'Jayson Tian  |  Units 1 - 6 covering all topics',
        folder: 18832,
        cards: {
            1234422: {
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
            9553233: {
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
        }
    }
}


function load() {
    renderPage(189902);
}

function renderPage(pageId){
    var page = $('#page-template').clone().addClass('page-' + pageId).attr('id',pageId);
    page.find('#head-con h1').text(data[pageId].title);
    page.find('#head-con .desc').text(data[pageId].desc);
    var title = data[pageId].title;
    page.find('#publish').click(()=>{publish(pageId, title)});
    page.find('#todocs').click(()=>{publishtodocs(pageId, title)});
    page.find('#save').click(()=>{save(data)})
    render.pdflink(pageId);
    page.appendTo('main').show();
    $('#page-template').remove();

    for (cardId in data[pageId].cards) {
        cardId = parseInt(cardId);
        renderCard(pageId, cardId);
    }
}

function renderCard(pageId, cardId){
    var cardData = data[pageId].cards[cardId];
    var card = $('#card-template').clone().appendTo($('.page-'+pageId).find('.card-con')).addClass('card-'+cardId);
    render.checkBox(pageId, cardId);
    render.topic(pageId, cardId);
    render.allnotes(pageId, cardId);
    card.show();
}

var render = {
    pdflink: (pageId)=>{
        if (data[pageId].driveID != null){
            console.log('hi');
            $('#'+pageId+' .pdflink').text('View PDF').attr('href', 'https://drive.google.com/file/d/'+data[pageId].driveID).attr('target','_blank')
        }
    },
    checkBox: (pageId, cardId)=>{
        if (data[pageId].cards[cardId].check) {$('.card-'+ cardId + ' input').attr('checked','checked');} else {$('.card-'+ cardId + ' input').removeAttr('checked');}
        $('.card-'+ cardId + ' input').click(()=>{
            data[pageId].cards[cardId].check = !data[pageId].cards[cardId].check;
            if (data[pageId].cards[cardId].check) {$('.card-'+ cardId + ' input').attr('checked','checked');} else {$('.card-'+ cardId + ' input').removeAttr('checked');}
        })
    },
    topic: (pageId, cardId) => {
        var topic = $('.card-'+ cardId + ' .topic .editor');
        topic.html(data[pageId].cards[cardId].topic);

        topic.keyup(()=>{
            if (topic.text()==''||topic.text()==null){topic.html('');}
            data[pageId].cards[cardId].topic = topic.html();
            console.log(data[pageId].cards[cardId]);
        })
    },
    allnotes: (pageId, cardId) => {
        //console.log(pageId, cardId);
        var previousNoteId = null;
        for (noteId in data[pageId].cards[cardId].notes){
            if (data[pageId].cards[cardId].notes[noteId].type == "text"){
                //console.log('rendering...'+data[pageId].cards[cardId].notes[noteId].id);
                render.note.text(pageId, cardId, data[pageId].cards[cardId].notes[noteId].id, previousNoteId);
            }
            previousNoteId = data[pageId].cards[cardId].notes[noteId].id;
        }
    },
    note: {
        text: (pageId, cardId, noteId, prevId) => { // prevId refers to the Id of the note that is before this note
            var notecontainer;
            var noteDIV;
            if (prevId == null){
                notecontainer = $('#note-template').clone().show().appendTo('.card-'+ cardId + ' .note-con').attr('id',noteId);
            } else {
                notecontainer = $('#note-template').clone().show().attr('id',noteId);
                $('#'+prevId).after(notecontainer);
            }
            noteDIV = $('#'+noteId).find('.editor').focus();
            var noteIndex = data[pageId].cards[cardId].notes.findIndex(function(note) {
                return note.id == noteId
              });
            noteDIV.html(data[pageId].cards[cardId].notes[noteIndex].content);
            noteDIV.keyup((e)=>{
                var noteIndexNew = data[pageId].cards[cardId].notes.findIndex(function(note) {
                    return note.id == noteId
                  });
                if (noteDIV.text()==''||noteDIV.text()==null){noteDIV.html('');}
                data[pageId].cards[cardId].notes[noteIndexNew].content = $('#'+noteId+' .editor').html();
            });
            noteDIV.keydown((e)=>{
                if (e.keyCode == 13){
                    e.preventDefault();
                    e.stopPropagation();
                    create.note.text(pageId, cardId, noteId);
                }
                if (e.keyCode == 8 && noteDIV.text()==''){
                    if ($('.card-'+ cardId + ' .note-con').children().length < 3){
                        // do nothing because there are no notes before it 
                    } else {
                        $('#'+noteId).remove();
                        var noteIndexNew = data[pageId].cards[cardId].notes.findIndex(function(note) {
                            return note.id == noteId
                        });
                        data[pageId].cards[cardId].notes.splice(noteIndexNew, 1);
                    }
                    print(pageId, cardId);
                    
                }
            })
            
        }
    }
}

var create = {
    note: {
        text: (pageId, cardId, prevId) => {
            var newID = Math.random().toString(16).slice(2);
            var index = data[pageId].cards[cardId].notes.findIndex(function(note) {
                return note.id == prevId
              });
            (data[pageId].cards[cardId].notes).splice(parseInt(index)+1, 0, {
                id: newID,
                type: 'text',
                content: ''
            })
            
            render.note.text(pageId, cardId, newID, prevId);
            console.log(data[pageId].cards[cardId].notes, data[pageId].cards[cardId].topic);
        }
    }
}

function print(pageId, cardId){
    (data[pageId].cards[cardId].notes).forEach(note => {
        console.log(note.content);
    })
}


load();

