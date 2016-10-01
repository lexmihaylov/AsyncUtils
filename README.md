# AsyncUtils
![alt travis ci](https://travis-ci.org/lexmihaylov/AsyncUtils.svg?branch=master)
[![Code Climate](https://codeclimate.com/github/lexmihaylov/AsyncUtils/badges/gpa.svg)](https://codeclimate.com/github/lexmihaylov/AsyncUtils)
[![HitCount](https://hitt.herokuapp.com/lexmihaylov/AsyncUtils.svg)](https://github.com/lexmihaylov/AsyncUtils)

This library relies heavily on promises so for older browsers that do not support native promises use a polyfill.
Suggestion: https://github.com/taylorhakes/promise-polyfill
# Build

```bash
npm install
jake
jake test
```

# Install

Install it form bower:

```bash
bower install lexm-async-utils
```

# Examples

## Using the static methods

#### Simple Loop
```javascript
// loop until the index becomes 10 and then output it
var index = 0;

AsyncUtils.Loop.until(function() {
    index++;
    
    return index == 10;
}).then(function() {
    console.log(index);
});

```

#### Unique loop

```javascript
// async incrementing index
var index = 0;
AsyncUtils.Loop.unique('inc').until(function() {
    index ++;
    return index === 10;
}).then(function() {
    console.log(index)
}).catch(function(e) {
    console.error(e);
});


// this will cancel the previous job and create a new one
AsyncUtils.Loop.unique('inc').until(function() {
   index ++;
});
```

#### Using instance method inside the loop

```javascript
var condition = false;
AsyncUtils.Loop.until(function(){
    if(condition === true) {
        this.done();
        return;
    }
    
    try {
        // Do something with that condition variable
    } catch(e) {
        this.terminate('Error', e.message);
    }
}).then(function() {
    // do something when the loop completes
}).catch(function() {
    // do something when the loop fails
});
```
#### Infinite loop
```javascript
AsyncUtils.Loop.until(function() {
   // do something 
});
```

#### Create a thread
```javascript
var thread = new AsyncUtils.Thread(function(arg1, arg2) {
    // do something in thread
    console.log(arguments);
    
    return '>Result from execution>'
});

thread.start();
thread.exec(['arg1', 'arg2']).then(function(result) {
    console.log(result);
}).catch(function(e) {
    // this will be executed if the thread has an error or was terminated before completing
    console.warn(e);
});
```

#### If - ElseIf - Else

```javascript
// if -> elseif -> ... -> elseif -> else
AsyncUtils.if(function() {
    return myVar == 'var';
}).then(function() {
    console.log('equals "var"');
}).else(function() {
    console.log('is NOT equal to "var".');
    console.log('check if it equals "var1"');
    
    return AsyncUtils.if(function() {
       return myVar == 'var1'; 
    });
}).then(function() {
    console.log('equals "var1"');
}).else(function() {
    console.log('is NOT equal to "var1"');
    
    console.log('check if it equals "var2"');
    
    return AsyncUtils.if(function() {
       return myVar == 'var2'; 
    });
}).then(function() {
    console.log('equals "var2"');
}).else(function() {
    console.log('is NOT equal to "var2".');
    console.log('equals something else');
});

```

#### Handling lists asynchronously 

```javascript

var List = [
    'item1',
    'item2',
    'item3',
    'test1',
    'test2',
    'test3'
];


AsyncUtils.List(List).each(function(item, index) {
    console.log(index + ': ' + item);
}).then(function() {
    console.log('===> List.each');
    console.log('loop ended');
});


AsyncUtils.List(List).filter(function(item) {
    return /^test/.test(item);
}).then(function(newList) {
    console.log('===> List.filter');
    console.log(newList);
});


AsyncUtils.List(List).map(function(item, index) {
    return {
        key: index,
        value: item
    };
}).then(function(newList) {
    console.log('===> List.map');
    console.log(newList);
});

AsyncUtils.List(List).find(function(item, index) {
    return item === 'test3';
}).then(function(match) {
    console.log('===> List.find');
    console.log(match);
});

AsyncUtils.List(List).find(function(item, index) {
    return item === 'test5';
}).then(function(match) {
    console.log('===> List.find');
    console.log(match);
}).catch(function() {
    console.log('===> List.find - not found');
});

```

#### Async Functions
```javascript
var printSomething = AsyncUtils.async(function(something) {
    console.log(something);
    
    return 'executed';
});

printSomething('Hello, World').then(function(val) {
    console.log(val);
});

console.log('this will be executed before `printSomething`');
```

#### Threaded Functions
```javascript
var printSomething = AsyncUtils.threaded(function(something) {
    var i = 0;
    while(i <= 10000000000) {i++;} // this will not block the ui because it run inside a worker
    console.log(something);
    
    return 'executed in a thread';
});

printSomething('Hello, World').then(function(val) {
    console.log(val);
});

console.log('this will be executed before `printSomething`');
```

# API Reference

[API Docs](API.md)

# Contribution

Issue Reports, Feature Requests, and Pull Requests are wellcome.