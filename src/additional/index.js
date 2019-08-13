//Создадим функцию, возвращаю рандомное число в пределах от min до max
function random (min = 0, max = 0) {
	return Math.floor(Math.random() * ( max - min ) + min);
}

//Создами функицю задержку (await delay() или delay.then())
function delay (ms = 0) {
	return new Promise(_ => setTimeout(_, ms));
}

//Функция конвертор градусов в радианы
function degToRad (deg = 0) {
	return ( Math.PI * deg ) / 180;
}

//Функция конвертер радиан в градусы
function radToDeg (rad = 0) {
	return rad * 180 / Math.PI
}

//Создадим функцию, которая преобразует коордионаты широта;долгота в метры
// (потому что метры - стандартная единица изменерения в СИ)
function convertCoordsToMeters (lat = 0.0, lng = 0.0) {
	const R = 6371;  // Радиус Земли
	
	return 2 * R * Math.acos(Math.sqrt(Math.sin(lat / 2) ** 2 + Math.cos(lat) * Math.sin(lng / 2) ** 2));
}

//Классы css можно записывать в ввиде массива
function styleArray (array = []) {
	return array.join(" ");
}

export {
	random,
	delay,
	degToRad,
	radToDeg,
	convertCoordsToMeters,
	styleArray
};
