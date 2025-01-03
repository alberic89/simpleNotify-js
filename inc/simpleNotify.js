/* -----------------------------------------------------------------------------

simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Drew Warkentin 2016. MIT Licence.
Contribued by alberic89 2024.

To do:
-Add a close button to close notifications => done
-Add notification show time => done
-Add support for non auto-dismissing notifications => done
----------------------------------------------------------------------------- */

var simpleNotify = {
    // Some important variables
    NOTIFICATION_CLASS_NAME: "simple-notification",
    CONTAINER_CLASS_NAME: "simple-notification-container",
    CONTAINER_ID_NAME: "notificationContainer",
    NOTIFICATION_WIDTH: 300, //px
    NOTIFICATION_TIME: 7000, //ms
    AUTO_DISMISSING: true,
    LEVEL: 'good',

    notify: function () {
        // arguments
        this.options = arguments[0] || {};
        // custom dismissing
        simpleNotify.AUTO_DISMISSING = typeof this.options.autoDismissing == 'boolean' ? this.options.autoDismissing : true;
        // custom level
        simpleNotify.LEVEL = typeof this.options.level !== 'undefined' ? this.options.level : "good";
        // custom timeout
        simpleNotify.NOTIFICATION_TIME = (typeof this.options.notificationTime !== 'undefined' && typeof this.options.notificationTime == 'number') ? this.options.notificationTime : 7000;
        var newNotification = {
            "message": this.options.message,
            "level": simpleNotify.LEVEL
        };
        // If we don't have the notification container already on the page, create it
        if (document.getElementById("notificationContainer")) {
            // Show the notification
            simpleNotify.showNotification(newNotification);
        } else {
            // create the container
            simpleNotify.createContainer();
            // Show the notification
            simpleNotify.showNotification(newNotification);
        }
    },

    // This function creates the container for the notifications to be render in
    createContainer: function () {
        var divContainer = document.createElement("div");
        divContainer.className = simpleNotify.CONTAINER_CLASS_NAME;
        divContainer.id = simpleNotify.CONTAINER_ID_NAME;
        document.body.appendChild(divContainer);
    },

    showNotification: function (notification) {
        // Create the new notification element
        var newNotification = document.createElement("div");
        newNotification.className = simpleNotify.NOTIFICATION_CLASS_NAME + " " + notification.level;
        newNotification.innerText = notification.message;
        var closing = document.createElement("div");
        closing.className = "close-notification";
        closing.addEventListener("click", () => simpleNotify.close(newNotification));
        newNotification.appendChild(closing);
        newNotification.style.marginLeft = simpleNotify.NOTIFICATION_WIDTH + 10 + "px";
        // Create a wrapper for the notification element so that we can transition it nicely.
        var notificationWrapper = document.createElement("div");
        notificationWrapper.className = "simple-notification-wrapper";
        notificationWrapper.appendChild(newNotification);
        // Add it to the DOM
        var notificationContainer = document.getElementById(simpleNotify.CONTAINER_ID_NAME);
        notificationContainer.insertBefore(notificationWrapper, notificationContainer.firstChild);
        // if auto_dismissing equal true
        if (simpleNotify.AUTO_DISMISSING) {
            // Destroy the notification after the set time
            setTimeout(function () {
                simpleNotify.removeNotification(newNotification);
            }, simpleNotify.NOTIFICATION_TIME);
        }
    },

    close: function (notification) {
        simpleNotify.removeNotification(notification);
    },

    removeNotification: function (notificationToRemove) {
        notificationToRemove.className = notificationToRemove.className + " fade-out";
        // Remove the notification from the DOM after the fade out has finished
        notificationToRemove.addEventListener("transitionend", function () {
            document.getElementById(simpleNotify.CONTAINER_ID_NAME).removeChild(notificationToRemove.parentElement);
        }, {
            once: true
        }, false);
    }
}
