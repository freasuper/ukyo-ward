s_con = document.getElementById("subcontainer");
p_con = document.getElementById("piececontainer");
array_flug_piece = [];
for(let i = 0;i < arra.length;i ++){
    array_flug_piece[i] = false;
}
flug_piece_scale = false;
flug_piece_choosing = -1;
//町名を隠すか
flug_remove_name = false;
//最後ピースはめる時の補正  右と下
let x_ac = 8;
let y_ac = 8;
let rest_piece = arra.length

/*
array[0] = [52,48,76,92,"広河原尾花町","https://cdn-ak.f.st-hatena.com/images/fotolife/a/altimos-unizer/20230414/20230414031526.png"];
point_array[0] = [93,93,83,99,88,112,78,126,89,140,95,139,115,147,122,138,126,114,126,95,121,94,113,97];
*/

function change_container_size(n){
    let pi = document.getElementById("piececontainer");
    if(n * 80 > 390){
    pi.style.width = n * 80 + "px";
    }
}

change_container_size(arra.length);
//シャッフル関数
function shuffle(n){
    let a = [];
    let b = [];
    for(let i = 0;i < n;i ++){
        a[i] = i;
        b[i] = Math.random();
    }
    let flug_shuffle = false;
    while(!flug_shuffle){
    flug_shuffle = true;
        for(let i = 0;i < n - 1;i ++){
            if(b[i] > b[i + 1]){
                flug_shuffle = false;
                let x1 = b[i];
                let x2 = b[i + 1];
                b[i] = x2;
                b[i + 1] = x1;
                x1 = a[i];
                x2 = a[i + 1];
                a[i] = x2;
                a[i + 1] = x1;
            }
        }
    }
    return a;
}



for(let i = 0;i < arra.length;i ++){

    // 枠の大きさは70×140 
    //外枠は380 なので6個がギリ入らない
    //ピースの外枠
    let s = "<div class = 'piece_flame' id = 'piece_flame"+i+"'></div>";
    let selector = "#piece_flame" + i;
    $("#piececontainer").append(s);
    //ピースタイトル
    let sen = "<span>" +arra[i][4] + "</span>";
    $(selector).append(sen);
    //ピースの本体
    let di = "<div style='width:100%;height:100%;display:flex;align-items:center;justify-content:center;margin-left:auto;margin-right:auto'><div id = 'piece_"+i+"'></div><div>";
    $(selector).append(di);
    //基準サイズは50×100
    let w = arra[i][0];
    let h = arra[i][1];
    if(2 * w >= h){
    //横幅を50高さを縮小
    let scale = 50 * h / w;
        $("#piece_"+i).css("width","50px");
        $("#piece_"+i).css("height",scale+"px");
        
    }
    else {
    //高さを100横幅を縮小
        let scale = 100 * w / h;
         $("#piece_"+i).css("width",scale+"px");
         $("#piece_"+i).css("height","100px");
    }
    $("#piece_"+i).css("background-image","url("+arra[i][5]+")");
    
}
//各ピースにイベントリスナーつけてく

for(let i = 0;i < arra.length;i ++){
   let di = document.getElementById("piece_"+i);

  di.addEventListener("click",piece_scale,false);
}
//どれが押されているか返す
function piece_checked(){
    if(!flug_piece_scale){

        return -1;
    }
    else{
        for(let i = 0;i < arra.length;i ++){
           if(!array_flug_piece[i]){
            if(document.getElementById("piece_"+i).style.transform=="scale(1.3)"){

               return i;
            }
            }
        }
    }
}



