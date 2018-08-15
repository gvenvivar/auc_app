export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cutEmail(email) {
  return email.split('@')[0];
}

export function transformPrice(price) {
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
