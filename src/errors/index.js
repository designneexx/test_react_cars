import React, {Component} from "react";
import {Alert, Col, Button, Jumbotron} from 'reactstrap'; //Импорт reactstrap (Bootstrap для react)
import {Link} from 'react-router-dom'; //Импорт роутера
import * as styles from "./style.module.scss";
import PropTypes from "prop-types";
import {styleArray} from "../additional"; //Импорт array-class-names

class Error extends Component {
	render () {
		return (
			<React.Fragment>
				<Col xs={ 12 } md={ 12 } lg={ 12 }>
					<Alert color="danger" className="text-center">
						Произошла ошибка! :(
						<br/>
						<strong>Смотрите подробности, код ошибки: { this.props.error.statusCode }</strong>
					</Alert>
				</Col>
				<Col xs={ 12 } md={ 12 } lg={ 12 }>
					<Jumbotron className="justify-content-center align-items-center text-center">
						<h3 className="display-4">{ this.props.error.message }</h3>
						<p className="lead">Вы можете вернуться на главную или попробовать перезагрузить страницу</p>
						<hr className="my-2"/>
						<div>
							<Link className={ styleArray(['btn', 'btn-success', styles.btnOffsetR]) } to="/">Вернуться на
								главную</Link>
							<Button color="secondary" onClick={ () => window.location.reload() }>Перезагрузить</Button>
						</div>
					</Jumbotron>
				</Col>
			</React.Fragment>
		);
	}
}

Error.propTypes = {
	error: PropTypes.object.isRequired //Ошибка, стандарт :), то есть { message, statusCode }
};

export default Error;
