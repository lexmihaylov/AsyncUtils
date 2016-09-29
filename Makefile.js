var fs = require('fs');
var childProcess = require("child_process");

console.log('Creating a bundle ...');
var bindPolyfill = fs.readFileSync('src/bind-polyfill.js').toString();
var async = fs.readFileSync('src/async-function.js').toString();
var LoopJS = fs.readFileSync('src/Loop.js').toString();
var ThreadJS = fs.readFileSync('src/Thread.js').toString();
var threaded = fs.readFileSync('src/threaded-function.js').toString();
var List = fs.readFileSync('src/List.js').toString();
var IfElse = fs.readFileSync('src/IfElse.js').toString();

var buildFile = fs.readFileSync('src/AsyncUtils.template').toString();

buildFile = buildFile.replace(
    '@{{CONTENT}}', 
    bindPolyfill + "\n\n" +
    async + "\n\n" +
    LoopJS + "\n\n" +
    ThreadJS + "\n\n" +
    threaded + "\n\n" +
    List + "\n\n" +
    IfElse + "\n\n" +
    "return {\n" +
    "    Loop: Loop,\n" +
    "    Thread: Thread,\n" +
    "    List: List,\n" +
    "    if: If,\n" +
    "    async: async,\n" +
    "    threaded: threaded\n" +
    "};\n"
);

fs.writeFileSync('AsyncUtils.js', buildFile);
console.log("Done\n");

childProcess.exec('node_modules/.bin/uglifyjs AsyncUtils.js -o AsyncUtils.min.js', function(err, stdout) {
    console.log('Minifying ...');
    console.log(stdout);
    if(err) {
        throw err;
    }
    console.log("Done\n");
});



childProcess.exec('node_modules/.bin/jshint AsyncUtils.js', function(err, setdout) {
    console.log('Running jsHint ...')
    console.log(setdout);
    if(err) {
        throw err;
    }
    console.log("Done\n");
});


