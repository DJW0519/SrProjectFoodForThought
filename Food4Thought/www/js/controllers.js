angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicModal) {
	$scope.shifts = [];

	var shift1 = {loc: 'MSU', date: '12/5/12', organization: 'Food4Thought', time: '7:30-9:30am', location: 'The Regency Athletic Complex at MSU Denver.', address: '1390 Shoshone St, Denver, CO 80204'};

	var shift2 = {loc: 'Ellis', date: '3/3/17', organization: 'Food4Thought', time: '2-3:30pm', location: 'Ellis Elementary School.', address: '1651 S Dahlia St, Denver, CO 80222'};


	$scope.clothInfo = "Please wear comforable clothing and dress for working in an outdoor covered location.";

	$scope.createShift = function(shift) {
		$scope.shifts.push({
			loc: shift.loc,
			date: shift.date,
			organization: shift.organization,
			time: shift.time,
			location: shift.location,
			address: shift.address,
			info2: $scope.clothInfo
		}); 
	};

	$scope.createShift(shift1);
	$scope.createShift(shift2);

	$scope.toggleShift = function(shift) {
		if($scope.isShiftShown(shift)) {
			$scope.shownShift = null;
		} else {
			$scope.shownShift = shift;
		}
	};
	$scope.isShiftShown = function(shift) {
		return $scope.shownShift === shift;
	};

	$scope.launchMaps = function(address){
		if(ionic.Platform.isIOS()){
			window.location.href = "maps://maps.apple.com/?daddr=" + address;
		}
		else if(ionic.Platform.isAndroid()){
			window.location.href = "geo:?q=" + address;
		}
		else{
			window.location.href = "https://www.google.com/maps/place/" + address;	
		}
	};

	function pickNewShiftModal () {
		if(ionic.Platform.isIOS()){
			return ('/templates/newShiftModals/ios.html');
		}
		else if(ionic.Platform.isAndroid()){
			return ('/templates/newShiftModals/android.html');
		}
		else {
			return ('/templates/newShiftModals/web.html');
		}
	}

	// Sign Up Modal
	$ionicModal.fromTemplateUrl(pickNewShiftModal(), {
		id: '1',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.signUpModal = modal;
	});


	// Check-in Modal
	$ionicModal.fromTemplateUrl('templates/start.html', {
		id: '2',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.checkInModal = modal;
	});

	$scope.openModal = function(modalID) {
		if(modalID == 1) $scope.signUpModal.show();
		else $scope.checkInModal.show();
		//$scope.checkInModal.show();
	};
	$scope.closeModal = function() {
		$scope.signUpModal.hide();
	};

	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.signUpModal.remove();
		$scope.checkInModal.remove();
	});
}) 

.controller('NotCtrl', function($scope) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//  
	//$scope.$on('$ionicView.enter', function(e) {
	//});

})


.controller('NotificationsCtrl', function($scope) {
	$scope.notificationsUrgent = [
	{ title: "snowman apocalypse" },
	{ title: "blah" }
	];

	$scope.notificationsInfo = [
	{title: "something cool and informative, yay kids!"}
	];

	$scope.createUrgent = function(notification) {
		$scope.notificationsUrgent.push({
			title: notification.title
		});
		notification.title = "";
	};
	$scope.createInfo = function(notification) {
		$scope.notificationsInfo.push({
			title: notification.title
		});
		notification.title = "";
	};

})

.controller('Admin-NotCtrl', function($scope, $ionicModal) {

	// Edit Notification Modal
	$ionicModal.fromTemplateUrl('templates/admin/modals/editNotification.html', {
		id: '1',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.signUpModal = modal;
	});


	// New Notification Modal
	$ionicModal.fromTemplateUrl('templates/admin/modals/newNotification.html', {
		id: '2',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.checkInModal = modal;
	});

$scope.openModal = function(modalID) {
		if(modalID == 1) $scope.signUpModal.show();
		else $scope.checkInModal.show();
		//$scope.checkInModal.show();
	};
	$scope.closeModal = function() {
		if(modalID == 1) $scope.signUpModal.hide();
		else $scope.checkInModal.hide();
	};

	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.signUpModal.remove();
		$scope.checkInModal.remove();
	});
})

