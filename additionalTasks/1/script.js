function palindromeCheck(string) {
	const cleanedString = string.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
	const reversedString = cleanedString.split('').reverse().join('')
	return cleanedString === reversedString
}

const myString = "A man, a plan, a canal: Panama"
console.log(`${myString} - ${palindromeCheck(myString)}`) // true
