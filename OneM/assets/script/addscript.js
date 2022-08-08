const element = document.getElementById("error"),
    createCategoryBtn = document.getElementById('createCategory'),
    createCategoryForm = document.getElementById('createCategoryForm');
createCategoryBtn.onclick = () => {
    event.preventDefault();
    xhr = new XMLHttpRequest();
    xhr.open('POST', '../api/v1/?do=createCategory',true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            if (data.ok === true && data.code === 200) {
                const empt = document.querySelectorAll('.empt');
                empt.forEach((item) => {
                    item.value = ""; 
                });
                element.innerHTML = `
                <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-primary d-flex align-items-center fixed-bottom" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                    </svg> &nbsp;
                    <div>
                        CATEGORY successfuly added
                    </div>
                </div>`;
              
              setTimeout(() => {
                element.style.visibility = 'hidden';
              }, 2000);

                // alert(data.message);
            }else{
                element.innerHTML = `
                <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                  </svg>
                 &nbsp;
                    <div>
                        so'rov yuborishda xatolik
                    </div>
                </div>`;
              
              setTimeout(() => {
                element.style.visibility = 'hidden';
              }, 2000);
            }
        }else{
            element.innerHTML = `
                <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-success d-flex align-items-center fixed-bottom" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                </svg>
                &nbsp;
                    <div>
                        texnik xatolik (masalan url noto'g'ri)
                    </div>
                </div>`;
                setTimeout(() => {
                    element.style.visibility = 'hidden';
                    }, 2000);
        }
    }
    formData = new FormData(createCategoryForm)
    xhr.send(formData);
}
/* ADD PRODUCT */

window.addEventListener('load',function(){
    const allCategory = document.getElementById('allCategory');
    xhr = new XMLHttpRequest();
    xhr.open('POST', '../api/v1/?do=getAllCategory',true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            if (data.ok === true && data.code === 200) {
                data.result.forEach((arg) => {
                    console.log(arg);
                    // let Cname = arg.name;
                    allCategory.innerHTML += `<option value="${arg.name}">${arg.name}</option>`
                    document.getElementById('Categorys').innerHTML += `<div class="card mb-3" style="max-width: 700px;">
                        <div class="row g-0">
                        <div class="col-md-4">
                            <img src="../uploads/${arg.img}" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                            <h5 class="card-title">${arg.name}</h5>
                            <p class="card-text">${arg.des}</p>
                            <a href='../api/v1/?do=deleteCategory&category_id=${arg.id}' id="delProd">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16" class="ml-5">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                            </a>
                            </div>
                        </div>
                        </div>
                    </div>`;
                    
                });
            }else{
                element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-success d-flex align-items-center fixed-bottom" role="alert">
                    &nbsp;
                        <div>
                             sorov yuborishda xatolik masalan (nimadur mavjud emas)
                        </div>
                    </div>`;
                    setTimeout(() => {
                        element.style.visibility = 'hidden';
                      }, 2000);
            }
        }else{
            element.innerHTML = `
            <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-success d-flex align-items-center fixed-bottom" role="alert">
            &nbsp;
                <div>
                     tehnik xatolik
                </div>
            </div>`;
            setTimeout(() => {
                element.style.visibility = 'hidden';
              }, 2000);
        }
    }
    xhr.send();


    // product screen
    requst = new XMLHttpRequest();
    requst.open('POST', '../api/v1/?do=getAllProduct',true);
    requst.onload = () => {
        if (requst.status === 200) {
            data = JSON.parse(requst.responseText);
            if (data.ok === true && data.code === 200) {
                data.result.forEach((arg) => {
                    console.log(arg);
                    document.getElementById('Products').innerHTML += ` <div class="col-md-6" >
                    <div class="card mb-3"> 
                      <div class="swiffy-slider border">
                        <ul class="slider-container" style="padding: 10%;">
                            <li class="px-5"><img class="img-fluid" src="../uploads/${arg.img}" style="max-width: 100%;height: auto;"></li>
                            <li class="px-5"><img class="img-fluid" src="../uploads/${arg.img1}" style="max-width: 100%;height: auto;"></li>
                            <li class="px-5"><img class="img-fluid" src="../uploads/${arg.img2}" style="max-width: 100%;height: auto;"></li>
                        </ul>
                        <button type="button" class="slider-nav"></button>
                        <button type="button" class="slider-nav slider-nav-next"></button>
                        <div class="slider-indicators">
                            <button class="active bg-dark"></button>
                            <button class="bg-dark"></button>
                            <button class="bg-dark"></button>
                        </div>
                    </div>
                      <div class="card-body">
                        <h3 class="card-title">${arg.category_id}</h3>

                        <h5 class="card-title">${arg.name}</h5>
                        <p class="card-text">${arg.des}</p>
                        <p class="card-text">UZS:<b>${arg.cost}</b> so'm</p>
                        <a href="../api/v1/?do=deleteProduct&product_id=${arg.id}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16" class="ml-5">
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg></a>
                      </div>
                    </div>
                  </div>`;
                });
            }else{
                element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                    &nbsp;
                        <div>
                            So'rov yuborishda xatolik
                        </div>
                    </div>`;

                setTimeout(() => {
                    element.style.visibility = 'hidden';
                    }, 2000);
            }
        }else{
            element.innerHTML = `
                <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                &nbsp;
                    <div>
                        Texnik xatolik
                    </div>
                </div>`;
            setTimeout(() => {
                element.style.visibility = 'hidden';
                }, 2000);
        }
    }
    requst.send();
});


