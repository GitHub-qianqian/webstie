<?php


if (isset($_GET['c'])&&isset($_GET['m'])){
    $classname=$_GET['c'];
    $method=$_GET['m'];
    include "PHP/".$classname.'.php';
    $page=new $classname();
    $page->$method();
}else{
    $method= 'index';
    include "PHP/page.php";
    $page = new page();
    $page ->$method();

}




