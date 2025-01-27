import { Fragment } from "react";



function ListGroup() {
    const items = [
        'New York',
        'Atlanta',
        'Chicago',
        'Los Angeles'
    ];
    
    return (
        <Fragment>
            <h1>List</h1>
        <ul className="list-group">
            {items.map(item => <li className="list-group-item" 
            key={item}>{item}</li>)}
        </ul>
        </Fragment>
    );
}

export default ListGroup;