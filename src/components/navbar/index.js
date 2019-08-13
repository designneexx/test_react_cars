import React from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	Container,
	Row
} from 'reactstrap';
import * as styles from "./style.module.scss";
import {styleArray} from "../../additional"; //Импорт array-class-names
import {Link} from 'react-router-dom'; //Импорт роутера

export default class HeaderSite extends React.Component {
	state = {
		isOpen: false //Открыто ли мобильное меню
	};
	
	//Меню переключатель для гамбургера (мобильное меню)
	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};
	
	render () {
		return (
			<Navbar className={ styles.headerSite } color="light" light expand="md">
				<Container>
					<Row className={ styleArray(['justify-content-between', styles.headerRow]) }>
						<NavbarBrand href="/">
							React Cars
						</NavbarBrand>
						<NavbarToggler onClick={ this.toggle }/>
						<Collapse isOpen={ this.state.isOpen } navbar>
							<Nav className="ml-auto" navbar>
								<NavItem>
									<Link className={ styleArray(["nav-link", styles.navLink]) } to="/">Все товары</Link>
								</NavItem>
								<NavItem>
									<NavLink className={ styles.navLink }
									         href="https://github.com/designneexx/test_react_cars">GitHub</NavLink>
								</NavItem>
							</Nav>
						</Collapse>
					</Row>
				</Container>
			</Navbar>
		);
	}
}
