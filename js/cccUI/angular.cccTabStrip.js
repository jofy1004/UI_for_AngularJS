// angular的公共模块定义列在这里面
(function (window, angular, undefined) {
    angular.module("commonServices").directive("cccTabStrip",CCCTabStripDirective);
    CCCTabStripDirective.$inject = ["ErrorService"];

    function CCCTabStripDirective(ErrorService){
        return {
            replace:true,
            scope:{
                activeId:'='
            },
            restrict:'AE',
            link:function($scope,$element,$attrs){
                var scope = $scope.$parent;
                //默认显示第一个Tab页面
                scope.selectedIndex = 0;
                //默认显示panelbar下面的内容
                scope.toggle = true;
                //找到最近的
                var $liArray = $element.find("ul:eq(0)").children();
                /**
                 * 绑定tabStrip中每个tab的事件
                 */
                $liArray.click(function(e){
                    var that = this;
                    //设置选中被点击的li标签
                    scope.$apply(function(){
                        scope.selectedIndex = _.indexOf($liArray,that);
                    });
                });
                /**
                 * panelBar隐藏和显示切换
                 * @param e
                 */
                scope.contentToggle = function(e){
                    if(e && e.target){
                        if(e.target.nodeName == 'UL'){
                            scope.toggle = !scope.toggle;
                        }
                    }else{
                        scope.toggle = !scope.toggle;
                    }
                };

                scope.activeTabId = function(tabId){
                    return ErrorService.errorModel.tabId;
                };

                if($attrs['activeId']){
                    $scope.$watch('activeId',function(newVal,oldVal){
                        if(newVal && newVal != oldVal){
                            _.each($liArray,function(obj,index){
                                if(obj.id == newVal){
                                    scope.selectedIndex = _.indexOf($liArray,obj);
                                }
                            });
                        }
                    })
                }
            }
        }
    }
})(window,window.angular);