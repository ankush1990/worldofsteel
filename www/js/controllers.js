var global_login = "";

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LogoutCtrl', function($scope,$rootScope,$ionicHistory) {
	$scope.login = "";
	
	$rootScope.$on('login_var', function (event, args) {
		$scope.login = args.global_login;
		global_login_id = args.global_login;
	});
	
	$scope.logout = function(){
		$ionicHistory.clearCache();
		login_var = "";
		$rootScope.$broadcast('login_var',{global_login:login_var});
	}
})

.controller('offersCtrl', function($scope,$state,$window,$ionicPopup,$http,$ionicLoading) {
	
	//check internt connection
	if(window.Connection) {
		//if connection is not there
		if(navigator.connection.type == Connection.NONE) {
			if(window.localStorage.getItem("offers_offline_data") !== undefined) {
           		$scope.response = angular.fromJson(window.localStorage.getItem("offers_offline_data"));
        	} 
		}
		else{
			// if connection is there
			$ionicLoading.show({template: '<ion-spinner icon="crescent"></ion-spinner>'});
			var temp = "";
			var data_parameters = "usertype="+temp;
			$http.post("http://worldofsteel.com/sysdata/offermobile.php",data_parameters, {
				headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response) {
				console.log(response);
				$scope.response = response;
				window.localStorage.setItem("offers_offline_data",angular.toJson(response));
				$ionicLoading.hide();
			});
		}
	}
	
	
	$scope.doRefresh = function() {
		if(window.Connection) {
		//if connection is not there
			if(navigator.connection.type == Connection.NONE) {
				if(window.localStorage.getItem("offers_offline_data") !== undefined) {
           			$scope.response = angular.fromJson(window.localStorage.getItem("offers_offline_data"));
					$scope.$broadcast('scroll.refreshComplete'); // to hide the spinner of pull to refresh
        		} 
			}
			else{
				// if connection is there
				var data_parameters = "usertype="+temp;
				$http.post("http://worldofsteel.com/sysdata/offermobile.php",data_parameters, {
					headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					console.log(response);
					$scope.response = response;
					$scope.$broadcast('scroll.refreshComplete'); // to hide the spinner of pull to refresh
				});
			}
		}
	};
})

.controller('offers_detailCtrl', function($scope,$stateParams,$http,$state) {
	$scope.origin = $stateParams.origin;
	$scope.quantity = $stateParams.quantity;
	$scope.thickness = $stateParams.thickness;
	$scope.width = $stateParams.width;
	$scope.length = $stateParams.length;
	$scope.currency = $stateParams.currency;
	$scope.price = $stateParams.price;
	$scope.heading = $stateParams.heading;
	$scope.classification = $stateParams.classification;
	$scope.steel_type = $stateParams.steel_type;
	$scope.forms = $stateParams.forms;
	$scope.CoilWeight = $stateParams.CoilWeight;
	
	$scope.sendresponse = function(value,origin,classification,quantity,steel_type,forms,thickness,width,length,currency,price,CoilWeight){
		$state.go("app.offers-detail-response",{offer_refno: value,origin: origin,classification: classification,quantity: quantity,steel_type: steel_type,forms: forms,thickness: thickness,width: width,length: length,currency: currency,price: price,CoilWeight: CoilWeight});
	}
})


