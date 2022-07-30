
export function reverseHex(hex: string): string {
	let reversed: string = "";
	if (hex.toLowerCase().startsWith("0x")) {
		hex = hex.substring(0, 2);
	}
	for (let i: number = 8; i >= 0; i -= 2) {
		reversed += hex.substring(i - 2, i);
	}
	console.log("reversed : " + hex + " -> " + reversed);
	return reversed;
}
/**
 * Convert HEX to Float
 * 
 * @see https://stackoverflow.com/a/14090278
 * @param hex 
 * @returns 
 */
export function parseHexToFloat(hex: any): number | null {
	let float = 0, sign, mantissa, exp,
	int = 0, multi = 1;
	if (/^0x/.exec(hex)) {
		int = parseInt(hex, 16);
	}
	else {
		for (let i = hex.length - 1; i >=0; i -= 1) {
			if (hex.charCodeAt(i) > 255) {
				console.log('Wrong string parameter');
				return null;
			}
			int += hex.charCodeAt(i) * multi;
			multi *= 256;
		}
	}
	sign = (int >>> 31) ? -1 : 1;
	exp = (int >>> 23 & 0xff) - 127;
	mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
	for (let m of mantissa) {
		float += parseInt(m) ? Math.pow(2, exp) : 0;
		exp--;
	}
	return float*sign;
}
