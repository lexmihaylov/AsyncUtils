QUnit.test('Async if-else', function(assert) {
    var value = "test3";
    
    (function() {
        var done = assert.async();
        AsyncUtils.if(function() {
            return value === 'test3';
        }).then(function() {
            assert.ok(true, 'If condition is true');
            done();
        }).else(function() {
            assert.ok(false, 'Else condition not true');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        AsyncUtils.if(function() {
            return value === 'test';
        }).then(function() {
            assert.ok(false, 'If condition is true');
            done();
        }).else(function() {
            assert.ok(true, 'Else condition not true');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        AsyncUtils.if(function() {
            return value === 'test';
        }).then(function() {
            assert.ok(false, 'Statement true');
            done();
        }).else(function() {
            return AsyncUtils.if(function() {
                return value === 'test3'
            });
        }).then(function() {
            assert.ok(true, 'Else-if condition is true');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        AsyncUtils.if(function() {
            return value === 'test';
        }).then(function() {
            assert.ok(false, 'Statement true');
            done();
        }).else(function() {
            return AsyncUtils.if(function() {
                return value === 'test1'
            });
        }).then(function() {
            assert.ok(false, 'Else-if condition is true');
            done();
        }).else(function() {
            assert.ok(true, 'Else-if condition is not true');
            done();
        });
    }());
});