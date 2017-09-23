/**
 * Created by Tao on 9/22/2017.
 */
function Snake(){
    var _SPEED = 150;  // milliseconds between update
    var _SIZE = 15;    // block size
    var _LENGTH = 2;   // length of the initial snake
    var running;
    var turned;
    var set;
    var score;
    var loop;
    var width;
    var height;
    var positions;
    var direction;
    var blocks;
    var tail;
    var head;
    var that = this;

    this.setup = function() {
        running = false;        // if a game has been started
        set = false;            // if a game is ready
        turned = false;         // to keep from turning more than once per update


        score = 0;

        width = 0;              // number of tiles across
        height = 0;             // number of tiles top to bottom

        positions = null;       // 2D array to keep track of positions

        loop = null;            // interval loop object

        direction = {           // direction to update in
            x: 1,
            y: 0
        };
        blocks = [];

        tail = null;            // pointer to the tail block
        head = null;

        // clear the old blocks
        blocks = [];
        const elements = document.getElementsByClassName("block");
        while( elements.length >0 ){
            elements[0].remove();
        }
        var message = document.getElementById("message");
        message.style.display = 'none';

        // resize window
        that.resizeWindow();

        // create position array
        positions = new Array(width);
        for (var j = 0; j < width; j++) {
            positions[j] = new Array(height);
            for (var k = 0; k < height; k++) {
                positions[j][k] = 0;
            }
        }

        // initialize snake
        for (var i = _LENGTH - 1; i >= 0; i--) {
            that.createBlock(i, 0);
        }
        head = blocks[0];

        // place food
        var food = document.getElementById("food");
        food.style.height =  _SIZE + "px";
        food.style.width = _SIZE + "px";
        that.placeFood();

        set = true;
    };

    this.start = function(){
        loop = setInterval(that.update, _SPEED);
        console.log(_SPEED);
        running = true;
    };

    this.checkPosition = function (x, y){
        if(x < 0|| x >= width || y < 0 || y >= height)
            return 1;
        return positions[x][y];
    };

    this.update = function(){
        // set new position
        var x = head.x + direction.x;
        var y = head.y + direction.y;

        // check position
        var check = that.checkPosition(x, y);
        if (check == 1) {                   // hit something
            that.gameOver();
            return;
        }
        else if (check == 2) {              // hit food
            score++;
            that.createBlock(0,0);
            that.placeFood();
        }

        // move tail block to front
        positions[tail.x][tail.y] = 0;
        positions[x][y] = 1;
        that.moveTo(tail, x, y);

        // update linked list
        head.next = tail;
        head = tail;
        tail = tail.next;

        turned = false;
    };


    this.placeFood = function(){
        var x = Math.floor(width*Math.random());
        var y = Math.floor(height*Math.random());
        var food = document.getElementById("food");
        //this position is not one point of snake
        if(positions[x][y] == 0){
            that.moveTo(food, x, y);
            positions[x][y] = 2;
            food.x = x;
            food.y = y;
        }else
            that.placeFood();
    };

    this.moveTo = function (block, x,y){
        block.style.top = y * _SIZE + "px";
        block.style.left = x * _SIZE + "px";
        block.x = x;
        block.y = y;
    };

    this.createBlock = function (x, y) {
        var block = document.createElement("div");
        var board = document.getElementById("board");
        block.className = "block";
        block.style.height =  _SIZE + "px";
        block.style.width = _SIZE + "px";

        that.moveTo(block, x, y);                            // position the block
        block.x = x;
        block.y = y;
        positions[x][y] = 1;

        block.next = tail;                              // update linked list
        tail = block;

        blocks.push(block);
        board.append(block);
    };

    this.resizeWindow = function () {

        var windowWidth = window.innerWidth * 0.9;
        var windowHeight = window.innerHeight * 0.7;
        var board = document.getElementById("board");
        board.style.height =  Math.floor(windowHeight / _SIZE) * _SIZE;
        board.style.width =  Math.floor(windowWidth / _SIZE) * _SIZE;
        height = Math.floor(windowHeight / _SIZE);
        width = Math.floor(windowWidth / _SIZE);
    };

    this.gameOver = function(){
        window.clearInterval(loop);
        running = false;
        var message = document.getElementById("message");
        message.innerHTML = "";
        message.append(score);
        message.style.display = 'block';
        score = 0;
        set = false;
    };

    this.left = function () {
        direction = {x: -1, y: 0};
    };

    this.right = function(){
        direction = {x: 1, y: 0};
    };

    this.up = function () {
        direction = {x: 0, y: -1};
    };

    this.down = function (){
        direction = {x: 0, y: 1};
    };

    this.keyHandler = function (e) {

        // arrow keys
        if (running && !turned) {
            if (e.keyCode == 37 && direction.y != 0) that.left();
            else if (e.keyCode == 38 && direction.x != 0) that.up();
            else if (e.keyCode == 39 && direction.y != 0) that.right();
            else if (e.keyCode == 40 && direction.x != 0) that.down();
            else {}
            turned = true;
        }

        // space bar
        if (e.keyCode == 32) {
            if(!set){
                set = true;
                that.setup();
            }
            if(!running){
                running = true;
                that.start();
            }
            else if(running){
                window.clearInterval(loop);
                running = false;
            }
        }
    };
}