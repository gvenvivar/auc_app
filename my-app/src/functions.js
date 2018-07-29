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

export function cutName25(name) {
  let limit = name.substring(0, 20) + '...';
  return limit;
}
