/**
 * Takes a function and returns an async version of it
 * @param {Function} fn
 * @returns {Function}
 */
var async = function(fn) {
    return function() {
        var _arguments = arguments;
        var _this = this;
        setTimeout(function() {
            fn.apply(_this, _arguments);
        });
    };
};