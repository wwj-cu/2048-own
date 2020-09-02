//将board和added设置成全局对象，在每个函数中都可以访问到和进行操作
var board = new Array();
var added = new Array();
var score = 0;
var top = 240;
$(document).ready(function(e){

    newgame();

})

function newgame(){
    //初始化棋盘格
    init();
    //产生两个随机数
    createOneNumber();
    createOneNumber();

}

//初试化，包括将一些参数进行初始化
//将指定的棋盘元素放到对应的位置
function init(){
    //初始化得分为0，gameover元素不显示
    score = 0;
    $("#score").innerHTML = score;
    $("#gameover").css('display','none');
    //将每个格子放到对应的位置上
    for(let i = 0; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j ++){
            let curcell = $("#grid-cell-"+i+"-"+j);
            //像这种求一个值的函数，放在support.js文件夹里
            curcell.css("top",getTopPosition(i,j));
            curcell.css("left",getLeftPosition(i,j));
        }
    }
    //将board和added全部置0
    for(let  i = 0 ; i < 4 ; i++){
        board[i] = new Array();
        for(let j = 0 ; j < 4 ; j++){
            board[i][j] = 0;
        }
    }
    for(let  i = 0 ; i < 4 ; i++){
        added[i] = new Array();
        for(let j = 0 ; j < 4 ; j++){
            added[i][j] = 0;
        }
    }
    //更新棋盘格前端样式
    updateBoardView();

}

//实现的是，根据board的变化，体现到前端的显示上,包括颜色显示、位置变化、大小变化
function updateBoardView(){
    $(".number-cell").remove();
    for(let i = 0 ; i < 4 ; i ++){
        for(let j = 0 ; j < 4 ; j ++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            let curnumbercell = $('#number-cell-'+i+'-'+j)
            if(board[i][j] == 0){
                curnumbercell.css("height","0");
                curnumbercell.css("width","0");
                curnumbercell.css("top",getTopPosition(i,j));
                curnumbercell.css("left",getLeftPosition(i,j));
            }else{
                curnumbercell.css("height","100px");
                curnumbercell.css("width","100px");
                curnumbercell.css("top",getTopPosition(i,j));
                curnumbercell.css("left",getLeftPosition(i,j));
                curnumbercell.text(board[i][j]);
                curnumbercell.css("background",getBackgroundColor(board[i][j]));
                curnumbercell.css("color",getTextColor(board[i][j]));
            }

        }
    }
}

function createOneNumber(){
    //如果棋盘格上没有空间了，就不能产生随机数了。
    if(noSpace(board)){
        return false;
    }
    //要判断这个随机的位置上是不是已经有数了，必须得保证是空白的格子才可以。就一直的循环，直到发现这个位置上没数再break。
    while(true){
        //随机x位置和随机y位置都是属于0 1 2 3
        var randx = parseInt(Math.floor(Math.random()*4)) ;
        var randy  = parseInt(Math.floor(Math.random()*4)) ;
        if(board[randx][randy] == 0){
            break;
        }
    }
    //注意变量作用域的问题，如果你将randx和randy都设置成let的话，则只在while循环作用域内有效，在外面是获取不到的
    let randnum = Math.random()<0.5 ? 2 : 4;
    board[randx][randy] = randnum;
    //创造出一个随机数之后，再将这个随机数以动画的显示显示出来。上面的updateBoardView，是将整个board重新判断样式并渲染，有点浪费，这里就定义一个，只显示某个数字的函数
    showNumberAnimation(randx,randy,randnum);
}

