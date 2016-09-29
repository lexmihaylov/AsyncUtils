
/**
 * takes a list and returns a List handler instance
 * @param {Array} list
 * @function
 * @returns {ListHandler}
 */
var List = (function() {
    /**
     * Async array usage
     * @class ListHandler
     * @param {Array} list
     */
    var ListHandler = (function() {
        
        var ListHandler = function(list) {
            this.list = list;
        };
        
        /**
         * Filter an array and return a new array with the filtered values
         * @memberof ListHandler
         * @param {Function} condition
         * 
         * @returns {Promise}
         */
        ListHandler.prototype.filter = function(condition) {
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
         * @memberof ListHandler
         * @param {Function} handle
         * @return {Promise}
         */
        ListHandler.prototype.each = function(handle) {
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
         * @memberof ListHandler
         * @param {Function} handle
         * 
         * @returns {Promise}
         */
        ListHandler.prototype.map = function(handle) {
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
         * @memberof ListHandler
         * @param {Function} condition
         * 
         * @returns {Promise}
         */
        ListHandler.prototype.find = function(condition) {
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
        
        return ListHandler;
    }());
    
    /**
     * Returns a new instance every time
     * @param {Array} list
     * @returns {List}
     */
    return function(list) {
        return new ListHandler(list);
    };
}());