const romanToIntMap = {
	'I': 1,
	'V': 5,
	'X': 10,
	'L': 50,
	'C': 100,
	'D': 500,
	'M': 1000
};

function parseRomanNumeral(romanString) {
	let sum = 0;
	const upperRoman = romanString.toUpperCase();

	for (let index = 0; index < upperRoman.length; index++) {
		const currentVal = romanToIntMap[upperRoman[index]];
		const nextVal = romanToIntMap[upperRoman[index + 1]];

		if (currentVal === undefined) {
			return `Символ '${upperRoman[index]}' не є римською цифрою`;
		}

		if (nextVal && currentVal < nextVal) {
			sum -= currentVal;
		} else {
			sum += currentVal;
		}
	}

	return sum;
}

const inputRoman = "CmDxI";
console.log(`${inputRoman.toUpperCase()} → ${parseRomanNumeral(inputRoman)}`);
