(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD module definition (require.js)
        define(factory);
    } else {
        // if everything else fails set it as a global variable
        root.AsyncUtils = factory();
    }
})(this, function() {
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP ?
                 this :
                 oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

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
            if(this.handle.call(this)){
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
            
            if(msg.type === 'exec') {
                try {
                    var result = (THREAD_HANDLE).apply(self, msg.data);
                    self.postMessage({
                        type: 'result',
                        data: result
                    });
                } catch(ex) {
                    self.postMessage({
                        type: 'error',
                        data: ex
                    });
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
        params = params || [];
        
        this.promise = new Promise(function(resolve, reject) {
            this.deferred = {
                resolve: resolve,
                reject: reject
            };
        }.bind(this));
        
        this.worker.postMessage({
            type: 'exec',
            data: params
        });
        
        this.worker.onmessage = function(e) {
            var msg = e.data;
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
    };
    
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

/* requires Loop */
/* global Loop */
var List = (function() {
    var List = (function() {
        /**
         * Async array usage
         * @param {Array} list
         * @constructor
         * @private
         */
        var self = function(list) {
            this.list = list;
        };
        
        /**
         * Filter an array and return a new array with the filtered values
         * @param {Function} condition
         * 
         * @returns {Promise}
         */
        self.prototype.filter = function(condition) {
            var promise = new Promise(function(resolve, reject) {
                var newIndex = 0;
                var newList = [];
                this.each(function(item, index) {
                    if(condition(item, index)) {
                        newList[newIndex] = item;
                        newIndex++;
                    }
                }).then(function() {
                    resolve(newList);
                });
            }.bind(this));
            
            return promise;
        };
        
        /**
         * Iterate thru a list
         * 
         * @param {Function} handle
         * @return {Promise}
         */
        self.prototype.each = function(handle) {
            var index = 0;
            var _this = this;
            return Loop.until(function() {
                handle.call(this, _this.list[index], index);
                
                index ++;
                
                return index > _this.list.length - 1;
            });
        };
        
        /**
         * Itarate thru the list and create a new array with augmentet values
         * @param {Function} handle
         * 
         * @returns {Promise}
         */
        self.prototype.map = function(handle) {
            var promise = new Promise(function(resolve, reject) {
                var newIndex = 0;
                var newList = [];
                this.each(function(item, index) {
                    newList[newIndex] = handle(item, index);
                    newIndex++;
                }).then(function() {
                    resolve(newList);
                });
            }.bind(this));
            
            return promise;
        };
        
        /**
         * Find a specific elemnet inside a list
         * 
         * @param {Function} condition
         * 
         * @returns {Promise}
         */
        self.prototype.find = function(condition) {
            var resolved = false;
            var promise = new Promise(function(resolve, reject) {
                this.each(function(item, index) {
                    if(condition(item, index)) {
                        resolved = true;
                        resolve({item: item, index: index});
                        this.done();
                    }
                }).then(function() {
                    if(!resolved) {
                        reject(null);
                    }
                });
            }.bind(this));
            
            return promise;
        };
        
        return self;
    }());
    
    /**
     * Returns a new instance every time
     * @param {Array} list
     * @returns {List}
     */
    return function(list) {
        return new List(list);
    };
}());

var If = (function() {
    var ForkPromiseProxy = (function() {
        /**
         * Proxy class for handling promises
         * @constructor
         * @private
         */
        var self = function(promise) {
            this.promise = promise;
            
            this.thenHandle = function() {};
            this.elseHandle = function() {};
            
            this.next = this.promise.then(function(result) {
                var returns = null;
                if(result === true) {
                    returns = this.resolve('then');
                } else if(result === false) {
                    returns = this.resolve('else');
                }
                
                if(returns instanceof self) {
                    returns = returns.promise;
                }
                
                return returns;
            }.bind(this));
        };
        
        /**
         * When the promise resolves it should call this method
         * to handle the if else statements
         * 
         * @param {String} type 'then' or 'else' types
         * 
         * @returns {?}
         */
        self.prototype.resolve = function(type) {
            return this[type + 'Handle']();
        };
        
        /**
         * sets the handle function for a true conditions
         * @param {Function} handle
         * 
         * @returns {ForkPromiseProxy}
         */ 
        self.prototype.then = function(handle) {
            this.thenHandle = handle;
            
            return this;
        };
        
        /**
         * sets the handle function for a false condition
         * @param {Function} handle
         * 
         * @returns {ForkPromiseProxy}
         */
        self.prototype.else = function(handle) {
            this.elseHandle = handle;
            
            return new self(this.next);
        };
        
        return self;
    }());
    
    /**
     * creates an async IF statement
     * @param {Function} function that returns a boolean
     * 
     * @returns {ForkPromiseProxy}
     */
    var If = function(condition) {
        var promise = new ForkPromiseProxy(new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(condition());
            });
        }));
        
        return promise;
    };
    
    return If;
}());


return {
    Loop: Loop,
    Thread: Thread,
    List: List,
    if: If,
    async: async,
    threaded: threaded
};

});
