const signUpBtn = document.getElementById('signUpBtn'),
	signUpForm = document.getElementById('signUpForm'),
	loginBtn = document.getElementById('loginBtn'),
	loginForm = document.getElementById('loginForm');

signUpBtn.addEventListener('click', () => {
	event.preventDefault();
	let request = new XMLHttpRequest();
	request.open('POST', '../api/v1/?do=signup');
	request.addEventListener('load', () => {
		localStorage.removeItem('user_id');
		localStorage.removeItem('untilDate');
		if (request.status === 200) {
			console.log(request.responseText);
			const data = JSON.parse(request.responseText);
			let singUpError = document.getElementById('singUpError');
			singUpError.style.display = 'block';
			if (data.ok === true && data.code === 200) {
				date = new Date();
				localStorage.setItem('user_id', data.result[0].unique_id);
				localStorage.setItem('untilDate', date.getTime());
				singUpError.innerText = 'Tizimga kirilmoqda...';
				setTimeout(function (argument) {
					window.location.href = '../profile';
				},2000)
			}else{
				singUpError.style.color = 'red';
				singUpError.innerText = data.message;
			}
		}else{
			singUpError.style.color = 'red';
			singUpError.innerText = "Set interval error";
		}
	});
	signUpFormData = new FormData(signUpForm);
	request.send(signUpFormData);
});

loginBtn.addEventListener('click', () => {
	event.preventDefault();
	let request = new XMLHttpRequest();
	request.open('POST', '../api/v1/?do=login');
	request.addEventListener('load', () => {
		localStorage.removeItem('user_id');
		localStorage.removeItem('untilDate');
		if (request.status === 200) {
			const data = JSON.parse(request.responseText);
			let loginError = document.getElementById('loginError');
			loginError.style.display = 'block';
			if (data.ok === true && data.code === 200) {
				date = new Date();
				localStorage.setItem('user_id', data.result.unique_id);
				localStorage.setItem('untilDate', date.getTime());
				loginError.innerText = 'Tizimga kirilmoqda...';
				setTimeout(function (argument) {
					window.location.href = '../profile';
				},2000);
			}else{
				loginError.style.color = 'red';
				loginError.innerText = data.message;
			}
		}else{
			loginError.style.color = 'red';
			loginError.innerText = "Set interval error";
		}
	});
	loginFormData = new FormData(loginForm);
	request.send(loginFormData);
});