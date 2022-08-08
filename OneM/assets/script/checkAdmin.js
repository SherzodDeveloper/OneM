function checkAdmin() {
	console.log("sckdsjk");
	const admin_unique_id = localStorage.getItem('admin_unique_id') ?? 0,
		adminUntilDate = localStorage.getItem('adminUntilDate') ?? 0,
		now = new Date();
	if (now.getTime() - adminUntilDate >= 864000) {
		localStorage.removeItem('admin_unique_id');
		localStorage.removeItem('adminUntilDate');
		window.location.href = "./login.html";
		return false;
	}
	const request = new XMLHttpRequest();
	request.open('POST', `../api/v1/?do=checkAdmin&admin_unique_id=${admin_unique_id}`,true);
	request.addEventListener('load', function (argument) {
		if (request.status === 200) {
			data = JSON.parse(request.responseText);
			if (data.ok === true && data.code === 200) {
				return true;
			}else{
				window.location.href = "./login.html";
				return false;
			}
		}else{
			window.location.href = "./login.html";
			return false;
		}
	});
	request.send();
	return true;
}
checkAdmin();