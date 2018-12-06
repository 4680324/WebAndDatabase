(function(exports){

    exports.someSharedMethod = function(){
         // code here will be shared
    };
  
  }(typeof exports === 'undefined' ? this.utilities = {} : exports));