
var TINY={};
var Count_Alarm_History_Row_DB=0;

function T$(i){return document.getElementById(i)}
function T$$(e,p){return p.getElementsByTagName(e)}


TINY.table=function(){
    function sorter(n){this.n=n; this.pagesize=20; this.paginate=0}


    sorter.prototype.init=function(id_tbl,f){

        var Table=ge(id_tbl),i=0,cell;

        this.Id_Table=id_tbl;
        this.RowsLenght=Table.Rows.length;
        Table.a=[];
        Table.RowHead=T$$('thead',T$(id_tbl))[0].rows[0];
        Table.CellsLenght=Table.RowHead.cells.length;

        if(f!=null) {
            for (i; i < Table.CellsLenght; i++) {
                cell = Table.RowHead.cells[i];
                if (cell.className != 'nosort') {
                    cell.className = this.head;
                    cell.onclick = new Function(this.n + '.wk(this.cellIndex)');
                }
            }
        }else{
            for (i; i < Table.CellsLenght; i++) {
                cell = Table.RowHead.cells[i];
                if ((cell.className == 'desc')||(cell.className == 'asc')){cell.onclick = new Function(this.n + '.wk(this.cellIndex)');}
                else if (cell.className != 'nosort') {
                    cell.className = this.head;
                    cell.onclick = new Function(this.n + '.wk(this.cellIndex)');
                }
            }


        }

        for(i=0;i<this.RowsLenght;i++){Table.a[i]={};}

        //if(f!=null){var a=new Function(this.n+'.wk('+f+')'); a();}
        var a=new Function(this.n+'.wk('+f+')'); a();


        if(this.paginate){this.g=1; this.pages();}
    };


    sorter.prototype.wk=function(y){
        var Table=ge(this.Id_Table),i=0,row_temp,cells,z;
        var el_tbody = document.createElement('tbody'); el_tbody.id = 'id_Alarm_List_Tbody';

        if(y!=null){
            var x=Table.RowHead.cells[y];
            for(i=0;i<this.RowsLenght;i++){
                var v=Table.Rows[i].cells[y];
                //Table.Rows[i].style.display='';
                while(v.hasChildNodes()){v=v.firstChild}
                Table.a[i].Value=v.nodeValue?v.nodeValue:'';
                Table.a[i].Index=i;
            }


            for(i=0;i<Table.CellsLenght;i++){var c=Table.RowHead.cells[i]; if(c.className!='nosort'){c.className=this.head}}

            if(Table.p==y){Table.a.reverse(); x.className=Table.Orientation?this.asc:this.desc; Table.Orientation=Table.Orientation?0:1}
            else {Table.p=y; console.info('dddd'); alarm_history_db.change_data_arr(y,"ASC"); Table.Orientation=0; x.className=this.asc}


            if(Table.p==y) {
                //for(i=0;i<this.RowsLenght/5;i++){console.info(i);Table.a.sort(sort_datetime);}
                for (i = 0; i < this.RowsLenght; i++) {
                    row_temp = Table.Rows[Table.a[i].Index].cloneNode(true);
                    el_tbody.appendChild(row_temp);
                    row_temp.className = i % 2 == 0 ? this.even : this.odd;
                    cells = T$$('td', row_temp);
                    for (z = 0; z < Table.CellsLenght; z++) {cells[z].className = y == z ? i % 2 == 0 ? this.evensel : this.oddsel : '';}
                }
                Table.replaceChild(el_tbody, Table.b);if (this.paginate) {this.size(this.pagesize)}
            }

        }else{
            for(i=0;i<this.RowsLenght;i++) {
                row_temp = Table.Rows[i].cloneNode(true);
                el_tbody.appendChild(row_temp);
                row_temp.className = i % 2 == 0 ? this.even : this.odd;
                cells = T$$('td', row_temp);
                var sortNum=null;
                for (var ii in Table.RowHead.cells) {
                    if (!Table.RowHead.cells.hasOwnProperty(ii)){continue;}
                    if ((Table.RowHead.cells[ii].className=="asc")||(Table.RowHead.cells[ii].className=="desc")){sortNum=ii;}
                }

                for(z=0;z<Table.CellsLenght;z++){cells[z].className=sortNum==z?i%2==0?this.evensel:this.oddsel:'';}
            }
            Table.replaceChild(el_tbody,Table.b); if(this.paginate){this.size(this.pagesize)}
        }



    };


    sorter.prototype.page=function(s){
        var t=ge(this.Id_Table), i=0, l=s+parseInt(this.pagesize);
        if(this.currentid&&this.limitid){T$(this.currentid).innerHTML=this.g}
        for(i;i<this.RowsLenght;i++){t.Rows[i].style.display=i>=s&&i<l?'':'none'}
    };
    sorter.prototype.move=function(d,m){
        var s=d==1?(m?this.Orientation:this.g+1):(m?1:this.g-1);
        if(s<=this.Orientation&&s>0){this.g=s; this.page((s-1)*this.pagesize)}
    };
    sorter.prototype.size=function(s){
        this.pagesize=s; this.g=1; this.pages(); this.page(0);
        if(this.currentid&&this.limitid){T$(this.limitid).innerHTML=this.Orientation;}
    };

    sorter.prototype.pages=function(){this.Orientation=Math.ceil(this.RowsLenght/this.pagesize)};

    function ge(e){var tabl=T$(e); tabl.b=T$$('tbody',tabl)[0]; tabl.Rows=tabl.b.rows; return tabl}

    return{sorter:sorter}
}();




