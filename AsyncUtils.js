(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD module definition (require.js)
        define(factory);
    } else if(typeof module === 'object' && module.exports) {
        // Node module definition
        module.exports = factory();
    } else {
        // if everything else fails set it as a global variable
        root.AsyncUtils = factory();
    }
})(this, function() {
var Loop = (function() {
    /**
     * Async loop class that takes a handle as a parameter and a maximum number of iterations
     * @constructor
     * @param {Function} handle
     * @param {Number} iterations
     */
    var Loop = function(handle, iterations) {
        this.maxIterations = iterations || null;
        this.handle = handle;
        this.deferred = {};
        this.job = null;
        this.promise = new Promise(function(resolve, reject) {
            this.deferred.resolve = resolve;
            this.deferred.reject = reject;
        }.bind(this));
    };

    /**
     * Starts the loop
     */
    Loop.prototype.start = function() {
        var iteration = 1;

        this.job = setTimeout(function wait() {
            if(this.handle()){
                this.done();

                return;
            }

            if(!!this.maxIterations && iteration === this.maxIterations) {
                this.kill('maximum iterations reached.');

                return;
            }

            iteration ++;

            this.job = setTimeout(wait.bind(this));
        }.bind(this));
        
        return this.promise;
    };
    
    Loop.prototype.done = function() {
        if(this.job) {
            clearTimeout(this.job);
            this.job = null;
        }
        
        this.deferred.resolve();
    };

    /**
     * Interupt the loop with a type and message.
     * This will call the reject callback on the promise.
     * @param  {String} type
     * @param  {String} message
     */
    Loop.prototype.terminate = function(type, message) {
        if(this.job) {
            clearTimeout(this.job);
            this.job = null;
        }

        type = type || 'Terminate';
        message = message || 'Unknown reason';
        this.deferred.reject('[' + type + '] ' + message);
    };

    /**
     * Cancel the loop and provide a reason message
     * @param  {String} message
     */
    Loop.prototype.cancel = function(message) {
        this.terminate('Cancel', message);
    };

    /**
     * Kill the loop and provide a reason message
     * @param  {String} message
     */
    Loop.prototype.kill = function(message) {
        this.terminate('Kill', message);
    };

    /**
     * Loop until the handle function returns true 
     * @static
     * @param  {Function} handle
     * @param  {Number} iterations
     * @return {Promise}
     */
    Loop.until = function(handle, iterations) {
        var instance = new this(handle, iterations);
        instance.start();

        return instance.promise;
    };

    (function() {
        var loopMap = {};
        
        /**
         * Creates a unique loop task that will terminate when another task with 
         * the same id starts
         * @static
         * @param {String} id
         * @return {Object}
         */
        Loop.unique = function(id) {
            var self = this;
            return {
                until: function(handle, iterations) {
                    if(id in loopMap) {
                        loopMap[id].cancel('Overriting unique task `'+id+'` with a newer one.');
                    }

                    var instance = new self(handle, iterations);
                    instance.start();
                    loopMap[id] = instance;
                    
                    return instance.promise;
                }
            };
        };
    }());
    
    return Loop;
}());

var Thread = (function() {
    
    /**
     * a template function used to construct the webworker's content
     */
    var Template = function() {
        self.onmessage = function(e) {
            var msg = e.data;
            var params = [];
            
            if(msg.type === 'exec') {
                try {
                    var result = (THREAD_HANDLE).apply(self, msg.data);
                    self.postMessage({
                        type: 'result',
                        data: result
                    });
                } catch(e) {
                    self.postMessage({
                        type: 'error',
                        data: e
                    })
                }
                
            }
        };
        
    };
    
    /**
     * Helper class that will run a function in a separate thread by using webworkers
     * @constructor
     * @param {Function} handle
     */
    var Thread = function(handle) {
        this.handle = "(" + Template.toString().replace('THREAD_HANDLE', handle.toString()) + ")();";
        this.url = null;
        this.worker = null;
        this.promise = null;
        this.deferred = null;
    };
    
    /**
     * Execute the function
     * @param {Array} params function arguments
     * @returns {Promise}
     */
    Thread.prototype.exec = function(params) {
        var params = params || [];
        
        this.promise = new Promise(function(resolve, reject) {
            this.deferred = {
                resolve: resolve,
                reject: reject
            };
        }.bind(this));
        
        this.worker.postMessage({
            type: 'exec',
            data: this.params
        });
        
        this.worker.onmessage = function(e) {
            var msg = e.data
            switch (msg.type) {
                case 'result':
                    this.deferred.resolve(msg.data);
                    break;
                
                case 'error':
                    this.deferred.reject(msg.data);
                    break;
            }
                
        }.bind(this);
        
        return this.promise;
    }
    
    /**
     * Start the thread. Creates a new webworker
     */
    Thread.prototype.start = function() {
        if(this.worker !== null) {
            this.terminate();    
        }
        
        this.url = window.URL.createObjectURL(new Blob([this.handle.toString()]));
        this.worker = new Worker(this.url);
        
        return this;
    };
    
    /**
     * terminates the thread and worker
     */
    Thread.prototype.terminate = function() {
        this.worker.terminate();
        window.URL.revokeObjectURL(this.url);
        
        this.worker = null;
        this.url = null;
        this.deferred.reject('Terminated');
        return this;
    };
    
    return Thread;
}());

return {
    Loop: Loop,
    Thread: Thread
};

});
