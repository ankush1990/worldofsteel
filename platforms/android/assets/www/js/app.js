// Ionic Starter App
var globalip = "http://makerits.com/worldofsteel/get_hint.php";
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,$state,$ionicPopup,$ionicHistory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
	//show a confirm modal on exit app 
	$ionicPlatform.registerBackButtonAction(function(event) {
    	if(true) { // your check here
			// check if there is back opiton to go back in application 
			if ($ionicHistory.backView()) {
				$ionicHistory.backView().go();
 			}
			else{
				$ionicPopup.confirm({
					title: 'World Of Steel',
					template: 'Are you sure you want to exit?'
				}).then(function(res) {
					if (res) {
						ionic.Platform.exitApp();
					}
				})
			}
    	}
  	},100);
	
	//check internt connection
	/*if(window.Connection) {
		if(navigator.connection.type == Connection.NONE) {
			$ionicPopup.confirm({
				title: "Internet Disconnected",
				content: "The internet is disconnected on your device."
			})
			.then(function(result) {
				if(!result) {
					//ionic.Platform.exitApp();
				}
			});
		}
	}*/
	
	//one signal code
	var notificationOpenedCallback = function(jsonData) {
		//console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
		var data = { origin:jsonData.additionalData.origin, quantity:jsonData.additionalData.quantity, thickness:jsonData.additionalData.thickness, width:jsonData.additionalData.width, length:jsonData.additionalData.length, currency:jsonData.additionalData.currency, price:jsonData.additionalData.price,heading:jsonData.additionalData.heading,classification:jsonData.additionalData.classification,steel_type:jsonData.additionalData.steel_type,forms:jsonData.additionalData.forms};
		$state.go('app.offers-detail',data);
	};

	window.plugins.OneSignal.init("1eb095de-4015-4a67-899b-e38da22ae0df",
									{googleProjectNumber: "600906789732"},
									notificationOpenedCallback);
  
	// Show an alert box if a notification comes in when the user is in your app.
	window.plugins.OneSignal.enableInAppAlertNotification(true);
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html'
      }
    }
  })
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  })

  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
    .state('app.offers', {
      url: '/offers',
      views: {
        'menuContent': {
          templateUrl: 'templates/offers.html',
          controller: 'offersCtrl'
        }
      }
    })
	.state('app.offers-detail', {
      url: "/offers-detail/:origin?quantity?thickness?width?length?currency?heading?price?classification?steel_type?forms",
      views: {
        'menuContent' :{
          templateUrl: "templates/offers-detail.html",
		  controller: "offers_detailCtrl"
        }
      }
    })
	.state('app.offers-detail-response', {
      url: '/offers-detail-response/:offer_refno',
      views: {
        'menuContent': {
          templateUrl: 'templates/offers-detail-response.html',
          controller: 'offers_response_Ctrl'
        }
      }
    })
  .state('app.contact', {
    url: '/contact',
    views: {
      'menuContent': {
        templateUrl: 'templates/contact.html',
        controller: 'contactCtrl'
      }
    }
  })
  .state('app.getinformation', {
      url: "/getinformation",
      views: {
        'menuContent' :{
          templateUrl: "templates/getinformation.html",
        }
      }
    })
	.state('app.emailus', {
      url: "/emailus",
      views: {
        'menuContent' :{
          templateUrl: "templates/emailus.html",
		  controller: "emailCtrl"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.directive('map', function() {
	return {
		restrict: 'E',
		scope: {
		  onCreate: '&'
		},
		link: function ($scope, $element, $attr) {
		  function initialize() {
			var myLatLng = {lat:18.9492888, lng: 72.8403256};
			var mapOptions = {
			  center: new google.maps.LatLng(18.9492888, 72.8403256),
			  zoom: 14,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map($element[0], mapOptions);
			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				label: "A",
				content:"Hello World!"
			});
			var infowindow = new google.maps.InfoWindow({
			  content:"World Of Steel"
			});
			infowindow.open(map,marker);
			
			$scope.onCreate({map: map});
	
			// Stop the side bar from dragging when mousedown/tapdown on the map
			google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
			  e.preventDefault();
			  return false;
			});
		  }
	
		  if (document.readyState === "complete") {
			initialize();
		  } else {
			google.maps.event.addDomListener(window, 'load', initialize);
		  }
		}
  	}
});


