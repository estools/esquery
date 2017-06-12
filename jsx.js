/* vim: set sw=4 sts=4 : */
(function () {

    var esquery = require("./esquery_init");
    var estraverse_jsx = require("estraverse-fb");


    if (typeof define === "function" && define.amd) {
        define(function(){return esquery(estraverse_jsx);});
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = esquery(estraverse_jsx);
    } else {
        this.esquery = esquery(estraverse_jsx);
    }

})();
