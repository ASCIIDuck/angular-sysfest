'use strict';

/* Controllers */

function HostListCtrl($scope, Host, $route) {

	$scope.delete = function (host) {
		if (confirm('Are you sure you want to delete '+host["hostname"]+'?')) {
			Host.delete({'host_id':host["_id"]});
			$route.reload();
		} else {
		}

	};

	$scope.search = function() {
		$scope.hosts = Host.search({'query':$scope.query}, $scope.transform);
	}
	
	$scope.transform = function () {
		for(var i = 0;i<$scope.hosts.length;i++) {
			for(var j=0; j<$scope.hosts[i]["homes"].length; j++) {
				if($scope.hosts[i]["homes"][j]["name"]=="eth0") {
					$scope.hosts[i]["primary_ip"]=$scope.hosts[i]["homes"][j]["ip"];
				}
			}
			$scope.hosts[i]["tags"].sort();
		}
	}

	$scope.hosts = Host.list($scope.transform);

}

function HostDetailCtrl($scope, $routeParams, Host, $location) {
	
	
	$scope.edit = function () {
		$location.path("/host/"+$routeParams.host_id+"/edit");
	}
	$scope.back = function () {
		$location.path("/hostlist");
	}
	$scope.order = "name";
	$scope.host = Host.get({"host_id":$routeParams.host_id});
}

function HostCreateCtrl($scope, $routeParams, Host, $location) {
	$scope.host = {};

	$scope.addHostname = function (home) {
		home.hostnames.push({"val":""});
	}
	$scope.addHome = function () {
		if( typeof $scope.host.homes == 'undefined' ||  ! $scope.host.homes instanceof Array) {		
			$scope.host.homes=[];
		}
		$scope.host.homes.push({"name":"", "ip":"", "hostnames":[{"val":""}]});
	}
	$scope.addTag = function () {
		if( typeof $scope.host.tags == 'undefined' || ! $scope.host.tags instanceof Array) {		
			$scope.host.tags=[];
		}
		$scope.host.tags.push($scope.newTag);
		$scope.newTag="";
	}
	$scope.save = function () {
		var new_host = new Host($scope.host);
		new_host.$save();
		$location.path("/hostlist");
	}
	$scope.cancel = function () {
		$location.path("/hostlist");
	}
}

function HostEditCtrl($scope, $routeParams, Host, $location, $route, $window) {
	$scope.host = Host.get({"host_id":$routeParams.host_id});
	$scope.order = "name";


	$scope.addHostname = function (home) {
		home.hostnames.push({"val":""});
	}
	$scope.addHome = function () {
		if( typeof $scope.host.homes == 'undefined' ||  ! $scope.host.homes instanceof Array) {		
			$scope.host.homes=[];
		}
		$scope.host.homes.push({"name":"", "ip":"", "hostnames":[{"val":""}]});
	}
	$scope.addTag = function () {
		if( typeof $scope.host.tags == 'undefined' || ! $scope.host.tags instanceof Array) {		
			$scope.host.tags=[];
		}
		$scope.host.tags.push($scope.newTag);
		$scope.newTag="";
	}
	$scope.save = function () {
		$scope.host.$save();
		$location.path("/host/"+$routeParams.host_id);
	}
	$scope.reset = function () {
		$route.reload();
	}
	$scope.cancel = function () {
		$location.path("/host/"+$routeParams.host_id);
	}

}
