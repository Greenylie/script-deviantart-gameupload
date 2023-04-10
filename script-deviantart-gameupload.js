// ==UserScript==
// @name         GameUpload
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script automatically fills the information for the game screenshot i'm uploading
// @author       Greenylie
// @match        https://www.deviantart.com/submit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @run-at       document-body
// @grant        none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==
/* global $, waitForKeyElements */
// ==/UserScript==

//Functions

function SwitchGallery(galleryname) {
    Array.from(document.querySelectorAll('label')).find(el => el.textContent === galleryname).parentElement.firstElementChild.click();
}

function GameIdentifier(jNode) {
    let desc, tags;
    let title = document.querySelector("input[title='Title']").value;


    fetch('https://raw.githubusercontent.com/Greenylie/script-deviantart-gameupload/main/game-info.json')
    .then(response => response.json())
    .then(data => {

        var i = data.games.length;
        data.games.forEach((element) =>{
            if (title.includes(element.search))
            {
                desc = element.description;
                tags = element.tags;
                gamegallery = element.gallery;
                i--;
                return;
            }

            if (i == data.games.length)
            {
                desc = data.default.description;
                gamegallery = data.default.gallery;
                tags = data.default.tags;
            }
        })
    });

    

    let buttonDesc = document.createElement('button');
    let buttonTags = document.createElement('button');
    let buttonPlatinum = document.createElement('button');
    buttonDesc.className = buttonTags.className = 'ile-button ile-handicapped ile-save-exit-button smbutton smbutton-white';
    buttonPlatinum.className = 'ile-button ile-handicapped ile-submit-button smbutton smbutton-green'
    buttonDesc.style = buttonTags.style = 'margin-right: 12px;';
    buttonPlatinum.style = 'margin-left: 12px; float:right';
    buttonDesc.id = 'Desc';
    buttonTags.id = 'Tags';
    buttonPlatinum.id = 'Platinum';

    buttonTags.addEventListener ("click", function () {
        copyToClipboard(tags);
        document.querySelector('div[class="tags-widget eclipse"]').focus()
        document.querySelector('div[class="tags-widget eclipse"]').click()
    }, false);
    buttonDesc.addEventListener ("click", function () {
        copyToClipboard(desc);
        document.querySelector('div[class="ccwriter-content"]').focus()
        document.querySelector('div[class="ccwriter-content"]').click()
    }, false);
    buttonPlatinum.addEventListener ("click",function () {
        accomplishment = true;
        AutoGalleries();
        copyToClipboard(gamegallery + ' - Platinum - ');
        document.querySelector('input[title="Title"]').select();
    }, false);

    var element = document.getElementById("Desc");

    //If it isn't "undefined" and it isn't "null", then it exists.
    if(typeof(element) != 'undefined' && element != null){
    }
    else
    {
        document.getElementById('autocomplete-placebo').appendChild(buttonDesc);
        let spanDesc = document.createElement('span');
        spanDesc.textContent = 'Descrizione';
        buttonDesc.appendChild(spanDesc)

        document.getElementById('autocomplete-placebo').appendChild(buttonTags);
        let spanTags = document.createElement('span');
        spanTags.textContent = 'Tags';
        buttonTags.appendChild(spanTags)

        document.getElementById('autocomplete-placebo').appendChild(buttonPlatinum);
        let spanPlatinum = document.createElement('span');
        spanPlatinum.textContent = 'Platinum';
        buttonPlatinum.appendChild(spanPlatinum)
    }
}

function AutoGalleries(jNode) {

    if (accomplishment) {
        SwitchGallery('Accomplishments');
    }


    if (typeof dim === 'undefined') {
            var dim = document.querySelector('.ile-feature-downloads-item-dimensions').textContent.replaceAll(" ", "").split('x');

            if (dim[0] < dim[1]) {
                SwitchGallery("Vertical Shots");
            }
        }

        SwitchGallery(gamegallery);

        if (confirm("Add to Close-ups gallery?"))
        {
            SwitchGallery("Close-ups");
        }

        if (!accomplishment && !confirm('Add to Featured gallery?')) {
            SwitchGallery("Featured");
        }
}

//User Snag on StackOverflow
function simulateMouseClick(targetNode) {
    function triggerMouseEvent(targetNode, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        targetNode.dispatchEvent(clickEvent);
    }
    ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
        triggerMouseEvent(targetNode, eventType);
    });
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function main(jNode)
{
    
    waitForKeyElements ("a[data-meta]",
    function AdvancedOptions (jNode) {
        document.querySelector("a[data-meta]").click()
    } //Waits for Show Advanced Options button and clicks it
    );

    waitForKeyElements ("a[class='ile-resize-button smbutton smbutton-white smbutton-stash-white']", //Waits for Size window panel and clicks it
                        function SelectSize (jNode) {
        simulateMouseClick(document.querySelector("a[class='ile-resize-button smbutton smbutton-white smbutton-stash-white']"));
    });

    waitForKeyElements ("a[data-size='0']", //Waits for Original Size Choice and clicks it
                        function OriginalSize (jNode) {
        document.querySelector("a[data-size='0']").click();
    if (document.querySelector("a > span[style]").textContent.includes('Original')) {}
    });

    waitForKeyElements ("div[class='ile-publish-bubble']", GameIdentifier);
    
    waitForKeyElements ("button[id='Desc']", AutoGalleries); //Starts the Gallery Selection process
}

//Code
let gamegallery;
let accomplishment = false;

waitForKeyElements("a[data-meta]", main);



