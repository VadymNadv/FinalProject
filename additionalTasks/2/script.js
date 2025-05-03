function largestNumber(numbers) {
	let number = numbers[0]
	for (const x in numbers) {
		if (numbers[x] > number) {
			number = numbers[x]
		}
	}
	return number
}

const myNumbers = [-10, -5, -3, -20]
console.log(`Найбільше число в ${myNumbers} - ${largestNumber(myNumbers)}`)
