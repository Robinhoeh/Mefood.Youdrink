import React from 'react';
import ReactDOM from 'react-dom';
import{
	BrowserRouter as Router, 
	NavLink as Link,
	Route
} from 'react-router-dom';

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyArWoSJY_OFYKV4VPIQ9Ed7xYuHfGCaTus",
		authDomain: "react-me-food-you-drinks.firebaseapp.com",
		databaseURL: "https://react-me-food-you-drinks.firebaseio.com",
		projectId: "react-me-food-you-drinks",
		storageBucket: "react-me-food-you-drinks.appspot.com",
		messagingSenderId: "1058206393716"
	};
	firebase.initializeApp(config);

const dbRef = firebase.database().ref('/list'); //attaching link between app and firebase 

class SecondPage extends React.Component {
	constructor() {
		super();
		this.state = {
			currrentItem: '',
			username: '',
			items: [],
			partyInfo: {
				whoParty: 'Loading...',
				whenParty: 'Loading...',
				whatParty: 'Loading...'
			}
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit= this.handleSubmit.bind(this);
	}

	  handleChange(e) { 
	  	this.setState({
	  		[e.target.name]: e.target.value
	  	});
	  }

	  handleSubmit(e) {
	  	e.preventDefault();
	  	const itemsRef = firebase.database().ref(`list/${this.props.match.params.id}/items`);	//reference firebase with .ref - 'items' is folder created in firebase
	  	const item = {
	  		title: this.state.currentItem,	//pull user data from state that they typed, send it to Fbase
	  		user: this.state.username
	  	}
	  	itemsRef.push(item);
	  	this.setState({	//this is clearing the input after the user has submitted
	  		currentItem: '',
	  		username: ''
	  	});
	  }

	componentDidMount() {
		// console.log(this.props.match.params.id);
		dbRef.child(this.props.match.params.id).on("value", partyInfo => {
			const partyinfo = partyInfo.val();
			// console.log(partyinfo);
			this.setState({
				partyInfo: partyInfo.val()
			});
		}); //this is the key from the route

		const itemsRef = firebase.database().ref(`list/${this.props.match.params.id}/items`);
		itemsRef.on('value', (snapshot) => {
			// console.log(snapshot.val());
			let items = snapshot.val();
			let newState = [];
			for (let item in items) {
				newState.push({
				id: item, 
				title: items[item].title,
				user: items[item].user
			});
		}
		this.setState({
			items: newState
		});
	});
	}
	removeItem(itemId) {
		console.log(itemId)
		const itemRef = firebase.database().ref(`/list/${this.props.match.params.id}/items/${itemId}`);
		itemRef.remove();
	}

	render() {
		return (
			<div className='addDrinks'>
			<header>
				<div className='wrapper'>
				  <h2>Host: {this.state.partyInfo.whoParty}</h2>
				  <h2> When: {this.state.partyInfo.whenParty}</h2>
				  <h2> Time: {this.state.partyInfo.whatParty}</h2>
				</div>
				<div className='drinkIdeasLink'>
					<a href="#">Drink ideas!</a>
				</div>
			</header>

			<div className='container'>
			  <section className='add-item'>
				  <form onSubmit={this.handleSubmit }>
				  <div className='pageTwoFlexItemOne'>
						<label>What's your name?</label>
						<input type="text" name="username" placeholder="Type your name here" onChange={this.handleChange} value={this.state.username} />
					</div>
					 <div className='pageTwoFlexItemTwo'>
						<label>What are you bringing to drink?</label>
						<input type="text" name="currentItem" placeholder="ie. 6 pack, bottle of wine etc..." onChange={this.handleChange} value={this.state.currentItem} />
					</div>
					<button>Add drinks ➕</button>
				  </form>
			  </section>

			  <section className='display-item'>
				  <ul>
				  {this.state.items.map((item) => {
				  	return (
				  		<li key={item.id}>
				  		<h3>Name: {item.user}</h3>
				  		<h4>Drink(s): {item.title}</h4>
				  		<button onClick={() => this.removeItem(item.id)}>Remove drinks 😢</button>
				  		</li>
				  	)
				  	})}
				  </ul>
			  </section>
			  <Footer />
			</div>
		  </div>
		);
	}
}

class UserForm extends React.Component {
	constructor(props) {
		super();
		this.state = {
				whoParty: '',
				whenParty: '',
				whatParty: ''
			};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]:e.target.value}); 
			//looks at input name, gonna look for that in the state, value is what user typed in
	}

	handleSubmit(event) {
		// console.log('you working?' + this.state.value);
		event.preventDefault();
		const listKey = dbRef.push().key;   //creates a key in firebase

		const updates = {};
		updates[listKey] = {
				whoParty:this.state.whoParty,
				whenParty:this.state.whenParty,
				whatParty:this.state.whatParty
			}

			dbRef.update(updates);
		// dbRef.push(this.state.whoParty); //pushing user from input to firebase
		// dbRef.push(this.state.whenParty);
		// dbRef.push(this.state.whatParty);
		this.setState({ //clears input on submit button push
			whoParty: '',
			whenParty: '',
			whatParty: '',
			listKey
		});
	}

	render() {
		return (
			<div className='pageOneWrapper'>
				<form onSubmit={this.handleSubmit}>
				<div className='formFlexContainer'>
					<div className='flexOneTwo'>
						<div className='formItemOne'>
							<label>Who is throwing the party?</label>
							<input name='whoParty'  type='text' placeholder='eg. Robin' value={this.state.whoParty} onChange={this.handleChange} />
						</div>
						<div className='formItemTwo'>
							<label>When is the party?</label>
							<input name='whenParty' type="date" placeholder='When is the party?' value={this.state.whenParty} onChange={this.handleChange} /> 
						</div>
					</div>
					<div className= 'formItemThree'>
						<label>What time do you want people to show up? </label>
						<input name='whatParty' type="text" placeholder='eg. 8pm' value={this.state.whatParty} onChange={this.handleChange} />
					</div> 
					<div className='formItemFour'>
						<label>Share this link with the guests of your party! 🎉</label>
						<input Classname='generateKeySubmit' type="submit" value='Click here to display and share link'/>
					</div>
				</div>
				</form>
				<div className='linkShare'>
				{ this.state.listKey === undefined ?    //essentially an if statement - ternary operator
						null    // if this.state.listkey is undefined, it returns nothing, is it is , returns the a tag below
					: // 'else' 
					  <Link to={`${this.state.listKey}`}><p className="linkText">{window.location.href}{this.state.listKey}</p></Link>
				}
				</div>
				<Footer />
			</div>
		);
	}
}

export default function Footer() {
	return (
		<footer><a href="https://twitter.com/rdubcodes">
		<span>&copy; Robin Watson</span></a><span> | 2017</span>
		</footer>
	)
}


class App extends React.Component { //main app component
	render() {  //main app rendering to page
		return (
			<Router>
				<main>
					<Route>
						<div className='divDaddy'>
							<h1>Me food. You drinks.</h1>
							<p>Parties are stressful. You got the food, let your guests take care of the drinks</p>
						</div>
					</Route>
					<section>
						<Route exact path="/" component={UserForm} />
						<Route exact path='/:id' component={SecondPage} />
					</section>
				</main>
			</Router>
		);
	}
}



ReactDOM.render(<App />, document.getElementById('app'));











