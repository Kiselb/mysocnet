var mycourses = (function() {
    const env = 1;
    const appUri = (!!env)? ('http://localhost:5000'):('https://kiselbcourses.herokuapp.com');
    const apiUri = (!!env)? ('http://localhost:5000/API1.0'):('https://kiselbcourses.herokuapp.com/API1.0');

    var bodyOnLoad = function() {
        const displayName = document.getElementById('user');
        displayName.innerText = localStorage.getItem('mycourses.user') || "";
        if (!!localStorage.getItem('mycourses.userId')) {
            document.getElementById("menuitem03").classList.remove('menu-item-toggle');
            document.getElementById("menuitem04").classList.remove('menu-item-toggle');
            document.getElementById("menuitem05").classList.add('menu-item-toggle');
            document.getElementById("menuitem06").classList.remove('menu-item-toggle');
            document.getElementById("menuitem07").classList.remove('menu-item-toggle');
            document.getElementById("user").classList.remove('menu-item-toggle');
        } else {
            document.getElementById("menuitem03").classList.add('menu-item-toggle');
            document.getElementById("menuitem04").classList.add('menu-item-toggle');
            document.getElementById("menuitem05").classList.remove('menu-item-toggle');
            document.getElementById("menuitem06").classList.add('menu-item-toggle');
            document.getElementById("menuitem07").classList.add('menu-item-toggle');
            document.getElementById("user").classList.add('menu-item-toggle');
        }
        let id = undefined;
        id = localStorage.getItem('mycourses.course.addLesson')
        if (!!id) {
            const dialog = document.getElementById('add-lesson-to-course');
            dialog.classList.remove('dialog-hide');
            return;
        }
        id = localStorage.getItem('mycourses.stream.addLesson')
        if (!!id) {
            const dialog = document.getElementById('add-lesson-to-stream');
            dialog.classList.remove('dialog-hide');
            return;
        }
        id = localStorage.getItem('mycourses.course.addStream')
        if (!!id) {
            const dialog = document.getElementById('add-stream-to-course');
            dialog.classList.remove('dialog-hide');
            return;
        }
        id = localStorage.getItem('mycourses.course.add')
        if (!!id) {
            const dialog = document.getElementById('add-course');
            dialog.classList.remove('dialog-hide');
            return;
        }
        id = localStorage.getItem('mycourses.course.change')
        if (!!id) {
            const dialog = document.getElementById('change-course');
            dialog.classList.remove('dialog-hide');
            return;
        }
        id = localStorage.getItem('mycourses.stream.change')
        if (!!id) {
            const dialog = document.getElementById('change-stream');
            dialog.classList.remove('dialog-hide');
            return;
        }
        id = localStorage.getItem('mycourses.stream.changeLesson')
        if (!!id) {
            const dialog = document.getElementById('change-stream-lesson');
            dialog.classList.remove('dialog-hide');
            return;
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
                document.getElementById("menuitem03").classList.add('menu-item-toggle');
                document.getElementById("menuitem04").classList.add('menu-item-toggle');
                document.getElementById("menuitem05").classList.remove('menu-item-toggle');
                document.getElementById("menuitem06").classList.add('menu-item-toggle');
                document.getElementById("menuitem07").classList.add('menu-item-toggle');
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
                localStorage.setItem('mycourses.user', "");
                localStorage.setItem('mycourses.userId', "");
                window.location.href = `${appUri}`
            }
        });
        request.send('{}');
    }
    var islogged = function() {
        return !!localStorage.getItem('mycourses.user');
    }
    var signupStream = function(streamId) {
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUri}/streams/${streamId}/students`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = `${appUri}/streams/${streamId}/subscribeinfo`;
            } else if (request.readyState === 4 && request.status === 302) {
                window.location.href = `${appUri}/streams/${streamId}/subscribewarning`;
            }
        });
        request.send(JSON.stringify({}));
    }
    var courseAddDialog = function() {
        const dialog = document.getElementById('add-course');
        localStorage.setItem('mycourses.course.add', "ADD");
    }
    var courseAddOK = function() {
        if (!localStorage.getItem('mycourses.course.add')) return;
        localStorage.removeItem('mycourses.course.add');
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUri}/courses`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                const courseId = JSON.parse(request.response).courseId;
                window.location.reload();
                window.location.href = `${appUri}/courses/${courseId}`;
            }
        });
        const name = document.getElementById("dialog-course-add-name").value;
        const description = document.getElementById("dialog-course-add-description").value;
        if (!name || !description) {
            return;
        }
        const data = JSON.stringify({ name: name, description: description });
        request.send(data)
    }
    var courseAddCancel = function() {
        localStorage.removeItem('mycourses.course.add');
        window.location.reload();
    }
    var courseChangeDialog = function(courseId) {
        const dialog = document.getElementById('change-course');
        const request = new XMLHttpRequest();
        request.open('GET', `${appUri}/courses/${courseId}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                const dialog = document.getElementById('change-course');
                dialog.classList.remove('dialog-hide');
                const data = JSON.parse(request.response);
                console.log(data.Name, data.Description)
                document.getElementById('dialog-course-change-name').value = data.Name;
                document.getElementById('dialog-course-change-description').value = data.Description;
                localStorage.setItem('mycourses.course.change', courseId);
            }
        });
        request.send({});
    }
    var courseChangeOK = function() {
        const courseId = localStorage.getItem('mycourses.course.change');
        if (!courseId) return;
        localStorage.removeItem('mycourses.course.change');
        const request = new XMLHttpRequest();
        request.open('PUT', `${apiUri}/courses/${courseId}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.reload();
            }
        });
        const name = document.getElementById("dialog-course-change-name").value;
        const description = document.getElementById("dialog-course-change-description").value;
        if (!name || !description) {
            return;
        }
        const data = JSON.stringify({ name: name, description: description });
        request.send(data)
    }
    var courseChangeCancel = function() {
        localStorage.removeItem('mycourses.course.change');
        window.location.reload();
    }
    var courseAddLessonDialog = function(courseId) {
        const dialog = document.getElementById('add-lessson-to-course');
        localStorage.setItem('mycourses.course.addLesson', courseId)
    }
    var courseAddLessonOK = function() {
        const courseId = localStorage.getItem('mycourses.course.addLesson');
        if (!courseId) return;
        localStorage.removeItem('mycourses.course.addLesson')
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUri}/courses/${courseId}/lessons`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = `${appUri}/courses/${courseId}`;
            }
        });
        const theme = document.getElementById("dialog-course-add-lesson-theme").value;
        const purpose = document.getElementById("dialog-course-add-lesson-purpose").value;
        if (!theme || !purpose) {
            return;
        }
        const elementInsertType = document.querySelector("input[name=addLesssonToCoursePositionType]:checked");
        let insertType;
        if (!!elementInsertType) {
           insertType = +elementInsertType.value;
        } else {
            return;
        }
        const insertPosition = +(document.getElementById("dialog-course-add-lesson-position-value").value || 0);
        if (!(insertType < 0 || insertType === 0 || insertType > 0 && insertPosition > 0)) {
            return;
        }
        if (insertType > 0 && insertPosition < 2 ) {
            return;
        }
        const data = JSON.stringify({ theme: theme, purpose: purpose, type: insertType, position: insertPosition });
        request.send(data)
    }
    var courseAddLessonCancel = function() {
        const courseId = localStorage.getItem('mycourses.course.addLesson');
        localStorage.removeItem('mycourses.course.addLesson');
        window.location.href = `${appUri}/courses/${courseId}`;
    }
    var courseRemLesson = function(courseId, lesson) {
        if (!!localStorage.getItem('mycourses.course.remLesson')) return;
        localStorage.setItem('mycourses.course.remLesson', courseId + '@' + lesson)
        const request = new XMLHttpRequest();
        request.open('DELETE', `${apiUri}/courses/${courseId}/lessons/${lesson}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                //window.location.href = 'http://127.0.0.1:5000/courses/' + courseId;
                window.location.reload();
                localStorage.removeItem('mycourses.course.remLesson');
            }
        });
        request.send(JSON.stringify({}));
    }
    var courseAddStreamDialog = function(courseId) {
        if (!!localStorage.getItem('mycourses.course.addStream')) return;

        const dialog = document.getElementById('add-stream-to-course');
        localStorage.setItem('mycourses.course.addStream', courseId)
    }
    var courseAddStreamOK = function() {
        const courseId = localStorage.getItem('mycourses.course.addStream');
        if (!courseId) return;
        localStorage.removeItem('mycourses.course.addStream');
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUri}/courses/${courseId}/streams`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                const streamId = JSON.parse(request.response).streamId;
                window.location.href = `${appUri}/streams/${streamId}`;
            }
        });
        const dateStart = document.getElementById("dialog-course-add-stream-start").value;
        const dateFinish = document.getElementById("dialog-course-add-stream-finish").value;
        if (!dateStart || !dateFinish) return
        const data = JSON.stringify({ start: dateStart, finish: dateFinish });
        request.send(data);
    }
    var courseAddStreamCancel = function() {
        const courseId = localStorage.getItem('mycourses.course.addStream');
        localStorage.removeItem('mycourses.course.addStream');
        window.location.href = `${appUri}/courses/${courseId}/streams`;
    }
    var streamAddLessonDialog = function(streamId) {
        const dialog = document.getElementById('add-lessson-to-stream');
        localStorage.setItem('mycourses.stream.addLesson', streamId)
    }
    var streamAddLessonOK = function() {
        const streamId = localStorage.getItem('mycourses.stream.addLesson');
        if (!streamId) return;
        const request = new XMLHttpRequest();
        request.open('POST', `${apiUri}/streams/${streamId}/lessons`);
        localStorage.removeItem('mycourses.stream.addLesson')
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = `${appUri}/streams/${streamId}`;
            }
        });
        const theme = document.getElementById("dialog-stream-add-lesson-theme").value;
        const purpose = document.getElementById("dialog-stream-add-lesson-purpose").value;
        if (!theme || !purpose) {
            return;
        }
        const date = document.getElementById("dialog-stream-add-lesson-date").value;
        const time = document.getElementById("dialog-stream-add-lesson-time").value;
        if (!date || !time) {
            return;
        }
        const dueDate = new Date(date + " " + time);
        const elementInsertType = document.querySelector("input[name=addLesssonToStreamPositionType]:checked");
        let insertType;
        if (!!elementInsertType) {
           insertType = +elementInsertType.value;
        } else {
            return;
        }
        const insertPosition = +(document.getElementById("dialog-stream-add-lesson-position-value").value || 0);
        if (!(insertType < 0 || insertType === 0 || insertType > 0 && insertPosition > 0)) {
            return;
        }
        if (insertType > 0 && insertPosition < 2 ) {
            return;
        }
        const data = JSON.stringify({ theme: theme, purpose: purpose, type: insertType, position: insertPosition, dueDate: dueDate });
        request.send(data);
    }
    var streamAddLessonCancel = function() {
        const streamId = localStorage.getItem('mycourses.stream.addLesson');
        localStorage.removeItem('mycourses.stream.addLesson');
        window.location.href = `${appUri}/streams/${streamId}`;
    }
    var streamChangeLessonDialog = function(streamId, lessonNum) {
        const dialog = document.getElementById('change-stream-lesson');
        localStorage.setItem('mycourses.stream.changeLesson', streamId + '@' + lessonNum);
    }
    var streamChangeLessonOK = function() {
        if (!localStorage.getItem('mycourses.stream.changeLesson')) return;
        const streamId = localStorage.getItem('mycourses.stream.changeLesson').split('@')[0];
        const lesson = localStorage.getItem('mycourses.stream.changeLesson').split('@')[1];
        if (!streamId || !lesson) {
            localStorage.removeItem('mycourses.stream.changeLesson');
            return
        }
        const request = new XMLHttpRequest();
        request.open('PUT', `${apiUri}/streams/${streamId}/lessons/${lesson}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                //window.location.href = 'http://127.0.0.1:5000/streams/' + streamId;
                window.location.reload();
                localStorage.removeItem('mycourses.stream.changeLesson');
            }
        });
        const date = document.getElementById("dialog-stream-change-lesson-date").value;
        const time = document.getElementById("dialog-stream-change-lesson-time").value;
        if (!date || !time) {
            return;
        }
        const dueDate = new Date(date + " " + time);
        console.log("DueDate", dueDate, date, time);
        request.send(JSON.stringify({ dueDate: dueDate}));
    }
    var streamChangeLessonCancel = function() {
        localStorage.removeItem('mycourses.stream.changeLesson');
        window.location.reload();
    }
    var streamRemLesson = function(streamId, lesson) {
        if (!!localStorage.getItem('mycourses.stream.remLesson')) return;
        localStorage.setItem('mycourses.stream.remLesson', streamId + '@' + lesson)
        const request = new XMLHttpRequest();
        request.open('DELETE', `${apiUri}/streams/${streamId}/lessons/${lesson}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                //window.location.href = 'http://127.0.0.1:5000/streams/' + streamId;
                window.location.reload();
                localStorage.removeItem('mycourses.stream.remLesson');
            }
        });
        request.send(JSON.stringify({}));
    }
    var changeStreamDialog = function(streamId) {
        const dialog = document.getElementById('change-stream');
        localStorage.setItem('mycourses.stream.change', streamId);
    }
    var changeStreamOK = function() {
        const streamId = localStorage.getItem('mycourses.stream.change');
        if (!streamId) return;
        localStorage.removeItem('mycourses.stream.change');
        const request = new XMLHttpRequest();
        request.open('PUT', `${apiUri}/streams/${streamId}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.reload();
            }
        });
        const start = document.getElementById("dialog-stream-change-start").value;
        const finish = document.getElementById("dialog-stream-change-finish").value;
        if (!start || !finish) {
            return;
        }
        request.send(JSON.stringify({ start: start, finish: finish }));
    }
    var changeStreamCancel = function() {
        const streamId = localStorage.getItem('mycourses.stream.change');
        localStorage.removeItem('mycourses.stream.change');
        window.location.reload();
    }
    var remStream = function(streamId) {
        console.log("Remove stream: " + streamId)
        const request = new XMLHttpRequest();
        request.open('DELETE', `${apiUri}/streams/${streamId}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 204) {
                window.location.reload();
            }
        });
        request.send(JSON.stringify({}));
    }
    return {
        login: login,
        logout: logout,
        islogged: islogged,
        bodyOnLoad: bodyOnLoad,
        signupStream: signupStream,
        courses: {
            addCourse: {
                Dialog: courseAddDialog,
                OK: courseAddOK,
                Cancel: courseAddCancel
            },
            changeCourse: {
                Dialog: courseChangeDialog,
                OK: courseChangeOK,
                Cancel: courseChangeCancel
            },
            addLesson: {
                Dialog: courseAddLessonDialog,
                OK: courseAddLessonOK,
                Cancel: courseAddLessonCancel
            },
            remLesson: courseRemLesson,
            addStream:  {
                Dialog: courseAddStreamDialog,
                OK: courseAddStreamOK,
                Cancel: courseAddStreamCancel
            }
        },
        streams: {
            addLesson: {
                Dialog: streamAddLessonDialog,
                OK: streamAddLessonOK,
                Cancel: streamAddLessonCancel
            },
            changeLesson: {
                Dialog: streamChangeLessonDialog,
                OK: streamChangeLessonOK,
                Cancel: streamChangeLessonCancel
            },
            remLesson : streamRemLesson,
            changeStream: {
                Dialog: changeStreamDialog,
                OK: changeStreamOK,
                Cancel: changeStreamCancel
            },
            removeStream: remStream
        }
    };
})();
