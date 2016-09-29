/**
 * takes a function, spawns a webworker and executes that function inside the webworker
 */
var threaded = function(fn) {
    return function() {
        var thread = new Thread(fn);
        var _arguments = Array.prototype.slice.call(arguments);
        
        thread.start();
        var promise = new Promise(function(resolve, reject) {
            thread.exec(_arguments).
                then(function(result) {
                    resolve(result);
                    thread.terminate();
                }).
                catch(function(ex) {
                    reject(ex);
                    thread.terminate();
                });
        });
        
        
        return promise;
    };
};