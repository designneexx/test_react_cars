import {action, computed, observable} from 'mobx'; //Импортируем декораторы
import api from "../api"; //Импортиурем объект апи

//Объявляет хранилище
class Store {
	@observable cars; //Следим за свойством cars
	
	constructor () {
		/* Сделаем вместо массива объект, так как изменять и удалять элементы мы будем по id,
		 а значит придется лишний раз итерировать массив, чтобы найти в нем элемент с таким id,
		 к тому же гораздо удобнее обращаться к элементу с id "n" так this.cars[n] , чем так:
		 this.cars[this.cars.findIndex(it => it === id)] + это быстрее
		 */
		this.cars = {
			//Добавим итератор, чтобы объект можно
			// было итерировать через for of
			[Symbol.iterator]: function * () {
				for (const [, car] of Object.keys(this)) {
					yield car;
				}
			},
			//Добавим немного методов массива в прототип для удобства
			__proto__: {
				forEach (callback = () => {}) {
					for (const [key, item] of Object.entries(this)) {
						callback(item, key, this);
					}
				},
				map (callback = () => {}) {
					const arr = [];
					
					for (const [key, item] of Object.entries(this)) {
						arr.push(callback(item, key, this));
					}
					
					return arr;
				},
				filter (callback = () => {}) {
					const searched = [];
					
					for (const [key, item] of Object.entries(this)) {
						console.log("iterate");
						if (callback(item, key, this)) searched.push(item);
					}
					
					return searched;
				},
				//Добавим длину(размер) объекта-итератора
				get length () {
					return Object.keys(this).length;
				},
			}
		};
	}
	
	@action("Инициализация данных с сервера")
	async initCars () {
		//Получаем список машин
		const cars = await api.cars.get.getAll();
		
		//Будем добавлять в объект данные в таком виде: [key: id] = value: element
		//чтобы можно было обращаться к определенному элементу по его id
		for (const car of cars) {
			this.cars[car.id] = car;
		}
		
		return this.cars;
	}
	
	@action("Получение элемента по id")
	async getDetailCarById (id = "") {
		await api.cars.get.getDetailById(id);
		
		return this.cars[id];
	}
	
	//Другие методы, которые обычно требуется при обработке данных с сервера
	//создание(добавление), изменение, удаление
	
	@action("Добавление элемента в список")
	async addCar (car = {}) {
		await api.delay();
		
		this.cars[car.id] = car;
		
		return this.cars[car.id]; //Вернем добавленный элемент
	}
	
	@action("Изменение данных элемента")
	async changeCarById (id = "", car = {}) {
		await api.delay();
		
		this.cars[id] = car;
		
		return this.cars[id]; //Вернем изменные данные
	}
	
	@action("Удаление элемента из списка")
	async removeCarById (id = "") {
		await api.delay();
		
		delete this.cars[id];
		
		return this.cars;
	}
}

const store = new Store(); //Создам экземпляр хранилища

export default store; //Экспорт экземпляра

export {store}; //Экспортируем и само хранилище, для тестов
