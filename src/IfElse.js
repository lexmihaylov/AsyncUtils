/**
 * Async conditions
 * @function
 * @param {Function} condition
 * @return {ForkPromiseProxy}
 */
var If = (function() {
    /**
     * Proxy class for handling promises
     * @class ForkPromiseProxy
     */
    var ForkPromiseProxy = (function() {
        var ForkPromiseProxy = function(promise) {
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
                
                if(returns instanceof ForkPromiseProxy) {
                    returns = returns.promise;
                }
                
                return returns;
            }.bind(this));
        };
        
        /**
         * When the promise resolves it should call this method
         * to handle the if else statements
         * @memberof ForkPromiseProxy
         * @param {String} type 'then' or 'else' types
         * 
         * @returns {?}
         */
        ForkPromiseProxy.prototype.resolve = function(type) {
            return this[type + 'Handle']();
        };
        
        /**
         * sets the handle function for a true conditions
         * @memberof ForkPromiseProxy
         * @param {Function} handle
         * 
         * @returns {ForkPromiseProxy}
         */ 
        ForkPromiseProxy.prototype.then = function(handle) {
            this.thenHandle = handle;
            
            return this;
        };
        
        /**
         * sets the handle function for a false condition
         * @memberof ForkPromiseProxy
         * @param {Function} handle
         * 
         * @returns {ForkPromiseProxy}
         */
        ForkPromiseProxy.prototype.else = function(handle) {
            this.elseHandle = handle;
            
            return new ForkPromiseProxy(this.next);
        };
        
        return ForkPromiseProxy;
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