.controller('Admin-LocCtrl', function($scope, $ionicModal) {
	// Edit Location Modal
	$ionicModal.fromTemplateUrl('templates/admin/modals/editLocation.html', {
		id: '1',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.signUpModal = modal;
	});


	// New Location Modal
	$ionicModal.fromTemplateUrl('templates/admin/modals/newLocation.html', {
		id: '2',
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.checkInModal = modal;
	});

	$scope.openModal = function(modalID) {
		if(modalID == 1) $scope.signUpModal.show();
		else $scope.checkInModal.show();
		//$scope.checkInModal.show();
	};
	$scope.closeModal = function() {
		if(modalID == 1) $scope.signUpModal.hide();
		else $scope.checkInModal.hide();
	};

	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.signUpModal.remove();
		$scope.checkInModal.remove();
	});
})

.controller('CheckinCtrl', function($scope, $state, $ionicFilterBar, $timeout) {
	
	var filterBarInstance;

	var currentShiftIndex;
	var currentUncheckedVols = [];
	var currentCheckedVols = [[],[]];
    function getItems () {

		//	Hide shift selector when there's only one shift for the current day

		$scope.doRefresh = function(selector) {
			currentUncheckedVols[currentShiftIndex] = $scope.uncheckedVolunteers;
			currentCheckedVols[currentShiftIndex] = $scope.checkedVolunteers;	
			$scope.uncheckedVolunteers = currentUncheckedVols[selector.options[selector.selectedIndex].value];
			$scope.checkedVolunteers = currentCheckedVols[selector.options[selector.selectedIndex].value];
			currentShiftIndex = selector.options[selector.selectedIndex];
			$scope.$broadcast('scroll.refreshComplete');
		};


		window.updateShifts = function updateShifts(selector){
			$scope.doRefresh(selector);
		}

		var shift1Vols = ["Jim Sanchez", "Carl Wheezer", "Dwayne 'The Rock' Johnson", "Marge Simpson"];
		var shift2Vols = ["Slaton Spangler", "Kyle Knight", "Darren White", "Darren Black", "John Cena", "Barry White"];
		currentUncheckedVols.push(shift1Vols);
		currentUncheckedVols.push(shift2Vols);

		var shiftNames = ["3/2/17 - CU Boulder", "ANOTHER PLACE"];
		var shiftSelector = document.createElement('select');

		shiftSelector.setAttribute("onChange", "updateShifts(this);");
		for(var i = 0; i < shiftNames.length; i++){
			var opt = document.createElement("option");
			opt.value = i;
			opt.innerHTML = shiftNames[i]; 
			shiftSelector.appendChild(opt);
		}
		
		document.getElementById("shiftSelector").appendChild(shiftSelector);
		var uncheckedVolunteers;
		var checkedVolunteers;
		//This is where we'll put the call to get the volunteer lists for shifts occuring 'today'
	
		for(var i = 0; i < currentUncheckedVols.length; i++){
			for(var j = 0; j < currentUncheckedVols[i].length; j++){
				currentUncheckedVols[i][j] = ({text: currentUncheckedVols[i][j], selected: false, deleted: false});
			}
			currentShiftIndex = 0;
			$scope.uncheckedVolunteers = currentUncheckedVols[currentShiftIndex];
			$scope.checkedVolunteers = currentCheckedVols[currentShiftIndex];
			$scope.multiShift = true;
		}
	}

	$scope.hide = "";
	$scope.removeItems = function () { 
		for(var i = $scope.uncheckedVolunteers.length -1; i >= 0; i--){ //Traversing backwards to preserve indices of yet-to-be-reoved items
			if($scope.uncheckedVolunteers[i].selected){
				$scope.uncheckedVolunteers[i].deleted = true;
				var removed = $scope.uncheckedVolunteers.splice(i, 1);
				$scope.checkedVolunteers.push(removed[0]);
			}
		}
	}; 

    getItems();

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.uncheckedVolunteers,
        update: function (filteredItems, filterText) {
          $scope.uncheckedVolunteers = filteredItems;
		},

		done: function(){
			$scope.hide = "hidden";
		},

		cancel: function (){
			$scope.hide = "";
			for(var i = $scope.uncheckedVolunteers.length-1; i >= 0; i--){
				if($scope.uncheckedVolunteers[i].deleted){
					$scope.uncheckedVolunteers.splice(i, 1);
				}
			}
		}
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
		
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
})

.controller('AdminCtrl', function($scope, $state) {
	 
})

.controller('SettingsCtrl', function($scope) {
	$scope.settings = { 
		enableFriends: true
	};  
});


