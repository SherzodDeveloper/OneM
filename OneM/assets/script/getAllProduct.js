const products = document.getElementById('products');

function getAllProduct() {
	const request = new XMLHttpRequest();
	request.open('POST', './api/v1/?do=getAllProduct',true);
	request.addEventListener('load', function () {
		if (request.status === 200) {
			data = JSON.parse(request.responseText);
			if (data.ok === true && data.code === 200) {
				if (data.result.length > 0) {
					data.result.forEach((arg)=>{
						products.innerHTML+= `<div class="col-lg-3 col-md-4 col-sm-6" data-aos="zoom-in">
                        <div class="product-grid" style="max-width: 330px">
                            <div class="product-image bg-light">
                                <a href="./product/?product_id=${arg.id}" class="image">
                                    <img class="pic-1" style="height: 230px;" src="./uploads/${arg.img}">
                                </a>
                                <ul class="product-links">
                                    <li><a onclick='liked(${arg.id})' href="#" data-tip="Add to Favorites" class="likeToggle"><i class="Favorites fas fa-heart"></i></a></li>
                                </ul>
                            </div>
                            <div class="product-content">
                                <ul class="rating">
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="fas fa-star"></li>
                                    <li class="far fa-star"></li>
                                </ul>
                                <h3 class="title"><a href="#">${arg.name}</a></h3>
                                <div class="price">${arg.cost} So'm</div>
                                <a class="add-to-cart" href="#" onclick='liked(${arg.id})'>add to cart</a>
                            </div>
                        </div>
                    </div>`;
					});
				}
			}else{
				console.log("xato");
			}
		}else{
			console.log("xato");
		}
	});
	request.send();
}
getAllProduct();
function liked(id) {
    const request = new XMLHttpRequest();
    request.open('POST', `./api/v1/?do=likedProduct&product_id=${id}`,true);
    request.addEventListener('load', function () {
        if (request.status === 200) {
            data = JSON.parse(request.responseText);
            if (data.ok === true && data.code === 200) {
                // alert('success');
            }else{
                window.location.href = '../OneM/login/';
                console.log('error');
            }
            console.log(data);
        }
    });
    request.send();
}
price = document.querySelectorAll('.price');