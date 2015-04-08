// angular的公共模块定义列在这里面
(function(window, angular) {
    angular
            .module("commonServices")
            .directive(
                    "cccClickDropdownInput",
                    function($timeout) {
                        return {
                            require : 'ngModel',
                            scope : {
                                itemValue : "=ngModel",
                                codeType : "@",
                                canEdit : "&"
                            },
                            restrict : 'AE',
                            replace : false,
                            template : '<div>\
                                            <span ng-if="editModel===\'readOnly\">\
                                                {{$parent.itemValue|getCodeName:$parent.codeType}}\
                                            </span>\
                                            <select ng-if="editModel===\'editable\'"  ng-model="$parent.selectedOption"\
                                                ng-options="op.text for op in options" class="k-select"  ng-selected="op.value==$parent.itemValue"\
                                                ng-change="$parent.toReadOnly()" ng-blur="$parent.toReadOnly()">\
                                            </select>\
                                        </div>',
                            link : function($scope, $element, $attrs, $rootScope) {
                                var itemValue = $scope.itemValue;
                                //dropdown bind ngmodel
                                $scope.selectedOption = null;
                                //init the editable model of the controller
                                $scope.editModel = "readOnly";
                                /**
                                 * switch model to editable
                                 */
                                $element.click(function() {
                                    var canEdit = $scope.canEdit();
                                    $scope.$apply(function() {
                                        $scope.editModel = canEdit === true ? "editable" : "readOnly";
                                    });
                                    $timeout(function() {
                                        var $input = $element.find("select");
                                        $input.focus();
                                    }, 0);
                                });
                                /**
                                 * switch model to readOnly
                                 */
                                $scope.toReadOnly = function() {
                                    $scope.editModel = "readOnly";
                                    $scope.itemValue = $scope.selectedOption.value;
                                    if (itemValue != $scope.itemValue) {
                                        $scope.$parent.item.dirty = true;
                                    }
                                    //没有操作类型的定损项目，在编辑操作类型的时候才触发添加动作
                                    if (!itemValue && $scope.itemValue && $scope.codeType == 'CD0024') {
                                        $timeout(function() {
                                            $.publish('addCustomClaimItem');
                                        }, 0);
                                    }
                                };
                                //init the dropdown options
                                /*$scope.options = CodeTable.getCodesByType($scope.codeType);
                                //init default value of dropdown
                                _.each($scope.options,function(op){
                                    if(op.value == $scope.itemValue){
                                        $scope.selectedOption = op;
                                    }
                                });*/
                            }
                        }
                    });
})(window, window.angular);