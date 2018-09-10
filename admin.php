<?php

class database{
    public $pdo;
    public function __construct()
    {
        $db = array(
            'dsn' => 'mysql:host=localhost;dbname=db;port=3306;charset=utf8',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8',
        );
        $options = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        );
        try{
            $this->pdo= new PDO($db['dsn'], $db['username'], $db['password'], $options);
        }catch(PDOException $e){
            die('数据库连接失败:'.$e->getMessage());
        }
    }
}

class News extends database {
    public function actiondelete(){
        echo $count=$this->pdo->exec("delete from  news where id = ".$_GET['id']);
    }
    public function actionselect(){
//        $total_number = null;
        $result = [];
        if (isset($_GET['cid'])) {
            $cid = $_GET['cid'];
         echo $counts=$this->pdo->exec("select * from  news where cid = ".$cid);
      }
        include("HTML/recommend.html");
    }

    public  function  actionupdate(){
        $stmt = $this->pdo->prepare("update news set  ". $_GET['k'] ."= ? where id =?");
        $stmt->bindValue(1, $_GET['v']);
        $stmt->bindValue(2, $_GET['id']);
        echo $stmt->execute();
    }

    public function actioninsert(){
        $stmt = $this->pdo->prepare("insert into news(cid,title,dsc,image,url,create_time,content)values(?,?,?,?,?,?,?)");
        $stmt->bindValue(1, '');
        $stmt->bindValue(2, '');
        $stmt->bindValue(3, '');
        $stmt->bindValue(4, '');
        $stmt->bindValue(5, '');
        $stmt->bindValue(6, '');
        $stmt->bindValue(7, '');
        echo $stmt->execute();

    }
    public  function  actionview(){
        $stmt = $this->pdo->query('select * from news');
        $rows = $stmt->fetchAll();//返回值是一个数组
        include("HTML/admin.html");
    }
    public  function  actionviews(){

        if (isset($_GET["cid"])){
            $cid=$_GET["cid"];
        }else{
            $cid=1;
        }
//总条数
        $num=$this->pdo->query("select count(*) as total from news ")->fetch()['total'];
//总页数
        $count=ceil($num/10) ;


        $stmt = $this->pdo->query('select * from news limit 10');
        $rows = $stmt->fetchAll();//返回值是一个数组
        include("HTML/recommend.html");

    }

}













//class Page extends database {
//
////    推荐
//    public function recommend(){
//        include("HTML/recommend.html");
//    }
////    视屏
//    public function video(){
//        include("HTML/video.html");
//
//    }
//        public  function  actionview(){
//        $stmt = $this->pdo->query('select * from news');
//        $rows = $stmt->fetchAll();//返回值是一个数组
//        include("HTML/admin.html");
//    }
//}


$class_name=$_GET['c'];
$method_name='action'.$_GET['m'];
$o          = new $class_name();
$o->$method_name();








//$xinwen=new News();
//if ( isset($_GET['action'])){
//    $maters="action".$_GET['action'];
//}else{
//    $maters='actionview';
//}
//$xinwen->$maters();

