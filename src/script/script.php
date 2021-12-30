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
<?php
// your code below this line
array_push($BS->storage, array(1,2,3));foreach ((function () {
global $BS;
if (sizeof($BS->storage) == 0) {
    throw new Error("No saved values to use at line 4, col 11.");
}
return $BS->storage[sizeof($BS->storage)-1];
                })() as $i) {echo $i;}array_pop($BS->storage)
?>