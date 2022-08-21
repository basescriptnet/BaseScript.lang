#atom -> number {% id %}
#    | string {% id %}
#    | myNull {% id %}
#    | "true" {% id %}
#    | "false" {% id %}
#    | parenthesized {% id %}
#    | prefixExp {% id %}
#    # ! function definition is missing

# base line
identifier -> %identifier {% (v, l, reject) => {
    if (v[0].type == 'null' ||
        ['Infinity', 'this', 'globalThis', 'NaN'
        , 'Boolean', 'Object', 'Array', 'String', 'Number', 'JSON'
        ].includes(v[0].value)) {
        return reject;
    }
    return v[0]
} %}
    | allowed_keywords {% id %}

allowed_keywords ->
    "Infinity" {% id %}
	| "this" {% id %}
    | "globalThis" {% id %}
    | "NaN" {% id %}
    | "Boolean" {% id %}
    | "Object" {% id %}
    | "Array" {% id %}
    | "String" {% id %}
    | "Number" {% id %}
    | "JSON" {% id %}
    | "undefined" {% v => assign(v[0], {
        type: 'keyword',
        value: 'void(0)'
    }) %}
    #| "null" {% id %}
    #| myNull {% id %}

convert -> prefixExp __ "as" __ convert_type {% (v, l, reject) => {
    //if (v[0] && !v[6] || !v[0] && v[6]) return reject
    return {
        type: 'convert',
        value: v[0],
        convert_type: v[4],
        line: v[0].line,
        col: v[0].col
    }
} %}

convert_type -> ("JSON" | "String" | "Number" | "Boolean" | "Object" | "Float" | "Int" | "Array") {% v => v[0][0] %}
    # ! removed for now
	#| "Array" "[" convert_type "]" {% v => {
	#	return {
	#		type: 'array_of_type',
	#		value: v[2],
	#		line: v[0].line,
	#		col: v[0].col
	#	}
	#} %}
	#| "Array" {% id %}

	# | %keywords __ {% id %}
# typed_argument -> identifier identifier
### primitives' essentials ###
# objects
pair -> ("async" __):? key _ arguments_with_types statements_block {% object.es6_key_value %}
	| key _ ":" _ value {% v => [v[0], v[4]] %}
    | key {% v => [v[0], v[0]] %}

key -> string {% id %}
	| identifier {% id %}
	| %keyword {% id %}

# strings
string_concat -> %string {% id %}
    #| string_concat _ "+" _ %string {% string_concat %}

# regexp
regexp_flags -> [gmi] {% regexp.flag %}
### END primitives' essentials ###

### primitives ###
# null
myNull -> "null" {% Null %}

# booleans
boolean -> (%boolean) {% boolean %}
    | "defined" _nbsp identifier {% v => ({
        type: 'defined',
        value: v[2],
        line: v[0].line,
        col: v[0].col
    }) %}
    | "defined" _nbsp "(" _ identifier _ ")" {% v => ({
        type: 'defined',
        value: v[4],
        line: v[0].line,
        col: v[0].col
    }) %}
	# | condition {% condition.value %}

# strings
string -> string_concat {% id %}
	# | string _ "[" _ number _ ":" ":":? _ number _ "]" {% string.slice %}
	#| number "px" {% string.px %}
    #| "typeof" __ prefixExp {% v => {
    #    return {
    #        type: 'typeof',
    #        value: v[2],
    #        line: v[0].line,
    #        col: v[0].col
    #    }
	#} %}
	| "typeof" _ "(" _ value _ ")" {% v => ({
		type: 'typeof',
		value: v[4],
        line: v[0].line,
        col: v[0].col
	}) %}

# numbers
# ! is not tested
bigInt -> %bigInt {% number.bigInt %}

number -> %number {% number.float %}
	#| ("-") _ value {% v => ({
	#	type: 'additive',
	#	sign: v[0][0].value,
	#	value: v[2],
    #    line: v[0].line,
    #    col: v[0].col
	#}) %}
    #| "sizeof" __ prefixExp {% v => ({
	#	type: 'sizeof',
	#	value: v[2],
    #    line: v[0].line,
    #    col: v[0].col
	#}) %}
    | "sizeof" _ "(" _ value _ ")" {% v => ({
		type: 'sizeof',
		value: v[4],
        line: v[0].line,
        col: v[0].col
	}) %}

# objects
object -> "{" _ "}" {% object.empty %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% object.extractObject %}

# regexp
regexp -> %regexp (regexp_flags):* {% regexp.parse %}

### END primitives ###
