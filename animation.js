function showNumberAnimation(i,j,num){
    //获取到当前元素
    let curnumbercell = $('#number-cell-'+i+'-'+j);
    curnumbercell.text(num);
    curnumbercell.css("background-color",getBackgroundColor(num));
    curnumbercell.css("color",getTextColor(num));

    curnumbercell.animate({
        "height":"100px",
        "width":"100px",
        "top":getTopPosition(i,j),
        "left":getLeftPosition(i,j),
    },50);
}


//number cell是肉眼可见的动来动去的，不动的是grid-cell。所以需要实现一个动画
function showMoveanimation(fromx,fromy,tox,toy){
    let curnumbercell = $('#number-cell-'+fromx+'-'+fromy);
    //改变一下这个元素的位置，还是这个元素，但是top和left改变，就可以看到其有移动的过程
    curnumbercell.animate({
        "top":getTopPosition(tox,toy),
        "left":getLeftPosition(tox,toy)
    },200);
}
