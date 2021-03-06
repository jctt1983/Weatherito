(function(root, undefined) {
	'use strict';

	var appConfig = root.AppConfig || {};

	/*
	 * controller for top page of retail site
	 */
	function controller($scope, m, weatherData, forecastData, countriesData) {
		var forecastList = [];
		var previousDate = '';

		forecastData.list.forEach(function(item) {
			var currentDate = m.unix(item.dt).format('DDMMYYYY');

			if (currentDate !== previousDate) {
				item.weather = item.weather.shift();
				forecastList.push(item);
				previousDate = currentDate;
			}
		});

		// models
		angular.extend($scope, {
			weatherInfo: weatherData.weather.shift(),
			targetCity: weatherData.name,
			targetCountry: weatherData.sys.country,
			weatherData: weatherData,
			forecastData: forecastData,
			forecastList: forecastList,
			countriesData: countriesData
		});

		// methods
		angular.extend($scope, {});
	}

	controller.$inject = ['$scope', 'moment', 'weatherData', 'forecastData', 'countriesData'];

	controller.resolve = {
		weatherData: ['WeatherService', 'geoData', function(WeatherService, geoData) {
			return WeatherService.weather(geoData);
		}],
		forecastData: ['WeatherService', 'geoData', 'weatherData', function(WeatherService, geoData) {
			return WeatherService.forecast(geoData);
		}]
	};

	/*
	 * Setup the routing for this page
	 */
	function config($stateProvider) {
		$stateProvider.state('main.welcome', {
			url: '/',
			resolve: controller.resolve,
			views: {
				'content@': {
					templateUrl: 'views/main/index.html',
					controller: 'WelcomeCtrl'
				}
			}
		});
	}

	config.$inject = ['$stateProvider'];

	angular.module(appConfig.appName)
		.config(config)
		.controller('WelcomeCtrl', controller);

}(this));
