(function(){function e(a){return a[0]}function f(a){return a[0].value}function k(a){a=a.literal;for(var g=[],c=0;c<a.length;c++){var d=a.charAt(c);d.toUpperCase()!==d||d.toLowerCase()!==d?g.push(new RegExp("["+d.toLowerCase()+d.toUpperCase()+"]")):g.push({literal:d})}return{subexpression:[{tokens:g,postprocess:function(l){return l.join("")}}]}}var b=require("moo"),h=Object.assign({ws:{match:/\s+/,lineBreaks:!0,next:"main"},comment:/#.*/,arrow:{match:/[=-]+>/,next:"main"},js:{match:/\{%(?:[^%]|%[^}])*%\}/,
value:a=>a.slice(2,-2),lineBreaks:!0},word:{match:/[\w\?\+]+/,next:"afterWord"},string:{match:/"(?:[^\\"\n]|\\["\\/bfnrt]|\\u[a-fA-F0-9]{4})*"/,value:a=>JSON.parse(a),next:"main"},btstring:{match:/`[^`]*`/,value:a=>a.slice(1,-1),next:"main",lineBreaks:!0}},function(a){var g={},c;for(c of a)g[c]={match:c,next:"main"};return g}(", | $ % ( ) :? :* :+ @include @builtin @ ]".split(" ")));b=b.states({main:Object.assign({},h,{charclass:{match:/\.|\[(?:\\.|[^\\\n])+?\]/,value:a=>new RegExp(a)}}),afterWord:Object.assign({},
h,{"[":{match:"[",next:"main"}})});b={Lexer:b,ParserRules:[{name:"final$ebnf$1",symbols:[b.has("ws")?{type:"ws"}:ws],postprocess:e},{name:"final$ebnf$1",symbols:[],postprocess:function(a){return null}},{name:"final",symbols:["_","prog","_","final$ebnf$1"],postprocess:function(a){return a[1]}},{name:"prog",symbols:["prod"],postprocess:function(a){return[a[0]]}},{name:"prog",symbols:["prod","ws","prog"],postprocess:function(a){return[a[0]].concat(a[2])}},{name:"prod",symbols:["word","_",b.has("arrow")?
{type:"arrow"}:arrow,"_","expression+"],postprocess:function(a){return{name:a[0],rules:a[4]}}},{name:"prod",symbols:["word",{literal:"["},"_","wordlist","_",{literal:"]"},"_",b.has("arrow")?{type:"arrow"}:arrow,"_","expression+"],postprocess:function(a){return{macro:a[0],args:a[3],exprs:a[9]}}},{name:"prod",symbols:[{literal:"@"},"_","js"],postprocess:function(a){return{body:a[2]}}},{name:"prod",symbols:[{literal:"@"},"word","ws","word"],postprocess:function(a){return{config:a[1],value:a[3]}}},{name:"prod",
symbols:[{literal:"@include"},"_","string"],postprocess:function(a){return{include:a[2].literal,builtin:!1}}},{name:"prod",symbols:[{literal:"@builtin"},"_","string"],postprocess:function(a){return{include:a[2].literal,builtin:!0}}},{name:"expression+",symbols:["completeexpression"]},{name:"expression+",symbols:["expression+","_",{literal:"|"},"_","completeexpression"],postprocess:function(a){return a[0].concat([a[4]])}},{name:"expressionlist",symbols:["completeexpression"]},{name:"expressionlist",
symbols:["expressionlist","_",{literal:","},"_","completeexpression"],postprocess:function(a){return a[0].concat([a[4]])}},{name:"wordlist",symbols:["word"]},{name:"wordlist",symbols:["wordlist","_",{literal:","},"_","word"],postprocess:function(a){return a[0].concat([a[4]])}},{name:"completeexpression",symbols:["expr"],postprocess:function(a){return{tokens:a[0]}}},{name:"completeexpression",symbols:["expr","_","js"],postprocess:function(a){return{tokens:a[0],postprocess:a[2]}}},{name:"expr_member",
symbols:["word"],postprocess:e},{name:"expr_member",symbols:[{literal:"$"},"word"],postprocess:function(a){return{mixin:a[1]}}},{name:"expr_member",symbols:["word",{literal:"["},"_","expressionlist","_",{literal:"]"}],postprocess:function(a){return{macrocall:a[0],args:a[3]}}},{name:"expr_member$ebnf$1",symbols:[{literal:"i"}],postprocess:e},{name:"expr_member$ebnf$1",symbols:[],postprocess:function(a){return null}},{name:"expr_member",symbols:["string","expr_member$ebnf$1"],postprocess:function(a){return a[1]?
k(a[0]):a[0]}},{name:"expr_member",symbols:[{literal:"%"},"word"],postprocess:function(a){return{token:a[1]}}},{name:"expr_member",symbols:["charclass"],postprocess:e},{name:"expr_member",symbols:[{literal:"("},"_","expression+","_",{literal:")"}],postprocess:function(a){return{subexpression:a[2]}}},{name:"expr_member",symbols:["expr_member","_","ebnf_modifier"],postprocess:function(a){return{ebnf:a[0],modifier:a[2]}}},{name:"ebnf_modifier",symbols:[{literal:":+"}],postprocess:f},{name:"ebnf_modifier",
symbols:[{literal:":*"}],postprocess:f},{name:"ebnf_modifier",symbols:[{literal:":?"}],postprocess:f},{name:"expr",symbols:["expr_member"]},{name:"expr",symbols:["expr","ws","expr_member"],postprocess:function(a){return a[0].concat([a[2]])}},{name:"word",symbols:[b.has("word")?{type:"word"}:word],postprocess:f},{name:"string",symbols:[b.has("string")?{type:"string"}:string],postprocess:a=>({literal:a[0].value})},{name:"string",symbols:[b.has("btstring")?{type:"btstring"}:btstring],postprocess:a=>
({literal:a[0].value})},{name:"charclass",symbols:[b.has("charclass")?{type:"charclass"}:charclass],postprocess:f},{name:"js",symbols:[b.has("js")?{type:"js"}:js],postprocess:f},{name:"_$ebnf$1",symbols:["ws"],postprocess:e},{name:"_$ebnf$1",symbols:[],postprocess:function(a){return null}},{name:"_",symbols:["_$ebnf$1"]},{name:"ws",symbols:[b.has("ws")?{type:"ws"}:ws]},{name:"ws$ebnf$1",symbols:[b.has("ws")?{type:"ws"}:ws],postprocess:e},{name:"ws$ebnf$1",symbols:[],postprocess:function(a){return null}},
{name:"ws",symbols:["ws$ebnf$1",b.has("comment")?{type:"comment"}:comment,"_"]}],ParserStart:"final"};"undefined"!==typeof module&&"undefined"!==typeof module.exports?module.exports=b:window.grammar=b})();
