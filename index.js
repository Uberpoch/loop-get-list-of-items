const axios = require('axios');
const fs = require('fs');


const clientID = '';
const secretKey = '';
// let tokenType = '';

// const desinationStream = 7106516;
const destHub = 118754;
const outputFile = 'unqork';

const ogData = require('./source.js');
const totalItems = ogData.length;



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


const updateStream = async (token, item) => {
    
    return axios.get(`https://v2.api.uberflip.com/items/${item.itemId}`,
    {
        headers: {
            "Authorization": `Bearer ${token}`,
            "User-Agent": "NP Script",
            "Content-Type": "application/json",
        }
    })
    .then(res => {
        const data = res.data;
        const formatted = {
            stream: data.id
        };
        return formatted;
    })
    .catch(err => {
        console.log(err.response);
        console.log(`error in updating a stream`);
    })
};

const makeLoop = async (token, array) => {
    let runItems = 0;
    array.forEach(async (stream) => {
        const value = await updateStream(token, stream);
        runItems += 1;
        console.log(`item: ${value.stream} updated ${runItems} of ${totalItems}`);
    })

}

const run = async function(){
    const token = await auth(clientID, secretKey);
    // console.log(token);
    console.log('token created');
    const data = await makeLoop(token,ogData);
    console.log('complete');


};
run();