$(window).on('load', function() {
    alarm_history_tbl.init();
});

var alarm_history_tbl = new function () {
    this.init = function (){
        $('#id_Sort_Alarm_History').click(function () {
            alarm_history_tbl.sort(1);
        });
    };
    // Вешаем обработчик на элемент управления кол-вом строк
    this.add_row_arr = function (fl_highlight, tbl_arr, orientation) {
        var rowTpl = document.createElement("TR"),
            RowHead=T$$('thead',T$("id_Alarm_List_Table"))[0].rows[0],
            tbody = document.getElementById("id_Alarm_List_Tbody"),
            btn_full_histr=document.getElementById('id_Full_Alarm_History'),
            rowNum = 0,
            sort_size = document.getElementById("id_Sorter_Size_Select"),
            fields = {1:"val1", 2:"val2", 3:"val3", 4:"val4",5:"val5", 6:"val6", 7:"val7"},
            TD,i,txt,sortNum=null;

        for (var field in fields) {
            if (false === fields.hasOwnProperty(field)) {continue;}
            TD = document.createElement("TD");
            rowTpl.appendChild(TD);
        }

        for (i in RowHead.children) {
            if (!RowHead.children.hasOwnProperty(i)){continue;}
            if ((RowHead.children[i].className=="asc")||(RowHead.children[i].className=="desc")){sortNum=i; break;}
        }


        for (var field in fields) {}

        for (i in tbl_arr){
            if (!tbl_arr.hasOwnProperty(i)){continue;}
            var elem=rowTpl.cloneNode(true);
            elem.id=tbl_arr[i]['id_row_db'];
            elem.cells[0].innerText = tbl_arr[i]["alarm_zone"];
            elem.cells[1].innerText = tbl_arr[i]["time_alarm"];
            elem.cells[2].innerText = tbl_arr[i]["object_type"];
            elem.cells[3].innerText = tbl_arr[i]["object_id"];
            elem.cells[4].innerText = tbl_arr[i]["distance_x"];
            elem.cells[5].innerText = tbl_arr[i]["distance_y"];
            elem.cells[6].innerHTML = "<a onclick='Del_Row_Alarm_History("+elem.id+")'> Delete </a><div class='clear'></div>";

            if((orientation!=null)&&(orientation=="bottom")){tbody.appendChild(elem);} else {tbody.insertBefore(elem,tbody.children[0]);}

            $(tbody.children[sort_size.value]).addClass('disp_none');

            if(fl_highlight){
                if(rowNum){
                    $(elem).addClass('highlight').delay(1000).queue(function(next){
                        $(this).removeClass('highlight');
                        next();});
                }else{
                    $(elem).addClass('highlight').delay(1000).queue(function(next){
                        $(this).removeClass('highlight');
                        alarm_history_tbl.sort();
                        next();});
                }
            }
            rowNum++;
        }


        if(tbody.children.length>20){var end=tbody.children.length; for(i=20;i<end;i++){tbody.removeChild(tbody.children[tbody.children.length-1]);}}
        if (Count_Alarm_History_Row_DB){txt="Alarm History ("+Count_Alarm_History_Row_DB+")";}else{txt="Alarm History";}
        btn_full_histr.value=txt;
        if((!fl_highlight)&&(rowNum)){
            alarm_history_tbl.sort();
        }

    };



    /*########################################################################################################## change_row_arr */
    /*########################################################################################################## change_row_arr */
    /*########################################################################################################## change_row_arr */
    /*########################################################################################################## change_row_arr */
    /*########################################################################################################## change_row_arr */
    this.change_row_arr = function (fl_highlight, tbl_arr, orientation) {
        var rowTpl = document.createElement("TR"),
            RowHead=T$$('thead',T$("id_Alarm_List_Table"))[0].rows[0],
            tbody = document.getElementById("id_Alarm_List_Tbody"),
            btn_full_histr=document.getElementById('id_Full_Alarm_History'),
            sort_size = document.getElementById("id_Sorter_Size_Select"),
            rowNum = 0,
            fields = {1:"val1", 2:"val2", 3:"val3", 4:"val4",5:"val5", 6:"val6", 7:"val7"},
            TD,i,txt,sortNum=null,end_row;

        for (var field in fields) {
            if (false === fields.hasOwnProperty(field)) {continue;}
            TD = document.createElement("TD");
            rowTpl.appendChild(TD);
        }

        for (i in RowHead.children) {
            if (!RowHead.children.hasOwnProperty(i)){continue;}
            if ((RowHead.children[i].className=="asc")||(RowHead.children[i].className=="desc")){sortNum=i; break;}
        }


        for (i in tbl_arr){
            if (!tbl_arr.hasOwnProperty(i)){continue;}
            var elem;
            if (rowNum<tbody.children.length){elem=tbody.children[i];}
            else{elem=rowTpl.cloneNode(true);}

            elem.id=tbl_arr[i]['id_row_db'];
            elem.cells[0].innerText = tbl_arr[i]["alarm_zone"];
            elem.cells[1].innerText = tbl_arr[i]["time_alarm"];
            elem.cells[2].innerText = tbl_arr[i]["object_type"];
            elem.cells[3].innerText = tbl_arr[i]["object_id"];
            elem.cells[4].innerText = tbl_arr[i]["distance_x"];
            elem.cells[5].innerText = tbl_arr[i]["distance_y"];
            elem.cells[6].innerHTML = "<a onclick='Del_Row_Alarm_History("+elem.id+")'> Delete </a><div class='clear'></div>";
            rowNum++;
        }

        if(tbody.children.length>rowNum){end_row=tbody.children.length; for(i=rowNum;i<end_row;i++){tbody.removeChild(tbody.children[tbody.children.length-1]);}}
        if(tbody.children.length>20){end_row=tbody.children.length; for(i=20;i<end_row;i++){tbody.removeChild(tbody.children[tbody.children.length-1]);}}
        if (Count_Alarm_History_Row_DB){txt="Alarm History ("+Count_Alarm_History_Row_DB+")";}else{txt="Alarm History";}
        btn_full_histr.value=txt;
        alarm_history_tbl.sort();
    };


    /*########################################################################################################## change_sort */
    /*########################################################################################################## change_sort */
    /*########################################################################################################## change_sort */
    /*########################################################################################################## change_sort */
    /*########################################################################################################## change_sort */
    this.change_sort = function (row, orientation) {
        var RowHead=document.getElementById("id_Alarm_List_Thead").rows[0];
        for (var i in RowHead.children) {
            if (!RowHead.children.hasOwnProperty(i)){continue;}
            var c = RowHead.cells[i];
            if (c.className != 'nosort') {
                c.className = "head";
            }
        }

        RowHead.cells[parseInt(row)].className=orientation;

    };



    this.sort = function (coll) {
        var sort_size = document.getElementById("id_Sorter_Size_Select");
        sorter = new TINY.table.sorter("sorter");
        sorter.head = "head";
        sorter.asc = "asc";
        sorter.desc = "desc";
        sorter.even = "evenrow";
        sorter.odd = "oddrow";
        sorter.evensel = "evenselected";
        sorter.oddsel = "oddselected";
        sorter.paginate = true;
        sorter.currentid = "currentpage";
        sorter.limitid = "pagelimit";
        sorter.init("id_Alarm_List_Table",coll);
        sorter.size(sort_size.value);
    }

};

/*########################################################################################################## Del_Row_Alarm_History */
/*########################################################################################################## Del_Row_Alarm_History */
/*########################################################################################################## Del_Row_Alarm_History */
/*########################################################################################################## Del_Row_Alarm_History */
/*########################################################################################################## Del_Row_Alarm_History */
/**
 * @return {boolean}
 */
function Del_Row_Alarm_History(id) {
    var tbl = document.getElementById("id_Alarm_List_Tbody");
    var RowHead=T$$('thead',T$("id_Alarm_List_Table"))[0].rows[0];
    var coll=null,orientation_sort=null;

    for (var i in RowHead.children) {
        if (!RowHead.children.hasOwnProperty(i)){continue;}
        if ((RowHead.children[i].className=="asc")||(RowHead.children[i].className=="desc"))
        {  coll=i;
            if(RowHead.children[i].className=="asc"){orientation_sort="ASC";}
            if(RowHead.children[i].className=="desc"){orientation_sort="DESC";}
            break;
        }
    }


    var el =document.getElementById(id);
    $(el).addClass('dellight').delay(100).queue(function(del){

        alarm_history_db.delete_row(id,coll,orientation_sort);
        del();});

    return false;
}


