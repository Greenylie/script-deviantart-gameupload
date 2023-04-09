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

//Code

waitForKeyElements ("a[data-meta]", //Waits for Show Advanced Options button and clicks it
                    function AdvancedOptions (jNode) {
    document.querySelector("a[data-meta]").click();
});

waitForKeyElements ("a[class='ile-resize-button smbutton smbutton-white smbutton-stash-white']", //Waits for Size window panel and clicks it
                    function SelectSize (jNode) {
    simulateMouseClick(document.querySelector("a[class='ile-resize-button smbutton smbutton-white smbutton-stash-white']"));
});

waitForKeyElements ("a[data-size='0']", //Waits for Original Size Choice and clicks it
                    function OriginalSize (jNode) {
    document.querySelector("a[data-size='0']").click();
    if (document.querySelector("a > span[style]").textContent.includes('Original')) {
    }
});

waitForKeyElements ("div[class='ile-publish-bubble']", GameIdentifier);

let game;
let accomplishment = false;

function GameIdentifier(jNode) {
    let desc, tags;
    let title = document.querySelector("input[title='Title']").value;

    if (title.includes("APlagueTale Innocence"))
    {
        desc = "A Plague Tale Innocence (PC 1080=>4k PNG)\nUpscale process executed by Topaz Gigapixel AI";
        tags = "aplaguetale,plague,videogame,xbox,xboxgamepass,HugoDeRune,AmiciaDeRune,videogames,gaming,rats,gamingcharacter,gamingwallpaper,video_games";
        game = "A Plague Tale Innocence";
    }
    else if (title.includes("Horizon Forbidden West"))
    {
        desc = "Horizon Forbidden West (PS5 4K PNG)";
        tags = "horizonzerodawn,horizon_zero_dawn,aloyhorizonzerodawn,aloyhorizon,aloy,robots,machines,playstation,ps5,ps4exclusive,gaming,videogames,gamingcharacter,horizonfobiddenwest,forbiddenwest";
        game = "Horizon Forbidden West";
    }
    else if (title.includes("Horizon Zero Dawn"))
    {
        desc = "Horizon Zero Dawn Complete Edition (PS5 4K PNG)";
        tags = "horizonzerodawn,horizon_zero_dawn,aloyhorizonzerodawn,aloyhorizon,aloy,robots,machines,playstation,ps5,ps4exclusive,gaming,videogames,gamingcharacter";
        game = "Horizon Zero Dawn";
    }
    else if (title.includes("Ghost of Tsushima"))
    {
        desc = "Ghost of Tsushima Director's Cut (PS5 4K PNG)";
        tags = "ghostoftsushima,ghost_of_tsushima,jinsakai,samurai,japan,playstation,ps5,ps4exclusive,gaming,videogames,gamingcharacter";
        game = "Ghost of Tsushima";
    }
    else if (title.includes("Assassin's Creed"))
    {
        desc = "Assassin's Creed: The Ezio Collection (PS5 4K PNG)";
        tags = "assassinscreed,ezioauditore,ezioauditoredafirenze,playstation,playstation5,ps5,gamingcharacter,gaming,videogames";
        game = "Assassin's Creed";
    }
    else if (title.includes("ELDEN RING"))
    {
        desc = "Elden Ring (PS5 4K PNG)";
        tags = "eldenring,fromsoftware,darkfantasy,soulslike,playstation,playstation5,ps5,gamingcharacter,gaming,videogames";
        game = "Elden Ring";
    }
    else if (title.includes("No Man's Sky"))
    {
        desc = "No Man's Sky (PS5 4K PNG)";
        tags = "nomanssky,spaceship,space,planet,gaming,videogames,ps5,playstation,exploration";
        game = "No Man's Sky";
    }

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
        copyToClipboard(game + ' - Platinum - ');
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


waitForKeyElements ("button[id='Desc']", AutoGalleries); //Starts the Gallery Selection process

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

        if (confirm("Add to Close-ups gallery?"))
        {
            SwitchGallery("Close-ups");
        }

        if (game == 'Horizon Zero Dawn' || game == 'Horizon Forbidden West')
        {
            SwitchGallery("Horizon");
        }
        else if (game == 'A Plague Tale Innocence')
        {
            SwitchGallery('A Plague Tale');
        }
        else if (game == 'Ghost of Tsushima')
        {
            SwitchGallery('Ghost of Tsushima');
        }
        else if (game == "Assassin's Creed")
        {
            SwitchGallery("Assassin's Creed");
        }
        else if (game == "Elden Ring")
        {
            SwitchGallery("Elden Ring");
        }
        else if (game == "No Man's Sky")
        {
            SwitchGallery("No Man's Sky");
        }
        else
        {
            SwitchGallery("Other Games");
        }

       if (!accomplishment && !confirm('Add to Featured gallery?')) {
        SwitchGallery("Featured");
       }
}


/*
var Desc = document.createElement('textarea');
    var Tags = document.createElement('textarea');
    Desc.id = 'Desc';
    Tags.id = 'Tags';
    Desc.value = desc;
    Tags.value = tags;
    Desc.style = "width: 587px; height: 20px;";
    Tags.style = "width: 587px; height: 99px;";

    var element = document.getElementById("Desc");

    //If it isn't "undefined" and it isn't "null", then it exists.
    if(typeof(element) != 'undefined' && element != null){
    } else{
        document.getElementById('autocomplete-placebo').appendChild(Desc);
        document.getElementById('autocomplete-placebo').appendChild(Tags);
    }


    Desc.select();
    Desc.scrollIntoViewIfNeeded();
*/

