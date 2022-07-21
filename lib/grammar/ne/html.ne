# html
html -> "{" "{" _ value _ "}" "}" {% html.value_to_string %}
    | opening_tag (_ html_content {% v => v[1] %}):* _ closing_tag {% html.with_content %}
	| "<" identifier ("#" identifier):? ("." identifier):* "/" ">" {% html.self_closing_tag %}
	#| "@text" __ value {% html.value_to_string %}

# html
opening_tag -> "<" identifier (__ attrubutes {% v => v[1] %}):? _ ">" {% html.opening_tag %}
closing_tag -> "<" "/" identifier ">" {% html.closing_tag %}

html_content -> html_string {% v => ({
	type: 'html_string',
	value: v[0]
}) %}
    | html_string (__ html_string {% v => v[1] %}):+ {% v => ({
        type: 'html_string',
        value: v[0],
        additions: v[1]
    }) %}
	| _ html {% v => v[1] %}

html_string -> string {% v => {
	// debugger
	return v
} %}
#html_string -> [^<]:+ {% v => {
#	// debugger
#	return v.flat()
#} %}
	# | [^<] {% id %}
attrubutes -> var_reassign (__ var_reassign):* {% html.attributes %}
