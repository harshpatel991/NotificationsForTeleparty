window.addEventListener("load", myMain, false);

function myMain(evt) {
    var jsInitChecktimer = setInterval(checkForJS_Finish, 1000);

    function checkForJS_Finish() {
        var chatHistoryContainer = window.document.getElementById('chat-history-container');

        if (chatHistoryContainer != null) {
            console.log("Teleparty detected");
            clearInterval(jsInitChecktimer);


            if (Notification.permission !== 'denied' || Notification.permission === "default") {
                Notification.requestPermission(function (permission) {
                    console.log("Notifcation permission granted");
                });
            }

            elementToObserve = chatHistoryContainer.children[0];
            observer = new MutationObserver(function (mutationsList, observer) {
                var nickNamePlaceholder = window.document.getElementById('nickname-edit').placeholder;
                var nickNameValue = window.document.getElementById('nickname-edit').value;
                var nickName = nickNameValue === '' ? nickNamePlaceholder : nickNameValue;

                var messageParts = mutationsList[0].addedNodes[0].innerText.split("\n");
                var name = messageParts[0];
                var message = messageParts[2];
                if (name != nickName) {
                    var audio = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
                    audio.play();
                    new Notification(name, { body: message });
                }
            });

            observer.observe(elementToObserve, { characterData: false, childList: true, attributes: false });
        }
    }
}