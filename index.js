const axios = require('axios');
const fs = require('fs');


const clientID = '';
const secretKey = '';

const outputFile = '';

const array = [];


const auth = async (key, secret) => {
    return axios.post('https://v2.api.uberflip.com/authorize', {
        grant_type:	'client_credentials',
        client_id: key,
        client_secret: secret
    })
    .catch(function (error) {
        console.log(error);
        })
    .then(function (response) {
        // tokenType = response.data.token_type;
         const token = response.data.access_token;
        // console.log(token);
        return token;
    });

}


const callLoop = async function(token, array){
    let returnedItems = [];
    let totalItems = array.length;
        
    async function call(url, token){
    axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'User_Agent': `Nathan UF`
              }
        })
        .catch(error => {
            console.log(error);
            })
        .then(async (res) => {
            let objs = res.data;
            
            returnedItems.push(objs);

                if(totalItems === returnedItems.length){
                    console.log(`returnedItems: ${returnedItems.length} = totalItems: ${totalItems}`);
                    console.log(`creating file`);
                    setTimeout(function(){
                        generateFile(returnedItems)
                    },
                        5000
                    );
                    // generateFile(returnedItems)
                }
            
        });  

    }
    for(let i = 0; i < array.length; i++){
        let url = `https://v2.api.uberflip.com/items/${array[i]}`;
        call(url, token)
   }
}

const  generateFile = async(res) => {
    const allowArray = [
        "hub_id",
        "title",
        "description",
        // "url",
        "seo_title",
        "seo_description",
        "thumbnail_url",
        "content",
        // "stream_id"
        "author"
    ];
    let data = JSON.stringify(res, null, 2);
    fs.writeFileSync(`${outputFile}.json`, data);
    console.log('json created');
  };

const run = async function(){
    const token = await auth(clientID, secretKey);
    // console.log(token);
    console.log('token created');
    const data = await callLoop(token, array);
    // console.log(data.length);
    console.log('data confirmed');
    // await generateFile(data);

};
run();