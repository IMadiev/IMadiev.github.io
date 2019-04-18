let imgFile = null;
let okButton = document.getElementsByClassName('accept-image')[0];
okButton.addEventListener('click', acceptImage, false);

function handleFiles(files) {
    files = [...files];
    files.forEach(previewFile);
    imgFile=files[0]
}

function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        let img = document.createElement('img');
        img.src = reader.result;
        img.className+='img-responsive';
        let gallery = document.getElementById('gallery');
        while (gallery.firstChild){
            gallery.removeChild(gallery.firstChild)
        }
        gallery.appendChild(img)
    }
}

function acceptImage() {
    document.getElementById('gallery').removeChild(document.getElementById('gallery').firstChild);
    let reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onloadend = function() {
        let img = document.createElement('img');
        img.src = reader.result;
        img.className+='img-responsive';
        let imageWrapper = document.getElementById('image');
        while (imageWrapper.firstChild){
            imageWrapper.removeChild(imageWrapper.firstChild)
        }
        imageWrapper.appendChild(img)
    }
}

