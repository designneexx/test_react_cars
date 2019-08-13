import React, {Component} from "react";
import {Alert, Button, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap'; //Импорт reactstrap
                                                                                            // (Bootstrap для react)
import Car from "../../components/car"; //Импорт компонента Car
import {observer} from 'mobx-react'; //Импорт Mobx (observer)
import store from "../../stores/store"; //Импорт хранилища
import {convertCoordsToMeters} from "../../additional"; //Кастомные функции (random, delay и т.д)
import CustomPagination from "../../components/pagination";
import Error from "../../errors"; //Пагинация


class Cars extends Component {
	//Загрузим наш список машин
	loadCars = async () => {
		try {
			//Ставим загрузчик и сбрасываем ошибки
			this.setState({
				isLoading: true,
				hasError: false,
				error: null
			});
			
			//Инициализируем список из хранилища
			await store.initCars();
			
			//Убираем загрузчик
			this.setState({
				isLoading: false
			});
		} catch (error) {
			//Что-то идет не так: убираем загрузчик, ставим ошибки
			this.setState({
				isLoading: false,
				hasError: true,
				error
			});
		}
	};
	
	//Получаем дилера (с дистанцией до точки коордионат в километрах)
	getDealer = (dealer) => {
		return {
			...dealer,
			get distance () {
				return Math.round(convertCoordsToMeters(dealer.latitude, dealer.longitude) / 1000 * 100) / 100;
			}
		};
	};
}

//Observer Mobx
export default @observer
class App extends Cars {
	state = {
		isLoading: true,
		hasError: false,
		paramsError: false,
		error: null,
		list: Array.from({length: 8}, (it, i) => `Test List - ${ i }`),
		priceCheck: false,
		distanceCheck: true,
		searched: []
	};
	
	//При обновлении проверяем параметр page
	//Параметр page должен быть строго целым числом, иначе показываем страницу ошибки
	componentDidUpdate (prevProps, prevState) {
		const prevPage = prevProps.match.params.page; //Прошлое значение
		const currentPage = this.props.match.params.page; //Текущее
		
		if (this.props.location.search !== prevProps.location.search) {
			this.checkSearchParams();
		}
		
		if (prevPage === currentPage) return; //Если значения те же - ничего не делаем
		
		//Если мы на главной (параметр не должен быть известен), то и ошибки быть не должно
		//так как в случае, если страница главная, то вместо params.page передается просто 1
		if (!currentPage) {
			this.setState({
				paramsError: false
			});
		} else {
			//Если при приведении параметра к целому числу получился NaN или
			//если число дробное, то нужно показать страницу ошибки, так как запрос неверный
			//(номер страницы не может быть строкой или дробным числом)
			if (isNaN(+currentPage) || currentPage.includes(".")) {
				this.setState({
					paramsError: true
				});
			} else if (!this.state.paramsError) { //Если есть ошибка, а запрос верный, убираем ее
				this.setState({
					paramsError: false
				});
			}
		}
	}
	
	checkSearchParams = () => {
		const filter = this.getSearch();
		
		if (filter === "price") {
			console.log(store.cars.map(item => item));
			this.setState({
				searched: store.cars.filter(() => true).sort((a, b) => +a.price - +b.price)
			});
		} else if (filter === "distance") {
			this.setState({
				searched: store.cars.filter(() => true).sort((a, b) => this.getDealer(a.dealer).distance - this.getDealer(b.dealer).distance)
			});
		} else {
			this.setState({
				searched: store.cars
			});
		}
	};
	
	//При инициализации проверяем параметр page
	//Параметр page должен быть строго целым числом, иначе показываем страницу ошибки
	async componentDidMount () {
		//Если мы на главной (параметр не должен быть известен), то и ошибки быть не должно
		if (!this.props.match.params.page) {
			await this.loadCars();
			
			this.checkSearchParams();
			
			return true;
		}
		
		const currentPage = this.props.match.params.page; //Текущая страница
		
		//Если при приведении параметра к целому числу получился NaN или
		//если число дробное, то нужно показать страницу ошибки, так как запрос неверный
		//(номер страницы не может быть строкой или дробным числом)
		if (isNaN(+currentPage) || currentPage.includes(".")) {
			this.setState({
				paramsError: true
			});
		}
		
		await this.loadCars();
		
		this.checkSearchParams();
	}
	
	//Рендер машин
	renderCars = () => {
		return this.state.searched.length > 0 ? this.state.searched.map(car => (
			<Col xs={ 10 } md={ 6 } lg={ 3 } key={ car.id }>
				<Car
					isLoaded={ !this.state.isLoading }
					image={ car.images[0] }
					title={ car.model_name }
					price={ car.price }
					dealer={ this.getDealer(car.dealer) }
					maxPresentList={ 4 }
					list={ car.features }
					id={ car.id }
				/>
			</Col>
		)) : store.cars.map(car => (
			<Col xs={ 10 } md={ 6 } lg={ 3 } key={ car.id }>
				<Car
					isLoaded={ !this.state.isLoading }
					image={ car.images[0] }
					title={ car.model_name }
					price={ car.price }
					dealer={ this.getDealer(car.dealer) }
					maxPresentList={ 4 }
					list={ car.features }
					id={ car.id }
				/>
			</Col>
		));
	};
	
	getSearch = () => {
		const params = new URLSearchParams(this.props.location.search);
		return params.get("filter");
	};
	
	//Фильтровка по цене
	filterPrice = () => {
		this.props.history.push(`${ this.props.location.pathname }?filter=price`);
	};
	
	//Фильтровка по дистанции
	filterDistance = () => {
		this.props.history.push(`${ this.props.location.pathname }?filter=distance`);
	};
	
	//Рендер контента (если загружается, отобразим это, ошибка - отображаем, все ок - список машин)
	renderContent = () => {
		return this.state.isLoading ? (
			<div className="pre-loader">
				<Spinner type="grow" color="success"/>
			</div>
		) : this.state.paramsError ? (
			<Error error={ ( {message: "Ошибка запроса, такой страницы не существует", statusCode: 400} ) }/>
		) : this.state.hasError ? (
			<Alert color="danger">
				Произошла ошибка при загрузке! :(
				<p>Попробуйте снова: </p>
				<Button onClick={ this.loadCars }>
					Перезагрузить
				</Button>
			</Alert>
		) : (
			<>
				<Col xs={ 12 } md={ 12 } lg={ 12 }>
					<Form className="form-filter" inline>
						<FormGroup className="mb-2 mr-sm-3 mb-sm-0">
							<strong>Сортировать по: </strong>
						</FormGroup>
						<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
							<Label for="priceCheck" className="mr-sm-2 input-pointer">Цене</Label>
							<Input
								className="input-pointer"
								type="radio"
								value="price"
								checked={ this.getSearch() === "price" }
								onChange={ () => {} }
								onClick={ this.filterPrice }
								name="check" id="priceCheck"/>
						</FormGroup>
						<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
							<Label for="distanceCheck" className="mr-sm-2 input-pointer">Удаленности</Label>
							<Input
								className="input-pointer"
								type="radio"
								value="distance"
								checked={ this.getSearch() === "distance" }
								onChange={ () => {} }
								onClick={ this.filterDistance }
								name="check" id="distanceCheck"
							/>
						</FormGroup>
					</Form>
				</Col>
				<CustomPagination
					page={ this.props.match.params.page ? +this.props.match.params.page : 1 }
					maxElementsPage={ 4 }
					maxButtonsPage={ 4 }
					path="/pages"
					error={ ( {message: "Такой страницы не существует", statusCode: 404} ) }
					history={ this.props.history }
					location={ this.props.location }
				>
					{ this.renderCars() }
				</CustomPagination>
			</>
		
		);
	};
	
	render () {
		return (
			<Row className="align-items-stretch">
				{ this.renderContent() }
			</Row>
		);
	}
}
