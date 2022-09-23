var fs=require("fs"),nearley=require("../lib/nearley.min.js"),opts=require("commander"),StreamWrapper=require("../lib/stream.js"),version=require("../package.json").version;
opts.version(version,"-v, --version").arguments("<file.js>").option("-i, --input [string]","An input string to parse (if not provided then read from stdin)").option("-s, --start [symbol]","An optional start symbol (if not provided then use the parser start symbol)",!1).option("-o, --out [filename]","File to output to (defaults to stdout)",!1).option("-q, --quiet","Output parse results only (hide Earley table)",!1).parse(process.argv);var output=opts.out?fs.createWriteStream(opts.out):process.stdout;
if(!opts.args[0])throw Error("Please supply a grammer.js file path as a command-line argument");var filename=require("path").resolve(opts.args[0]),grammar=nearley.Grammar.fromCompiled(require(filename));opts.start&&(grammar.start=opts.start);
var parser=new nearley.Parser(grammar,{keepHistory:!0}),writeTable=function(a,b){a.write("Table length: "+b.table.length+"\n");a.write("Number of parses: "+b.results.length+"\n");a.write("Parse Charts");b.table.forEach(function(c,d){a.write("\nChart: "+d++ +"\n");c.states.forEach(function(e,f){a.write(f+": "+e.toString()+"\n")})});a.write("\n\nParse results: \n")},writeResults=function(a,b){a.write(require("util").inspect(b.results,{colors:!opts.quiet,depth:null}));a.write("\n")};
if("undefined"===typeof opts.input)process.stdin.pipe(new StreamWrapper(parser)).on("finish",function(){opts.quiet||writeTable(output,parser);writeResults(output,parser)});else parser.feed(opts.input),opts.quiet||writeTable(output,parser),writeResults(output,parser);