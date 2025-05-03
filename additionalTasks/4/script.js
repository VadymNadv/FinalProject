const symbol = "%20";

function spaceChange(str) {
	return str.split(' ').join(symbol);
}

const myStr = 'Mr John Smith';

console.log(`${myStr} - ${spaceChange(myStr)}`);
