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