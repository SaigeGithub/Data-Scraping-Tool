const fs = require('fs');
const axios = require('axios');
const express= require('express');
const app= express();
var http = require('http');
var path =require('path');
var bodyParser =require('body-parser');
app.use(express.static('public'));

const fileName = 'schoolinfo.json';

function main() {
    getData(1)
        .then(data => {
            return data.data.total_pages;
        })
        .then(totalPages => {
            const promises = [];
            for (let i = 1; i <= totalPages; i++) {
                promises.push(getData(i));
            }
            //for ()
            return promises;
        })
        .then(promises => {


          
    
            const schoolObj= []; 

            return Promise.all(promises).then(data => {
                // data is response from 'www.usnews.com'
                let PrimaryKey =0;

                data.forEach(data => {
                    const schools = data.data.items;

                    //console.log(schools);
                    for (key in schools) {
                        schoolObj[PrimaryKey]={
                            name:""+schools[key].institution.displayName,
                            shortName:""+schools[key].institution.aliasNames,
                            address:{
                                country:"US",
                                state:""+schools[key].institution.state,
                                city:""+schools[key].institution.city,
                                postalCode:""+schools[key].institution.zip,

                            },
                            type:""+schools[key].institution.institutionalControl,
                           
                            //qsRanking: 0+schools[key].parent.sortRank,
                            satScore:0+schools[key].searchData["satAvg"].rawValue,
                            
                            studentNo:0+schools[key].searchData["enrollment"].rawValue,
                         
                            gpa:0+schools[key].searchData["hsGpaAvg"].rawValue,
                            introduction:""+schools[key].blurb,
                            
                            actScore:schools[key].searchData["actAvg"].rawValue,
                            acceptanceRate: schools[key].searchData["acceptanceRate"].rawValue,
                            tuition:schools[key].searchData.tuition.rawValue,
                            businessRepScore:schools[key].searchData.businessRepScore.rawValue,
                            engineeringRepScore:schools[key].searchData.engineeringRepScore.rawValue,
                            cost_after_aid:schools[key].searchData["costAfterAid"].rawValue,
                            percent_receiving_aid:schools[key].searchData["percentReceivingAid"].rawValue,
                            
                            
                        
                        };
            
                        PrimaryKey++;

                       
                    }
                });
                return schoolObj;
            });
        })
        .then(schoolObj => {
            fs.writeFileSync(
                fileName,
                JSON.stringify(schoolObj, null, 2),
                err => {
                    if (err) throw new Error(err);
                }
            );
           
            var schoolList ="";
            for(key in schoolObj){
               // console.log(schoolObj[key].name);
                schoolList+=schoolObj[key].name + " \n ";
                //schoolList.push(schoolObj[key].name);
            };
           
            


            // schoolList
            // JSON.stringify(schoolist) here, and save to a variable
            // slice schooListString[0] and schoolListstring[1]
            // Create a new variable, loop through schooListString, if (schoolListString[i] === '"') ignore; otherwise append to new variable
            

            app.use(bodyParser());
            app.get('/', function(req,resp){
                resp.sendFile('GetSchoolInfo.html', {root: path.join(__dirname,'./')});
            }
            );
            app.get('/school',function(req,resp){
                //resp.end(JSON.stringify(schoolList, null, 4))
                resp.end(schoolList);
                console.log('Get OK');
            });
            app.get('/alldetails',function(req,resp){
                resp.end(JSON.stringify(schoolObj, null, 2))
                console.log('Get OK');
            });
            
            app.post('/oneSchool',function(req,resp){
                console.log(req.body.name);
                for(key in schoolObj){
                    if (req.body.name===schoolObj[key].name){
                        
                        resp.end(JSON.stringify(schoolObj[key],null,2));
                    }

                    
                }
                
                
            });
  
         
            app.listen(1337,function(){
                console.log('Hey, go to 1337');
            });

        })
        .then(() => console.log('done'))
        .catch(err => console.log(err));
}

// GET
function getData(i) {
    // axios automatically parses json so we don't need to do it
    return axios
        .get(
            `https://www.usnews.com/best-colleges/rankings/national-universities?_page=${i}&format=json`
        )
        .then(data => data.data);
}


//document.querySelector('#btn').onClick = main();
main();
