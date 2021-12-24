# html
html -> opening_tag (_ html_content):* _ closing_tag {% html.with_content %}
	| "<" identifier ("#" identifier):? ("." identifier):* "/" ">" {% html.self_closing_tag %}
	| "@text" __ value {% html.value_to_string %}

# html
opening_tag -> "<" identifier (__ attrubutes {% v => v[1] %}):? _ ">" {% html.opening_tag %}
closing_tag -> "<" "/" identifier ">" {% html.closing_tag %}
html_content -> string {% id %}
	| html {% id %}
attrubutes -> var_reassign (__ var_reassign):* {% html.attributes %}
