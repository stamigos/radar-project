$(window).on('load', function() {
    object_list_tbl.Init();
});

var object_list_tbl = new function () {
    var rowTpl      = document.createElement("TR");

    this.Init = function () {
        var fields = {1:"val1", 2:"val2", 3:"val3", 4:"val4",5:"val5", 6:"val6", 7:"val7",8:"val8", 9:"val9", 10:"val10",11:"val11"},
            ELEMENT, TD, rowNum=0;
        /* Строим шаблон строки таблицы один раз, в дальнейшем будем просто его клонировать */
        for(var field in fields) {
            if (false === fields.hasOwnProperty(field)) { continue; }
            TD = document.createElement("TD");

                ELEMENT = document.createElement("INPUT");
                ELEMENT.type = 'text';

            TD.appendChild(ELEMENT).className = "obj_list_inpt";
            rowTpl.appendChild(TD);

            rowNum += 1;
        }
    };

    // Вешаем обработчик на элемент управления кол-вом строк
    this.change_row = function (rows_data) {
        var DataRows = rows_data,
            htmlTBody   = document.getElementById("id_Table_Object_Tbody"),
            NumRows = DataRows.objects.length;

        /* Отслеживаем отрицательные значения а то мало ли какие там значения в option понаставят */
        NumRows = NumRows < 0 ? 0 : NumRows;
        /* Удаляем те строки которые есть. */
        while(htmlTBody.firstChild) {
            htmlTBody.removeChild(htmlTBody.firstChild);
        }
        for (var i = 0; i < NumRows; i++) {
            htmlTBody.appendChild(rowTpl.cloneNode(true));
        }

        // Фактически, ниже это инициализация таблицы:
        // Содержимое ячеек помещается внутрь текстовых полей
        return (function() {

            var
                tableRows = document.getElementById("id_Table_Object_Tbody").rows;

            // Мы имеем дело с двумерным массивом: table.rows[...].cells[...]
            // Поэетому сдесь вложенный цикл. Внешний цикл "шагает" по строкам...
            // Внутренний цикл "шагает" по ячейкам:
            for (var i = 0; i < NumRows; i++) {
                tableRows[i].cells[0].firstChild.value = (i+1)+".";
                tableRows[i].cells[1].firstChild.value = DataRows.objects[i].object_id;
                tableRows[i].cells[2].firstChild.value = DataRows.objects[i].quality;
                tableRows[i].cells[3].firstChild.value = DataRows.objects[i].c_distance_x;
                tableRows[i].cells[4].firstChild.value = DataRows.objects[i].c_distance_y;
                tableRows[i].cells[5].firstChild.value = DataRows.objects[i].c_velocity_x;
                tableRows[i].cells[6].firstChild.value = DataRows.objects[i].c_velocity_y;
                tableRows[i].cells[7].firstChild.value = 7;//DataRows.objects[i].object_type;
                tableRows[i].cells[8].firstChild.value = DataRows.objects[i].p_distance;
                tableRows[i].cells[9].firstChild.value = DataRows.objects[i].p_velocity;
                tableRows[i].cells[10].firstChild.value = DataRows.objects[i].p_angle;
            }

        }());

    };
};



