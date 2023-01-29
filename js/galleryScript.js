// Global Variables
let imgSize = '';
let backToTopBtn = document.getElementById("backToTop");

// The eventListner for the search button
document.querySelector('#formButton').addEventListener('click', getUserInput);

// Function - Collects the form data
function getUserInput(event) {
    event.preventDefault();

    const imgAmount = document.querySelector('#amountInput').value;
    const sortType = document.querySelector('#sortInput').value;
    const searchText = document.querySelector('#textInput').value;
    imgSize = document.querySelector('#sizeInput').value;
    
    //Sets textInput to heading and then clears the textInput
    document.querySelector('.heading-text span').innerText = searchText;
    document.querySelector('#textInput').value = '';

    // Only call fetch function if #textInput is not empty
    if (!searchText == '') {
        document.querySelector('#errorDisplayDiv').innerText = '';
        document.querySelector('#textInput').focus();

        getImageSearch(searchText, imgAmount, sortType);

    } else {
        removeChildElements('imageGallery');
        document.querySelector('#textInput').focus();
        document.querySelector('#errorDisplayDiv').innerText = 'You can not make an emty search!';

    }
}

// Function - API fetch request
function getImageSearch(searchText, imgAmount, sortType) {
    const urlRequest = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f65523c21e8cd824989286794aa6f382&text=${searchText}&sort=${sortType}&per_page=${imgAmount}&format=json&nojsoncallback=1`;

    fetch(urlRequest)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                throw 'Something went wrong, try again later.';
            }
        })
        .then(displayImages)
        .catch(error => {
            console.log(error); //Log
            document.querySelector('#errorDisplayDiv').innerText = 'There is something wrong with the server, try again later.';
        });
}

// Function - Calls the createImgLiElement function and adds the response to the gallery.
function displayImages(imageInfo) {
    const imgTarget = document.querySelector('#imageGallery');

    removeChildElements('imageGallery');

    // Checks if there is images to display.
    if (imageInfo.photos.photo.length === 0) {
        document.querySelector('#errorDisplayDiv').innerText = 'No images could be found for this search.';

    } else {
        imageInfo.photos.photo.forEach(element => {
            const imgUrl = `https://live.staticflickr.com/${element.server}/${element.id}_${element.secret}_${imgSize}.jpg`;
            createImgLiElement(imgUrl, imgTarget);
        });
    }
}

// Function - Builds the image elements for display in gallery
function createImgLiElement(imgUrl, target) {
    const liEl = document.createElement('li');
    target.append(liEl);

    const aEl = document.createElement('a');
    aEl.href = imgUrl;
    aEl.target = 'blank';
    liEl.append(aEl);

    const imgEl = document.createElement('img');
    imgEl.src = `${imgUrl}`;
    aEl.append(imgEl);
}


// Function - Clears a node of all its children.
function removeChildElements(parentElement) {
    const parent = document.getElementById(parentElement)
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
}


// Back to top button functions
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}

function backToTopFunc() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 