QUnit.test('Createing, using and destroying a loop', function(assert) {
    (function() {
        var index = 0;
        var done = assert.async();
        var loop = new AsyncUtils.Loop(function() {
            index ++;
            return index === 10;
        });
        
        loop.start().then(function() {
            assert.ok(index === 10, 'Make 10 iterations and finish');
            done();
        });    
    }());
    
    
    (function() {
        var done = assert.async();
        var index = 0;
        var loop = new AsyncUtils.Loop(function() {
            index++;
        }, 20);
        
        
        loop.start().catch(function() {
            assert.ok(index === 20, 'Reached maximum number of iterations');
            done();
        });
    }());
    
    (function() {
        var list = [
            'item1',
            'item2',
            'item3',
        ];
        
        var index = 0;
        var loop = new AsyncUtils.Loop(function() {
            var item = list[index];
            
            if(item == 'item2') {
                this.done();
            } else {
                index++;
            }
        });
        
        var done = assert.async();
        loop.start().then(function() {
            var item = list[index];
            assert.ok(item === 'item2', 'Successfully break out of the loop');
            done();
        });
    }());
    
    (function(){
        
        var loop = new AsyncUtils.Loop(function() {
           this.terminate();
        });
        
        var done = assert.async();
        loop.start().catch(function(msg) {
           assert.ok(msg === '[Terminate] Unknown reason', 'Loop terminated with error');
           done();
        });
    }())
    
});