angular.module('chefslounge.controllers', [])

chefslounge.controller('HomeCtrl', ['$scope', '$state',
	function($scope, $state) {

		$scope.refreshFn = function() {
			console.log("Hit refreshFn");
			$state.go('tab.home', {}, {
				reload: true,
				inherit: false
			});
		}


	}
])
chefslounge.controller('OfferCtrl', ['$scope', '$http', '$state', '$templateCache',
	function($scope, $http, $state, $templateCache) {

		//=== getOfferFn() ====\\

		$scope.getOfferFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getoffer';
			$scope.codeStatus = "";
			console.log('Hit Function getOfferFn');


			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log(response);
				$scope.offers = response;



			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};

		$scope.getOfferFn();
	}
])


chefslounge.controller('EnquiryCtrl', ['$scope', '$http', '$state', '$templateCache',
	function($scope, $http, $state, $templateCache) {
		// $scope.enquiry = {};

		$scope.enquiryFn = function(data) {

			console.log('Hit enquiry');
			var enquiry = 'enquiry=' + JSON.stringify(data);
			console.log(enquiry);
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/sendmsg';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: enquiry,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$state.go('tab.home', {}, {
					reload: true,
					inherit: false
				});


			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			// return false;

		};



	}
])

.controller('ProfileCtrl', function($scope) {})

// === SignInCtrl
// =======================================================//
chefslounge.controller('SignInCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {



		$scope.signIn = function(user) {
			//var user = 'user=' + JSON.stringify(user);
			//var method = 'POST';
			//var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/checkusers';
			//$scope.codeStatus = "";
			console.log('Hit Function signIn');

			// $http({
			//     method: method,
			//     url: inserturl,
			//     data: user,
			//     headers: {
			//         'Content-Type': 'application/x-www-form-urlencoded'
			//     },
			//     cache: $templateCache
			// }).
			// success(function(response) {

			//     console.log("user confirmed", response);


			// }).
			// error(function(response) {
			//     console.log("error");
			//     $scope.codeStatus = response || "Request failed";
			//     console.log($scope.codeStatus);
			// });
			//return false;

			console.log('Sign-In', user.email);
			$state.go('tab.home');
			//$location.path('/#/home');
		};

		// Create and load the Modal
		$ionicModal.fromTemplateUrl('new-user.html', function(modal) {
			$scope.userModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});

		// Create new user and store them in the database
		$scope.createUser = function(userdata) {

			console.log('Hit createUser');
			var user = 'userdata=' + JSON.stringify(userdata);
			console.log(user);
			$scope.userModal.hide();
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/insertuser';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: user,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.user = {};
				//magic!!!! 
				$state.go('signin', {}, {
					reload: true,
					inherit: false
				});
				$scope.userModal.remove();

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			// return false;

		};



		// Open new user modal
		$scope.newUser = function() {
			$scope.userModal.show();
		};

		// Close new user modal
		$scope.closeNewUser = function() {
			$scope.userModal.hide();
		};

	}
])

.controller('ForgotPassCtrl', function($scope) {})



// === BookingCtrl
// =======================================================//
chefslounge.controller('BookCtrl', ['$scope', '$http', '$state', '$templateCache',
	function($scope, $http, $state, $templateCache) {
		$scope.bookInput = {};


		var method = 'POST';
		var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/insertbooking';
		$scope.codeStatus = "";
		$scope.booktableFn = function() {

			console.log('Hit Function booktableFn', JSON.stringify($scope.bookInput));
			var jdata = 'bookingdata=' + JSON.stringify($scope.bookInput);

			$http({
				method: method,
				url: inserturl,
				data: jdata,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.booked();

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};



		//=== Booking Submitted Confirmation ====\\
		$scope.booked = function() {
			console.log("booked");
			$state.go('tab.home', {}, {
				reload: true,
				inherit: false
			});
		};



	}
])

// === ReviewCtrl
// =======================================================//
chefslounge.controller('ReviewCtrl', ['$scope', '$http', '$state', '$templateCache',
	function($scope, $http, $state, $templateCache) {
		$scope.review = {};

		//=== reviewFn() ====\\
		$scope.reviewFn = function() {
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/insertreview';
			$scope.codeStatus = "";
			console.log('Hit Function reviewFn', JSON.stringify($scope.review));
			var jdata = 'mydata=' + JSON.stringify($scope.review);

			$http({
				method: method,
				url: inserturl,
				data: jdata,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.reviewed();


			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};



		//=== Review Submitted Confirmation ====\\
		$scope.reviewed = function() {
			console.log("reviewed");
			$state.go('tab.home', {}, {
				reload: true,
				inherit: false
			});
		};



	}
])
// === ViewReviewCtrl
// =======================================================//
chefslounge.controller('ViewReviewCtrl', ['$scope', '$http', '$state', '$templateCache',
	function($scope, $http, $state, $templateCache) {
		//=== getReviewFn() ====\\

		$scope.getReviewFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getreview';
			$scope.codeStatus = "";
			console.log('Hit Function getReviewFn');


			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log(response);
				$scope.reviews = response;



			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};

		$scope.getReviewFn();


	}
])

.controller('MenusCtrl', function($scope) {});