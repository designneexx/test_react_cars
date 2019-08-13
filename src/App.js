import React, {Component} from "react";
import {Container} from 'reactstrap'; //Импорт reactstrap (Bootstrap для react)
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; //Испорт роутера
import "./App.scss";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
/*Страницы(компоненты)*/
import Home from "./pages/home";
import Car from "./pages/car/_id";
import Errors from "./errors";

class App extends Component {
	state = {
		404: {
			message: "Страница не найдена :(",
			statusCode: 404
		}
	};
	
	render () {
		return (
			<> {/*Сокращенный синтаксис <React.Fragment/> - <></>*/}
				<Navbar/>
				<Container>
					<Router>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/car/:id" component={Car} />
							<Route exact path="/pages/:page" component={Home}  />
							<Route render={() => <Errors error={this.state[404]} />}/>
						</Switch>
					</Router>
				</Container>
				<Footer/>
			</>
		);
	}
}

export default App;
