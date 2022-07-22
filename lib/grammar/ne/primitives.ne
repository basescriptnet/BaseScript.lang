atom -> number {% id %}
    | string {% id %}
    | myNull {% id %}
    | "true" {% id %}
    | "false" {% id %}
    | parenthesized {% id %}
    | prefixExp {% id %}
    # ! function definition is missing

# base line
identifier -> %identifier {% id %}

nameList -> identifier {% id %}
    | nameList _ "," _ identifier {% v => ({
			type: 'name_list',
			value: v[0],
            addition: v[4]
    }) %}

allowed_keywords ->
    "Infinity" {% id %}
	| "this" {% id %}
    | "globalThis" {% id %}
    | "NaN" {% id %}

convert -> value __ "as" __ convert_type {% v => {
		return {
			type: 'convert',
			value: v[0],
			convert_type: v[4]
		}
	} %}

# ! removed for now
#convert_type -> ("List" | "JSON" | "String" | "Number" | "Boolean" | "Object" | "Float" | "Int") {% v => v[0][0] %}
#	| "Array" "[" convert_type "]" {% v => {
#		return {
#			type: 'array_of_type',
#			value: v[2],
#			line: v[0].line,
#			col: v[0].col
#		}
#	} %}
#	| "Array" {% id %}

	# | %keywords __ {% id %}
# typed_argument -> identifier identifier
### primitives' essentials ###
# objects
pair -> ("async" __):? key _ arguments_with_types _ statements_block {% object.es6_key_value %}
	| key _ ":" _ value {% v => [v[0], v[4]] %}

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
boolean -> (%boolean | "!" _ value) {% boolean %}
	# | condition {% condition.value %}

# strings
string -> string_concat {% id %}
	# | string _ "[" _ number _ ":" ":":? _ number _ "]" {% string.slice %}
	| number "px" {% string.px %}
    | "typeof" __ prefixExp {% v => ({
		type: 'typeof',
		value: v[2]
	}) %}
	| "typeof" _ "(" _ value _ ")" {% v => ({
		type: 'typeof',
		value: v[4]
	}) %}

# numbers
# ! is not tested
bigInt -> %bigInt {% number.bigInt %}

number -> %number {% number.float %}
	| ("-") _ value {% v => ({
		type: 'additive',
		sign: v[0][0].value,
		value: v[2]
	}) %}
    | "sizeof" __ prefixExp {% v => ({
		type: 'sizeof',
		value: v[2]
	}) %}
    | "sizeof" _ "(" _ value _ ")" {% v => ({
		type: 'sizeof',
		value: v[4]
	}) %}

# objects
object -> "{" _ "}" {% object.empty %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% object.extractObject %}

# regexp
regexp -> %regexp (regexp_flags):* {% regexp.parse %}

### END primitives ###
