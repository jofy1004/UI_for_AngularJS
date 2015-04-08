(function(angular) {
    /**
     * 数字控件
     */
    angular.module("commonServices").directive("cccNumberInput", function() {
        return {
            restrict : "AE",
            require : 'ngModel',
            scope : {
                value : "=ngModel",
                digit : "@",
                decimal : "@"
            },
            template : "<input ng-model='value' class='k-textbox'/>",
            link : function($scope, $element, $attr) {
                $scope.digit = $scope.digit ? $scope.digit : 8;
                $scope.decimal = $scope.decimal ? $scope.decimal : 2;
                $element.find("input").decimalInput($scope.digit, $scope.decimal, 0);
            }
        }
    });

})(window.angular);