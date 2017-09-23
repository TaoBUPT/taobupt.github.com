/**
 * Created by Tao on 9/22/2017.
 */
document.addEventListener('DOMContentLoaded',function () {
    var snake = new Snake();
    this.onkeydown = function(e){
        snake.keyHandler(e);
    }
},false);
