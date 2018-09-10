<?php

$classname=$_GET['c'];
include "PHP/".$classname.'.php';
$method=$_GET['m'];
$page=new $classname();
$page->$method();

