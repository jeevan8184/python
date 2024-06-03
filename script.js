
const name=document.getElementById('name');
const rollno=document.getElementById('rollno');
const branch=document.getElementById('branch');
const section=document.getElementById('section');
const hobbies=document.getElementById('hobbies');
const friends=document.getElementById('friends');
const submitBtn=document.getElementById('btn1');
let value='';

const display=document.getElementById('display');
const get=document.getElementById('get');

function cancelFunction() {
    name.value='';
    rollno.value='';
    branch.value='AIML';
    section.value='';
    hobbies.value='';
    friends.value='';
}

async function getStudents() {
    try {
        const response=await fetch('http://localhost:5000/get_students',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            }
        })
        const data=await response.json();
        console.log('data',data);

        if(data) {

            const html=data.map((d,i)=> (
                    `<div class="article">
                        <div class="opt">
                            <p class="">Id : ${d[0]}</p>
                            <p class="">Name : ${d[1]}</p>
                            <p class="">RollNo : ${d[2]}</p>
                            <p class="">Branch : ${d[3]}</p>
                            <p class="">Section : ${d[4]}</p>
                            <p class="">hobbies : ${d[5]}</p>
                            <p class="">friends : ${d[6]}</p>
                        </div>
                            <button class="delete" onClick="deleteUser(${d[0]})">delete</button>
                            <button class="edit" onClick='EditUser(${JSON.stringify(d[0])})'>Edit</button>
                    </div>`
                )
            ).join('');

            get.innerHTML=html
        }

    } catch (error) {
      console.log(error)   
    }
}

function setStudent() {
    
    if(submitBtn.textContent==='Update') {
        updateStudent();
    }else {
        submitFunction();
    }
}

async function updateStudent() {

    try {
        const newVals={
            name:name.value,
            rollno:rollno.value,
            branch:branch.value,
            section:section.value,
            hobbies:hobbies.value,
            friends:friends.value
        }
        console.log('newVals',newVals);

        const response=await fetch(`http://localhost:5000/edit_student?id=${value}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(newVals)
        })
        const data=await response.json();
        console.log('update',data);

        if(data) {
            getStudents()
            value=''
        }
        
    } catch (error) {
        console.log(error);
    }
    submitBtn.textContent='Submit'
    cancelFunction()
}

async function submitFunction() {
    if(!name.value || !rollno.value || !section.value || !hobbies.value || !friends.value) return;

    try {
        const newVals={
                name:name.value,
                rollno:rollno.value,
                branch:branch.value,
                section:section.value,
                hobbies:hobbies.value,
                friends:friends.value
        }
        console.log(newVals);

        const response=await fetch('http://localhost:5000/add_student',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(newVals)
        })

        const data=await response.json();
        console.log('submit',data);

        if(data) {
            getStudents();
        }
        
    } catch (error) {
        console.log(error);
    }
    cancelFunction();
}

async function EditUser(id){

   try {
        const response=await fetch(`http://localhost:5000/get_student?id=${id}`,{
            method:'GET',
            headers:{
                'Content-type':'application/json'
            },
        })
        const newData=await response.json();
        const data=newData[0]

        if(data) {
            console.log('edit',data)
            
            name.value=data[1]
            rollno.value=data[2]
            branch.value=data[3]
            section.value=data[4]
            hobbies.value=data[5]
            friends.value=data[6]

            submitBtn.textContent='Update'
            value=id;
        }

   } catch (error) {
      console.log(error);
   }
}

async function deleteUser(id) {
    if(!id) return;
    console.log('id',id);
    try {
        const response=await fetch('http://localhost:5000/remove_student',{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:id})
        })
        if(response.ok) {
            const data=await response.json();
            console.log('delete',data);
            getStudents();
        }
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded',()=>getStudents());
