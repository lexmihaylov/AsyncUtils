# AsyncLoop
An asynchronous loop structure utilizing the JavaScript's eventloop

# Install

Install it form bower:

```bash
bower install async-loop
```

Install from npm:

```bash
npm install async-loop
```

# Examples

## Using the static methods

#### Simple Loop
```javascript
// loop until the index becomes 10 and then output it
var index = 0;

LoopAsync.until(function() {
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
LoopAsync.unique('inc').until(function() {
    index ++;
    return index === 10;
}).then(function() {
    console.log(index)
}).catch(function(e) {
    console.error(e);
});


// this will cancel the previous job and create a new one
LoopAsync.unique('inc').until(function() {
   index ++;
});
```

#### Using instance method inside the loop

```javascript
var condition = false;
LoopAsync.until(function(){
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
Loop.until(function() {
   // do something 
});
```

# API Reference

## LoopAsync Class

#### Constructor
* Parameters
    * `Function handle` - a function that will be executed on every iteration
    * `Number iterations` (optional) - maximum number of iterations after which the loop will be canceled
* Example
    ```javascript
        var loop = new LoopAsync(function() {
            // do something
        }, 10)
    ```
#### Public properties
* `Number? maxIterations` - number of iterations before the loop is auto canceled
* `Function handle` - the handle that will be executed on every iteration
* `Object deferred` - resolve/rejects the promise
* `Number job` - async job identification used for terminating the loop
* `Promise promise` - the jobs promise object

#### Public methods
* `Promise start()` - starts loop execution
* `done()` - resolve and stops the loop
* `terminate(type, message)` - terminates the loop with a specific type and message
    * `String type`
    * `String message`
* `cancel(message)` - cancel type termination that stops the loop and rejects the promise
    * `String message` - a reason why the loop was canceled
* `kill(message)` - kill type termination that stops the loop and rejects the promise
    * `String message` - a reason why the loop was killed

#### Static methods
* `Promise until(handle, iterations)` - creates a loop instance and starts it. Returns a promise.
    * `Function handle` - function that will be executed on every iteration.
    * `Number iterations` (optinal) - maximum number of iterations before the loop is canceled.
* `Object unique(jobId)` - creates a unique loop that will be terminated if another loop with the same jobId has been started.
    * `String jobId` - a unique jobId
* `Promise unique(jobId).until(handle, iterations)` - same as `until(handle, iterations)`

# Contribution

Issue Reports, Feature Requests, and Pull Requests are wellcome.