var fs = require('fs');

var LoopJS = fs.readFileSync('src/Loop.js').toString();
var ThreadJS = fs.readFileSync('src/Thread.js').toString();
var List = fs.readFileSync('src/List.js').toString();
var IfElse = fs.readFileSync('src/IfElse.js').toString();

var buildFile = fs.readFileSync('src/AsyncUtils.template').toString();

buildFile = buildFile.replace(
    '@{{CONTENT}}', 
    LoopJS + "\n\n" +
    ThreadJS + "\n\n" +
    List + "\n\n" +
    IfElse + "\n\n" +
    "return {\n" +
    "    Loop: Loop,\n" +
    "    Thread: Thread,\n" +
    "    List: List,\n" +
    "    if: If\n" +
    "};\n"
);

fs.writeFileSync('AsyncUtils.js', buildFile);