.controller('offers_response_Ctrl', function($scope,$stateParams,$http,$state,$ionicPopup,$ionicHistory) {
	$scope.offer_refno = $stateParams.offer_refno;
	
	$scope.user = {name : '',email : '',mobile : '',comment : ''};
	
	$scope.send_mail = function(user) {
		
		if(window.Connection) {
		//if connection is not there
			if(navigator.connection.type == Connection.NONE) {
				$ionicPopup.show({
					  template: '',
					  title: 'No Connection.....Retry',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
			}
			else{
				// if connection is there
				var name = user.name;
				var email = user.email;
				var mobile = user.mobile;
				var comment = user.comment;
				var offer_refno = $stateParams.offer_refno;
				
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z\-])+\.)+([a-zA-Z]{2,4})+$/;
				
				if(typeof email === "undefined" || typeof name === "undefined" || email == "" || name == "" || typeof comment === "undefined" || comment == "" || offer_refno == "" || offer_refno == "undefined"){
					$ionicPopup.show({
					  template: '',
					  title: 'Please fill all fields',
					  scope: $scope,
					  buttons: [
						{ 
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
				}
				else
				{
					if(!filter.test(email)){
						$ionicPopup.show({
								  template: '',
								  title: 'Please enter valid email',
								  scope: $scope,
								  buttons: [
									{ 
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
						})
					}
					else
					{
						var action = "send_email";
						var data_parameters = "action="+action+"&user_email="+email+ "&name="+name+ "&mobile="+mobile+ "&comment="+comment+ "&offer_refno="+offer_refno+ "&origin="+$stateParams.origin+ "&classification="+$stateParams.classification+ "&quantity="+$stateParams.quantity+ "&steel_type="+$stateParams.steel_type+ "&forms="+$stateParams.forms+ "&thickness="+$stateParams.thickness+ "&width="+$stateParams.width+ "&length="+$stateParams.length+ "&currency="+$stateParams.currency+ "&price="+$stateParams.price+ "&CoilWeight="+$stateParams.CoilWeight;
						$http.post(globalip,data_parameters, {
							headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
						})
						.success(function(response) {
							if(response[0].status == "Y"){
								$scope.user = {name : '',email : '',mobile : '',comment : ''};
								$ionicPopup.show({
								  template: '',
								  title: 'Thank you for your response. Our Sales Team will contact you shortly.',
								  scope: $scope,
								  buttons: [
									{
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
								})
								$ionicHistory.nextViewOptions({
									disableBack: true
								});
								$state.go('app.offers');
							}
							else{
								$ionicPopup.show({
								  template: '',
								  title: 'There is some server error',
								  scope: $scope,
								  buttons: [
									{
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
								})
							}
						});
					}
				}
			}
		}
		
	};
})

.controller('contactCtrl', function($scope) {
	$scope.mapCreated = function(map) {
		$scope.map = map;
	};
	
	$scope.centerOnMe = function () {
		console.log("Centering");
		if (!$scope.map) {
		  return;
		}
	
		$scope.loading = $ionicLoading.show({
		  content: 'Getting current location...',
		  showBackdrop: false
		});
	
		navigator.geolocation.getCurrentPosition(function (pos) {
		  console.log('Got pos', pos);
		  $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		  $scope.loading.hide();
		}, function (error) {
		  alert('Unable to get location: ' + error.message);
		});
	};
})

.controller('emailCtrl', function($scope,$state,$http,$ionicPopup) {
	$scope.user = {
			name : '',
			email : '',
			website : '',
			comments : ''
	};
	
	$scope.sendemail = function(user){
		var name = user.name;
		var email = user.email;
		var website = user.website;
		var comments = user.comments;
		
		var data_parameters = "cont_name="+name+ "&cont_mail="+email+ "&cont_url="+website+ "&cont_message="+comments;
		$http.post("http://"+globalip+"/email.php",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response){
			if(response[0].status == "Y"){
				$ionicPopup.show({
				  template: '',
				  title: 'Email sent successfully.',
				  scope: $scope,
				  buttons: [
					{
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
			}
		});
	}
})

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', function($scope,$ionicHistory,$rootScope,$http,$ionicPopup,$state) {
	$scope.user = {username: '',password : ''};
    // hide back butotn in next view
	$ionicHistory.nextViewOptions({
      	disableBack: true
    });
	
	
   	$scope.signIn = function(user) {
		var username = user.username;
		var password = user.password;
		
		
		if(typeof username === "undefined" || typeof password === "undefined" || username == "" || password == ""){
			$ionicPopup.show({
			  template: '',
			  title: 'Please fill all fields',
			  scope: $scope,
			  buttons: [
				{ 
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
		else{
			var action = "login";
			var data_parameters = "action="+action+"&username="+username+ "&password="+password;
			$http.post(globalip,data_parameters, {
				headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response) {
				if(response[0].status == "Y"){
					$rootScope.$broadcast('login_var',{global_login:response.userid});
					$state.go('app.dashboard');
				}
				else{
					$ionicPopup.show({
					  template: '',
					  title: 'Username or password is wrong',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
				}
			});
		}
	};
	
	
	// for registration
	$scope.register = function(user) {
		var email = user.register_email;
		var password = user.register_password;
		var cpassword = user.register_cpassword;
		var firstname = user.register_name;
		var mobile = user.mobile_number;
		
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z\-])+\.)+([a-zA-Z]{2,4})+$/;
		
		if(typeof email === "undefined" || typeof password === "undefined" || email == "" || password == "" || typeof cpassword === "undefined" || cpassword == "" || typeof firstname === "undefined" || firstname == ""  || typeof mobile === "undefined" || mobile == ""){
			$ionicPopup.show({
			  template: '',
			  title: 'Please fill all fields',
			  scope: $scope,
			  buttons: [
				{ 
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
		else
		{
			if(password != cpassword){
				$ionicPopup.show({
				  template: '',
				  title: 'Password did not match',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
			}
			else{
				if(!filter.test(email)){
					$ionicPopup.show({
							  template: '',
							  title: 'Please enter valid email',
							  scope: $scope,
							  buttons: [
								{ 
								  text: 'Ok',
								  type: 'button-assertive'
								},
							  ]
					})
				}
				else
				{
					var action = "register";
					var data_parameters = "action="+action+"&user_email="+email+ "&password="+password+ "&firstname="+firstname+ "&mobile="+mobile;
					$http.post(globalip,data_parameters, {
						headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
					})
					.success(function(response) {
						if(response[0].status == "Y"){
							$scope.user = {register_email: '',register_name : '',register_password : '',register_cpassword : '',mobile_number : ''};
							$ionicPopup.show({
							  template: '',
							  title: 'You have registered Successfully',
							  scope: $scope,
							  buttons: [
								{
								  text: 'Ok',
								  type: 'button-assertive'
								},
							  ]
							})
						}
						else if(response[0].status == "E"){
							$ionicPopup.show({
							  template: '',
							  title: 'Email already exists',
							  scope: $scope,
							  buttons: [
								{
								  text: 'Ok',
								  type: 'button-assertive'
								},
							  ]
							})
						}
						else{
							$ionicPopup.show({
							  template: '',
							  title: 'There is some server error',
							  scope: $scope,
							  buttons: [
								{
								  text: 'Ok',
								  type: 'button-assertive'
								},
							  ]
							})
						}
					});
				}
			}
		}
	};
	
	//for forgot
	$scope.forgot = function(user) {
		var email = user.forgot_email;
		
		if(typeof email === "undefined" || email == ""){
			$ionicPopup.show({
			  template: '',
			  title: 'Please enter email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
		else{
			var action = "forgot";
			var data_parameters = "action="+action+"&user_email="+email;
			$http.post(globalurl,data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "N"){
					$ionicPopup.show({
					  template: '',
					  title: 'Email address not registered.',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
				}else{
					$scope.user = {forgot_email: ''};
					$ionicPopup.show({
					  template: '',
					  title: 'An email has been sent to the email address.',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive',
						},
					  ]
					})
				}
			});
		}
	}
});

