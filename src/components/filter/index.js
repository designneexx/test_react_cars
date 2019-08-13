import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Example extends React.Component {
	render() {
		return (
			<Form inline>
				<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
					<strong>Сортировать по: </strong>
				</FormGroup>
				<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
					<Label for="priceCheck" className="mr-sm-2">Цене</Label>
					<Input type="radio" value={this.props.priceCheck} name="check" id="priceCheck"/>
				</FormGroup>
				<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
					<Label for="distanceCheck" className="mr-sm-2">Удаленности</Label>
					<Input type="radio" value={this.props.distanceCheck} name="check" id="distanceCheck"/>
				</FormGroup>
			</Form>
		);
	}
}
