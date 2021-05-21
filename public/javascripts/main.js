var mycourses = (function() {
    const env = 0;
    const appUri = (!!env)? ('http://localhost:3000'):('https://hla.legion.ru');
    const apiUri = (!!env)? ('http://localhost:3000/API1.0'):('https://hla.legion.ru/API1.0');

    var bodyOnLoad = function() {
        const displayName = document.getElementById('user');
        displayName.innerText = localStorage.getItem('mysocnet.user') || "";
        if (!!localStorage.getItem('mysocnet.userId')) {
            document.getElementById("menuitem01").classList.add('menu-item-toggle');
            document.getElementById("menuitem04").classList.add('menu-item-toggle');
            document.getElementById("menuitem05").classList.remove('menu-item-toggle');
            document.getElementById("user").classList.remove('menu-item-toggle');
        } else {
            document.getElementById("menuitem01").classList.remove('menu-item-toggle');
            document.getElementById("menuitem04").classList.remove('menu-item-toggle');
            document.getElementById("menuitem05").classList.add('menu-item-toggle');
            document.getElementById("user").classList.add('menu-item-toggle');
        }
        const messagesWindow = document.getElementById("messages");
        if (!!messagesWindow) {
            messagesWindow.scrollTop = messagesWindow.scrollHeight;
        }
        const subscription = localStorage.getItem('mysocnet.subscription.currency');
        if (!!subscription) {
            const subcription_element = document.getElementById(subscription);
            subcription_element.classList.add('subscription-current');
        }
        let id = undefined;
        id = localStorage.getItem('mysocnet.subscription.add')
        if (!!id) {
            const dialog = document.getElementById('addsubscription');
            dialog.classList.remove('dialog-hide');
        } else {
            const dialog = document.getElementById('addsubscription');
            dialog.classList.add('dialog-hide');
        }
    }
    var login = function() {
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
    
        if (!name || !password) return;
    
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUri}/login`);
        request.setRequestHeader('content-type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                localStorage.setItem('mysocnet.user', name);
                localStorage.setItem('mysocnet.userId', JSON.parse(request.response).userId);

                document.getElementById('user').innerText = name;

                window.location.href = `${appUri}`;
            } else if (request.readyState === 4 && request.status === 401) {
                localStorage.setItem('mysocnet.user', "");
                localStorage.setItem('mysocnet.userId', "");

                document.getElementById('name').innerText = "";
                document.getElementById("menuitem01").classList.remove('menu-item-toggle');
                document.getElementById("menuitem04").classList.remove('menu-item-toggle');
                document.getElementById("menuitem05").classList.add('menu-item-toggle');
                document.getElementById("user").classList.add('menu-item-toggle');
            }
        });
        request.send('{ "name": "' + name + '", "password": "' + password +'" }');
    }
    var logout = function() {
        const request = new XMLHttpRequest();
        request.open('POST', `${appUri}/logout`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                localStorage.setItem('mysocnet.user', "");
                localStorage.setItem('mysocnet.userId', "");
                window.location.href = `${appUri}`
                console.log("User leave application");
            }
        });
        request.send('{}');
    }
    var islogged = function() {
        return !!localStorage.getItem('mysocnet.user');
    }
    var subscriptionSelect = function(id) {
        const subscriptionCurrency = localStorage.getItem('mysocnet.subscription.currency') || "";
        if (!!subscriptionCurrency) {
            document.getElementById(subscriptionCurrency).classList.remove('subscription-current');
        }
        document.getElementById("subscriptionid" + id).classList.add('subscription-current');
        localStorage.setItem('mysocnet.subscription.currency', "subscriptionid" + id);
        window.location.href = `${appUri}/${id}`;
    }
    var myMessages = function() {
        localStorage.setItem('mysocnet.subscription.currency', "");
        window.location.href = `${appUri}`;
    }
    var sendMessage = function(controlId) {
        const request = new XMLHttpRequest();
        const message = document.getElementById(controlId).value;

        request.open('POST', `${apiUri}/messages`);
        request.setRequestHeader('content-type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = `${appUri}`;
                const messagesWindow = document.getElementById("messages");
                messagesWindow.scrollTop = messagesWindow.scrollHeight;
            }
        });
        request.send('{ "message": "' + message + '" }');
    }
    var viewMessageComments = function(messageId) {
        localStorage.setItem('mysocnet.comments.message', messageId);
        const subscriptionCurrency = localStorage.getItem('mysocnet.subscription.currency') || "";
        if (!!subscriptionCurrency) {
            window.location.href = `${appUri}/${(subscriptionCurrency.replace("subscriptionid",""))}?commentsMessageId=${messageId}`;
        } else {
            window.location.href = `${appUri}?commentsMessageId=${messageId}`;
        }
    }
    var viewMessageCommentsMessageId = function() {
        return localStorage.getItem('mysocnet.comments.message');
    }
    var sendComments = function(meesageId, controlId) {

    }
    var userRegister = function() {
        const password1 = document.getElementById("Password1").value.trim();
        const password2 = document.getElementById("Password2").value.trim();

        if (password1.length < 5) return;

        if (password1 !== password2) {
            console.log("Invalid password");
            return;
        }
        const params = {
            EMail: document.getElementById("EMail").value,
            FirstName: document.getElementById("FirstName").value,
            LastName: document.getElementById("LastName").value,
            BirthDate: document.getElementById("BirthDate").value,
            Gender: document.getElementById("Gender").value,
            City: document.getElementById("City").value,
            Country: document.getElementById("Country").value,
            Interests: document.getElementById("Interests").value,
            Password: password1
        };

        for(let value of Object.values(params)) {
            if ((value || "").length === 0) return;
        }

        console.log(params);

        const request = new XMLHttpRequest();

        request.open('POST', `${apiUri}/register`);
        request.setRequestHeader('content-type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = `${appUri}/login`;
            }
        });
        request.send(JSON.stringify(params));
    }
    var subscriptionAddDialog = function() {
        localStorage.setItem('mysocnet.subscription.add', 'ADD');
        const dialog = document.getElementById('addsubscription');
        dialog.classList.remove('dialog-hide');
    }
    var subscriptionOKDialog = function(id) {
        localStorage.removeItem('mysocnet.subscription.add');
        const request = new XMLHttpRequest();

        request.open('POST', `${apiUri}/profile/subscribe`);
        request.setRequestHeader('content-type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = `${appUri}`;
            }
        });
        request.send(JSON.stringify({ authorId: id }));
    }
    var subscriptionCancelDialog = function() {
        localStorage.removeItem('mysocnet.subscription.add');
        const dialog = document.getElementById('addsubscription');
        dialog.classList.add('dialog-hide');
    }
    var subscriptionsList = function() {
        const criteria = document.getElementById("searchtext").value
        if (criteria) {
            window.location.href = `${appUri}?criteria=${criteria}`;
        }
    }
    return {
        login: login,
        logout: logout,
        islogged: islogged,
        bodyOnLoad: bodyOnLoad,
        subscription: {
            currency: subscriptionSelect
        },
        messages: {
            my: myMessages,
            send: sendMessage
        },
        comments: {
            view: viewMessageComments,
            messageId: viewMessageCommentsMessageId,
            send: sendComments
        },
        users: {
            register: userRegister
        },
        addSubscription: {
            Dialog: subscriptionAddDialog,
            OK: subscriptionOKDialog,
            Cancel: subscriptionCancelDialog,
            List: subscriptionsList
        }
    };
})();
