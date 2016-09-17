var fs = require('fs');

var LoopJS = fs.readFileSync('src/Loop.js').toString();
var ThreadJS = fs.readFileSync('src/Thread.js').toString();

var buildFile = fs.readFileSync('src/AsyncUtils.js').toString();

buildFile = buildFile.replace(
    '@{{CONTENT}}', 
    LoopJS + "\n\n" +
    ThreadJS + "\n\n" +
    "return {\n" +
    "    Loop: Loop,\n" +
    "    Thread: Thread\n" +
    "};\n"
);

fs.writeFileSync('AsyncUtils.js', buildFile);