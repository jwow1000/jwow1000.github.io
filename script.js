// api stuff
const baseUrl = 'https://api.discogs.com';
const myToken = 'dgoPiRdAagChWVYQqpfTKEYSVAJGpdSpPxuisxkx';
// global variable for focus
let imgFocused = false;

// declare submit page, image area, and search bar
const theForm = document.querySelector('#theForm');
const imgArea = document.querySelector('#imageArea');
const searchBar = document.querySelector('#searchBar');
const userInput = document.querySelector('#userInput');
const searchButt = document.querySelector('#searchButt');
const randoButt = document.querySelector('#randoButt');

const handleSubmit = function (e) {
    e.preventDefault();
    // input value
    const search = e.target[0].value;
    getFirstFive(search);
}
const handleClick = function (e) {
    e.preventDefault();
    // input value
    const search = userInput.value;
    getFirstFive(search);
}

searchBar.addEventListener('submit', handleSubmit);
searchButt.addEventListener('click', handleClick);

randoButt.addEventListener('click', getRando);

// random button function
async function getRando() {
    // get random labels artists, releases
    let which = 'artists';
    let randoIndex = Math.floor(Math.random() * 3);
    switch (randoIndex) {
        case 0:
            which = 'labels';
            break;
        case 1:
            which = 'artists';
            break;
        case 2:
            which = 'releases';
            break
    }

    // console.log("Random index: ", randoIndex, which)
    let randomNum = (Math.random() * 200000);
    // console.log('which', which, randoIndex);
    const floorRando = Math.floor(randomNum);
    const response = await fetch(`${baseUrl}/${which}/${floorRando}`, {
        headers: {
            'User-Agent': `reSearchDiscogs/1.0 +https://github.com/jwow1000/SoundProject_api`
        }
    });
    const data = await response.json();
    // console.log("Data: ", data)

    if (data.message) {
        //console.log("inside of recursive loop")
        getRando()
        return
    }
    // console.log('this is the data', data.name);
    const searchTerm = data.title || data.name
    getFirstFive(searchTerm);
    userInput.value = searchTerm;
}

async function getFirstFive(s) {
    const response = await fetch(`${baseUrl}/database/search?q=${s}&type=all&token=${myToken}`, {
        headers: {
            'User-Agent': `reSearchDiscogs/1.0 +https://github.com/jwow1000/SoundProject_api`
        }
    });
    const data = await response.json();

    // clear image area
    imgArea.innerHTML = ``;
    console.log("getFirstFive Data: ", data);
    // let randoInt = (Math.floor(Math.random() * 5)) * 10;

    let arrLength = 0; // data.results.length < 10 ? data.results.length : 10;

    if (data.results.length < 10) {
        arrLength = data.results.length;
        arrMin = 0;
    } else {
        const len = Math.floor(data.results.length / 10);
        const rand10 = Math.floor(Math.random() * len) * 10;
        arrMin = rand10;
        arrLength = rand10 + 10;
    }

    for (let i = arrMin; i < arrLength; i++) {
        // make a 'div' element
        const newDiv = document.createElement('div');
        //const nestedNoImg = document.createElement('img');
        const nestedImg = document.createElement('img');
        // with a coolImg class
        nestedImg.dataset.coolImg = true;
        // add the discogs link
        const makeAlink = `https://www.discogs.com${data.results[i].uri}`;
        if (makeAlink) {
            nestedImg.dataset.link = makeAlink;
        }
        nestedImg.dataset.title = data.results[i].title;
        // dataset a link to the resource
        nestedImg.dataset.resource = data.results[i].resource_url;
        nestedImg.setAttribute('class', 'coolImg');


        newDiv.setAttribute('class', 'bgPatterns');

        // set the img source
        nestedImg.src = data.results[i].cover_image;
        // append to the document
        imgArea.appendChild(newDiv);
        //newA.appendChild(nestedNoImg);
        newDiv.appendChild(nestedImg);


    }
}

imgArea.addEventListener('click', function (e) {
    //console.log(e.target.dataset.secLink);
    if (e.target.dataset.coolImg) {
        if (imgFocused === false) {
            e.target.setAttribute('id', 'focusImg');
            // create the discogs link
            const discLinks = document.createElement('a');
            discLinks.innerText = 'discogs link';
            discLinks.setAttribute('id', 'discLink');
            discLinks.dataset.link = e.target.dataset.link;
            discLinks.dataset.secLink = 'discLink';

            // create the reSearch link
            const reSearch = document.createElement('a');
            reSearch.innerText = 'reSearch';
            reSearch.setAttribute('id', 'reSearch');
            reSearch.dataset.title = e.target.dataset.title;
            reSearch.dataset.secLink = 'reSearch';

            // create the youtube link
            const youTube = document.createElement('a');
            youTube.innerText = 'link 2 youtube';
            youTube.setAttribute('id', 'youTube');
            youTube.dataset.secLink = 'youTube';
            // console.log('is this a videolink', getVideo(e.target.dataset.resource));
            youTube.dataset.youTube = e.target.dataset.resource;

            imgArea.appendChild(discLinks);
            imgArea.appendChild(reSearch);
            imgArea.appendChild(youTube);

            imgFocused = true;

        } else {
            deleteFocus();
        }

    }
    function deleteFocus() {
        // find the img with the focusImg
        const focus = document.getElementById('focusImg');
        focus.setAttribute('id', '');
        const delLink = imgArea.querySelectorAll('a');
        console.log(delLink);
        for (let i = 0; i < delLink.length; i++) {
            delLink[i].remove();
        }
        // set global var to false
        imgFocused = false;
    }

    if (e.target.dataset.secLink === 'reSearch') {
        userInput.value = e.target.dataset.title;
        deleteFocus();
        console.log(e.target);
        userInput.value = e.target.dataset.title;
    }
    if (e.target.dataset.secLink === 'youTube') {
        const point = e.target.dataset.youTube;
        getVideo(point);
    }

    if (e.target.dataset.secLink === 'discLink') {
        console.log(e.target);
        window.open(`${e.target.dataset.link}`, '_blank');

    }
});

async function getVideo(url) {
    // get resource_url if this is not a release
    const point = url;
    // resorce data has the video location.
    const response = await fetch(point, {
        headers: {
            'User-Agent': `reSearchDiscogs/1.0 +https://github.com/jwow1000/SoundProject_api`
        }
    });
    const data = await response.json();
    //console.log('here is all the data', data.artists);

    const link = data.videos[0].uri;
    // return the video link
    let newLink = '';
    if (link) {
        newLink = link;
    } else {
        newLink = data.title;
    }
    window.open(newLink, '_blank');
}