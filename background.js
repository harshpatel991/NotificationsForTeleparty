window.addEventListener("load", myMain, false);

function myMain(evt) {
    var jsInitChecktimer = setInterval(checkForJS_Finish, 1000);

    function checkForJS_Finish() {
        var chatHistoryContainer = document.querySelectorAll('div[class^="onboard_sidebar-history-container"]')[0];

        if (chatHistoryContainer != null) {
            console.log("Teleparty detected");
            clearInterval(jsInitChecktimer);


            if (Notification.permission !== 'denied' || Notification.permission === "default") {
                Notification.requestPermission(function (permission) {
                    console.log("Notifcation permission granted");
                });
            }

            var elementToObserve = chatHistoryContainer.children[0];
            observer = new MutationObserver(function (mutationsList, observer) {
                var profileIcon = window.document.querySelector("[tp-id=edit_profile]").src;

                var messageParts = mutationsList[0].addedNodes[0].innerText.split("\n");
                var message = messageParts[2];

                var foundProfileNameAndIcon = findProfileNameAndIcon(mutationsList[0].addedNodes[0]);

                var name = foundProfileNameAndIcon.name;
                var messageProfileIcon = foundProfileNameAndIcon.messageProfileIcon;

                if(messageProfileIcon !== profileIcon) {
                    var audio = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
                    audio.play();
                    new Notification(name, {body: message});
                }
            });

            observer.observe(elementToObserve, { characterData: false, childList: true, attributes: false });
        } else {
            console.log("Teleparty not detected");
        }
    }
}

//move up the siblings
function findProfileNameAndIcon(element) {
    //loop over all classes for the element, if it has "combined", we need to look at earlier siblings which don't have "combined"
    if(isCombinedElement(element)) {
        let previousSiblings = getPreviousSiblings(element);
        for(const previousSibling of previousSiblings) {
            if(!isCombinedElement(previousSibling)) {
                return {name: previousSibling.innerText.split("\n")[0], messageProfileIcon: previousSibling.childNodes[0].src } ;
            }
        }
    } else {
        return {name: element.innerText.split("\n")[0], messageProfileIcon: element.childNodes[0].src } ;
    }
}

function isCombinedElement(element) {
    var classes = element.className.split(' ');

    for (var i = 0; i < classes.length; i++) {
        var name = classes[i];
        if (name.includes('combined')) {
            return true;
        }
    }
    return false;
}

function getPreviousSiblings(elem, filter) {
    var sibs = [];
    while (elem = elem.previousSibling) {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    }
    return sibs;
}