//var http = require('http');
var cheerio =require('cheerio');
//var https=require('https');
var axios = require('axios');
const fs = require('fs');
const fileName = 'Moreschoolinfo.html';
var url ='';

// var url = 'https://www.usnews.com/education/best-global-universities/hebrew-university-of-jerusalem-500554';
//var url = 'https://www.usnews.com/education/best-global-universities?format=json';

axios.get('https://www.usnews.com/education/best-global-universities/hebrew-university-of-jerusalem-500554')
.then(data => {
    //console.log(data)
    const processed = filterData(data.data);
    fs.writeFileSync(
        fileName,
        data.data,
        err => {
            if (err) throw new Error(err);
        }
    );
    return processed;
})




function filterData(html) {
    //console.log('filterData');
    var $ = cheerio.load(html);
   // var number_of_student;
    var temp = $('.directory-data');
    var link = $('.icon-website');
    var links = temp.last()[0].children[3].attribs.href;
    var address =temp[0].children[3].children[0].data;
    var city =temp[0].children[5].children[0].data;
    var country =temp[0].children[7].children[0].data;
    //var items= $('<div class="right t-strong" style="padding-left:10px"></div>');
    var items=$(".t-strong");

    
    items.each(function () {
        let item = $(this)
        let data = item[0].children[0].data.trim();
        //let data = detail[0].children[0].data.trim();
        
        
        console.log(data);


    });
    var names=$(".t-dim")
    names.each(function(){
        let name=$(this)
        let namedata=name[0].children[0].data.trim();
        console.log(namedata);
    })
    var rankings=$(".rankings-score")
    rankings.each(function(){
        let ranking=$(this)
        let rankingdata=ranking[0].children[1].children[0].data
        
        console.log(rankingdata)
        
    })
    

    console.log(links);
    console.log(address);
    console.log(city);
    console.log(country);

    var SchoolData = [];

}

