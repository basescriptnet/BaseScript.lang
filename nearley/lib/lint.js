var warn=function(b,a){b.out.write("WARN\t"+a+"\n")};function lintNames(b,a){var e=[];b.rules.forEach(function(d){e.push(d.name)});b.rules.forEach(function(d){d.symbols.forEach(function(c){c.literal||c.token||c.constructor===RegExp||-1===e.indexOf(c)&&warn(a,"Undefined symbol `"+c+"` used.")})})}function lint(b,a){a.out||(a.out=process.stderr);lintNames(b,a)}module.exports=lint;