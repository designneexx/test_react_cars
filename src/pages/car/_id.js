import React from 'react';
import {observer} from 'mobx-react'; //Импорт Mobx (observer)
import store from "../../stores/store";
import {Container, Row, Col, Spinner, Alert, Button, ListGroup, ListGroupItem, Collapse} from 'reactstrap';
import Error from "../../errors";
import * as styles from "./style.module.scss";
import { convertCoordsToMeters, styleArray } from "../../additional"; //Кастомные функции (random, delay и т.д)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export default @observer class DetailCar extends React.Component {
	state = {
		isLoading: true,
		hasError: false,
		error: null,
		car: null,
		notFound: false,
		collapse: true
	};
	
	//Вызывается при инициалазации компонента, то есть загрузка списка, перед отрисовкой в DOM
	async componentDidMount () {
		await this.loadCar();
	}
	
	loadCar = async () => {
		const { match: { params: { id } } } = this.props; //Получаем id из пропсов
		
		//Так как у нас только муляж сервера, выглядеть будет это как-то так
		
		this.setState({
			isLoading: true, //Ставим загрузчик
			hasError: false,
			error: null
		});
		
		try {
			if(store.cars[id]) { //Если store.cars уже есть в хранилище
				await store.getDetailCarById(id); //Ждем детальной информации
			} else {
				await store.initCars(); //Инициализируем хранилище, загружаем список
			}
			
			if(!store.cars[id]) {
				this.setState({
					isLoading: false,
					notFound: true,
					error: {
						message: "Такой машины не найдено",
						statusCode: 404
					}
				});
				
				return false;
			}
			
			
			//Устанавливаем состояние
			this.setState({
				car: store.cars[id],
				isLoading: false,
				hasError: false,
				error: null
			});
			
			return store.cars[id]; //Вернем детали
		} catch (error) {
			this.setState({
				isLoading: false,
				hasError: true,
				error
			});
		}
	};
	
	toggle = () => {
		this.setState(state => ({
			collapse: !state.collapse
		}));
	};
	
	//Получаем дилера (с дистанцией до точки коордионат в километрах)
	getDealer = (dealer) => {
		return {
			...dealer,
			get distance() {
				return Math.round(convertCoordsToMeters(dealer.latitude, dealer.longitude) / 1000 * 100) / 100;
			}
		};
	};
	
	renderDealer = () => {
		const dealer = this.getDealer(this.state.car.dealer);
		
		return (
			<>
				<ListGroupItem><strong>Имя дилера:</strong> {dealer.name}</ListGroupItem>
				<ListGroupItem><strong>Город:</strong> {dealer.city}</ListGroupItem>
				<ListGroupItem><strong>Адрес:</strong> {dealer.address ? dealer.address : 'Нет точного адреса'}</ListGroupItem>
				<ListGroupItem><strong>Расстояние до дилерского центра:</strong> {dealer.distance}</ListGroupItem>
				<ListGroupItem>
					{dealer.url ? <a href={dealer.url}>Сайт дилера</a> : 'К сожалению у дилера нет сайта'}
				</ListGroupItem>
			</>
		);
	};
	
	renderList = () => {
		return this.state.car.features.map((feature,i) => (
			<ListGroupItem key={feature + i} className={styles.featureItem}>{feature}</ListGroupItem>
		));
	};
	
	renderCarContent = () => {
		return (
			<div className="content-col">
				<div className={styles.sectionTitle}>
					<h3 className={styles.heading}>{this.state.car.model_name}</h3>
					<h4 className={styles.priceHeading}>{this.state.car.price} ₽</h4>
				</div>
				<p className={styleArray([styles.blockHeading, styles.collapseButtonHeading])} onClick={this.toggle}>
					<strong>Особенности</strong>
					<FontAwesomeIcon className={styles.ico} icon={ this.state.collapse ? faAngleUp : faAngleDown }/>
				</p>
				<Collapse className={styles.listCollapse} isOpen={this.state.collapse}>
					<ListGroup className={styles.features}>
						{this.renderList()}
					</ListGroup>
				</Collapse>
				<p className={styles.blockHeading}>
					<strong>Информация о дилере:</strong>
				</p>
				<ListGroup>
					{this.renderDealer()}
				</ListGroup>
			</div>
		);
	};
	
	renderImages = () => {
		return this.state.car.images.map((image,i) => (
			<img className="img-fluid" src={image} alt={image} key={image + i}/>
		));
	};
	
	//Редер контента (загрузчик, нет данных, ошибка, все ок)
	renderContent = () => {
		if(this.state.isLoading) {
			return (
				<div className={styles.preloader}>
					<strong className={styles.loadText}>Загрузка</strong>
					<Spinner type="grow" color="success" />
				</div>
			);
		} else if(this.state.notFound) {
			return <Error error={this.state.error}/>;
		} else if(this.state.hasError) {
			return (
				<Alert color="danger" className="w-100">
					Произошла ошибка при загрузке! :(
					<p>Попробуйте снова: </p>
					<Button onClick={this.loadCars}>
						Перезагрузить
					</Button>
				</Alert>
			);
		} else {
			return (
				<React.Fragment>
					<Col xs={12} md={5} lg={5} className={styles.imageGallery}>
						{this.renderImages()}
					</Col>
					<Col xs={12} md={7} lg={7} className={styles.contentCar}>
						{this.renderCarContent()}
					</Col>
				</React.Fragment>
			);
		}
	};
	
	render() {
		return (
			<Container>
				<Row>
					{this.renderContent()}
				</Row>
			</Container>
		);
	}
}
