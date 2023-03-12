<?php 
	require_once "../../gateway.php";
	header("Accept: application/x-www-form-urlencoded");
	header("Content-Type: application/json");
	try{
		$data = GATEWAY::getQueryData(file_get_contents("php://input"));
		switch ($_SERVER['REQUEST_METHOD']) {
			case 'GET':
				if(isset($_GET['token'])){
					$data = USER::get_data($_GET['token']);

					if(isset($_GET['target'])){
						if($_GET['target'] == "profile"){
							error_reporting(0);
							$filename = "../../profile/" . $data -> id . "." . $data -> profile;
							if(file_exists($filename)){
								header("Content-Type: image/" . $data -> profile);
								header("Content-Length: " . filesize($filename));
								echo file_get_contents($filename);
							}
							else{
								header("Content-Type: image/svg+xml");
								$filename = "../../asset/profile_fallback/".($data -> name ? $data -> name : $data -> email)[0].".svg";
								if(file_exists($filename))
									echo file_get_contents($filename);
								else
									echo file_get_contents("../../asset/profile_fallback/other.svg");
							}
						}
						else if($_GET['target'] == "design_photo"){
							error_reporting(0);
							$data = SOLUTION_ORDER::get_data($_GET['token'], $_GET['id']);
							if(!$data){
								throw new Exception("Data doesn't exist");
							}
							$filename = "../../design_photo/" . $data -> id . "." . $data -> design_photo;
							if(file_exists($filename)){
								header("Content-Type: image/" . $data -> design_photo);
							}
							else{
								header("Content-Type: image/svg+xml");
								$filename = "../../asset/design_file_fallback.svg";
							}
							header("Content-Length: " . filesize($filename));
							echo file_get_contents($filename);
						}
						else{
							try{
								echo json_encode([$_GET['target'] => ((array)$data)[$_GET['target']]]);
							}catch(Exception){
								throw new Exception("Data requested doesn't exist.");
							}
						}
					}
					else
						echo json_encode($data);
				}
				break;
			case 'POST':
				if(!isset($_POST['action'])){
					unset($_POST['action']);
					throw new Exception("Error Processing Request");
				}
				if($_POST['action'] == 'login'){
					unset($_POST['action']);
					echo json_encode(["token" => USER::login($_POST["login"], $_POST['pass'])]);
				}
				else if($_POST['action'] == 'order'){
					unset($_POST['action']);
					if(!isset($_POST["token"]))
						throw new Exception("Please login first.");
					$user = TOKEN::validate($_POST["token"]) -> user;
					unset($_POST["token"]);
					$data = [...$_POST, "user" => $user, "time" => date("Y-m-d h:i:s"), "status" => "pending"];
					if(in_array(strtolower($_POST['service']), ["seo optimisation", "maintenance"])){
						try{
							SEO_MAINTENANCE::add($data);
						}catch(Exception){
							throw new Exception("Error adding your service, recheck your solution_ID.");
						}
					}
					else if(in_array(strtolower($_POST['service']), ["website", "app", "website and app", "local solution"]))
						SOLUTION_ORDER::add($data);
				}
				else if($_POST['action'] == 'signup'){
					unset($_POST['action']);
					echo json_encode(["token" => USER::signup($_POST)]);
				}
				else if($_POST['action'] == 'edit'){
					unset($_POST['action']);
					$token = $_POST['token'];
					unset($_POST['token']);
					USER::edit($token, $_POST);
				}
				break;
			case 'DELETE':
				USER::del($data["id"]);
				break;
			case 'LOGOUT':
				if(!isset($data["token"]))
					throw new Exception("invalid token.");
				USER::logout($data["token"]);
				break;
			case 'MESSAGE':
				if(!isset($data["token"]))
					throw new Exception("Please login first.");
				if(!isset($data["message"]))
					throw new Exception("The message can't be empty.");
				USER::message($data["token"], $data["message"]);
				break;
			case 'HISTORY':
				if(!isset($data["token"]))
					throw new Exception("Please login first.");
				if(!isset($data["target"]) || $data["target"] == "solution")
					echo json_encode(USER::solution_history($data["token"]));
				else if($data["target"] == "service")
					echo json_encode(USER::service_history($data["token"]));
				break;
			default:
				throw new Exception("Method not allowed ( " . $_SERVER['REQUEST_METHOD'] . " )");
		}
	}catch(Exception $e){
		die('{"error":"' . $e -> getMessage() . '"}');
	}
?>