// angular的公共模块定义列在这里面
(function(window, angular) {
    angular
            .module("commonServices")
            .directive(
                    "cccClickNumberInput",
                    function($timeout) {
                        return {
                            require : 'ngModel',
                            scope : {
                                itemValue : "=ngModel",
                                fieldError : "=",
                                dirty : "=cccDirty",
                                digit : "@",
                                decimal : "@",
                                canEdit : "&"
                            },
                            restrict : 'AE',
                            replace : false,
                            transclude : true,
                            template : '<span ng-transclude ng-if="editModel===\'readOnly\'"/>\
                                        <input ng-if="editModel===\'editable\'" ng-class="{\'error\':error}" ng-model="$parent.itemValue" class="k-textbox" ng-blur="$parent.toReadOnly()"/>',
                            link : function($scope, $element, $attrs, $ctrl) {
                                $scope.digit = $scope.digit ? $scope.digit : 8;
                                $scope.decimal = $scope.decimal ? $scope.decimal : 2;
                                //init the editable model of the controller
                                $scope.editModel = "readOnly";
                                var itemValue = $scope.itemValue;

                                /**
                                 * switch model to editable
                                 */
                                $element.click(function() {
                                    var canEdit = $scope.canEdit();
                                    $scope.$apply(function() {
                                        $scope.editModel = canEdit === true ? "editable" : "readOnly";
                                    });
                                    $timeout(function() {
                                        var $input = $element.find("input");
                                        $input.focus().decimalInput($scope.digit, $scope.decimal, 0);
                                    }, 0);
                                });
                                /**
                                 * switch model to readOnly
                                 *
                                 */
                                $scope.toReadOnly = function() {
                                    $scope.editModel = "readOnly";
                                    $scope.error = false;
                                    if (itemValue != $scope.itemValue) {
                                        $scope.dirty = true;
                                    }
                                };

                                /*if ($attrs["fieldError"]!="") {
                                    $scope.$watch("fieldError", function (newVal, oldVal) {
                                        if (newVal) {
                                            $scope.editModel = "editable";
                                            $scope.error = true;
                                            $timeout(function(){
                                                var $input = $element.find("input");
                                                $input.focus().decimalInput($scope.digit,$scope.decimal,0);
                                            }, 0);
                                        }
                                        //当错误消息定位以后，需要将activeModel.activeErrorId的值置空
                                        ErrorService.cleanErrorModel();
                                    });
                                }*/
                            }
                        }
                    });
})(window, window.angular);