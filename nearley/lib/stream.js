var Writable=require("stream").Writable,util=require("util");function StreamWrapper(a){Writable.call(this);this._parser=a}util.inherits(StreamWrapper,Writable);StreamWrapper.prototype._write=function(a,c,b){this._parser.feed(a.toString());b()};module.exports=StreamWrapper;