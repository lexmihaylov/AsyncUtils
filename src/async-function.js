/**
 * Takes a function and returns an async version of it
 * @param {Function} fn
 * @returns {Function}
 */
var async = function(fn) {
    return function() {
        var _arguments = arguments;
        var _this = this;
        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    resolve(fn.apply(_this, _arguments));
                } catch(ex) {
                    reject(ex);
                }
            });
        });
        
        return promise;
    };
};