import React, {Component} from "react";
import {
	Card, CardImg, CardText, CardBody,
	CardTitle, CardSubtitle, Button,
	ListGroup, ListGroupItem, Collapse
} from 'reactstrap';
import * as styles from "./style.module.scss";
import CardFooter from "reactstrap/es/CardFooter";
import CardHeader from "reactstrap/es/CardHeader";
import CardLink from "reactstrap/es/CardLink";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; //Испорт роутера
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import {styleArray} from "../../additional";

//Разделим логику: Menu отдельно, методы рендоров тоже в отдельном классе (экспортируемом)
//Иначе может быть такое, что класс разростется до огромных размеров и будет непонятно что,
//а так видно, что за что отвечает, ведь функционал разделен на мелкие классы

class Menu extends Component {
	//Открытие меню
	open = () => {
		this.setState({
			collapse: true
		});
	};
	
	//Закрытие меню
	close = () => {
		this.setState({
			collapse: false
		})
	};
	
	//Переключатель меню
	toggle = () => {
		this.setState(state => ( {
			collapse: !state.collapse
		} ));
	};
}

class Car extends Menu {
	state = {
		collapse: false
	};
	
	//Получить количество скрытых элементов из списка
	getHiddenCounts = () => {
		return this.props.list.length - this.props.maxPresentList >= 1 ? this.props.list.length - this.props.maxPresentList : '';
	};
	
	//Показать текст кнопки "Скрыть/Показать оставшиеся x элементов"
	showButtonListText = () => {
		return !this.state.collapse ? `Показать еще ${this.getHiddenCounts()} особенностей` : `Скрыть элементы списка`;
	};
	
	//Рендер первых maxPresentList элементов списка, например выводим 4 элемента
	renderPresentList = () => {
		return this.props.list.slice(0, this.props.maxPresentList).map((item, i) => (
			<ListGroupItem className={styles.listFeature} key={ i }>{ item }</ListGroupItem>
		));
	};
	
	render () {
		const {image, alt, title, price, dealer, id} = this.props;
		
		return (
			<Card className={styles.cardCar}>
				<CardHeader>
					<Link to={`/car/${id}`}>
						<CardImg top width="100%" src={ image } alt={ alt ? alt : "Image" }/>
					</Link>
				</CardHeader>
				<CardBody className={styles.cardBodyFlex}>
					<CardTitle>
						<h3 className="heading">{ title }</h3>
					</CardTitle>
					<CardSubtitle>
						<div className={styles.priceHeading}>{ price } ₽</div>
					</CardSubtitle>
					<CardText tag="div">
						<ListGroup className={styles.listFeatures}>
							{ this.renderPresentList() }
						</ListGroup>
					</CardText>
					<Link to={`/car/${id}`} className={styleArray(['card-link', styles.cardLinkList])}>
						{this.showButtonListText()}
					</Link>
				</CardBody>
				<CardFooter className={styles.cardFooter}>
					<FontAwesomeIcon icon={faMapMarkerAlt}/>
					<CardLink className={styles.cardLink} href={dealer.url}>{dealer.name}, {dealer.distance} км.</CardLink>
				</CardFooter>
			</Card>
		);
	}
}

Car.propTypes = {
	image: PropTypes.string.isRequired,
	alt: PropTypes.string,
	title: PropTypes.string.isRequired,
	price: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	dealer: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired
};

export default Car;
