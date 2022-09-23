@{%function nth(n){return function(d){return d[n]}}function $(o){return function(d){var ret={};Object.keys(o).forEach(function(k){ret[k]=d[o[k]]});return ret}}%}
delimited[el,delim]->$el ($delim $el {%nth(1)%}):*{%function(d){return[d[0]].concat(d[1])}%}
