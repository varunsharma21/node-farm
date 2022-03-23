const fs = require('fs');
const http = require('http');
const url = require('url');


////////////////////////////////////////////////////
// FILES

// fs.readFile( './read', 'utf-8');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `I love avocado bcoz: ${textIn}`;
// fs.writeFileSync('./txt/input.txt', textOut);
// console.log('text written!');

// NON-BLOCKING CODE/ ASHYNCHRONOUS CODE
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log("ERRROR!!");

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);  

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!');
//             });
//         });
//     });
// });
// console.log('will read file!');

////////////////////////////////////////////////////
// SERVER


// 1. using synchronous version coz it has to only run once BEFORE executing next callback function.
// here we store all info in data and we don't need to read file everytime api is called(have to be done 
// in case we write readFile() in router), now we just show stored data whenever api is called,
//  which is certainly better.
// 2. Also we only require two arguments as we are storing data.

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    const pathName = req.url;
    

    // Overview
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {
          'Content-type': 'text/html'
        });
    
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    // Product
    else if(pathName === '/product') {
        res.end('This is PRODUCT');
    }

    // API
    else if(pathName === '/api') {
        // 1. writeHead() property is an inbuilt property of the 'http'
        // module which sends a response header to the request.
        // 2. arguments take status code and an object for content type.
        res.writeHead(200, {
            // for json we use application/json.
            'Content-type': 'application/json'
        });
        res.end(data);
    }

    // Not found
    else {
        res.writeHead(404, {
            // for HTML we use text/html.
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end(`<h1>page not found</h1>`);
    }
});

// can also write "server.listen(3000, '127.0.0.1', () => .....)"
// i.e we can also specify where it will run 127.0.0.1 is localhost.
server.listen(3000, () => {
    console.log('Listening to port 3000...');
});