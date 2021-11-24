import {
	BrowserRouter,
	Switch,
	Route,
} from 'react-router-dom';

import PrivateRoute from './components/routing/PrivateRoute';

import PrivateScreen from './components/screens/PrivateScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ForgotpasswordScreen from './components/screens/ForgotpasswordScreen';
import PasswordRestScreen from './components/screens/PasswordRestScreen';

function App() {
	return (
		<BrowserRouter>
			<div className='app'>
				<Switch>
					<PrivateRoute
						exact
						path='/'
						component={PrivateScreen}
					/>
					<Route
						exact
						path='/login'
						component={LoginScreen}
					/>
					<Route
						exact
						path='/register'
						component={RegisterScreen}
					/>
					<Route
						exact
						path='/forgotpassword'
						component={ForgotpasswordScreen}
					/>
					<Route
						exact
						path='/passwordreset/:resetToken'
						component={PasswordRestScreen}
					/>
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
