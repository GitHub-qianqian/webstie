const filter=require("bloom-filter-x")
const iconv=require("iconv-lite")
const request=require("request")
const cheerio=require("cheerio")
const async=require("async")
const fs=require("fs")
const mysql=require("mysql")

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"db"
})

let urls=[];
let newurl=[];
// let select_sql='select url from news';
// connection.query(select_sql,(err,result,fields)=>{
//     if (err) throw err;
//     result.forEach((v)=>{
//         let url=v.url;
//         if(filter.add(url)){
//             urls.push(url)
//         }
//     })
// });
function fetch_news(){
    request({
        url: "http://news.zol.com.cn/",
        encoding: null//默认编码方式无
    }, (err, res, body) => {
        body = iconv.decode(body, 'gb2312');//编码方式gb2312
        let $ = cheerio.load(body);



//查找数据
        $('.content-list li').each((k, v) => {
            let t = $(v).find('.info-head a');
            let title = t.text();
            let dsc = $(v).find('p').contents().eq(0).text();
            let image = $(v).find('img').attr('.src');
            let url = t.attr("href");
            if (filter.add(url)) {
                urls.push(url);
                newurl.push({
                    'title': title,
                    'dsc': dsc,
                    'image': image,
                    'url': url
                })
            }
        });


        if (!urls.length) {
            let d = new Date();
            console.log(d.toUTCString() + '抓取一次，本次没有更新..')
        } else {
            let d = new Date();
            console.log(d.toUTCString() + '抓取一次，本次更新..' + urls.length + '次');
            async.eachLimit(newurl, 1, (v, next) => {
                request({
                    url: v.url,
                    encoding: null,
                }, (err, res, body) => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        body = iconv.decode(body, 'gb2312');
                        let $ = cheerio.load(body);
                        let pubtime = $('#pubtime_baidu').attr('content');
                        let content = $('#article-content').html();
                        let title = v.title;
                        let dsc = v.dsc;
                        let image = v.image;
                        let url = v.url;
                                let insert_sql = 'insert into news (title,dsc,url,image,create_time,content) values (?,?,?,?,?,?)';
                                connection.query(insert_sql, [title, dsc,  url,image,pubtime, content], (err, results, fields) => {
                                    if (err) throw err;
                                    console.log(results.insertId);
                                })

                      console.log(title)
                    }
                });
                next(null);
            })
        }
    })
    }
fetch_news();