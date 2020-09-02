function getTopPosition (i,j){
    return 20+i*120
}

function getLeftPosition(i,j){
    return 20+j*120
}

function getBackgroundColor(num){
    switch (num) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#eee4da";
            break;
        case 8:
            return "#f26179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e36";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#3365a5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6bc";
            break;
        case 8192:
            return "#93c";
            break;
    }
    return "black";
}

//如果是2或者4，显示灰色，如果是其他的数字，则显示白色
function getTextColor(num){
    if(num <= 4){
        return "#776e65";
    }else{
        return "white";
    }

}


function noSpace(board){
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            //只要有一个棋盘格式空的，则就是还有空间
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}

//为什么传过来的board是undefined？？？


//判断一行里，两个位置之间是否堵塞
function noCrowBlocked(colleft,crow,colright,board){
    for(let j = colleft+1 ; j < colright ; j++){
        if(board[crow][j] !== 0){
            return false;
        }
    }
    return true;

}
//判断一列里，两个位置之间是否堵塞.
function noColBlocked(crowup,crowdown,col,board){
    for(let j = crowup+1 ; j < crowdown ; j++ ){
        if(board[j][col] !== 0){
            return false;
        }
    }
    return true;
}

function noMove(board){
    //左、右、上、下都不能移动
    if(canMoveleft(board) || canMoveup(board) || canMoveright(board) || canMovedown((board))){
        return false;
    }
    return true;
}
