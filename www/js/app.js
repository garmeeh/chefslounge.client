'use strict';

var chefslounge = angular.module('chefslounge', ['ionic', 'chefslounge.controllers', 'chefslounge.services'])


chefslounge.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('signin', {
            url: "/sign-in",
            templateUrl: "templates/sign-in.html",
            controller: 'SignInCtrl'
        })
        .state('forgotpassword', {
            url: "/forgot-password",
            templateUrl: "templates/forgot-password.html",
            controller: 'ForgotPassCtrl'
        })
        .state('signup', {
            url: "/sign-up",
            templateUrl: "templates/sign-up.html",
            controller: 'SignUpCtrl'
        })
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })


    // Sub Tabs of tab-home.html
    //==============================//
    .state('tab.offer', {
        url: '/home/offer',
        views: {
            'tab-home': {
                templateUrl: 'templates/offer.html',
                controller: 'OfferCtrl'
            }
        }
    })

    .state('tab.enquiry', {
        url: '/home/enquiry',
        views: {
            'tab-home': {
                templateUrl: 'templates/enquiry.html',
                controller: 'EnquiryCtrl'
            }
        }
    })

    .state('tab.viewreviews', {
        url: '/home/viewreviews',
        views: {
            'tab-home': {
                templateUrl: 'templates/view-reviews.html',
                controller: 'ViewReviewCtrl'
            }
        }
    })
    // End of sub tabs =============//



    .state('tab.book', {
        url: '/book',
        views: {
            'tab-book': {
                templateUrl: 'templates/tab-book.html',
                controller: 'BookCtrl'
            }
        }
    })


    .state('tab.review', {
        url: '/review',
        views: {
            'tab-review': {
                templateUrl: 'templates/tab-review.html',
                controller: 'ReviewCtrl'
            }
        }
    })

    .state('tab.menus', {
        url: '/menus',
        views: {
            'tab-menus': {
                templateUrl: 'templates/tab-menus.html',
                controller: 'MenusCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/sign-in');

});