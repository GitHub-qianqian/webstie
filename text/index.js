const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs');
const async = require('async');
const filter=require('bloom-filter-x');

//1初始化布隆过滤器
//  -从数据库中读取已有的url
//   -添加到布隆过滤器中
//2 定时抓取新闻网站上的数据
//   -根据布隆过滤器判定有没有新的新闻


//中观村在线
// async.eachLimit(['url','ur2','ur3'],1,(v,next)=>{
//     setTimeout(()=>{
//         console.log(v);
//         next(null);
// },1000);

//setInterval()
//url 去重
//
const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'db'
});
//初始化布隆
let newurl=[];
let urls=[];
let select_sql='select url from news';
connection.query(select_sql,(err,result,fields)=>{
    if (err) throw err;
    result.forEach((v)=>{
        let url=v.url;
        if(filter.add(url)){
            urls.push(url)
        }
    })
});
function fetch_news(){
    request({
        url: "http://news.zol.com.cn/",
        encoding: null//默认编码方式无
    }, (err, res, body) => {
        body = iconv.decode(body, 'gb2312');//编码方式gb2312
        let $ = cheerio.load(body);
//查找数据
        $('.content-list li').each((k,v)=>{
            let t = $(v).find('.info-head a');
            let title = t.text();
            let dsc = $(v).find('p').contents().eq(0).text();
            let image = $(v).find('img').attr('.src');
            let url=t.attr("href");
            if(filter.add(url)){
                urls.push(url);
                newurl.push({
                    'title':title,
                    'dsc':dsc,
                    'image':image,
                    'url':url
                })
            }
        });
        if(!urls.length){
            let d=new Date();
            console.log(d.toUTCString()+'抓取一次，本次没有更新..')
        }else{
            let d=new Date();
            console.log(d.toUTCString()+'抓取一次，本次更新..'+urls.length+'次');
            async.eachLimit(newurl,1,(v,next)=>{
                request({
                    url:v.url,
                    encoding:null,
                },(err, res, body)=>{
                    if(err){
                        console.log(err.message)
                    }else{
                        body = iconv.decode(body, 'gb2312');
                        let $ = cheerio.load(body);
                        let pubtime = $('#pubtime_baidu').attr('content');
                        let content = $('#article-content').html();
                        let title=v.title;
                        let dsc=v.dsc;
                        let image=v.image;
                        let url=v.url;
                        let insert_sql='insert into news (title,dsc,image,url,pubtime,content) values (?,?,?,?,?,?)';
                        connection.query(insert_sql,[title,dsc,image,url,pubtime,content],(err,results,fields)=>{
                            if (err) throw err;
                            console.log(results.insertId);
                        })
                    }
                });
                next(null);
            })
        }
    })
}

fetch_news();
setInterval(fetch_news,1000);


// async.eachLimit($('.content-list li'), 1, (v ,next)=>{
//     let t = $(v).find('.info-head a');
//     let title = t.text();
//     let dsc = $(v).find('p').contents().eq(0).text();
//     let image = $(v).find('img').attr('.src');
//     let url = t.attr("href");
//     console.log(title);
//     console.log(dsc);
//     console.log(image);
//     console.log(url);
//
//
//
//     request({
//         url: url,
//         encoding: null,
//     }, (err, res, body) => {
//         body = iconv.decode(body, 'gb2312');
//         let $ = cheerio.load(body);
//         let pubtime = $('#pubtime_baidu').attr('content');
//         let content = $('#article-content').html();
//         // console.log(content)
//         console.log(pubtime);
//         console.log(content);
//         next(null);
//     });
// });





// const mysql      = require('mysql');
// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'zday'
// });
// connection.connect();
//查
// let select_sql='select * from news where id = ?';
// connection.query(select_sql,[38], function (error, results, fields) {
//     if (error) throw error;
//     console.log(results);
// });
// //增
// let insert_sql="insert into news (title, des, content) values (?,?,?) ";
// connection.query(insert_sql,['aaa','aaa','aaa'],function (error, results, fields) {
//     if (error) throw error;
//     console.log(results.insertId);
//
// });
// //改
// let update_sql='update news set des = ? where id = ? ';
// connection.query(update_sql,['111',50,],function (error, results, fields) {
//     if (error) throw error;
//     console.log(results.affectedRows);
//
// });
//删
// let delete_sql='delete from news where id = ?';
// connection.query(delete_sql,[48], function (error, results, fields) {
//      if (error) throw error;
//     console.log(results.affectedRows);
//     connection.end();
//  });


// for(let i=0;i<3;i++){
//     setTimeout(()=>{
//         console.log('a')
//     },1000)
// }

//百度网
// request.get(
//     'http://www.baidu.com',
//     (eer,res,body)=>{
//         let $=cheerio.load(body);
//         $('img').each((k,v)=>{
//          let src=$(v).attr('src');
//           if(!src.startsWith('http:')){
//               src='http:'+src;
//         }
//          console.log(src)
//         })
//     }
// );
//昵图网
// request({
// //     url:"http://www.nipic.com/"
// // },(err,res,body)=> {
// //     let $ = cheerio.load(body);
// //     $('.clearfix img').each((k, v) => {
// //         let src = $(v).attr('src');
// //         request(src).pipe(fs.createWriteStream('./k-'+k+'.jpg'))
// //     })
// //
// // });
//今日头条
// request({
//     url:"https://www.toutiao.com/api/pc/feed/?category=news_tech&utm_source=toutiao&widen=1&max_behot_time=1535517768&max_behot_time_tmp=1535517768&tadrequire=true&as=A165AB28F6B3ADB&cp=5B86D3FAEDBBAE1&_signature=zZLTNwAAlh22q7DxIxdZgs2S0y",
//     encoding:'utf-8'
// },(err,res,body)=>{
//     // let $=cheerio.load(body);
//    let o=JSON.parse(body);
//    // console.log(o.data);
//      o.data.forEach(v=>{
//             let src="http:"+v.image_url;
//                 console.log(src);
//          }
//
//      )
// });
//bing 网
// const wallpaper=require('wallpaper');
// request({
//     url:"https://cn.bing.com/",
//     },(err,res,body)=>{
//       let $ = cheerio.load(body);
//       let src='https://cn.bing.com'+$('img').last().attr('src');
//       let ws=fs.createWriteStream('./bing.jpg');
//       request(src).pipe(ws);
//       ws.on('finish',()=>{
//           console.log('ok');
//           wallpaper.set('./bing.jpg').then(()=>{
//               console.log('done')
//           })
//       })
// });
//    $('img').each((k, v) => {
//     let t = $(v).attr('src');
//     if(t&&t.indexOf('1920x1080')){
//          let src='http://cn.bing.com'+t;
//          console.log(src);
//         // request(src).pipe(fs.createWriteStream('./a-'+k+'.jpg'))
//     }
// })