//area要素を作っていく
function create_area(){
for(let i = 0;i < arra.length;i ++){

   
let s = "<area shape = 'poly' coords = "+ point_arra[i] +" class = 'piece_area' id='piece_area"+i+"' onclick='select_map("+i+")'/> ";
   $("#insert_map").append(s);

}
//すべてのareaを挿入した後に全体をカバーするレイヤーareaをはる
$("#insert_map").append("<area shape='rect' coords='0,0,380,575' id='layer_area'/>");
}
create_area();
//ピース選択でサイズが変わる
function piece_scale(){
//なにも選択していない
    if(!flug_piece_scale){ 
    flug_piece_scale = true;
    flug_piece_choosing = piece_checked();
        for(i = 0;i < arra.length;i ++){
           if(!array_flug_piece[i]){
            document.getElementById("piece_"+i).style.transform="scale(1.0)";
            document.getElementById("piece_"+i).style.border="";
            }
        }
        this.style.transform=" scale(1.3)";
        this.style.border = "solid red 2px";
    }
    else{
        if(this.style.transform=="scale(1.3)"){
           flug_piece_scale = false;
           this.style.transform = "scale(1.0)";
           this.style.border = "";
        }
        else{
            flug_piece_scale = true;
            for(i = 0;i < arra.length;i ++){
           if(!array_flug_piece[i]){
            document.getElementById("piece_"+i).style.transform="scale(1.0)";
            document.getElementById("piece_"+i).style.border="";
            }
        }
        this.style.transform="scale(1.3)";
        this.style.border="solid red 2px";
        }
    }
}

//全てはまっているかの真偽値を返す
function judge_all(){
  let x = 0;
    for(let i = 0;i < arra.length;i ++){
        if(array_flug_piece[i]){
            x ++;
        }
    }
    return x == arra.length;
}

function select_map(n){

    //ピースを選択中か
    //選択していない
    if(flug_piece_choosing == -1){
        alert("nul");
    }
    //選択している
    else {
    //選択されているピースの番号(piece_i)
        let flug_piece_choosing = piece_checked();
        if(n == flug_piece_choosing){
            //ハマリ判定
            //ピースの外枠の方
            $("#piece_flame"+n).remove();
            //ピースはめる
            let x = arra[n][2] + x_ac;
            let y = arra[n][3] + y_ac;
            let piece_style = "position:absolute;top:"+y+"px;left:"+x+"px;width:"+arra[n][0]+"px;height:"+arra[n][1]+"px;";
            $("#insert_map").append("<img src="+arra[n][5]+" style="+piece_style+">");
            rest_piece --;//❤❤
            change_container_size(rest_piece);
            array_flug_piece[n] = true;
            //町名いれる
      name_all_change();
    //ピースの本体
            //クリア時
            if(judge_all()){
                ending();
            }
        }
    }
}

//全部ハマった時
function ending(){
clearInterval(timer);
    alert("クリア");
    
}

//重なるのを防ぐため全部取り去ってまた付ける

function name_all_change(){
    for(let i = 0;i < arra.length;i ++){
        if(array_flug_piece[i]){
        //補正
        let a = arra[i][3] + 20;
            let d = "top:"+a+";left:"+arra[i][2]+";";
            let sen = "<div id='name_div"+i+"' style="+d+" class='piece_name_div'>"+arra[i][4]+"</div>";
            $("#name_div"+i).remove();
            if(!flug_remove_name){
            $("#insert_map").append(sen);
            }//❤❤
        }
    }
}

//タイマー


timer_m = 0;
timer_s = 0;
timer_ms = 0;
timer_value = "0:0.00";
setTimeout(function(){
$("#container").append("<div id='clock_div'>0:0.00</div>");
$("#container").append("<div id='letter_bt_div'><button onclick='name_hidden()' id ='letter_bt'>町名をかくす</button></div>")
timer = setInterval(function(){
    timer_clock();
},100);
},3200);

function timer_clock(){
    timer_ms += 10;
    if(timer_ms == 100){
        timer_ms = 0;
        timer_s ++;
        if(timer_s == 60){
            timer_s = 0;
            timer_m ++;
        }
    }
    let ms = (timer_ms == 0) ? "00" : timer_ms;
    timer_value = timer_m+":"+timer_s+"."+ms;
    document.getElementById("clock_div").innerHTML = (timer_value);
}

function name_hidden(){
    if(!flug_remove_name){
        flug_remove_name = true;

        document.getElementById("letter_bt").innerHTML=("町名をみせる");
    }
    else{
        flug_remove_name = false;
        document.getElementById("letter_bt").innerHTML=("町名をかくす");
    }
    name_all_change();
}
