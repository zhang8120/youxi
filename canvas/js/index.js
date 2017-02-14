//人物
function person (canvas,cobj,running,jumps){
    this.canvas=canvas;
    this.cobj=cobj;
    this.running=running;
    this.jumps=jumps;
    //this.person=new person(canvas,cobj,running);
    this.width=113;
    this.height=110;
    this.status="running";
    this.state=0;
    this.x=0;
    this.speedx=3;
    this.backspeed=8;
    this.y=500
    this.life=5;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        //this.cobj.drawImage(this[this.status][this.state],0,0,226,220,0,0,this.width,this.height);
        this.cobj.drawImage(this[this.status][this.state], 0, 0, 226, 220, 0, 0, this.width, this.height);
        //alert(this[this.status][this.state])
        this.cobj.restore();
    }
}
//障碍物
function hinderimg(canvas,cobj,hinders){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinders=hinders;
    this.state=0;
    this.width=50;
    this.height=50;
    this.x=canvas.width-20;
    this.y=510;
    this.speedx=10
}
hinderimg.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinders[this.state],0,0,100,100,0,0,this.width,this.height);
        //console.log(this.state)
        this.cobj.restore();
    }
}
//血
function lizi(cobj) {
    this.cobj=cobj;
    //this.x = 250;
    //this.y = 250;
    this.r =2 * Math.random()+1;
    this.color="rgb(226,17,12)"
    this.speedy =Math.random()*8-4;;
    this.speedx=Math.random()*4-2;
    this.zhongli=0.3
    this.speedr = 0.1
}
lizi.prototype = {
    draw: function () {
        this.cobj.save();
        this.cobj.translate(this.x, this.y);
        this.cobj.beginPath();
        this.cobj.fillStyle = this.color;
        this.cobj.arc(0, 0, this.r, 0, 2 * Math.PI);
        this.cobj.fill();
        this.cobj.restore();
    },
    update: function () {
        this.x +=this.speedx;
        this.y += this.speedy;
        this.speedy+=this.zhongli
        this.r -= this.speedr;
    }
}
function zidan(canvas,cobj){
    this.x=0;
    this.y=0;
    this.width=50;
    this.height=10;
    this.color="green";
    this.speedx=5;
    this.jia=1;
    this.cobj=cobj;
    this.canvas=canvas;
}
zidan.prototype={
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.fillStyle=this.color;
        cobj.fillRect(0,0,this.width,this.height);
        cobj.restore();
    }
};
function xue(cobj,x,y){
    var arr = [];
    for(var i=0;i<30;i++){
        var obj=new lizi(cobj)
        obj.x=x;
        obj.y=y;
        arr.push(obj);
    }
    var t=setInterval(function () {
        for (var i = 0; i < arr.length; i++) {
            arr[i].draw();
            arr[i].update();
            if (arr[i].r <= 0) {
                arr.splice(i,1)
            }

        }
        if (arr.length==0) {
            clearInterval(t);
        }
    },50)
}


//游戏制定动态规则
function game(canvas,cobj,running,jumps,hinders,scores,lifes){    //定义游戏的状态
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinders=hinders;
    this.hinderArr=[];
    this.score=0;
    this.scores=scores;
    this.lifes=lifes;
    this.width=canvas.width;
    this.height=canvas.height;
    //this.name=name
    this.isfire = false;
    this.person=new person(canvas,cobj,running,jumps);
    this.zidan=new zidan(canvas,cobj);
}
game.prototype={
    play:function(start,mask,end){
        //this.prompt("name","zhangsan")
        var that=this;
        var num=0;
        var num2=0;
        var num3=0;
        var  rand=Math.ceil(Math.random())*Math.ceil(Math.random());
        start.css("animation","start1 2s ease forwards");
        mask.css("animation","mask1 2s ease forwards");
        var t2=setInterval(function(){
            num3+=50;
            that.cobj.clearRect(0,0,that.width,that.height);
            num++;
            that.person.x+=that.person.speedx
            if(that.person.x>that.canvas.width/3){
                that.person.x=that.canvas.width/3;
            }
            if( that.person.status=="running"){
                that.person.state=num % 4;
            }else if(that.person.status=="jumps"){
                that.person.state=0;
            }
            that.person.draw();
            //背景变化
            num2-=that.person.backspeed;
            that.canvas.style.backgroundPositionX=num2+"px";
            //障碍物
            if(num3%rand==0){
                rand=Math.ceil(Math.random()*3)*Math.ceil(Math.random()*100+10);
                num3=0;
                var obj=new hinderimg(that.canvas,that.cobj,that.hinders);
                //alert(obj.state);
                obj.state=Math.floor(Math.random()*that.hinders.length);     //问题
                that.hinderArr.push(obj);
            }
            //alert(1)
            for (var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.hinderArr[i].speedx;
                that.hinderArr[i].draw();
                //碰撞检测
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    if(!that.hinderArr[i].flag){
                        that.person.life--;
                        that.lifes.html(that.person.life);
                        xue(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                        if (that.person.life==0){
                            clearInterval(t2);
                            end.css("animation","start2 2s ease forwards");
                            mask.css("animation","mask 2s ease forwards");
                            //location.reload();
                        }
                        that.hinderArr[i].flag=true;
                    }

                }
                if(that.person.x>(that.hinderArr[i].x+that.hinderArr[i].width)){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
                        that.score++;
                        that.scores.html(that.score);
                        //alert( that.score);
                        that.hinderArr[i].flag1=true;
                    }
                }
                if(that.isfire) {
                    if (hitPix(that.canvas, that.cobj, that.zidan, that.hinderArr[i])) {
                        // alert(1);
                    }
                }
            }
            if(that.isfire){
                if(that.zidan.x>that.width){
                    that.isfire=false;
                }
                that.zidan.speedx+=that.zidan.jia;
                that.zidan.x+=that.zidan.speedx;
                that.zidan.draw();
            }

        },50);
        that.key();
        that.mouse();
    },
    mouse:function(){
        var that=this;
        document.querySelector(".mask").onclick=function(){
            if(that.isfire){
                return false;
            }
            that.zidan.x=that.person.x+that.person.width/2;
            that.zidan.y=that.person.y+that.person.height/3;
            that.zidan.speedx=5;
            that.isfire=true;


        }
    },

    key:function(){
        var that=this;
        var flag=true;

        document.onkeydown=function(e){
            if(!flag){
                return;
            }
            flag=false;
            //var timeout
            if(e.keyCode==32){
                that.person.status="jumps";
                var init=0;
                var r=150;
                var speeda=10;
                var y=that.person.y;
                var t= setInterval(function(){
                    init+=speeda;
                    if(init>180){
                        that.person.y=y;
                        clearInterval(t);
                        flag=true;
                        that.person.status="running"
                    }else {
                        var top=Math.sin(init*Math.PI/180)*r;
                        that.person.y=y-top;
                    }
                },50)
            }
        }
    }


}
