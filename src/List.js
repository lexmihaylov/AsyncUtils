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
        }
        
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