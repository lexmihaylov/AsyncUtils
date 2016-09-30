var fs = require('fs');

task('default', [
    'clean',
    'bundle',
    'minify',
    'lint',
    'docs'
]);

task('clean', function() {
    jake.rmRf('API.md');
    jake.rmRf('AsyncUtils.js');
    jake.rmRf('AsyncUtils.min.js');
});

task('bundle', function() {
    process.stdout.write('Creating a bundle ... ');
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
    
    process.stdout.write("[Success]\n");
});

task('minify',{async: true}, function() {
    process.stdout.write('node_modules/.bin/uglifyjs AsyncUtils.js -o AsyncUtils.min.js ... ');
    jake.exec(['node_modules/.bin/uglifyjs AsyncUtils.js -o AsyncUtils.min.js'], {printStdout: true, printStderr: true}, function() {
        process.stdout.write("[Success]\n");
        
        complete();
    }); 
});

task('lint',{async: true}, function() {
    process.stdout.write('node_modules/.bin/jshint AsyncUtils.js ... ');
    jake.exec(['node_modules/.bin/jshint AsyncUtils.js'], {printStdout: true, printStderr: true}, function() {
        process.stdout.write("[Success]\n");
        complete();
    });
});

task('docs',{async: true}, function() {
    process.stdout.write('node_modules/.bin/jsdoc2md src/*.js > API.md ... ');
    jake.exec(['node_modules/.bin/jsdoc2md src/*.js > API.md'], {printStdout: true, printStderr: true}, function() {
        process.stdout.write("[Success]\n");
        complete();
    }); 
});

task('test', {async: true}, function() {
    jake.exec(['node_modules/.bin/node-qunit-phantomjs tests/tests.html --verbose'], {printStdout: true, printStderr: true}, function() {
        complete();
    });
});