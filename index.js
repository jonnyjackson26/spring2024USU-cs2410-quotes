const searchButton=document.getElementById('searchButton');
const searchBar=document.getElementById('searchBar');
const quote = document.getElementById('quote');
const container = document.getElementById('container');


let pinned = [];
let previousQuery="";

async function getRandomQuote() {
    const result = await fetch("https://usu-quotes-mimic.vercel.app/api/random");
    quoteObject=await result.json();
    text=quoteObject.content;
    author=quoteObject.author;
    quote.innerText=text+"\n  -"+author;
}
getRandomQuote(); //sets home screen with random quote
searchBar.focus(); //focus on input field
searchBar.setAttribute('placeholder','Thomas Edison');
//an enter searches
document.addEventListener('keypress', function(e) {
    if(e.key==="Enter") {
        searchButton.click();
    }
});

searchBar.setAttribute('aria-label','Search Bar');


async function search() {
    let query=searchBar.value;
    if(query.length>0 && query!==previousQuery) { //make sure they have SOMETHING in the search bar and that its not just the same thing
        previousQuery=query;
        //remove the random quote
        quote.remove();
        //remove all the old quotes except for the pinned ones
        container.querySelectorAll('div').forEach(div => {
            if (!div.classList.contains('pinned')) {
                div.remove(); 
            }
        });
    
        const result = await fetch("https://usu-quotes-mimic.vercel.app/api/search?query="+query);
        let quotes = await result.json();

        let cntr=0;
        quotes.results.forEach(element => {
            let div = document.createElement('div');
            let quoteP = document.createElement('p');
            let authorP = document.createElement('p');

            quoteP.classList.add('quoteContent');
            div.classList.add('quote');
            cntr+=1;
            let divId="quote"+cntr;
            div.setAttribute('id',divId);
            div.setAttribute('role','button');
            div.setAttribute('tabindex','1');
            div.addEventListener('click', function() {
                //toggle if divId is in pinned
                const index = pinned.indexOf(divId); // is divId is in the array
                if (index === -1) {
                    pinned.push(divId);
                    div.classList.add('pinned');
                    container.insertBefore(div,container.firstChild);//bring to top
                } else {
                    pinned.splice(index, 1);
                    div.classList.remove('pinned');
                }
            });
            div.addEventListener('keypress', function(e) {
                if(e.key==="Enter") {
                    //toggle if divId is in pinned
                    const index = pinned.indexOf(divId); // is divId is in the array
                    if (index === -1) {
                        pinned.push(divId);
                        div.classList.add('pinned');
                        container.insertBefore(div,container.firstChild);//bring to top
                    } else {
                        pinned.splice(index, 1);
                        div.classList.remove('pinned');
                    }
                }  
            });
            quoteP.innerText=element.content;
            authorP.innerText=" - "+element.author;

            div.appendChild(quoteP);
            div.appendChild(authorP);
            container.appendChild(div);
        });
    }
}



/*      */


searchButton.addEventListener('click',search);

