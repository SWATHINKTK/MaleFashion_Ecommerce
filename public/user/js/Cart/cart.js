// ***** PRODUCT ADD TO CART *****
async function addToCart(eventTag){

    try{

        const productId = eventTag.getAttribute('data-product-id');

        const productPrice = document.getElementById('product-price').innerHTML;

        const productQuantity = document.getElementById('product-quanitity') ? document.getElementById('product-quanitity').value : 1;

        const url = '/api/addToCart';

        const requestOption = {
            method:'POST',
            body:JSON.stringify({
                id:productId,
                quantity:productQuantity,
                price : productPrice
            }),
            headers:{'Content-Type':'application/json'}
        }



        const response = await fetch(url,requestOption);
        
            if(!response.ok){
                window.location.href = '/error500';
            }

        const data = await response.json();

                if(data.status){
                    const addToCart = document.getElementById('addToCart');

                    addToCart.innerHTML = '<a href="/api/cart" class="btn btn btn-warning rounded-pill btn-addToCart"><i class="bi bi-cart3 fa-lg text-dark"></i> Go To Cart</a>'
                }

    }catch(error){

        console.log(error.message);

    }

}


document.addEventListener('DOMContentLoaded',()=>{


    // *******  QUNATITY UPDATE TO THE CART PRODUCT ********

    const quanitityUpdate = document.querySelectorAll('input[name="quanitity"]');


    quanitityUpdate.forEach((changeInputField)=>{

        changeInputField.addEventListener('click' , (event)=>{

            const productQuanitity = event.target.value;

            const parent = event.target.parentNode;
            const oldData = parent.querySelector('#oldData');
            const oldQuantity = oldData.value;

            
            if(oldQuantity == 10 && productQuanitity == 10){

                Swal.fire({
                    text: 'Sorry ! Only 10 unit(s) allowed in each order',
                    icon: 'warning',
                    showConfirmButton: false, 
                    timer: 2500,
                    customClass: {
                        icon: 'my-custom-icon-class', 
                        content: 'my-custom-content-class', 
                      }, 
                  });
                  event.target.value = oldQuantity;
                  return;

            }else if(oldQuantity == 1 && productQuanitity == 1){

                Swal.fire({
                    text: 'Sorry ! this is not allowed',
                    icon: 'warning',
                    showConfirmButton: false, 
                    timer: 2500,
                    customClass: {
                        icon: 'my-custom-icon-class', 
                        content: 'my-custom-content-class', 
                      }, 
                  });
                  event.target.value = oldQuantity;
                  return;
            }

        })




        changeInputField.addEventListener('change', async(event) => {

            try{

                const productId = event.target.getAttribute('data-cart-product-id');
                const productQuanitity = event.target.value;


                const parent = event.target.parentNode;
                const oldData = parent.querySelector('#oldData');
                const oldQuantity = oldData.value;
                const price = oldData.getAttribute('name');

                const priceUpdate = document.querySelectorAll('span[name="cart-price"]');
                const totalAmount = parseFloat(priceUpdate[0].innerHTML);


                if(productQuanitity > 10 ){
                    Swal.fire({
                        text: 'Sorry ! Only 10 unit(s) allowed in each order',
                        icon: 'warning',
                        showConfirmButton: false, 
                        timer: 2500,
                        customClass: {
                            icon: 'my-custom-icon-class', 
                            content: 'my-custom-content-class', 
                          }, 
                      });
                      event.target.value = oldQuantity;
                      return;

                }else if(productQuanitity < 1){

                    Swal.fire({
                        text: 'Sorry ! this is not allowed',
                        icon: 'warning',
                        showConfirmButton: false, 
                        timer: 2500,
                        customClass: {
                            icon: 'my-custom-icon-class', 
                            content: 'my-custom-content-class', 
                          }, 
                      });
                      event.target.value = oldQuantity;
                      return;
                }



                const url = '/api/cartQuantityUpdate';

                const requestOption = {
                    method: 'PATCH',
                    body: JSON.stringify({
                        id: productId,
                        quantity : productQuanitity
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }


                const response = await fetch(url,requestOption);

                    if(!response.ok){
                        Window.location.href = '/error500';
                    }

                const responseData = await response.json();

                    if(responseData.status){

                        let newPrice;
                        if( productQuanitity > oldQuantity){
                            
                            console.log(totalAmount,productQuanitity,oldQuantity,price)

                            newPrice = totalAmount + parseInt(((productQuanitity - oldQuantity) * price));


                        }else{

                            newPrice = totalAmount - ((oldQuantity - productQuanitity) * price);

                        }
                        oldData.value = productQuanitity
        
                        priceUpdate[0].innerText = newPrice;
                        priceUpdate[1].innerText = newPrice;

                        Swal.fire({
                            text: 'Quantity Updated!',
                            icon: 'success',
                            showConfirmButton: false, 
                            timer: 1000,
                            customClass: {
                                icon: 'my-custom-icon-class', 
                                content: 'my-custom-content-class', 
                              }, 
                          });


                    }else{

                        Swal.fire({
                            text: 'Quantity Not Updated!',
                            icon: 'error',
                            showConfirmButton: false, 
                            timer: 1000,
                          });

                    }

            }catch(error){

                console.log(error.message);
            }
        
        })
    });





    // ******* CART REMOVE PRODUCTS ***********
    const productRemove = document.querySelectorAll('button[name="cart-product-delete"]');

    productRemove.forEach((button) => {

        button.addEventListener('click', async(event) => {

            document.getElementById('modalremoveCart').style.display = 'block';
            
            const productId = event.target.getAttribute('data-cart-product-id');

            const okButton = document.getElementById('deleteCartModalOk');
            okButton.setAttribute('data-product-id',`${productId}`);

        })
    })

})

async function successCartProduct(button){

   
    try{

        const productId = button.getAttribute('data-product-id');
    

        const url = `/api/deleteCartProduct${productId}`;

        const requestOption = {
            method:'DELETE',
            headers:{'Content-Type': 'application/json'}
        }

        const response = await fetch(url,requestOption);

            if(!response.ok){
                window.location.href = '/error500';
            }

        const responseData = await response.json();

            if(responseData.status){
                const productDiv = document.getElementById(`${productId}`);
                document.getElementById('modalremoveCart').style.display = 'none';
                productDiv.remove();
            }

    }catch(error){

        console.log(error.message)
    }

}


function removeModalCart(){
    document.getElementById('modalremoveCart').style.display = 'none';
}


   // Swal.fire({
            //     title: 'Are you sure?',
            //     text: "You won't be able to revert this!",
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3085d6',
            //     cancelButtonColor: '#d33',
            //     confirmButtonText: 'Yes, delete it!'
            //   }).then((result) => {
            //     if (result.isConfirmed) {
            //       // The "OK" button was clicked
            //       // Add your code to handle the "OK" button event here
            //       Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            //     }
            //   });

            //   const button = document.querySelector('.swal2-confirm');
            //   console.log(button)
              