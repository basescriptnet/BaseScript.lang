# base line
identifier -> %identifier {% v => v[0] %}

convert -> value __ "as" __ convert_type {% v => {
		return {
			type: 'convert',
			value: v[0],
			convert_type: v[4]
		}
	} %}

convert_type -> ("List" | "JSON" | "String" | "Number" | "Boolean" | "Object" | "Float" | "Int") {% v => v[0][0] %}
	| "Array" "[" convert_type "]" {% v => {
		return {
			type: 'array_of_type',
			value: v[2],
			line: v[0].line,
			col: v[0].col
		}
	} %}
	| "Array" {% id %}

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
string_concat -> string_concat __ %string {% string_concat %}
	| %string {% id %}

# regexp
regexp_flags -> [gmi] {% regexp.flag %}
### END primitives' essentials ###

### primitives ###
# null
myNull -> "null" {% Null %}

# booleans
boolean -> (%boolean | "!" _ value) {% boolean %}

# strings
string -> string_concat {% id %}
	# | string _ "[" _ number _ ":" ":":? _ number _ "]" {% string.slice %}
	| number "px" {% string.px %}

# numbers
bigInt -> %number "n" {% number.bigInt %}

number -> %number {% number.float %}
	| ("+" | "-") _ value {% v => ({
		type: 'additive',
		sign: v[0][0].value,
		value: v[2]
	}) %}

# objects
object -> "{" _ "}" {% object.empty %}
	| "{" _ pair (_ "," _ pair):* (_ ","):? _ "}" {% object.extractObject %}

# regexp
regexp -> %regexp (regexp_flags):* {% regexp.parse %}

### END primitives ###
