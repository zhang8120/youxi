// JavaScript Document
var game={
	data:[],//单元格中的所有数字
	score:0,
	state:1,
	RUNNING:1,//保存游戏运行时的状态
	GAME_OVER:0,//保存游戏结束时的状态
	start:function(){//启动游戏时调用
		this.data=[[0,0,0,0],
				   [0,0,0,0],
				   [0,0,0,0],
				   [0,0,0,0]];
		
		//在两个随机位置生成2或4
		this.score=0;
		this.state=this.RUNNING;
		var div=document.getElementById("gameOver");
		div.style.display="none";
		this.randomNum();
		this.randomNum();
		this.updateView();
	},
	isFull:function(){//判断是否已满
		//遍历data数组
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
		//只要发现==0，就返回false
				if(this.data[row][col]==0){
					return false;
				}
		//如果退出循环，就返回true
			}
		}
		return true;
	},
	randomNum:function(){//在随机位置生成2或4
		if(this.isFull()){//如果满，就不再生成
			return;
		}
		//循环条件：true
		while(true){
			//循环体：
			//  随机在0-3行中生成一个行下标row
			var row=Math.floor(Math.random()*4);
			//  随机在0-3列中生成一个列下标col
			var col=Math.floor(Math.random()*4);
			//  如果该位置==0，随机选择2或4，放入该位置(如果MAth.random<0.5,选2;否则,选4)，退出循环
			if(this.data[row][col]==0){
				this.data[row][col]=Math.random()<0.5?2:4;
				break;
			}
		}
	},
	/*实现左移*/
	canLeft:function(){
		//遍历每个元素(最左侧列除外)，只要发现任意元素左侧值==0或当前值==左侧值，return true
		//如果循环正常结束，return false
		for(var row=0;row<4;row++){
			for(var col=1;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row][col-1]==0||this.data[row][col-1]==this.data[row][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	moveLeft:function(){//左移所有行
		if(this.canLeft()){//先判断能否左移
			for(var row=0;row<4;row++){
				this.moveLeftInRow(row);
			}
			this.randomNum();
			this.updateView();
		}
	},
	moveLeftInRow:function(row){//左移1行
		//从0位置开始到2结束遍历row行中的每个元素
		//获得下一个不为0的元素的nextCol的下标
		//如果nextCol==-1，break；否则，判断合并
		//如果自己==0，用下一个元素的值替换自己，将下一个元素的值设为0，让col留在原地
		//如果自己==下一个元素，将自己*2，将下一个元素设置为0
		for(var col=0;col<=2;col++){//最右不必检查
			var nextCol=this.getNextRight(row,col);
			if(nextCol==-1){ break;
			}else{
		    	if(this.data[row][col]==0){
					this.data[row][col]=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					col--;
				}else if(this.data[row][col]==this.data[row][nextCol]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[row][nextCol]=0;
				}
			}
		}
	},
	getNextRight:function(row,col){//获得当前行中，指定位置右侧第一个不为0的数的位置
		//遍历当前位置右侧元素，只要返回!=0的，就返回下一个位置nextCol
		//退出循环，返回-1
		for(var i=col+1;i<4;i++){
			if(this.data[row][i]!=0){
				return i;
			}
		}
		return -1;
	},
	/*实现右移*/
	canRight:function(){
		for(var row=0;row<4;row++){
			for(var col=0;col<3;col++){
				if(this.data[row][col]!=0){
					if(this.data[row][col+1]==0||this.data[row][col+1]==this.data[row][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	moveRight:function(){//左移所有行
	    if(this.canRight()){
			for(var row=0;row<4;row++){
				this.moveRightInRow(row);
			}
			this.randomNum();
			this.updateView();
		}
	},
	moveRightInRow:function(row){//右移1行
		for(var col=3;col>=1;col--){
			var nextCol=this.getNextLeft(row,col);
			if(nextCol==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					col++;
				}else if(this.data[row][col]==this.data[row][nextCol]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[row][nextCol]=0;
				}
			}
		}
	},
	getNextLeft:function(row,col){
		for(var i=col-1;i>=0;i--){
			if(this.data[row][i]!=0){
				return i;
			}
		}
		return -1;
	},
	/*实现上移*/
	canUp:function(){
		for(var row=1;row<4;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row-1][col]==0||this.data[row-1][col]==this.data[row][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	moveUp:function(){
		if(this.canUp()){
			for(var col=0;col<4;col++){
				this.moveUpInCol(col);
			}
			this.randomNum();
			this.updateView();
		}
	},
	moveUpInCol:function(col){
		for(var row=0;row<3;row++){
			var nextRow=this.getNextDown(row,col);
			if(nextRow==-1){ break;
			}else{
		    	if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextRow][col];
					this.data[nextRow][col]=0;
					row--;
				}else if(this.data[row][col]==this.data[nextRow][col]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[nextRow][col]=0;
				}
			}
		}
	},
	getNextDown:function(row,col){
		for(var i=row+1;i<4;i++){
			if(this.data[i][col]!=0){
				return i;
			}
		}
		return -1;
	},
	/*实现下移*/
	canDown:function(){
		for(var row=0;row<3;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row+1][col]==0||this.data[row+1][col]==this.data[row][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	moveDown:function(){
		if(this.canDown()){
			for(var col=0;col<4;col++){
				this.moveDownInCol(col);
			}
			this.randomNum();
			this.updateView();
		}
	},
	moveDownInCol:function(col){
		for(var row=3;row>=1;row--){
			var nextRow=this.getNextUp(row,col);
			if(nextRow==-1){ break;
			}else{
		    	if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextRow][col];
					this.data[nextRow][col]=0;
					row++;
				}else if(this.data[row][col]==this.data[nextRow][col]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[nextRow][col]=0;
				}
			}
		}
	},
	getNextUp:function(row,col){
		for(var i=row-1;i>=0;i--){
			if(this.data[i][col]!=0){
				return i;
			}
		}
		return -1;
	},
	updateView:function(){
		//Step1:遍历二维数组中的每个元素
		//Step2:找到和当前元素对应的div，拼div的id:c+row+col
		//var div=document.getElementById(id);
		//Step3:将当前元素的值放入div中(div.innerHTML=?)，如果当前值==0，放入""，否则放入当前值
		//Step4:根据当前元素值修改div样式类，div.className="类名"，如果当前值==0，className="cell",否则className="cell n"+当前值
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				var div=document.getElementById("c"+row+col);
				div.innerHTML=this.data[row][col]==0?"":this.data[row][col];
				div.className=this.data[row][col]==0?"cell":"cell n"+this.data[row][col];
			}
		}
		//将分数放入span
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		//判断游戏结束
		//如果游戏结束，this.state=this.GAME_OVER,显示游戏结束div,修改style.display
		if(this.isGameOver()){
			this.state=this.GAME_OVER;
			var div=document.getElementById("gameOver");
			var finalScore=document.getElementById("finalScore");
			finalScore.innerHTML=this.score;
			div.style.display="block";
		}
	},
	isGameOver:function(){
		/*如果不满，返回false
		如果任意一个元素周围有与之相同的元素，返回false*/
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]==0){
					return false;
				}
				if(row<3){//检查下方相邻
					if(this.data[row+1][col]==this.data[row][col]){
						return false;
					}
				}
				if(col<3){//检查右侧相邻
					if(this.data[row][col+1]==this.data[row][col]){
						return false;
					}
				}
			}
		}
		return true;
	}
}
//窗口加载后，调用game对象的start方法
window.onload=function(){//事件处理函数
	game.start();
	document.onkeydown=function(){
		if(game.state==game.RUNNING){
		//Step1:先获得事件对象
		//所有事件发生时都自动创建一个event对象
		//event对象中封装了事件信息，比如：鼠标的坐标，触发事件的元素，按键的编号
			var event=window.event||arguments[0];//"||"经常用于解决浏览器兼容性问题    IE||其他
			//Step2:获得事件对象中的按键号,如果是37号，调用moveLeft
			if(event.keyCode==37){
				game.moveLeft();
			}else if(event.keyCode==38){
				game.moveUp();
			}else if(event.keyCode==39){
				game.moveRight();
			}else if(event.keyCode==40){
				game.moveDown();
			}
		}else if(event.keyCode==13){
			game.start();
		}
	}
}