$(document).keydown(function(event){
    switch (event.keyCode) {
        //如果keyCode是37的话，按下的是左键。每次移动之后，要执行四步操作：（1）移动  （2）判断score （3）重新再产生一个随机数  （4）判断游戏是否结束
        case 37:
            //如果左移了，才会进行下面的操作，有可能没办法左移
            //在这个地方，board是有值的，但是为啥无法调用函数进行判断呢？
            if(moveleft(board)){
                getscore();
                createOneNumber();
                isgameover();
            }
            break

        case 38:
            if(moveup(board)){
                getscore();
                createOneNumber();
                isgameover();
            }
            break
        case 39:
            if(moveright(board)){
                getscore();
                createOneNumber();
                isgameover();
            }
            break
        case 40:
            if(movedown(board)){
                getscore();
                createOneNumber();
                isgameover();
            }
            break
    }
})
function addedempty(){
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            added[i][j] = 0;
        }
    }
}
//注意每一次进行左移、上移、下移、右移操作，都必须先将added数组置0。
function moveleft(board){
    //如果不能左移，返回false
    if(!canMoveleft(board)){
        return false
    }
    addedempty();
    //可以左移的逻辑：对于每一行的元素来说，对其前面的目标位置进行遍历，如果目标位置的值为0或者值相等，同时二者之间又没有阻碍的话，就可以移动过来
    for(let i = 0 ; i < 4 ; i ++){
        //第一列数字是不可能左移的，从j=1开始
        for(let j = 1 ; j < 4 ; j++){
            //遍历前面目标位置。首先得满足，这个地方有值，再考虑对其进行移动操作
            if(board[i][j]!=0){
                for(let k = 0 ; k < j ; k ++){
                    //判断行是否阻塞，传递的参数为：左边列，行，右边列。第一种情况，目标位置为0，且中间不阻塞
                    if(board[i][k]==0 && noCrowBlocked(k,i,j,board)){
                        showMoveanimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        //跳出这层循环，查看下一个j，需要移动的节点
                        continue
                    }else if(board[i][k]==board[i][j] && noCrowBlocked(k,i,j,board)){
                        //如果目标位置的值和其相等，有两种情况，一种是这个目标位置是在这次左移行动中已经叠加过的值了，就不可以再叠加在这里。如果没叠加过，就可以叠加
                        if(added[i][k] == 0){
                            showMoveanimation(i,j,i,k);
                            board[i][k] = board[i][k]+board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score = score+board[i][k];
                        }
                        else{
                            showMoveanimation(i,j,i,k+1);
                            board[i][k+1] = board[i][j];
                            board[i][j] = 0;
                        }
                        continue
                    }
                }

            }
        }
    }
    //U最后一定要把棋盘格更新显示一下，因为你改变了你的board
    setTimeout(updateBoardView(),200);
    return true

}
function moveup(board){
    //如果不能上移，返回false
    if(!canMoveup(board)){
        return false
    }
    addedempty();
    //可以上移的逻辑：对于每一列的元素来说，对其前面的目标位置进行遍历，如果目标位置的值为0或者值相等，同时二者之间又没有阻碍的话，就可以移动过来
    for(let j = 0 ; j < 4 ; j ++){
        //第一列数字是不可能左移的，从j=1开始
        for(let i = 1 ; i < 4 ; i++){
            //遍历前面目标位置。首先得满足，这个地方有值，再考虑对其进行移动操作
            if(board[i][j]!=0){
                for(let k = 0 ; k < i ; k ++){
                    //判断行是否阻塞，传递的参数为：上边行，下边行，列。第一种情况，目标位置为0，且中间不阻塞
                    if(board[k][j]==0 && noColBlocked(k,i,j,board)){
                        showMoveanimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        //跳出这层循环，查看下一个j，需要移动的节点
                        continue
                    }else if(board[k][j]==board[i][j] && noColBlocked(k,i,j,board)){
                        //如果目标位置的值和其相等，有两种情况，一种是这个目标位置是在这次左移行动中已经叠加过的值了，就不可以再叠加在这里。如果没叠加过，就可以叠加
                        if(added[k][j] == 0){
                            showMoveanimation(i,j,k,j);
                            board[k][j] = board[k][j]+board[i][j];
                            board[i][j] = 0;
                            added[k][j] = 1;
                            score = score+board[k][j];
                        }
                        else{
                            showMoveanimation(i,j,k+1,j);
                            board[k+1][j] = board[i][j];
                            board[i][j] = 0;
                        }
                        continue
                    }
                }

            }
        }
    }
    //U最后一定要把棋盘格更新显示一下，因为你改变了你的board
    setTimeout(updateBoardView(),200);
    return true
}
function moveright(board){
    //如果不能右移，返回false
    if(!canMoveright(board)){
        return false
    }
    addedempty();
    //可以右移的逻辑：对于每一行的元素来说，对其右面的目标位置进行遍历，如果目标位置的值为0或者值相等，同时二者之间又没有阻碍的话，就可以移动过来
    for(let i = 0 ; i < 4 ; i ++){
        //第一列数字是不可能左移的，从j=1开始
        for(let j = 2 ; j >=0 ; j--){
            //遍历前面目标位置。首先得满足，这个地方有值，再考虑对其进行移动操作
            if(board[i][j]!=0){
                //对其右边的目标位置进行遍历，这个地方要注意，是从最最右边的那个位置开始看，k=3，然后逐个往左走
                for(let k = 3 ; k > j ; k --){
                    //判断行是否阻塞，传递的参数为：左边列，行，右边列列。第一种情况，目标位置为0，且中间不阻塞
                    if(board[i][k]==0 && noCrowBlocked(j,i,k,board)){
                        showMoveanimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        //跳出这层循环，查看下一个j，需要移动的节点
                        continue
                    }else if(board[i][k]==board[i][j] && noCrowBlocked(j,i,k,board)){
                        //如果目标位置的值和其相等，有两种情况，一种是这个目标位置是在这次左移行动中已经叠加过的值了，就不可以再叠加在这里。如果没叠加过，就可以叠加
                        if(added[i][k] == 0){
                            showMoveanimation(i,j,i,k);
                            board[i][k] = board[i][k]+board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score = score+board[i][k];
                        }
                        else{
                            showMoveanimation(i,j,i,k-1);
                            board[i][k-1] = board[i][j];
                            board[i][j] = 0;
                        }
                        continue
                    }
                }

            }
        }
    }
    //U最后一定要把棋盘格更新显示一下，因为你改变了你的board
    setTimeout(updateBoardView(),200);
    return true

}
function movedown(board){
    //如果不能下移，返回false
    if(!canMovedown(board)){
        return false
    }
    addedempty();
    //可以下移的逻辑：对于每一行的元素来说，对其后面的目标位置进行遍历，如果目标位置的值为0或者值相等，同时二者之间又没有阻碍的话，就可以移动过来
    for(let j = 0 ; j < 4 ; j ++){
        //第一列数字是不可能左移的，从j=1开始
        for(let i = 2 ; i >=0 ; i--){
            //遍历前面目标位置。首先得满足，这个地方有值，再考虑对其进行移动操作
            if(board[i][j]!=0){
                for(let k = 3 ; k > i ; k --){
                    //判断行是否阻塞，传递的参数为：上边行，下边行，列。第一种情况，目标位置为0，且中间不阻塞
                    if(board[k][j]==0 && noColBlocked(i,k,j,board)){
                        showMoveanimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        //跳出这层循环，查看下一个j，需要移动的节点
                        continue
                    }else if(board[k][j]==board[i][j] && noColBlocked(i,k,j,board)){
                        //如果目标位置的值和其相等，有两种情况，一种是这个目标位置是在这次左移行动中已经叠加过的值了，就不可以再叠加在这里。如果没叠加过，就可以叠加
                        if(added[k][j] == 0){
                            showMoveanimation(i,j,k,j);
                            board[k][j] = board[k][j]+board[i][j];
                            board[i][j] = 0;
                            added[k][j] = 1;
                            score = score+board[k][j];
                        }
                        else{
                            showMoveanimation(i,j,k-1,j);
                            board[k-1][j] = board[i][j];
                            board[i][j] = 0;
                        }
                        continue
                    }
                }

            }
        }
    }
    //U最后一定要把棋盘格更新显示一下，因为你改变了你的board
    setTimeout(updateBoardView(),200);
    return true

}