const addProductBtn = document.getElementById('addProductBtn'),
    addProductForm = document.getElementById('addProductForm');
addProductBtn.onclick = () => {
    const allCategory = document.getElementById('allCategory');
    if (allCategory.value) {
        event.preventDefault();
        xhr = new XMLHttpRequest();
        xhr.open('POST', '../api/v1/?do=addProduct',true);
        console.log(data);
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log(xhr);
                data = JSON.parse(xhr.responseText);
                if (data.ok === true && data.code === 200) {
                    const empt = document.querySelectorAll('.empt');
                    empt.forEach( (item) => {
                        item.value = ""; 
                    });
                    element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-success d-flex align-items-center fixed-bottom" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                    </svg>
                    &nbsp;
                        <div>
                            Product muvaffaqiyatli qo'shildi
                        </div>
                    </div>`;
              
              setTimeout(() => {
                element.style.visibility = 'hidden';
              }, 2000);
                    // alert(data.message);
                }else{
                    element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                    &nbsp;
                        <div>
                            So'rov yuborishda xatolik
                        </div>
                    </div>`;
                    setTimeout(() => {
                        element.style.visibility = 'hidden';
                        }, 2000);
                }
            }else{
                element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-success d-flex align-items-center fixed-bottom" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                    </svg>
                    &nbsp;
                        <div>
                            texnik xatolik (masalan url notogri)
                        </div>
                    </div>`;
                    setTimeout(() => {
                        element.style.visibility = 'hidden';
                      }, 2000);
            }
        }
        formData = new FormData(addProductForm);
        xhr.send(formData);
    }else{
        element.innerHTML = `
        <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
        &nbsp;
            <div>
                Kategoriyani tanlang
            </div>
        </div>`;
        setTimeout(() => {
            element.style.visibility = 'hidden';
            }, 2000);
    }
}

// change cashback
const changeCashbackBtn = document.getElementById('changeCashbackBtn'),
      changeCashbackform = document.getElementById('changeCashbackform');
changeCashbackBtn.onclick = () => {
    event.preventDefault();
    xhr = new XMLHttpRequest();
    xhr.open('POST', '../api/v1/?do=changeCashback',true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            if (data.ok === true && data.code === 200) {
                const empt = document.querySelectorAll('.empt');
                empt.forEach( (item) => {
                    item.value = ""; 
                });
                console.log(data);
                element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                    &nbsp;
                        <div>
                            So'rov yuborishda xatolik
                        </div>
                    </div>`;
                    setTimeout(() => {
                        element.style.visibility = 'hidden';
                        }, 2000);
                // alert(data.message);
            }else{
                element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                    &nbsp;
                        <div>
                            So'rov yuborishda xatolik
                        </div>
                    </div>`;
                    setTimeout(() => {
                        element.style.visibility = 'hidden';
                        }, 2000);
            }
        }else{
            element.innerHTML = `
                    <div style="width: 290px; position: absolute; z-index: 9999;" class="alert alert-danger d-flex align-items-center fixed-bottom" role="alert">
                    &nbsp;
                        <div>
                            texnik xatolik
                        </div>
                    </div>`;
                    setTimeout(() => {
                        element.style.visibility = 'hidden';
                        }, 2000);
        }
    }
    formData = new FormData(changeCashbackform)
    xhr.send(formData);
}