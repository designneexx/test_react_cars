import cars from "./cars"; //Импортируем "ответ сервера"
import { random, delay } from "../additional";

const MIN_DEFAULT_DELAY = 250; //Минимальная задержка по умолчанию
const MAX_DEFAULT_DELAY = 2000; //Максимальная задержка по умолчанию

//Добавим рандомную задержку, то есть сделаем муляж сервера, ведь данные приходят
//не мгновенно и всегда с разной задержкой
function apiDelay() {
	return delay(random(MIN_DEFAULT_DELAY, MAX_DEFAULT_DELAY));
}

//Экспортируем объект апи
export default {
	delay: apiDelay,
	
	//Апи для машин
	cars: {
		//Опишем поля так:
		//get - GET запросы
		//post - POST запросы
		//put - PUT запросы
		//delete - DELETE запросы
		
		get: {
			//Получаем весь список с "сервера"
			async getAll() {
				//Задержка
				await apiDelay();
				
				return cars;
			},
			
			async getDetailById(id) {
				await apiDelay();
			}
		},
		post: {},
		put: {},
		delete: {}
	}
}
