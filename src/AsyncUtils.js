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
@{{CONTENT}}
});
