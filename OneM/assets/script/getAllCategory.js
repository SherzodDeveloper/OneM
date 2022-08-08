window.addEventListener('load', function () {
	const categorys = document.getElementById('categorys'),
		request = new XMLHttpRequest();
	request.open('POST', './api/v1/?do=getAllCategory',true);
	request.addEventListener('load', function() {
		if (request.status === 200) {
			data = JSON.parse(request.responseText);
			if (data.ok === true && data.code === 200) {
				if (data.result.length > 0) {
					data.result.forEach(function (arg) {
						categorys.innerHTML += `
						<div class="col col-lg-2 col-md-3 col-sm-4 col-6">
                            <div class="p-2">
                                <a href="./categorys/category_id=${arg.id}" class="text-decoration-none">
                                    <img src="./uploads/${arg.img}" class="sct-img img-fluid" alt="${arg.name}"><br>
                                    <small>${arg.name}</small>
                                </a>
                            </div>
                        </div>`;
					});
				}
			}
		}
	});
	request.send();	
});	