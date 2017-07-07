$(document).ready(function() {

    var refreshInterval = 5000;
    var filterTimer = 0;
    var csrfCookieName = "secretCookie";
    var cookie = {};
    cookie.csrf = $("meta[name='_csrf']").attr("content");
    $.cookie(csrfCookieName, JSON.stringify(cookie));

    var currentPageData = {
        account : {},
        accounts : {
            data : [],
            columns : ["name", "role"],
            filter : ""
        },
        timezones : {
            data : [],
            columns : ["name", "city", "gmtDifferenceInSeconds", "localTime"],
            filter : ""
        }
    };

    /* Setup filter */
    $(".filter").on("keyup", function() {
        var obj = $(this).data("obj");
        var filterStr = $(this).find("input[type='text']").val();
        clearTimeout(filterTimer);
        filterTimer = setTimeout(function() {
            currentPageData[obj].filter = filterStr;
            requestData(obj);
        }, 200); 
    });

    $(".filter").on("click", "button", function() {
        $(this).closest(".filter").keyup();
    });

    /* Actions buttons: Delete and Update */
    $(document).on("click", "input[name='delete']", function() {
        var row = $(this).closest("tr");
        $("#confirm-yes").data("obj", row.data("obj"));
        $("#confirm-yes").data("id", row.data("id"));
    });

    $("#confirm-yes").on("click", function() {
        var obj = $(this).data("obj");
        var id = $(this).data("id");
        $.ajax({
            url : "/rest/" + obj + "/" + id,
            method: "DELETE",
            success : function(data) {
                showStatus("success", "Entry has been successfully removed");
                delete currentPageData[obj].data[id];
                displayList(obj);
            },
            error : function(request) {
                showStatus("danger", getErrorMessage(request));
            }
        });
    });

    $(document).on("click", "input[name='update']", function() {
        var row = $(this).closest("tr");
        var obj = row.data("obj");
        var id = row.data("id");
        var elem = currentPageData[obj].data[id];
        var columns = currentPageData[obj].columns;
        columns.forEach(function (column) {
            var value = elem[column];
            if (value) {
                if (column == "gmtDifferenceInSeconds") {
                    value = toHHMMSS(value, true);
                }
                if (column != "password") {
                    $("#" + obj + "-save-modal input[name='" + column + "']").val(value);
                    $("#" + obj + "-save-modal select[name='" + column + "']").val(value);
                }
            }
        });
        $("#" + obj + "-save-modal input[name='id']").val(id);
    });

    $(".modal").on("show.bs.modal", function(e) {
        $(this).find("input[type='text'],input[type='password'],input[type='hidden'],select").val("");
        $(this).find("input[type='text']").filter(":first").focus();
    });

    $("#save-timezone-entry-ok").on("click", function() {
        var data = {};
        $.each($("#timezones-save-modal").find("input[type='text'],input[type='hidden']"), function() {
            data[this.name] = $(this).val();
        });
        var method = data.id != "" ? "PUT" : "POST";
        data.gmtDifferenceInSeconds = fromHHMMSS(data.gmtDifferenceInSeconds);
        $.ajax({
            url : "/rest/timezones/" + data.id,
            method : method,
            data : data,
            success : function() {
                showStatus("success", "Time Zone entry has been saved");
                requestData("timezones");
                $("#timezones-save-modal").modal("hide");
            },
            error : function(request) {
                showStatus("danger", getErrorMessage(request));
            }
        });
    });

    $("#save-account-entry-ok").on("click", function() {
        var data = {};
        $.each($("#accounts-save-modal").find("input[type='text'],input[type='password'],input[type='hidden'],select"), function() {
            data[this.name] = $(this).val();
        });
        var method = data.id != "" ? "PUT" : "POST";
        data.gmtDifferenceInSeconds = fromHHMMSS(data.gmtDifferenceInSeconds);
        $.ajax({
            url : "/rest/accounts/" + data.id,
            method : method,
            data : data,
            success : function() {
                showStatus("success", "User has been successfully updated");
                requestData("accounts");
                $("#accounts-save-modal").modal("hide");
            },
            error : function(request) {
                showStatus("danger", getErrorMessage(request));
            }
        });
    });

    $("input[name='gmtDifferenceInSeconds']").inputmask("Regex", { regex: "^([+]|[-])(0[0-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]$" });

    /* Login/Logout */
    $("#login_ok").on("click", function() {
        var data = {};
        $.each($("#login-form input"), function() {
            data[this.name] = $(this).val();
        });
        $.ajax({
            url : "/login",
            method : "POST",
            beforeSend : function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(data.username + ":" + data.password));
            },
            success : function(data, textStatus, jqXHR) {
                currentPageData.account = data;
                showPage("#user-data");
                requestDataForTabs();
                setInterval(function() {
                    repaintTabs();
                }, refreshInterval);
            },
            error : function(request) {
                var message;
                if (request.status == 401) {
                    message = "Incorrect username or password";
                } else {
                    message = getErrorMessage(request);
                }
                showStatus("danger", message);
            }
        });
    });

    $("#login_register").on("click", function() {
        showPage("#registration-form");
    });

    $("#logout").on("click", function() {
        $.ajax({
            url : "/logout",
            method : "POST",
            success : function(data) {
                window.location = "/";
            },
            error : function(request) {
                showStatus("danger", getErrorMessage(request));
            }
        });
    });

    /* Registration */
    $("#register_ok").on("click", function() {
        var data = {};
        $.each($("#registration-form :input"), function() {
            data[this.name] = $(this).val();
        });
        $.ajax({
            url : "/register",
            method : "POST",
            data : data,
            success : function(data) {
                showStatus("success", "Account has been created. Please log in for confirmation");
                showPage("#login-form");
            },
            error : function(request) {
                showStatus("danger", getErrorMessage(request));
            }
        });
    });

    $("#register_cancel").on("click", function() {
        showPage("#login-form");
    });

    /* AJAX Settings */
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        var cookie = JSON.parse($.cookie(csrfCookieName));
        xhr.setRequestHeader("X-CSRF-TOKEN", cookie.csrf);
    });

    $(document).ajaxComplete(function(e, xhr, options) {
        var csrfToken = xhr.getResponseHeader('X-CSRF-TOKEN');
        if (csrfToken) {
            var cookie = JSON.parse($.cookie(csrfCookieName));
            cookie.csrf = csrfToken;
            $.cookie(csrfCookieName, JSON.stringify(cookie));
        }
    });

    /* Display data */
    function repaintTabs() {
        calculateLocalTime();
        displayList("timezones");
        if (currentPageData.account.role == 'ADMIN') {
            displayList("accounts");
        }
    }

    function displayList(obj) {
        $("#" + obj + "-tab").removeClass("hidden");
        $("#" + obj).removeClass("hidden");
        if (obj == "timezones") {
            calculateLocalTime();
        }
        var columns = currentPageData[obj].columns;
        var tableBody = $("#" + obj + " table tbody");
        tableBody.html("");
        if (currentPageData[obj].data.length == 0) {
            var trTemplate = _.template($("#table-empty-row-template").text());
            tableBody.append(trTemplate({columns : columns.length + 1}));
            return;
        }
        var trTemplate = _.template($("#table-row-template").text());
        currentPageData[obj].data.forEach(function(elem) {
            tableBody.append(trTemplate({id : elem.id, obj: obj}));
            var lastTd = tableBody.find("tr:last td:last");
            columns.forEach(function (column) {
                var value = elem[column];
                if (column == "gmtDifferenceInSeconds") {
                    value = toHHMMSS(value, true);
                } else if (column == "localTime") {
                    value = toHHMMSS(value, false);
                }
                lastTd.before("<td>" + value + "</td>");
            });
        });
    }

    /* Request data */
    function requestDataForTabs() {
        requestData("timezones");
        if (currentPageData.account.role == 'ADMIN') {
            requestData("accounts");
        }
    }

    function requestData(obj) {
        var url = "/rest/" + obj + "/";
        $.ajax({
            url : url,
            method: "GET",
            data: {filter : currentPageData[obj].filter},
            success : function(data) {
                currentPageData[obj].data = [];
                data.forEach(function(elem) {
                    currentPageData[obj].data[elem.id] = elem;
                });
                displayList(obj);
            },
            error : function(request) {
                showStatus("danger", getErrorMessage(request));
            }
        });
    }

    /* Helper functions */
    function calculateLocalTime() {
        var now = Date.now();
        currentPageData.timezones.data.forEach(function(elem) {
            var currentLocalDate = new Date(now + elem.gmtDifferenceInSeconds * 1000);
            elem.localTime = currentLocalDate.getUTCHours() * 3600 + currentLocalDate.getUTCMinutes() * 60 + currentLocalDate.getUTCSeconds();
        });
    }

    function toHHMMSS(seconds, withSign) {
        var sign = seconds < 0 ? "-" : "+";
        seconds = Math.abs(seconds);
        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0" + hours;}
        if (minutes < 10) {minutes = "0" + minutes;}
        if (seconds < 10) {seconds = "0" + seconds;}

        var time = hours+':'+minutes+':'+seconds;

        return withSign ? sign + time : time;
    }

    function fromHHMMSS(str) {
        if (!str || str.length < 9) {
            return 0;
        }
        var sign = str.substring(0, 1) == "-" ? -1 : 1;
        var hh = str.substring(1, 3);
        var mm = str.substring(4, 6);
        var ss = str.substring(7);
        return sign * (hh * 3600 + mm * 60 + ss * 1);
    }

    $("input[type='button']").on("click", function() {
        clearStatus();
    });

    function showStatus(type, message) {
        var status = $("#status");
        status.removeClass().addClass("text-center alert alert-" + type);
        status.text(message);
    }

    function clearStatus() {
        var status = $("#status");
        status.removeClass();
        status.text("");
    }

    function showPage(page) {
        $("#login-form").addClass("hidden");
        $("#registration-form").addClass("hidden");
        $("#user-data").addClass("hidden");
        $(page).find("input[type='text'],input[type='password']").val("");
        $(page).removeClass("hidden");
    }

    function getErrorMessage(request) {
        try {
            return JSON.parse(request.responseText).message;
        } catch(e) {
            return request.responseText;
        }
    }

});