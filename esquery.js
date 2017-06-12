/* vim: set sw=4 sts=4 : */
(function () {

    var esquery = require("./esquery_init");
    var estraverse = require("estraverse");


    if (typeof define === "function" && define.amd) {
        define(esquery(estraverse));
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = esquery(estraverse);
    } else {
        this.esquery = esquery(estraverse);
    }

})();
