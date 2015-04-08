// angular的公共模块定义列在这里面
(function(angular) {
    angular
            .module("commonServices")
            .directive(
                    "cccClickTextInput",
                    function($timeout) {
                        return {
                            require : 'ngModel',
                            scope : {
                                value : "=ngModel",
                                dirty : "=cccDirty",
                                canEdit : "&"
                            },
                            restrict : 'AE',
                            replace : false,
                            transclude : true,
                            template : '<span ng-transclude ng-if="editModel===\'readOnly\'"></span>\
                                        <input ng-if="editModel === \'editable\'" ng-model="$parent.value" class="k-textbox" ng-blur="$parent.toReadOnly()"/>',
                            link : function($scope, $element, $attrs, $ctrl) {
                                var value = $scope.value;
                                //init the editable model of the controller
                                $scope.editModel = "readOnly";
                                /**
                                 * switch model to editable
                                 */
                                $element.bind('click', function() {
                                    var canEdit = $scope.canEdit();
                                    $scope.$apply(function() {
                                        $scope.editModel = canEdit === true ? "editable" : "readOnly";
                                    });
                                    $timeout(function() {
                                        var $input = $element.find("input");
                                        $input.focus();
                                    }, 0);
                                });
                                /**
                                 * switch model to readOnly
                                 */
                                $scope.toReadOnly = function() {
                                    $scope.editModel = "readOnly";
                                    if (value != $scope.value) {
                                        $scope.dirty = true;
                                    }
                                };

                                /*if ($attrs["fieldError"] != "") {
                                    $scope.$watch($attrs["fieldError"], function(newVal, oldVal) {
                                        if (newVal != oldVal) {
                                            if (newVal) {
                                                $scope.editModel = "editable";
                                            }
                                        }
                                    });
                                }*/
                            }
                        }
                    });
})(window.angular);