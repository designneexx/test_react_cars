import React from "react";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom'; //Импорт роутера
import {Pagination, PaginationItem} from 'reactstrap';
import Button from "reactstrap/es/Button";
import Error from "../../errors";
import * as styles from "./style.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {styleArray} from "../../additional";

class CustomPagination extends React.Component {
	state = {
		hasError: false//Есть ли ошибка
	};
	
	//При обновлении проверяем страницу (если текущая страница нулевая или больше, чем максимальное количество страниц),
	//то вместо компонента пагинации сделаем компонент ошибки.
	//В противном случае, убираем ошибку и показываем все как нужно
	componentDidUpdate (prevProps, prevState) {
		const prevPage = prevProps.page; //Прошлое значение
		const currentPage = this.props.page; //Текущее
		
		if (prevPage === currentPage) return; //Если все осталось как есть - выходим
		
		//(если текущая страница нулевая или больше, чем максимальное количество страниц), обновим состояние,
		// только если ошибка уже не создана
		
		console.log(currentPage);
		
		if (( currentPage > this.getCountOfPages() || currentPage <= 0 ) && !this.props.hasError) {
			this.setState({
				hasError: true
			});
		} else if (!this.props.hasError) { //Уберем ошибку только если она есть
			this.setState({
				hasError: false
			});
		}
	}
	
	//При инициализации проверяем страницу (если текущая страница нулевая или больше, чем максимальное количество
	// страниц), то вместо компонента пагинации сделаем компонент ошибки
	componentDidMount () {
		const nextPage = +this.props.page;
		
		if (nextPage > this.getCountOfPages() || nextPage <= 0) {
			this.setState({
				hasError: true
			});
		}
	}
	
	//Так как у нас может приходить как строка(параметр из роутера), так и число, это надо учесть
	//ВОЗВРАЩАЕТ целое число текущей страницы
	getPage = () => {
		return +this.props.page;
	};
	
	//Метод принимает в качестве аргумента список, а именно this.props.children, то есть, все, что
	//передается в комопнент <component><children><children>...</component>,
	//далее он обрезает эти элементы по this.props.maxElementsPage, начиная с this.getPage()
	//ВОЗВРАЩАЕТ ОБРЕЗАННЫЙ СПИСОК ДОЧЕРНИХ ЭЛЕМЕНТОВ (начиная с текущей страницы)
	getElementsPage = (List) => {
		const list = List ? React.Children.toArray(this.props.children) : [];
		if (list.length > this.props.maxElementsPage) {
			//this.getPage() - 1   так как странички мы начинаем не с нуля) (/pages/0) вряд ли кто-то станет делать
			return list.slice(( this.getPage() - 1 ) * this.props.maxElementsPage, this.props.maxElementsPage * this.getPage());
		} else {
			return list;
		}
	};
	
	//ВОЗВРАЩАЕТ общее количество страниц
	getCountOfPages = () => {
		return this.props.countOfElements ? this.props.countOfElements : Math.round(React.Children.toArray(this.props.children).length / this.props.maxElementsPage);
	};
	
	//ВОЗВРАЩАЕТ последнюю страницу
	getLastPage = () => {
		return this.getCountOfPages();
	};
	
	//ВОЗВРАЩАЕТ массиов объектов вида [ { id, page, get path } ]
	generateButtons = () => {
		const generateButton = page => ( {
			id: page,
			page,
			url: this.props.path,
			search: this.props.location.search,
			//Чтобы не писать по 100 раз `${ this.url }/${ this.page }` сделаем для этого геттер
			get path () {
				return `${ this.url }/${ this.page }${ this.search }`
			}
		} );
		
		let maxButtonsPage = this.props.maxButtonsPage;
		
		if (this.getCountOfPages() < maxButtonsPage) maxButtonsPage = this.getCountOfPages();
		
		debugger;
		
		//Обычно у `хорошей пагинации` есть первая страница, затем идет список остальных страниц (2,3,4,5,...),
		//после этого идет последняя страница
		return [
			generateButton(1), //Объект на первую стр
			//Генерации остальных страниц (кроме 1 и последней)
			//Замыкание, чтобы не мутировать this.props.page
			//Количество элементов - maxButtonsPage - 2 уже созданных элемента
			...Array.from({length: maxButtonsPage - 2 < 1 ? 1 : maxButtonsPage - 2}, ( () => {
				let page = this.props.page; //Получаем текущую страницу
				
				//Если наша текущая стр - 1, то сделаем ее 2, потому что первая уже есть в списке
				if (page === 1) page = 2;
				//Если наша текущая стр - последняя, то сделаем ее предпоследней, потому что последняя уже есть в списке
				else if (page + maxButtonsPage >= this.getCountOfPages()) {
					page = this.getCountOfPages() - maxButtonsPage <= 1 ? 2 : this.getCountOfPages() - maxButtonsPage;
				}
				
				//Если у нас страниц, например 125, а мы на 124, то отобразим это так 124,123,122,121,120
				//Иначе отображаем как 1,2,3,4, то есть по возрастанию
				return (it, i) => generateButton(page + i);
			} )()),
			generateButton(this.getLastPage()), //Объект на последнюю страницу
		];
	};
	
	prev = () => {
		this.props.history.push(`${ this.props.path }/${ +this.props.page - 1 }${ this.props.location.search }`);
	};
	
	next = () => {
		this.props.history.push(`${ this.props.path }/${ +this.props.page + 1 }${ this.props.location.search }`);
	};
	
	//Рендерим кнопки
	renderButtons = () => {
		return (
			<Pagination aria-label="Page navigation example" className={ styles.pagination }>
				<Button color="success" disabled={ +this.props.page - 1 <= 0 } onClick={ this.prev }
				        className={ styles.buttonPrev }>
					<FontAwesomeIcon icon={ faArrowLeft }/>
				</Button>
				
				{ this.generateButtons().map((button, i) => (
					<PaginationItem key={ button.id }>
						<Link
							className={ styleArray(['page-link', +button.page === this.getPage() ? styles.currentPage : '']) }
							to={ button.path }>{ button.page }</Link>
					</PaginationItem>
				)) }
				
				<Button color="success" disabled={ +this.props.page >= this.getCountOfPages() } onClick={ this.next }
				        className={ styles.buttonNext }>
					<FontAwesomeIcon icon={ faArrowRight }/>
				</Button>
			</Pagination>
		);
	};
	
	render () {
		const content = this.state.hasError ? (
			<Error error={ this.props.error }/>
		) : (
			<>
				{ this.getElementsPage(this.props.children).map(children => children) }
				<React.Fragment>
					{ this.renderButtons() }
				</React.Fragment>
			</>
		);
		
		return (
			<React.Fragment>
				{ content }
			</React.Fragment>
		);
	}
}

CustomPagination.propTypes = {
	page: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]), //Текущая страница
	maxElementsPage: PropTypes.number.isRequired, //Максимальное количество элементов на странице
	maxButtonsPage: PropTypes.number.isRequired, //Максимальное количество кнопок на странице
	countOfElements: PropTypes.number, //Общее количество страниц
	path: PropTypes.string.isRequired, //Путь, наприме /pages (без второго слеша на конце)
	error: PropTypes.object.isRequired,//Объект ошибки
	history: PropTypes.object.isRequired,//History browser (history из пропсов компонента)
	location: PropTypes.object.isRequired
};

export default CustomPagination;
