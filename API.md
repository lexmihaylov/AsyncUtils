## Classes

<dl>
<dt><a href="#ForkPromiseProxy">ForkPromiseProxy</a></dt>
<dd></dd>
<dt><a href="#ListHandler">ListHandler</a></dt>
<dd></dd>
<dt><a href="#Loop">Loop</a></dt>
<dd></dd>
<dt><a href="#Thread">Thread</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#If">If(condition)</a> ⇒ <code><a href="#ForkPromiseProxy">ForkPromiseProxy</a></code></dt>
<dd><p>Async conditions</p>
</dd>
<dt><a href="#List">List(list)</a> ⇒ <code><a href="#ListHandler">ListHandler</a></code></dt>
<dd><p>takes a list and returns a List handler instance</p>
</dd>
<dt><a href="#async">async(fn)</a> ⇒ <code>function</code></dt>
<dd><p>Takes a function and returns an async version of it</p>
</dd>
<dt><a href="#threaded">threaded(fn)</a> ⇒ <code>Promise</code></dt>
<dd><p>takes a function, spawns a webworker and executes that function inside the webworker</p>
</dd>
</dl>

<a name="ForkPromiseProxy"></a>

## ForkPromiseProxy
**Kind**: global class  

* [ForkPromiseProxy](#ForkPromiseProxy)
    * [new ForkPromiseProxy()](#new_ForkPromiseProxy_new)
    * [.resolve(type)](#ForkPromiseProxy+resolve) ⇒ <code>?</code>
    * [.then(handle)](#ForkPromiseProxy+then) ⇒ <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>
    * [.else(handle)](#ForkPromiseProxy+else) ⇒ <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>

<a name="new_ForkPromiseProxy_new"></a>

### new ForkPromiseProxy()
Proxy class for handling promises

<a name="ForkPromiseProxy+resolve"></a>

### forkPromiseProxy.resolve(type) ⇒ <code>?</code>
When the promise resolves it should call this method
to handle the if else statements

**Kind**: instance method of <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | 'then' or 'else' types |

<a name="ForkPromiseProxy+then"></a>

### forkPromiseProxy.then(handle) ⇒ <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>
sets the handle function for a true conditions

**Kind**: instance method of <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>  

| Param | Type |
| --- | --- |
| handle | <code>function</code> | 

<a name="ForkPromiseProxy+else"></a>

### forkPromiseProxy.else(handle) ⇒ <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>
sets the handle function for a false condition

**Kind**: instance method of <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>  

| Param | Type |
| --- | --- |
| handle | <code>function</code> | 

<a name="ListHandler"></a>

## ListHandler
**Kind**: global class  

* [ListHandler](#ListHandler)
    * [new ListHandler(list)](#new_ListHandler_new)
    * [.filter(condition)](#ListHandler+filter) ⇒ <code>Promise</code>
    * [.each(handle)](#ListHandler+each) ⇒ <code>Promise</code>
    * [.map(handle)](#ListHandler+map) ⇒ <code>Promise</code>
    * [.find(condition)](#ListHandler+find) ⇒ <code>Promise</code>

<a name="new_ListHandler_new"></a>

### new ListHandler(list)
Async array usage


| Param | Type |
| --- | --- |
| list | <code>Array</code> | 

<a name="ListHandler+filter"></a>

### listHandler.filter(condition) ⇒ <code>Promise</code>
Filter an array and return a new array with the filtered values

**Kind**: instance method of <code>[ListHandler](#ListHandler)</code>  

| Param | Type |
| --- | --- |
| condition | <code>function</code> | 

<a name="ListHandler+each"></a>

### listHandler.each(handle) ⇒ <code>Promise</code>
Iterate thru a list

**Kind**: instance method of <code>[ListHandler](#ListHandler)</code>  

| Param | Type |
| --- | --- |
| handle | <code>function</code> | 

<a name="ListHandler+map"></a>

### listHandler.map(handle) ⇒ <code>Promise</code>
Itarate thru the list and create a new array with augmentet values

**Kind**: instance method of <code>[ListHandler](#ListHandler)</code>  

| Param | Type |
| --- | --- |
| handle | <code>function</code> | 

<a name="ListHandler+find"></a>

### listHandler.find(condition) ⇒ <code>Promise</code>
Find a specific elemnet inside a list

**Kind**: instance method of <code>[ListHandler](#ListHandler)</code>  

| Param | Type |
| --- | --- |
| condition | <code>function</code> | 

<a name="Loop"></a>

## Loop
**Kind**: global class  

* [Loop](#Loop)
    * [new Loop(handle, iterations)](#new_Loop_new)
    * _instance_
        * [.start()](#Loop+start)
        * [.done()](#Loop+done)
        * [.terminate(type, message)](#Loop+terminate)
        * [.cancel(message)](#Loop+cancel)
        * [.kill(message)](#Loop+kill)
    * _static_
        * [.until(handle, iterations)](#Loop.until) ⇒ <code>Promise</code>
        * [.unique(id)](#Loop.unique) ⇒ <code>Object</code>

<a name="new_Loop_new"></a>

### new Loop(handle, iterations)
Async loop class that takes a handle as a parameter and a maximum number of iterations


| Param | Type |
| --- | --- |
| handle | <code>function</code> | 
| iterations | <code>Number</code> | 

<a name="Loop+start"></a>

### loop.start()
Starts the loop

**Kind**: instance method of <code>[Loop](#Loop)</code>  
<a name="Loop+done"></a>

### loop.done()
stops the loop normally

**Kind**: instance method of <code>[Loop](#Loop)</code>  
<a name="Loop+terminate"></a>

### loop.terminate(type, message)
Interupt the loop with a type and message.
This will call the reject callback on the promise.

**Kind**: instance method of <code>[Loop](#Loop)</code>  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 
| message | <code>String</code> | 

<a name="Loop+cancel"></a>

### loop.cancel(message)
Cancel the loop and provide a reason message

**Kind**: instance method of <code>[Loop](#Loop)</code>  

| Param | Type |
| --- | --- |
| message | <code>String</code> | 

<a name="Loop+kill"></a>

### loop.kill(message)
Kill the loop and provide a reason message

**Kind**: instance method of <code>[Loop](#Loop)</code>  

| Param | Type |
| --- | --- |
| message | <code>String</code> | 

<a name="Loop.until"></a>

### Loop.until(handle, iterations) ⇒ <code>Promise</code>
Loop until the handle function returns true

**Kind**: static method of <code>[Loop](#Loop)</code>  

| Param | Type |
| --- | --- |
| handle | <code>function</code> | 
| iterations | <code>Number</code> | 

<a name="Loop.unique"></a>

### Loop.unique(id) ⇒ <code>Object</code>
Creates a unique loop task that will terminate when another task with 
the same id starts

**Kind**: static method of <code>[Loop](#Loop)</code>  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="Thread"></a>

## Thread
**Kind**: global class  

* [Thread](#Thread)
    * [new Thread(handle)](#new_Thread_new)
    * [.exec(params)](#Thread+exec) ⇒ <code>Promise</code>
    * [.start()](#Thread+start)
    * [.terminate()](#Thread+terminate)

<a name="new_Thread_new"></a>

### new Thread(handle)
Helper class that will run a function in a separate thread by using webworkers


| Param | Type |
| --- | --- |
| handle | <code>function</code> | 

<a name="Thread+exec"></a>

### thread.exec(params) ⇒ <code>Promise</code>
Execute the function

**Kind**: instance method of <code>[Thread](#Thread)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array</code> | function arguments |

<a name="Thread+start"></a>

### thread.start()
Start the thread. Creates a new webworker

**Kind**: instance method of <code>[Thread](#Thread)</code>  
<a name="Thread+terminate"></a>

### thread.terminate()
terminates the thread and worker

**Kind**: instance method of <code>[Thread](#Thread)</code>  
<a name="If"></a>

## If(condition) ⇒ <code>[ForkPromiseProxy](#ForkPromiseProxy)</code>
Async conditions

**Kind**: global function  

| Param | Type |
| --- | --- |
| condition | <code>function</code> | 

<a name="List"></a>

## List(list) ⇒ <code>[ListHandler](#ListHandler)</code>
takes a list and returns a List handler instance

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>Array</code> | 

<a name="async"></a>

## async(fn) ⇒ <code>function</code>
Takes a function and returns an async version of it

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="threaded"></a>

## threaded(fn) ⇒ <code>Promise</code>
takes a function, spawns a webworker and executes that function inside the webworker

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

