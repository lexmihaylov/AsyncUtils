(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD module definition (require.js)
        define(factory);
    } else if(typeof module === 'object' && module.exports) {
        // Node module definition
        module.exports = factory();
    } else {
        // if everything else fails set it as a global variable
        root.LoopAsync = factory();
    }
})(this, function() {
    var LoopAsync = (function() {
        /**
         * Async loop class that takes a handle as a parameter and a maximum number of iterations
         * @constructor
         * @param {Function} handle
         * @param {Number} iterations
         */
        var LoopAsync = function(handle, iterations) {
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
        LoopAsync.prototype.start = function() {
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
        
        LoopAsync.prototime.done = function() {
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
        LoopAsync.prototype.terminate = function(type, message) {
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
        LoopAsync.prototype.cancel = function(message) {
            this.terminate('Cancel', message);
        };

        /**
         * Kill the loop and provide a reason message
         * @param  {String} message
         */
        LoopAsync.prototype.kill = function(message) {
            this.terminate('Kill', message);
        };

        /**
         * Loop until the handle function returns true 
         * @static
         * @param  {Function} handle
         * @param  {Number} iterations
         * @return {Promise}
         */
        LoopAsync.until = function(handle, iterations) {
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
            LoopAsync.unique = function(id) {
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
        return LoopAsync;
    }());
    
    return LoopAsync;
});
