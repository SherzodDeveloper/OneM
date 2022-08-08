<?php
	error_reporting(0);
	session_start();
	$data = ['ok'=>false, 'code'=>null, 'message'=>null, 'result'=>[]];
	require './config/config.php';
	if (isset($_REQUEST['do'])) {
		$db = new dbmysqli;
		$db->dbConnect();
		if ($_REQUEST['do'] == 'adminlogin') {
			if (isset($_REQUEST['login']) && isset($_REQUEST['password'])) {
				$login = $_REQUEST['login'];
				$password = $_REQUEST['password'];
				$result = $db->selectWhere('admin',[
					[
						'login'=>$login,
						'cn'=>'='
					],
					[
						'admin_password'=>$password,
						'cn'=>'='
					]
				]);
				if ($result->num_rows) {
					$row = mysqli_fetch_assoc($result);
					if (mysqli_real_escape_string($db-> connectionString, $password) == $row['admin_password']) {
						$data['ok'] = true;
						$data['code'] = 200;
						$data['message'] = 'login successfully';
						foreach ($result as $key => $value) $data['result'][] = $value;
						$_SESSION['admin_unique_id'] = $data["result"][0]["admin_unique_id"];
						setcookie('admin_unique_id', $data["result"][0]["admin_unique_id"], time()+ 60 * 60 * 24 * 10);
					}
				}else{
					$data['code'] = 402;
					$data['message'] = "invaled authorization token";
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'login and password is requered';
			}
		}else if($_REQUEST['do'] == 'checkAdmin'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					$data['ok'] = true;
					$data['code'] = 200;
					$data['message'] = 'admin confirmed';
					$data['result'][] = mysqli_fetch_assoc($result);
				}else{
					$data['code'] = 403;
					$data['message'] = 'invaled authorization token';
					session_destroy();
					setcookie('admin_unique_id','', time() - 100);
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'createCategory'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					if (isset($_REQUEST['name']) && isset($_REQUEST['description']) && isset($_FILES['img'])) {
						$allowed = array('png','jpg','jpeg','jfif');
						$filename = $_FILES['img']['name'];
						$ext = pathinfo($filename, PATHINFO_EXTENSION);
						if (in_array($ext, $allowed)) {
							$filename = trim($_FILES['img']['name']);
							if (file_exists('../../uploads/' . $filename)) $filename = time() . $filename;
							move_uploaded_file($_FILES['img']['tmp_name'], '../../uploads/' . $filename);
							$db->insertInto('category',[
								'name'=>trim($_REQUEST['name']),
								'des'=>trim($_REQUEST['description']),
								'img'=>$filename,
							]);
							$result = $db->selectWhere('category',[
								[
									'id'=>0,
									'cn'=>'>'
								],
							]);
							foreach ($result as $key => $value);
							$data['ok'] = true;
							$data['code'] = 200;
							$data['message'] = 'Category inserted successfully';
							$data['result'][] = $value;
						}else{
							$data['code'] = 407;
							$data['message'] = 'File type: JPG,PNG,JPEG,JFIF';
						}
					}else{
						$data['code'] = 402;
						$data['message'] = 'Category name, description and img is requered';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'getAllCategory'){
			$result = $db->selectWhere('category',[
				[
					'id'=>0,
					'cn'=>'>'
				],
			],"ORDER BY id DESC");
			if ($result->num_rows) {
				$data['ok'] = true;
				$data['code'] = 200;
				$data['message'] = 'Category count: ' . $result->num_rows;
				foreach ($result as $key => $value) $data['result'][] = $value;
			}
		}else if($_REQUEST['do'] == 'getAllProduct'){
			$result = $db->selectWhere('product',[
				[
					'id'=>0,
					'cn'=>'>'
				],
			],"ORDER BY id DESC");
			if ($result->num_rows) {
				$data['ok'] = true;
				$data['code'] = 200;
				$data['message'] = 'Product count: ' . $result->num_rows;
				foreach ($result as $key => $value) $data['result'][] = $value;
			}else{
				$data['code'] = 404;
				$data['message'] = 'Product is empty';
			}
		}else if($_REQUEST['do'] == 'getAllProductFromCategory'){
			if (isset($_REQUEST['category_id'])) {
				$result = $db->selectWhere('product',[
					[
						'category_id'=>trim($_REQUEST['category_id']),
						'cn'=>'='
					],
				],"ORDER BY id DESC");
				if ($result->num_rows) {
					$data['ok'] = true;
					$data['code'] = 200;
					$data['message'] = "Product count: " . $result->num_rows;
					foreach ($result as $key => $value) $data['result'][] = $value;
				}else{
					$data['code'] = 404;
					$data['message'] = "Category is empty";
				}
			}else{
				$data['code'] = 402;
				$data['message'] = "Category is requered";
			}
		}else if($_REQUEST['do'] == 'getProductFromId'){
			if (isset($_REQUEST['product_id'])) {
				$result = $db->selectWhere('product',[
					[
						'id'=>trim($_REQUEST['product_id']),
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					$data['ok'] = true;
					$data['code'] = 200;
					$data['result'][] = mysqli_fetch_assoc($result);
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'category_id is requered';
			}
		}else if($_REQUEST['do'] == 'getLikedProduct'){
			$unique_id = $_REQUEST['unique_id'] ?? $_SESSION['unique_id'] ?? $_COOKIE['unique_id'];
			if (isset($unique_id)) {
				$user = $db->selectWhere('users',[
					[
						'unique_id'=>$unique_id,
						'cn'=>'='
					],
				]);
				if ($user->num_rows) {
					$likedproduct = $db->selectWhere('likedproduct',[
						[
							'user_id'=>$unique_id,
							'cn'=>'='
						],
					]);
					if ($likedproduct->num_rows) {
						$data['ok'] = true;
						$data['code'] = 200;
						$data['message'] = 'likedproduct count: ' . $likedproduct->num_rows;
						foreach ($likedproduct as $key => $value) $data['result'][] = $value;
					}else{
						$data['code'] = 404;
						$data['message'] = 'likedproduct is empty';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'deleteCategory'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					if (isset($_REQUEST['category_id'])) {
						$oncecategory = mysqli_fetch_assoc($db->selectWhere('category',[
							[
								'id'=>trim($_REQUEST['category_id']),
								'cn'=>'='
							],
						]));
						unlink('../../uploads/' . $oncecategory['img']);
						$delete = $db->delete('category',[
							[
								'id'=>trim($_REQUEST['category_id']),
								'cn'=>'='
							],
						]);
						$delete = $db->delete('product',[
							[
								'id'=>trim($_REQUEST['category_id']),
								'cn'=>'='
							],
						]);
						$result = $db->selectWhere('category',[
							[
								'id'=>0,
								'cn'=>'>'
							],
						]);
						if ($result->num_rows) {
							$data['ok'] = true;
							$data['code'] = 200;
							$data['message'] = 'Product count: ' . $result->num_rows;
							foreach ($result as $key => $value) $data['result'][] = $value;
						}else{
							$data['code'] = 402;
							$data['message'] = 'Category empty';
						}
					}else{
						$data['code'] = 402;
						$data['message'] = 'category_id is requered';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'addProduct'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					if (isset($_REQUEST['category_name']) && isset($_REQUEST['name']) && isset($_REQUEST['description']) && isset($_REQUEST['cost']) && isset($_FILES['img']) && isset($_FILES['img1']) && isset($_FILES['img2']) ) {
						$allowed = array('png','jpg','jpeg','jfif');
						$filename = trim($_FILES['img']['name']);
						$filename1 = trim($_FILES['img1']['name']);
						$filename2 = trim($_FILES['img2']['name']);
						$ext = pathinfo($filename, PATHINFO_EXTENSION);
						$ext1 = pathinfo($filename, PATHINFO_EXTENSION);
						$ext2 = pathinfo($filename, PATHINFO_EXTENSION);
						if (in_array($ext, $allowed) && in_array($ext1, $allowed) && in_array($ext2, $allowed)) {
							if (file_exists('../../uploads/' . $filename)) $filename = rand(time(),10000) . $filename;
							if (file_exists('../../uploads/' . $filename1)) $filename1 = rand(time(),10000) . $filename1;
							if (file_exists('../../uploads/' . $filename2)) $filename2 = rand(time(),10000) . $filename2;
							$result = mysqli_fetch_assoc($db->selectWhere('category',[
								[
									'name'=>trim($_REQUEST['category_name']),
									'cn'=>'='
								],
							]));
							$delivery = $_REQUEST['delivery'] ?? 0;
							$db->insertInto('product',[
								'category_id'=>$result["id"],
								'name'=>trim($_REQUEST['name']),
								'des'=>trim($_REQUEST['description']),
								'cost'=>trim($_REQUEST['cost']),
								'img'=>trim($filename),
								'img1'=>trim($filename1),
								'img2'=>trim($filename2),
								'delivery'=>$delivery,
							]);
							move_uploaded_file($_FILES['img']['tmp_name'], "../../uploads/" . $filename);
							move_uploaded_file($_FILES['img1']['tmp_name'], "../../uploads/" . $filename1);
							move_uploaded_file($_FILES['img2']['tmp_name'], "../../uploads/" . $filename2);
							$result = $db->selectWhere('product',[
								[
									'id'=>0,
									'cn'=>'>'
								],
							]);
							foreach ($result as $key => $value);
							$data['ok'] = true;
							$data['code'] = 200;
							$data['message'] = 'Product added successfully';
							$data['result'][] = $value;
						}else{
							$data['code'] = 407;
							$data['message'] = 'File type: JPG,PNG,JPEG,JFIF';
						}
					}else{
						$data['code'] = 402;
						$data['message'] = 'category_name name, description, cost, img, img1, img2 is requered';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'changeCashback'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					if (isset($_REQUEST['cashback'])) {
						$upd = $db->update('cashback',[
							'percent'=>trim($_REQUEST['cashback']),
						],[
							'id'=>1,
							'cn'=>'='
						]);
						$result = $db->selectWhere('cashback',[
							[
								'id'=>1,
								'cn'=>'='
							],
						]);
						$data['ok'] = true;
						$data['code'] = 200;
						$data['message'] = 'Cashback changed successfully';
						$data['result'][] = mysqli_fetch_assoc($result);
					}else{
						$data['code'] = 402;
						$data['message'] = 'Cashback is requered';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'deleteProduct'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					if (isset($_REQUEST['product_id'])) {
						$onceproduct = mysqli_fetch_assoc($db->selectWhere('product',[
							[
								'id'=>trim($_REQUEST['product_id']),
								'cn'=>'='
							],
						]));
						unlink('../../uploads/' . $onceproduct['img']);
						unlink('../../uploads/' . $onceproduct['img1']);
						unlink('../../uploads/' . $onceproduct['img2']);
						$delete = $db->delete('product',[
							[
								'id'=>trim($_REQUEST['product_id']),
								'cn'=>'='
							],
						]);
						$result = $db->selectWhere('product',[
							[
								'id'=>0,
								'cn'=>'>'
							],
						]);
						if ($result->num_rows) {
							$data['ok'] = true;
							$data['code'] = 200;
							$data['message'] = 'Product count: ' . $result->num_rows;
							foreach ($result as $key => $value) $data['result'][] = $value;
						}else{
							$data['code'] = 402;
							$data['message'] = 'Product empty';
						}
					}else{
						$data['code'] = 402;
						$data['message'] = 'product_id is requered';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}else if($_REQUEST['do'] == 'signup'){
			if (isset($_REQUEST['name']) && isset($_REQUEST['username']) && isset($_REQUEST['password']) && isset($_REQUEST['repeatpassword']) && isset($_REQUEST['mail'])) {
				if ($_REQUEST['password'] === $_REQUEST['repeatpassword']) {
					if (filter_var($_REQUEST['mail'],FILTER_VALIDATE_EMAIL)) {
						if (preg_match('/[A-Za-z0-9]$/', trim($_REQUEST['username']))) {
							$username = $db->selectWhere('users',[
								[
									'username'=>trim($_REQUEST['username']),
									'cn'=>	'='
								],
							]);
							$mail = $db->selectWhere('users',[
								[
									'mail'=>trim($_REQUEST['mail']),
									'cn'=>'='
								],
							]);
							if (!$username->num_rows) {
								if (!$mail->num_rows) {
									$id = explode(".",uniqid(time()-rand(0,999), true))[0];
									$invited_id = $_SESSION['invited_id'] ?? null;
									$db->insertInto('users',[
										'unique_id'=>$id,
										'name'=>trim($_REQUEST['name']),
										'username'=>trim($_REQUEST['username']),
										'pass_word'=>$_REQUEST['password'],
										'mail'=>$_REQUEST['mail'],
										'phone'=>'',
										'card'=>'',
										'invited_id'=>$invited_id,
										'token'=>md5(uniqid(trim($_REQUEST['username']), true)),
									]);
									if (isset($_REQUEST['remember'])) {
										setcookie('unique_id', $id, time() + 86400);
									}
									$_SESSION['unique_id'] = $id;
									$user = $db->selectWhere('users',[
										[
											'unique_id'=>$_SESSION['unique_id'],
											'cn'=>'='
										],
									]);
									$data['ok'] = true;
									$data['code'] = 200;
									$data['message'] = "Registered successfully";
									$data['result'][] = mysqli_fetch_assoc($user);
								}else{
									$data['code'] = 403;
									$data['message'] = trim($_REQUEST['mail']) . ' this mail already exists';
								}
							}else{
								$data['code'] = 403;
								$data['message'] = trim($_REQUEST['username']) . ' this username already exists';
							}
						}else{
							$data['code'] = 403;
							$data['message'] = trim($_REQUEST['username']) . ' this username is invalid';
						}
					}else{
						$data['code'] = 403;
						$data['message'] = trim($_REQUEST['mail']) . ' this mail is invalid';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invalid repeat password';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = "name,username,password,repeatpassword, mail is requered";
			}
		}else if($_REQUEST['do'] == 'login'){
			if (isset($_REQUEST['password']) && isset($_REQUEST['username'])) {
				$mail = $db->selectWhere('users',[
					[
						'mail'=>trim($_REQUEST['username']),
						'cn'=>'='
					],
					[
						'pass_word'=>trim($_REQUEST['password']),
						'cn'=>'='
					],
				]);
				$username = $db->selectWhere('users',[
					[
						'username'=>trim($_REQUEST['username']),
						'cn'=>'='
					],
					[
						'pass_word'=>trim($_REQUEST['password']),
						'cn'=>'='
					],
				]);
				if ($mail->num_rows || $username->num_rows) {
					$user = null;
					if ($mail->num_rows) {
						$user = mysqli_fetch_assoc($mail);
					}else{
						$user = mysqli_fetch_assoc($username);
					}
					if (isset($_REQUEST['remember'])) {
						setcookie('unique_id', $user['unique_id'], time() + 86400);
					}
					$_SESSION['unique_id'] = $user['unique_id'];
					$data['ok'] = true;
					$data['code'] = 200;
					$data['message'] = "Login successfully";
					$data['result'] = $user;
				}else{
					$data['code'] = 403;
					$data['message'] = "password or username or mail is invalid";
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'password and username or mail is requered';
			}
		}else if($_REQUEST['do'] == 'checkUser'){
			$unique_id = $_REQUEST['unique_id'] ?? $_SESSION['unique_id'] ?? $_COOKIE['unique_id'];
			if (isset($unique_id)) {
				$user = $db->selectWhere('users',[
					[
						'unique_id'=>$unique_id,
						'cn'=>'='
					],
				]);
				if ($user->num_rows) {
					$data['ok'] = true;
					$data['code'] = 200;
					$data['message'] = "User confirmed";
					$data['result'][] = mysqli_fetch_assoc($user);
				}else{
					$data['code'] = 403;
					$data['message'] = "Invaled authorization token";
				}
			}else{
				$data['code'] = 403;
				$data['message'] = "invaled authorization token";
			}
		}else if($_REQUEST['do'] == 'editProfile'){
			$unique_id = $_REQUEST['unique_id'] ?? $_SESSION['unique_id'] ?? $_COOKIE['unique_id'];
			if (isset($unique_id)) {
				$user = $db->selectWhere('users',[
					[
						'unique_id'=>$unique_id,
						'cn'=>'='
					],
				]);
				if ($user->num_rows) {
					if ((isset($_REQUEST['name']) && isset($_REQUEST['username']) && isset($_REQUEST['mail']) && isset($_REQUEST['password']))) {
						$pass = $db->selectWhere('users',[
							[
								'pass_word'=>$_REQUEST['password'],
								'cn'=>'='
							],
						]);
						$errorText = "Eror:\n";
						if ($pass->num_rows) {
							$name = trim($_REQUEST['name']);
							$username = trim($_REQUEST['username']);
							$mail = trim($_REQUEST['mail']);
							$card = "";
							$phone = "";
							$newPassword = $_REQUEST['password'];
							if (isset($_REQUEST['card'])) {
								$card = trim($_REQUEST['card']);
							}
							if (isset($_REQUEST['phone'])) {
								$phone = trim($_REQUEST['phone']);
							}
							if (isset($_REQUEST['newPassword'])) {
								if (isset($_REQUEST['confirmPassword'])) {
									if ($_REQUEST['newPassword'] == $_REQUEST['confirmPassword']) {
										$newPassword = trim($_REQUEST['newPassword']);
									}else{
										$errorText .= "\n invaled repeat password";
									}
								}else{
									$errorText .= "\n confirmPassword is requered";
								}
							}
							$checkUsername = $db->selectWhere('users',[
								[
									'username'=>$username,
									'cn'=>'='
								],
							], " AND unique_id!='{$unique_id}'");
							if (!$checkUsername->num_rows) {
								$checkMail = $db->selectWhere('users',[
									[
										'mail'=>$mail,
										'cn'=>'='
									],
								], " AND unique_id!='{$unique_id}'");
								if (!$checkMail->num_rows) {
									$errorText .= " ok";
									$upd = $db->update('users',[
										'name'=>$name,
										'username'=>$username,
										'pass_word'=>$newPassword,
										'mail'=>$mail,
										'phone'=>$phone,
										'card'=>$card,
									],[
										'id'=>1,
										'cn'=>'='
									]);
									$user = $db->selectWhere('users',[
										[
											'unique_id'=>$unique_id,
											'cn'=>'='
										],
									]);
									$data['ok'] = true;
									$data['code'] = 200;
									$data['message'] = "Edited successfully";
									$data['result'][] = mysqli_fetch_assoc($user);
								}else{
									$errorText .= "\n" . $username . " This mail already exists";
								}
							}else{
								$errorText .= "\n" . $username . " This username already exists";
							}
						}else{
							$errorText = "\n old password is invalid";
						}
						if ($data['code'] !== 200) {
							$data['code'] = 400;
							$data['message'] = $errorText;
						}
					}else{
						$data['code'] = 402;
						$data['message'] = "name,username,mail,password is requered";
						$data['codes'] = $_REQUEST;
					}
				}
			}else{
				$data['code'] = 403;
				$data['message'] = "invaled authorization token";
			}
		}else if($_REQUEST['do'] == 'likedProduct'){
			$unique_id = $_REQUEST['unique_id'] ?? $_SESSION['unique_id'] ?? $_COOKIE['unique_id'];
			if (isset($unique_id)) {
				$user = $db->selectWhere('users',[
					[
						'unique_id'=>$unique_id,
						'cn'=>'='
					],
				]);
				if ($user->num_rows) {
					if (isset($_REQUEST['product_id'])) {
						$likedProduct = $db->selectWhere('likedproduct',[
							[
								'user_id'=>trim($unique_id),
								'cn'=>'='
							],
							[
								'product_id'=>trim($_REQUEST['product_id']),
								'cn'=>'='
							],
						]);
						$allLikedProduct = $db->selectWhere('likedproduct',[
							[
								'product_id'=>trim($_REQUEST['product_id']),
								'cn'=>'='
							],
						]);
						if ($likedProduct->num_rows) {
							$likedProduct = $db->delete('likedproduct',[
								[
									'user_id'=>trim($unique_id),
									'cn'=>'='
								],
								[
									'product_id'=>trim($_REQUEST['product_id']),
									'cn'=>'='
								],
							]);
							$data['ok'] = true;
							$data['code'] = 200;
							$data['message'] = "like deleted successfully";
							$data['result'][] = array('like count' => $allLikedProduct->num_rows-1);
						}else{
							$db->insertInto('likedproduct',[
								'product_id'=>trim($_REQUEST['product_id']),
								'user_id'=>trim($unique_id),
							]);
							$data['ok'] = true;
							$data['code'] = 200;
							$data['message'] = "like inserted successfully";
							$data['result'][] = array('like count' => $allLikedProduct->num_rows+1);
						}
					}else{
						$data['code'] = 402;
						$data['message'] = "product_id is requered";
					}
				}else{
					$data['code'] = 403;
					$data['message'] = "invaled authorization token";
				}
			}else{
				$data['code'] = 402;
				$data['message'] = "user_id is requered";
			}
		}else if($_REQUEST['do'] == 'addToCard'){
			$unique_id = $_REQUEST['unique_id'] ?? $_SESSION['unique_id'] ?? $_COOKIE['unique_id'];
			if (isset($unique_id)) {
				$user = $db->selectWhere('users',[
					[
						'unique_id'=>$unique_id,
						'cn'=>'='
					],
				]);
				if ($user->num_rows) {
					if (isset($_REQUEST['product_id'])) {
						$db->insertInto('card',[
							'product_id'=>trim($_REQUEST['product_id']),
							'user_id'=>trim($unique_id),
						]);
						$data['ok'] = true;
						$data['code'] = 200;
						$data['message'] = "card inserted successfully";
						$data['result'][] = array('like count' => $allLikedProduct->num_rows+1);
					}else{
						$data['code'] = 402;
						$data['message'] = "product_id is requered";
					}
				}else{
					$data['code'] = 403;
					$data['message'] = "invaled authorization token";
				}
			}else{
				$data['code'] = 402;
				$data['message'] = "user_id is requered";
			}
		}else if($_REQUEST['do'] == 'addToOrders'){
			if (isset($_REQUEST['product_id']) && isset($_REQUEST['phone']) && isset($_REQUEST['location'])) {
				$unique_id = $_REQUEST['unique_id'] ?? $_SESSION['unique_id'] ?? $_COOKIE['unique_id'] ?? "OneM user";
				$invited_id = $_REQUEST['unique_id'] ?? "";
				$db->insertInto('orders',[
					'product_id'=>trim($_REQUEST['product_id']),
					'user_id'=>trim($unique_id),
					'invited_id'=>trim($invited_id),
					'phone'=>trim($_REQUEST['phone']),
					'location'=>trim($_REQUEST['location']),
					'order_date'=>strtotime('now'),
					'status'=>0,
				]);
				$data['ok'] = true;
				$data['code'] = 200;
				$data['message'] = "ok";
			}else{
				$data['code'] = 402;
				$data['message'] = "product_id,phone,location is requered";
			}
		}else if($_REQUEST['do'] == 'getOrders'){
			$orders = $db->selectWhere('orders',[
				[
					'id'=>0,
					'cn'=>'>'
				],
			]);
			$data['ok'] = true;
			$data['code'] = 200;
			$data['message'] = "orders count: " . $orders->num_rows;
			foreach ($orders as $key => $value) $data['result'][] = $value;
		}else if($_REQUEST['do'] == 'changeMinsum'){
			$admin_unique_id = $_SESSION['admin_unique_id'] ?? $_COOKIE['admin_unique_id'] ?? $_REQUEST['admin_unique_id'];
			if (isset($admin_unique_id)) {
				$result = $db->selectWhere('admin',[
					[
						'admin_unique_id'=>$admin_unique_id,
						'cn'=>'='
					],
				]);
				if ($result->num_rows) {
					if (isset($_REQUEST['minsum'])) {
						$upd = $db->update('minsum',[
							'minsum'=>trim($_REQUEST['minsum']),
						],[
							'id'=>1,
							'cn'=>'='
						]);
						$result = $db->selectWhere('minsum',[
							[
								'id'=>1,
								'cn'=>'='
							],
						]);
						$data['ok'] = true;
						$data['code'] = 200;
						$data['message'] = 'minsum changed successfully';
						$data['result'][] = mysqli_fetch_assoc($result);
					}else{
						$data['code'] = 402;
						$data['message'] = 'minsum is requered';
					}
				}else{
					$data['code'] = 403;
					$data['message'] = 'Invaled authorization token';
				}
			}else{
				$data['code'] = 402;
				$data['message'] = 'admin_unique_id is requered';
			}
		}
	}else{
		$data['code'] = 400;
		$data['message'] = 'method not found';
	}
	echo json_encode($data,  JSON_PRETTY_PRINT);
?>