//更新显示得分
function getscore(){
    //为什么改成这种普通的js获取和设置元素的形式就可以了，原来的jQuery写法会报错。？
    document.getElementById("score").innerHTML=score;
}

function isgameover(){
    //如果此时棋盘上没有空间了，同时也不能再移动进行合并了，则证明游戏结束了，要改变游戏结束的显示模式。
    if(noSpace(board)&& noMove(board)){
        $("#gameover").css('display','block');
    }
}



function canMoveleft(board){
    //对于左移操作来说，判断所有行，和第123列，只要有一个元素可以左移，则这个函数就返回true
    for(var i = 0;i<4;i++)
        for(var j = 0;j<4;j++)
            //如果这个位置有值（不为0），最左边的一列元素
            if( board[i][j] !=0 && j != 0)
                //如果它左面那一个没有数字，或者左面那一个和它是相等的，就可以往左移动
                if( board[i][j-1] == 0 || board[i][j-1] == board[i][j])
                    return true;
    return false;
    //否则不能往左移动
}
//我应该在这个地方，debug一下，看看board里面是什么内容？
function canMoveup(board){
    //对于上移操作来说，判断所有列，和第123行，只要有一个元素可以左移，则这个函数就返回true
    for(var i = 0 ; i < 4 ; i ++){
        for(var j = 0 ; j < 4 ; j++){
            //对每一个元素来说，它上边的元素为空，或者是和它本身的值相等，是可以上移的
            if(board[i][j]!=0 && i!=0){
                if(board[i-1][j]==0 || board[i-1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;

}
function canMoveright(board){
    //对于右移操作来说，判断所有行，和第012列，只要有一个元素可以右移，则这个函数就返回true
    for(var i = 0 ; i < 4 ; i ++){
        for(var j = 0 ; j < 4 ; j++){
            //对每一个元素来说，它右边的元素为空，或者是和它本身的值相等，是可以右移的
            if(board[i][j]!=0 && j!=3) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true
                }
            }
        }
    }
    return false;

}
function canMovedown(board){
    //对于左移操作来说，判断所有列，和第012行，只要有一个元素可以下移，则这个函数就返回true
    for(var i = 0 ; i < 4 ; i ++){
        for(var j = 0 ; j < 4 ; j++){
            //对每一个元素来说，它左边的元素为空，或者是和它本身的值相等，是可以左移的
            if(board[i][j]!=0 && i!=3){
                if(board[i+1][j]==0 || board[i+1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;

}

