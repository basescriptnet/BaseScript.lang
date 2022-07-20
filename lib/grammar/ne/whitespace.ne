### whitespace ###
# comments
# comment -> %space %comment
# space -> %space
# # not mandatory whitespace
# _ -> comment:* %space {% v => '' %}
# 	| null {% v => '' %}
# # mandatory whitespace
# __ -> comment:* %space {% v => ' ' %}

_ -> %space {% id %}
	| null {% v => '' %}
# mandatory whitespace
__ -> %space {% id %}

# wschar -> [ \t\n\v\f] {% id %}
# s -> [ \t] | null
# end of line token
# WS_NO_LINE_BREAKS -> s (%comment [ \t]):*
# 	# | [ \t]
# 	# | %comment
# 	# | null
# WS_WITH_LINE_BREAKS -> [\s] (%comment [\s]):*
# 	# | %comment
# 	| null
# End of line
# ? Works really well, but needs more tests. First 2 lines
# ? replaced from %space to this
EOL -> [\n]:+ {% v => 'EOL' %}
    | [ \t]:* "/" "/" [^\n]:* [\n]:*  {% v => 'EOL' %}
	# | WS_NO_LINE_BREAKS [\n] WS_WITH_LINE_BREAKS
	| [ \t]:* ";" {% v => v[1] %}

_nbsp -> [ \t]:* {% v => '' %}

### END whitespace ###
