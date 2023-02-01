// Global Variables
let imgSize = '';
let backToTopBtn = document.getElementById("backToTop");

// The eventListner for the form search button
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
        // Clears the #errorDisplayDiv on valid search and refocus on #textInput
        document.querySelector('#errorDisplayDiv').innerText = '';
        document.querySelector('#textInput').focus();

        // Calls API fetch function with given parameters.
        getImageSearch(searchText, imgAmount, sortType);

    } else {
        // Clears the gallery and post an error message.
        removeChildElements('imageGallery');
        document.querySelector('#textInput').focus();
        document.querySelector('#errorDisplayDiv').innerText = 'You can not make an empty search!';

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
            // Post an error message on all server statuses that is not 200-299(Success).
            document.querySelector('#errorDisplayDiv').innerText = `Something went wrong, try again later. - ${error.message}`;
        });
}

// Function - Calls the createImgLiElement function and adds the response to the gallery.
function displayImages(imageInfo) {
    const imgTarget = document.querySelector('#imageGallery');

    // Clears the Image gallery
    removeChildElements('imageGallery');

    // Checks if there is any images to display.
    if (imageInfo.photos.photo.length === 0) {
        document.querySelector('#errorDisplayDiv').innerText = 'No images could be found for this search.';

    } else {
        imageInfo.photos.photo.forEach(element => {
            const imgUrl = `https://live.staticflickr.com/${element.server}/${element.id}_${element.secret}_${imgSize}.jpg`;
            createImageElements(imgUrl, imgTarget);
        });
    }
}

// Function - Builds the image elements for display in gallery
function createImageElements(imgUrl, target) {
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


// Back to top button functions - 
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}

document.querySelector('#backToTop').addEventListener('click', backToTopFunc);

function backToTopFunc() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 
