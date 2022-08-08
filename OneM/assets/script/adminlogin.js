const send = document.getElementById('send'),
        form = document.querySelector('form');
send.onclick = () => {
    event.preventDefault();
    xhr = new XMLHttpRequest();
    xhr.open('POST', '../api/v1/?do=adminlogin');
    xhr.onload = () =>{
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            if (data.ok === true && data.code === 200) {
                date = new Date();
                localStorage.setItem('admin_unique_id', data.result.admin_unique_id);
                localStorage.setItem('adminUntilDate', date.getTime());
                window.location.href = './';
            }
        }
    }
    formData = new FormData(form);
    xhr.send(formData);
}