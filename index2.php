<?PHP
error_reporting(-1);
ini_set('display_errors', 'On');


$path = ltrim($_SERVER['REQUEST_URI'], '/');    // Trim leading slash(es)

//echo 'start<pre>';
//var_dump($path);
//echo '</pre> end<br/>';

$path = substr($path,11); //TODO: remove life!!

$elements = explode('.', $path);                // Split path on slashes

//echo 'start<pre>';
//var_dump($elements);
//echo '</pre> end<br/>';
 

if(count($elements) == 0) {                      // No path elements means home
    
    home();
    
} else {
    
    if (file_exists ( "img/works/".$elements[0].".jpg" )) {
       // echo '<img src="img/works/'.$elements[0].'.jpg" alt="TEST" >';
        $img = 'img/works/'.$elements[0].'.jpg';
        $title = $elements[0];
        include_once 'lib/singlepic.php';
    } else {
            header('HTTP/1.1 404 Not Found');
            error();
    }
}


function home() {

 echo 'HOME';
}

function pics( $elements) {

    var_dump($elements);
    
}

function error() {
 
    echo 'ERROR!!';
}

?>
