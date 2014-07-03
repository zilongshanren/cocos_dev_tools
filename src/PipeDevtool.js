(function (global, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else if (typeof define === "function" && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    factory(global.pipeDevtool = {}); // <script>
  }
}(this, function (me) {
    me.tryTimes = 0;
    me.TRYS = 10;
    me.timeout = 10000;

    var chrome = chrome || {};

    me.checkMessage = function() {
        // console.log('check', me.tryTimes);
        me.tryTimes ++;
        var script = 'pipePage.flush()';
        me.inject(script, function(messages) {
            if (!messages || messages.length == 0) return;
            for(var i = 0;i < messages.length; i++) {
                me.onMessage(messages[i]);
            }
        });
    }
    me.init = function() {
        var intervalId = setInterval(function(){
            me.checkMessage();
            if (me.tryTimes >= me.TRYS) {
               // clearInterval(intervalId);
            }
        },500);
       var script = '//#PipePage.min.js#';
       me.inject(script);
    },

    me.send = function(message) {
        var messageSerial = JSON.stringify(message);
        var script = 'pipePage.onMessage(' + messageSerial + ')';
        me.inject(script);
    };

    me.onMessage = function(message) {
        console.log('receive :', message);
    };

    me.inject = function(script, callback) {
        script = script.replace('\'', '\\\'');
        chrome.devtools.inspectedWindow.eval(script, callback);
    };
}));