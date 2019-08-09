export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cutEmail(email) {
  return email.split('@')[0];
}

export function transformPrice(price) {
  // console.log(price);
  // console.log(typeof(price));
  if(price === 'N/A'){
    return price;
  }
	price /=  10000;
	price = price.toFixed(2);
	price = parseFloat(price);
	if(price > 1000){
		price = Math.round(price);
	}

  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function cutName(name, len) {
  if(name.length>len){
    let limit = name.substring(0, len) + '...';
    return limit;
  } else{
    return name;
  }
}

export function cutAvg(num){
  if(num % 1){
    //console.log('no íntenger');
    return num;
  }
  else{
    return Math.round(num);
  }
}

export function SetCaretAtEnd(elem) {
    let elemLen = elem.value.length;
    console.log(elemLen);
    // For IE Only
    if (document.selection) {
        // Set focus
        elem.focus();
        // Use IE Ranges
        let oSel = document.selection.createRange();
        // Reset position to 0 & then set at end
        oSel.moveStart('character', -elemLen);
        oSel.moveStart('character', elemLen);
        oSel.moveEnd('character', 0);
        oSel.select();
    }
    else if (elem.selectionStart || elem.selectionStart === '0') {
        // Firefox/Chrome
        elem.selectionStart = elemLen;
        elem.selectionEnd = elemLen;
        elem.focus();
    }
} // SetCaretAtEnd()

export function reverseObject(object) {
    let newObject = {};
    let keys = [];
    for (let key in object) {
        keys.push(key);
    }
    for (let i = keys.length - 1; i >= 0; i--) {

      let value = object[keys[i]];
      newObject[keys[i]]= value;
    }

    return newObject;
}
