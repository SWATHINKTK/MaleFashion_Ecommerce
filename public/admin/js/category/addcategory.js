//***** Image View On Add Category Form *****
let cropperAddCategory;
let croppedImgAddCategory;
let srcAddCategoryImage;
function categoryImageView(event){
    const input = event;
    const imgTag = document.getElementById('category-img-view');

    if (input.files && input.files[0]) {

        const reader = new FileReader();
        reader.onload = function (e) {
            srcAddCategoryImage = e.target.result;
            imgTag.src = srcAddCategoryImage;

            document.getElementById('addCategoryImagePreview').style.display = 'block';
            imgTag.style.display = 'block';

        }
        reader.readAsDataURL(input.files[0]);
    }else{
        imgTag.style.display = 'none';
        document.getElementById('addCategoryImagePreview').style.display = 'none';
        imgTag.src = '';
    }

}

const addCategoroyCropperWindow = document.getElementById('addCategory-CropperWindowView');

if(addCategoroyCropperWindow){

    addCategoroyCropperWindow.addEventListener('click',(event)=>{
        event.preventDefault();

        const modal = document.getElementById('addCategory-cropper-modal');
        modal.style.display = 'block';

        const image = document.getElementById('addCategory-cropper-Image');
        image.src = srcAddCategoryImage;

        cropperAddCategory = new Cropper(image, {
            aspectRatio: NaN, // Allow freeform cropping
            viewMode: 0,      // Display the cropped area in the preview
        });
    })
}


// CROPPER RESULT GET BUTTON CLICK
const addCategorycropResult = document.getElementById('cropResult');

if(addCategorycropResult){
    addCategorycropResult.addEventListener('click', (event) => {
        event.preventDefault();

        if (cropperAddCategory) {
            const cropperCanvas = cropperAddCategory.getCroppedCanvas();

            if (cropperCanvas) {
                cropperCanvas.toBlob(async (blob) => {
                    const imageElement = document.getElementById("category-img-view");
                    imageElement.src = URL.createObjectURL(blob);
                    const customName = "cropped-Category.png";
                    const file = new File([blob], customName, { type: 'image/png' });
                    croppedImgAddCategory = file;

                });
            }

            cropperAddCategory.destroy(); // Move the destroy call here
        }

        // Hide the modal
        document.getElementById('addCategory-cropper-modal').style.display = "none";
    });
}


// CROPPER WINDOW OPEN MODAL CLOSE
function addCategoryCropperClose(){
    const modal = document.getElementById('addCategory-cropper-modal');
    modal.style.display = 'none';
    cropperAddBrand.destroy();
}


// ADD CATEGORY SUBMIT DATA 

document.getElementById("addCategoryForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const categoryname = document.getElementById('categoryname').value;
        const image = document.getElementById('categoryImage');
        console.log(image)
        const categoryDescription = document.getElementById('category-description').value;


        let validate = document.querySelectorAll('p[name="validate-category"]');

        if(categoryname.trim() === ''){

            validate[0].innerHTML = '* enter Brand name';
            validate[1].innerHTML = '';
            validate[2].innerHTML = '';

        }else if(image.files.length == 0){

            validate[0].innerHTML = '';
            validate[1].innerHTML = '* upload image';
            validate[2].innerHTML = '';

        }else if(categoryDescription.trim() === ''){

            validate[0].innerHTML = '';
            validate[1].innerHTML = '';
            validate[2].innerHTML = '* enter description';

        }
        else{

            const result = document.getElementById('category-submit-result');
            result.style.display = 'block';
            
            const form = document.getElementById('addCategoryForm');
            const formData = new FormData(form);

            if(croppedImgAddCategory){
                formData.set('categoryImage',croppedImgAddCategory);
            }

            fetch("/admin/addcategory", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    
                    if (data.status) {
                        result.setAttribute('class','alert alert-success');
                        result.innerHTML = data.message;
                        document.getElementById("addCategoryForm").reset();
                        document.getElementById('category-img-view').style.display = 'none';
                        document.getElementById('addCategoryImagePreview').style.display = 'none';

                    }else{
                        result.setAttribute('class','alert alert-danger');
                        result.innerHTML = data.message;
                    }
                })
                .catch((error) => {
                    console.log();
                    "Error:", error.message;
                });

                setTimeout(()=>{
                    result.style.display = 'none';
                },2000);
        }
});


function formReset(){
    window.location.href = '/admin/home';
    // document.getElementById("addCategoryForm").reset();
}

