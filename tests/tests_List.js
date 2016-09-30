QUnit.test('Async List operations', function(assert) {
    var list = [
        'item1',
        'item2',
        'item3',
        'item4',
    ];
    
    (function() {
        var lastIndex = 0;
        var done = assert.async();
        AsyncUtils.List(list).each(function(item, index) {
            lastIndex = index; 
        }).then(function() {
            assert.ok(lastIndex == 3, 'each successfull');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        
        AsyncUtils.List(list).filter(function(item, index) {
            return index % 2 === 0
        }).then(function(newList) {
            assert.ok(JSON.stringify(['item1', 'item3']) === JSON.stringify(newList), 'filter successfull');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        AsyncUtils.List(list).map(function(item, index) {
            return {
                key: index,
                value: item
            };
        }).then(function(newList) {
            var expected = JSON.stringify([
                {
                    key: 0,
                    value: 'item1'
                },
                {
                    key: 1,
                    value: 'item2'
                },
                {
                    key: 2,
                    value: 'item3'
                },
                {
                    key: 3,
                    value: 'item4'
                },
            ]);
            
            assert.ok(expected === JSON.stringify(newList), 'map successfull');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        AsyncUtils.List(list).find(function(item, index) {
            return item === 'item3' 
        }).then(function() {
            assert.ok(true, 'find successfull');
            done();
        }).catch(function() {
            assert.ok(false, 'find NOT successfull');
            done();
        });
    }());
    
    (function() {
        var done = assert.async();
        AsyncUtils.List(list).find(function(item, index) {
            return item === 'item0' 
        }).then(function() {
            assert.ok(false, 'find successfull');
            done();
        }).catch(function() {
            assert.ok(true, 'find NOT successfull');
            done();
        });
    }());
});