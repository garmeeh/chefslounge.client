angular.module('chefslounge.controllers', [])

.factory('Dates', function() {
	return {

		all: function() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			if (month.toString().length == 1) {
				var month = '0' + month;
			}
			if (day.toString().length == 1) {
				var day = '0' + day;
			}
			if (hour.toString().length == 1) {
				var hour = '0' + hour;
			}
			if (minute.toString().length == 1) {
				var minute = '0' + minute;
			}
			if (second.toString().length == 1) {
				var second = '0' + second;
			}
			//var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
			var dateTime = hour + ':' + minute + ' - ' + day + '/' + month + '/' + year;

			return dateTime;
		}
	}
})
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
chefslounge.controller('OfferCtrl', ['$scope', '$http', '$state', '$timeout',
	function($scope, $http, $state, $timeout) {

		$scope.doRefresh = function() {

			console.log('Refreshing!');
			$timeout(function() {

				$scope.getOfferFn();
				console.log("Refreshing");

				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('offers', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.offers = newVal;
		});
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

	}
])


chefslounge.controller('EnquiryCtrl', ['$scope', '$http', '$state', 'Dates', '$ionicPopup',
	function($scope, $http, $state, Dates, $ionicPopup) {
		// $scope.enquiry = {};

		$scope.enquiryFn = function(data) {

			var cdate = Dates.all();
			console.log(cdate);
			var user = localStorage.getItem("userData");
			var userD = JSON.parse(user);
			var userData = userD;

			var enq = {
				'firstname': userData.firstname,
				'lastname': userData.lastname,
				'email': userData.email,
				'subject': data.subject,
				'message': data.message,
				'sent': cdate
			};
			console.log(enq);

			console.log('Hit enquiry');
			var msg = 'enquiry=' + JSON.stringify(enq);
			console.log(msg);
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/sendmsg';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: msg,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			}).
			success(function(response) {
				console.log("success", response);
				var alertPopup = $ionicPopup.alert({
					title: 'Message Sent!',
					subTitle: 'Someone will be in touch shortly.',
					okType: 'button-dark'

				});
				alertPopup.then(function(res) {
					console.log('Reset Password');
					$state.go('tab.home', {}, {
						reload: true,
						inherit: false
					});
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

chefslounge.controller('LogCtrl', ['$scope', '$state', '$templateCache',
	function($scope, $state, $templateCache) {

		$scope.logOut = function() {
			localStorage.clear();
			console.log("Clearing local data")
			$state.go('signin', {}, {
				reload: true,
				inherit: false
			});
		}
		$scope.noLogOut = function() {
			localStorage.clear();
			$state.go('tab.home', {}, {
				reload: true,
				inherit: false
			});
		}
	}
])

// === SignInCtrl
// =======================================================//
chefslounge.controller('SignInCtrl', ['$scope', '$http', '$state', '$ionicModal', '$ionicPopup', 'md5',
	function($scope, $http, $state, $ionicModal, $ionicPopup, md5) {



		if (localStorage.getItem("Menus") == true) {
			localStorage.removeItem("Menus");
			console.log("removed menus");
		}

		$scope.signIn = function(user) {

			console.log('Hit logIn');
			var mdpass = md5.createHash(user.password || '');
			var userprep = {
				'email': user.email,
				'password': mdpass
			}
			var user = JSON.stringify(userprep);
			console.log(user);

			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/clientlogin';
			$scope.codeStatus = "";

			$http({
				method: method,
				dataType: 'json',
				url: inserturl,
				data: user,
				headers: {
					'Content-Type': 'application/json'
				},

			}).
			success(function(response) {

				if (response.statusCode == 200) {


					console.log(response);

					var data = response.payload.userData;

					localStorage.setItem("userData", JSON.stringify(data));

					var alertPopup = $ionicPopup.alert({
						title: 'Log In Success',
						okType: 'button-dark'
					});
					alertPopup.then(function(res) {
						console.log('Logged In');
					});

					$state.go('tab.home', {}, {
						reload: true,
						inherit: false
					});
				} else if (response.statusCode == 500) {
					console.error("Invalid Login");

					var alertPopup = $ionicPopup.alert({
						title: 'Invalid log in. Please Try Again',
						okType: 'button-dark'

					});
					alertPopup.then(function(res) {
						console.log('Invalid');
					});
				}


			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});



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

			if (userdata.firstname == null || userdata.firstname == "") {
				var alertFNPopup = $ionicPopup.alert({
					title: 'Please enter your First Name',
					okType: 'button-dark'

				});
				alertFNPopup.then(function(res) {
					console.log('First Name Blank');
				});
				return false;
			}

			if (userdata.lastname == null || userdata.lastname == "") {
				var alertLNPopup = $ionicPopup.alert({
					title: 'Please enter your Last Name',
					okType: 'button-dark'

				});
				alertLNPopup.then(function(res) {
					console.log('Last Name Blank');
				});
				return false;
			}

			if (userdata.phone == null || userdata.phone == "") {
				var alertPHNPopup = $ionicPopup.alert({
					title: 'Please enter your phone no.',
					okType: 'button-dark'

				});
				alertPHNPopup.then(function(res) {
					console.log('Phone No. Blank');
				});
				return false;
			}
			if (userdata.dob == null || userdata.dob == "") {
				var alertDOBPopup = $ionicPopup.alert({
					title: 'Please enter your D.O.B',
					okType: 'button-dark'

				});
				alertDOBPopup.then(function(res) {
					console.log('DOB Blank');
				});
				return false;
			} else {

				if (userdata.email == null || userdata.email == "") {
					var alertEMPopup = $ionicPopup.alert({
						title: 'Not a valid e-mail address!',
						okType: 'button-dark'

					});
					alertEMPopup.then(function(res) {
						console.log('Invalid Email');
					});
					return false;
				} else {
					var x = userdata.email;
					var atpos = x.indexOf("@");
					var dotpos = x.lastIndexOf(".");
					console.log('Hit createUser');

					if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

						var alertEPopup = $ionicPopup.alert({
							title: 'Not a valid e-mail address!',
							okType: 'button-dark'

						});
						alertEPopup.then(function(res) {
							console.log('Invalid Email');
						});
						return false;
					}
				}

				if (userdata.password == null || userdata.passwordconfirm == null || userdata.passwordconfirm == "" || userdata.password == "") {

					var alertPASSPopup = $ionicPopup.alert({
						title: 'Please Enter Password!',
						okType: 'button-dark'

					});
					alertPASSPopup.then(function(res) {
						console.log('Invalid Password');
					});
					return false;
				}


				if (userdata.password === userdata.passwordconfirm) {
					var mdpass = md5.createHash(userdata.password || '')
					var newUser = {
						'firstname': userdata.firstname,
						'lastname': userdata.lastname,
						'email': userdata.email,
						'phone': userdata.phone,
						'password': mdpass,
						'dob': userdata.dob
					};

					var user = 'userdata=' + JSON.stringify(newUser);
					console.log('Sending to server => ' + user);

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

					}).
					success(function(response) {
						console.log("success", response);
						$scope.user = {};
						var alertPopup = $ionicPopup.alert({
							title: 'Successful Sign Up!  Now just sign in...',
							okType: 'button-dark'

						});
						alertPopup.then(function(res) {
							console.log('Successful Sign Up');
						});
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

				} else {
					var alertPopup = $ionicPopup.alert({
						title: 'Passwords Do Not Match!',
						okType: 'button-dark'

					});
					alertPopup.then(function(res) {
						console.log('Password Mismatch');
					});

				}
			}


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


chefslounge.controller('ForgotPassCtrl', ['$scope', '$state', '$ionicPopup',
	function($scope, $state, $ionicPopup) {

		$scope.forgotPass = function() {



			var alertPopup = $ionicPopup.alert({
				title: 'Reset Email Sent',
				okType: 'button-dark'

			});
			alertPopup.then(function(res) {
				console.log('Reset Password');
				$state.go('signin', {}, {
					reload: true,
					inherit: false
				});
			});



		}

	}
])


// === BookingCtrl
// =======================================================//
chefslounge.controller('BookCtrl', ['$scope', '$http', '$state', 'Dates', '$ionicPopup',
	function($scope, $http, $state, Dates, $ionicPopup) {
		$scope.bookInput = {};


		var method = 'POST';
		var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/insertbooking';
		$scope.codeStatus = "";
		$scope.booktableFn = function(data) {

			var cdate = Dates.all();

			var user = localStorage.getItem("userData");
			var userD = JSON.parse(user);
			var userData = userD;

			if (data.bookingdate == null || data.bookingdate == "") {

				var alertBDPopup = $ionicPopup.alert({
					title: 'Please enter date',
					okType: 'button-dark'

				});
				alertBDPopup.then(function(res) {
					console.log('Date Blank');
				});
				return false;
			}

			if (data.bookingtime == null || data.bookingtime == "") {

				var alertBTPopup = $ionicPopup.alert({
					title: 'Please enter time',
					okType: 'button-dark'

				});
				alertBTPopup.then(function(res) {
					console.log('Time Blank');
				});
				return false;
			}

			if (data.bookingguests == null || data.bookingguests == "") {

				var alertBGPopup = $ionicPopup.alert({
					title: 'Please enter number of guests.',
					okType: 'button-dark'

				});
				alertBGPopup.then(function(res) {
					console.log('Guests Empty');
				});
				return false;
			}



			var bookingDetails = {
				'firstname': userData.firstname,
				'lastname': userData.lastname,
				'email': userData.email,
				'bookingdate': data.bookingdate,
				'bookingguests': data.bookingguests,
				'bookingtime': data.bookingtime,
				'sent': cdate
			};
			//console.log('Hit Function booktableFn', JSON.stringify($scope.bookInput));
			var jdata = 'bookingdata=' + JSON.stringify(bookingDetails);

			$http({
				method: method,
				url: inserturl,
				data: jdata,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			}).
			success(function(response) {
				console.log("success", response);
				var alertPopup = $ionicPopup.alert({
					title: 'Someone will be in touch shortly to confirm.',
					okType: 'button-dark'

				});
				alertPopup.then(function(res) {
					console.log('Reset Password');
					$state.go('tab.home', {}, {
						reload: true,
						inherit: false
					});
				});

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

		};

	}
])

// === ReviewCtrl
// =======================================================//
chefslounge.controller('ReviewCtrl', ['$scope', '$http', '$state', 'Dates', '$ionicPopup',
	function($scope, $http, $state, Dates, $ionicPopup) {
		$scope.review = {};
		$scope.review.rating = '0';

		//=== reviewFn() ====\\
		$scope.reviewFn = function(data) {

			var cdate = Dates.all();

			var user = localStorage.getItem("userData");
			var userD = JSON.parse(user);
			var userData = userD;


			if (data.rating == null || data.rating == "") {

				var alertBDPopup = $ionicPopup.alert({
					title: 'Please enter rating',
					okType: 'button-dark'

				});
				alertBDPopup.then(function(res) {
					console.log('Rating Blank');
				});
				return false;
			}

			if (data.rtitle == null || data.rtitle == "") {

				var alertBTPopup = $ionicPopup.alert({
					title: 'Please enter Title',
					okType: 'button-dark'

				});
				alertBTPopup.then(function(res) {
					console.log('Title Blank');
				});
				return false;
			}

			if (data.message == null || data.message == "") {

				var alertBGPopup = $ionicPopup.alert({
					title: 'Please enter a message.',
					okType: 'button-dark'

				});
				alertBGPopup.then(function(res) {
					console.log('Message Empty');
				});
				return false;
			}


			var reviewDetails = {
				'firstname': userData.firstname,
				'lastname': userData.lastname,
				'email': userData.email,
				'rating': data.rating,
				'rtitle': data.rtitle,
				'message': data.message,
				'sent': cdate
			};

			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/insertreview';
			$scope.codeStatus = "";
			console.log('Hit Function reviewFn', JSON.stringify(reviewDetails));
			var jdata = 'mydata=' + JSON.stringify(reviewDetails);

			$http({
				method: method,
				url: inserturl,
				data: jdata,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			}).
			success(function(response) {
				console.log("success", response);
				var alertPopup = $ionicPopup.alert({
					title: 'Thanks! Review Sent!',
					okType: 'button-dark'

				});
				alertPopup.then(function(res) {
					console.log('Reviewed');
					$state.go('tab.home', {}, {
						reload: true,
						inherit: false
					});
				});


			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});


		};


	}
])
// === ViewReviewCtrl
// =======================================================//
chefslounge.controller('ViewReviewCtrl', ['$scope', '$http', '$state', '$timeout',
	function($scope, $http, $state, $timeout) {

		$scope.doRefresh = function() {

			console.log('Refreshing!');
			$timeout(function() {

				$scope.getReviewFn();
				console.log("Refreshing");

				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('reviews', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.reviews = newVal;
		});
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



	}
])

chefslounge.controller('MenusCtrl', ['$scope', '$http', '$state', '$location', '$templateCache',
	function($scope, $http, $state, $location, $templateCache) {

		$scope.getMenusFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getmenus';
			$scope.codeStatus = "";
			console.log('Hit Function getMenusFn');


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
				$scope.menus = response;
				console.log("MENUS", $scope.menus[0].menuName);

				localStorage.setItem('Menus', JSON.stringify($scope.menus));


			}).error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});


		};

		$scope.getMenusFn();

		$scope.goMenu = function(menuD) {
			$location.url('/tab/menus/' + menuD);
		}



	}
])

chefslounge.controller('MenuCtrl', ['$scope', '$state', '$stateParams', '$templateCache',
	function($scope, $state, $stateParams, $templateCache) {

		if (localStorage.getItem("Menus") == true) {
			localStorage.removeItem("Menus");
			console.log("removed menus");
		}

		var currentMenu = [];
		//console.log($stateParams);
		var menutype = $stateParams.menutype
		console.log($scope);
		var menuD = localStorage.getItem("Menus");
		$scope.menu = JSON.parse(menuD);
		// console.log($scope.menu);

		for (var i = 0; i < $scope.menu.length; i++) {
			var menuItem = $scope.menu[i];
			if (menuItem.menuName === menutype) {
				currentMenu = menuItem.items;
				$scope.currentMenu = currentMenu;
				console.log($scope.currentMenu);
			}
		}


	}
])