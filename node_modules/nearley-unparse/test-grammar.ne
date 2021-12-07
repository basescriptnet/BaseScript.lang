main -> foo | bar_list

foo -> "foo" [0-9]:+

bar_list -> bar
    | bar_list "," bar

bar -> "bar"
