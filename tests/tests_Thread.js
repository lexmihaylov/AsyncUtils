QUnit.test('Creating, using and destroying threads', function(assert) {
    var thread = new AsyncUtils.Thread(function(a, b) {
        return a + b;
    });
    
    thread.start();
    
    assert.ok(thread.worker !== null , 'Worker is running');
    
    var done = assert.async();
    thread.exec([3, 2]).then(function(result) {
        assert.ok(result === 5, 'Returns correct result');
        thread.terminate();
        assert.ok(thread.worker === null, 'Worker terminated');
        
        done();
    });
    
    var threadFail = new AsyncUtils.Thread(function() {
        return undefVar;
    });
    threadFail.start();
    var doneFail = assert.async();
    
    threadFail.exec().then(function() {}).catch(function(err) {
        assert.ok(err !== null, 'Thread should fail with `' + err.message + '`');
        doneFail();
    });
});