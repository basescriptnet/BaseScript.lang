<?php
    function concat () {
        $arguments = func_get_args();
        $result = '';
        // var_dump ($arguments[0]);
        foreach ($arguments as $value) {
            // var_dump($value);
            if (gettype($value) == 'array') {
                $result .= concat(...$value);
            } else {
                $result .= $value;
            }
        }
        return $result;
    }
    $BS = (object) array(
        'storage' => array(),
        'range' => function ($number) {
            return range(0, $number);
        }
    );
    $RANGE = function ($number) {
        return range(0, $number);
    }
?>