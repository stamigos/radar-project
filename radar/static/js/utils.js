function addClass(elements, className) {
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		if (element.classList) {
			element.classList.add(className);
		} else {
			element.className += ' ' + className;
		}
	}
}

function removeClass(elements, className) {
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		if (element.classList) {
			element.classList.remove(className);
		} else {
			element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}
}
/*########################################################################################################## ValidateUrl */
/**
 * @return {boolean}
 */
function ValidateUrl(){
    var url_zone=$('#id_Alarm_URL');
    if(flag_url=='ok') return false;
    var y=url_zone.val();


    if (y.length==0){
        flag_url = 'ok';
        return false;
    }


    var regexp = 	/^(((f|ht)tp(s)?):\/\/)?(www\.)?([a-zA-Z0-9\-]{1,}\.){1,}?([a-zA-Z0-9\-]{2,}\.[a-zA-Z0-9\-]{2,4}(\.[a-zA-Z0-9\-]{2,4})?)(\/|\?)?$/;

    //проверяем пункт 2
    if (!regexp.test(y)){
        alert('NOT PROPERLY URL!');
        flag_url = 'err';
        return false;
    }
    //проверяем пункт 3

    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open('GET', y, true);
    xmlhttp.onreadystatechange = update;
    xmlhttp.send(null);
    document.getElementById('id_Wait_URL_Wind').style.visibility='visible';
    setTimeout(DelayValidateUrl, 2000);

    function update()
    {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if(flag_url=='wait'){flag_url = 'ok';}
            //для проверки
            //document.forms['form'].submit()
        }
        if (xmlhttp.readyState === 4 && xmlhttp.status === 404)
        {alert('URL NOT FOUND');
            flag_url = 'err';
            document.getElementById('id_Wait_URL_Wind').style.visibility='hidden';
        }

    }
    return false;
}

/*########################################################################################################## DelayValidateUrl */
/**
 * @return {boolean}
 */
function DelayValidateUrl(){

    if((flag_url=='wait')&&(count_check_url>0)){ count_check_url--; setTimeout(DelayValidateUrl, 2000); return false;}

    if(count_check_url==0)
    {
        document.getElementById('id_Wait_URL_Wind').style.visibility='hidden';
        alert('problem connect'); flag_url = 'err';
        Modify_Alarm_Zone();
    }

    if(flag_url=='ok') {
        document.getElementById('id_Wait_URL_Wind').style.visibility='hidden';
        Modify_Alarm_Zone();
    }

}

/*########################################################################################################## ValidateName */
/**
 * @return {boolean}
 */
function ValidateName(){
    var name=document.getElementById('id_Alarm_Zone_Name').value;
    for (var i in Alarm_Zones){
        if (!Alarm_Zones.hasOwnProperty(i)){continue;}
        if((Alarm_Zones[i]['name']==name)&&(i!=Select_Alarm_Zone)){
        alert('The "Name" exists!'); return false;
    }}
    return true;
}
