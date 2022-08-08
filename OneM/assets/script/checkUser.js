let userData = null;
function checkUser() {
	const userUniqueId = localStorage.getItem('user_id') ?? 0,
		untilDate = localStorage.getItem('untilDate') ?? 0,
		now = new Date();
	if (now.getTime() - untilDate >= 864000) {
		localStorage.removeItem('user_id');
		localStorage.removeItem('untilDate');
		window.location.href = "../login/";
		return false;
	}
	const request = new XMLHttpRequest();
	request.open('POST', `../api/v1/?do=checkUser&unique_id=${userUniqueId}`,true);
	request.addEventListener('load', function (argument) {
		if (request.status === 200) {
			data = JSON.parse(request.responseText);
			if (data.ok === true && data.code === 200) {
				userData = data;
				return data;
			}else{
				window.location.href = "../login/";
				return false;
			}
		}else{
			window.location.href = "../login/";
			return false;
		}
	});
	request.send();
	return true;
}
checkUser();