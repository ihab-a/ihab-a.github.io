function Auth(props){
	const mainContext = React.useContext(MainContext);
	const [target, setTarget] = React.useState("");
	React.useEffect(() => {
		if(target != "")
			mainContext.setOverlay([<Input type="button" className="input-active" key="back" onClick={() => {
				setTarget("");
			}}>&#9668; back</Input>, <Text type="normal-big" key="title">~{target}</Text>], "head")
		else
			mainContext.setOverlay(props.head ?? [], "head")
	}, [target])
	return target ? (() => {
				return React.createElement(window[target], {"setTarget":setTarget, "setOverlay":mainContext.setOverlay})
			})()
		: <section style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
			<Card title="login" onClick={() => {setTarget("Login")}}/>
			<Card title="signup" onClick={() => {setTarget("Signup")}}/>
		</section>
}
function Login(props){
	return <form className="form" id="login">
		<Input type="text" 
			name="login" 
			label="login" 
			placeholder="username or email"
		/>
		<Input type="password" 
			name="pass" 
			label="password" 
			placeholder="type your password"
		/>
		<Input type="button" className="input-active" onClick={(e) => {
			e.preventDefault();
			userApi.login(new FormData(document.getElementById("login")), () => props.setOverlay([]));
		}}>login</Input>
	</form>
}
function Signup(props){
	return <form className="form" id="signup">
		<Input type="text" 
			name="name" 
			label="username" 
			placeholder="Ex: carl" 
			info="a unique name to identify you."
		/>
		<Input type="text" 
			name="email" 
			label="email" 
			placeholder="Ex: carl12@gmail.com" 
			info="email to be used when we contact you."
		/>
		<Input type="text" 
			name="phone" 
			label="phone" 
			placeholder="Ex: 0215487596" 
			info="phone number to use in case email isn't sufficent."
		/>
		<Input type="text" 
			name="address" 
			label="address" 
			placeholder="Ex: 2285 Driftwood Road, Los Gatos" 
			info="to decide the possibility of in-person conferences."
		/>
		<Input type="file" 
			name="profile" 
			label="profile" 
			info="profile picture to identify you."
		/>
		<Input type="password" 
			name="password" 
			label="password" 
			info="password to secure your account"
			placeholder="choose a password"
		/>
		<Input type="button" className="input-active" onClick={(e) => {
			e.preventDefault();
			userApi.signup(new FormData(document.getElementById("signup")), () => props.setOverlay([]));
		}}>signup</Input>
	</form>	
}