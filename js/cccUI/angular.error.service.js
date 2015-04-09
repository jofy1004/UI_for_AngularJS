(function(window,angular,undefined){
    angular.module("commonServices")
        .factory("ErrorService",ErrorService)
        .directive("cccErrorList",CCCErrorListDirective);

    CCCErrorListDirective.$inject = ["ErrorService"];

    /**
     * Error Class
     * @type {Class|*}
     */
    window.ValidationModel = Class.extend({
        init : function(config){
            config = $.extend({},{
                type:"1",
                tabId: "",
                controlId: "",
                message:""
            },config);
            this.type = config.type;
            this.tabId = config.tabId;
            this.controlId = config.controlId;
            this.message = config.message;
        }
    });

    /**
     *  错误消息列表控制逻辑
     * @returns {{errorList: Array, errorModel: {activeErrorId: string, tabId: string}, addError: Function, hasError: Function, removeErrorByControlId: Function, activeErrorModel: Function, cleanErrorModel: Function, showImmediate: Function}}
     * @constructor
     */
    function ErrorService () {
        //
        var errorList =  [];
        var growlMap = new Map();
        return{
            errorList : errorList,
            errorModel : {
                activeErrorId :"",
                tabId:""
            },
            /**
             * 添加错误消息
             * @param error
             */
            addError : function(error){
                if(!this.hasError(error)){
                    this.errorList.push(error);
                }
            },
            hasError : function(error){
                return _.find(this.errorList,function(e){return e.controlId==error.controlId;});
            },
            /**
             * 删除错误消息
             * @param controlId
             */
            removeErrorByControlId:function(controlId){
                for(var i=0;i<this.errorList.length;i++){
                    if(controlId == this.errorList[i].controlId){
                        this.errorList.splice(i,1);
                        break;
                    }
                }
            },
            /**
             * 定位当前点击的错误消息
             * @param model
             */
            activeErrorModel : function(model){
                this.errorModel.tabId = model.tabId;
                this.errorModel.activeErrorId = model.controlId;
            },
            /**
             * 清除被激活的错误消息model
             */
            cleanErrorModel : function(){
                this.errorModel.activeErrorId = "";
                this.errorModel.tabId = "";
            },
            /**
             * 5min alert
             * @param error
             */
            showImmediate : function(error){
                this.addError(error);
                if(!growlMap.get(error.controlId)){
                    $.growl.notice({
                        title: "",
                        duration: 5000,
                        message: error.message,
                        complete: function () {
                            growlMap.remove(error.controlId);
                        }
                    });
                }
                growlMap.put(error.controlId,error);
            }
        }
    }

    function CCCErrorListDirective(ErrorService){
        return{
            replace:false,
            restrict: 'AE',
            template:'<span id="tipsBtn" class="button">' +
            '           <span class="buttonText minWidth110">' +
            '               <span> ' +
            '                   提 示  (<span id="errorNum" class="red">{{errorList.length}}</span>|<span id="warningNum">{{errorList.length}}</span>)' +
            '               </span>' +
            '           </span>' +
            '         </span>' +
            '        <div class="tipsInfo_content" ccc-window="{pinned:true,animation:false, modal:false, draggable: true, visible:false, resizable:false, width:400, height: 300, title: \'Error window\'}" window-visible="showWindow" window-close="onClose(e)" window-open="onOpen(e)" >' +
            '           <div class="mainTipsInfo" style="background: gainsboro;" ng-if="errorList.length>0">' +
            '            <h3>定损项目</h3>' +
            '            <ul>' +
            '              <li ng-repeat="error in errorList" style="background: beige;"  ng-click="activeModel(error)">' +
            '                   <span class="mainTipsIcon"></span>' +
            '                   <span class="tipsText">{{error.message}}</span>' +
            '              </li>' +
            '            </ul>' +
            '          </div>' +
            '       </div>',
            link : function($scope, $element, $attrs){
                //默认关闭错误消息window
                $scope.showWindow = false;
                //初始化错误错误消息列表
                $scope.errorList = ErrorService.errorList;
                /**
                 * 激活错误消息
                 * @param error
                 */
                $scope.activeModel = function(error){
                    ErrorService.activeErrorModel(error);
                };
                /**
                 * 打开或关闭错误消息窗口
                 */
                $element.on('click', function () {
                    $scope.$apply(function () {
                        $scope.showWindow = !$scope.showWindow;
                    });
                });
                $scope.onClose = function(){
                    $scope.showWindow = false;
                };
                $scope.onOpen = function(){

                };
            }
        };
    }
})(window,window.angular);