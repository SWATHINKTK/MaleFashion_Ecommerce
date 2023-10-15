// Block or Un Bublock button to Confirmation Modal Display
function userList(value){
    document.getElementById('modal').style.display = 'block';

    // Button preset Row to taken the Categoryname for uniqueness
    const row = value.parentElement.parentElement;
    const id = row.cells[5]
    console.log('aa',id,'bb',row)

    // Adding Data to the Ok button 
    document.getElementById('user-sucess').setAttribute("data-category-id",id.getAttribute('id'));  
}


// Modal Back Button Functionality Working Method
function back(){
    document.getElementById('modal').style.display = 'none';
}


// Modal OK Button Functionality To Block or UnBlock User
function userBlock(){
    document.getElementById('modal').style.display = 'none';

    // Retrieve the Data From OK Button 
    const buttonId = document.getElementById('user-sucess').getAttribute('data-category-id');
    const element = document.querySelector(`td[id="${buttonId}"]`);

    const data = {
        id:buttonId
    }
    const json = JSON.stringify(data)
    console.log(json)
    fetch('/admin/blockuser',{
        method: 'PATCH',
        body: json,
        headers: {'Content-Type':'application/json'}
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.user){
            element.innerHTML = '<button class="btn  btn-outline-danger pl-4 pr-4" id="<%= data[i]._id %>" onclick="userList(this)">Block</button>';
        }else{
            element.innerHTML = '<button class="btn btn-outline-success pl-3 pr-3" id="<%= data[i]._id %>" onclick="userList(this)">Unblock</button>';
        }
        
    }).catch((error) => {
        console.log(error.message);
    })
}




// Searching the User Based on name
function searchUser(){

    const  searchData = document.getElementById('categorySearch').value; 
    window.location.href = `/admin/searchuser?search=${searchData}`;
   
    // const url = '/admin/searchuser';
    // const post = {
    //     method:'POST',
    //     body: JSON.stringify({'search':`${searchData}`}),
    //     headers:{'Content-Type':'application/json'}
    // }

    // fetch(url,post)

    // .then((response) => {
    //     if(!(response.ok)){
    //         window.location.href = '/admin/error500';
    //     }
    //     return response.text();
    // })

    // .then((data) => {
    //     console.log(data)
    //     var parser = new DOMParser();
    //     var doc = parser.parseFromString(data, 'text/html');
    //     var html = doc.querySelector('#userview')
    //     console.log(html)

    //     document.getElementById("dynamic_page").innerHTML = html;
    // }).catch((error) => {
    //     console.log(error.message)
    // })

}




