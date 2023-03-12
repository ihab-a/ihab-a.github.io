ReactDOM.createRoot(document.getElementById("root")).render(<App />)
const MainContext = React.createContext();


let id = 0;
function genId(){return ++id;}

function checkVisibility(){
	let effectDelayCount = 0;
	[...document.querySelectorAll(".invisible")].map((elem) => {
		const rect = elem.getBoundingClientRect();
		if(rect.y > 0 && rect.y < screen.height){
			const classList = elem.className.split(" ");
			if(classList.indexOf("invisible") != -1){
				classList[classList.indexOf("invisible")] = "visible";
				setTimeout(()=>{elem.className = classList.join(" ")}, ++effectDelayCount * 200)
			}
		}
	})
}
function notify(text, positive = true, duration = 4000){
	if(!document.getElementById("notification-holder")){
		const holder = document.createElement("section");
		holder.id = "notification-holder";
		document.documentElement.appendChild(holder);
	}
	const holder = document.getElementById("notification-holder"); 
	const main_id = genId();
	const elem = document.createElement("section");
	elem.id = main_id;
	elem.className = `notification-${positive ? "positive" : "negative"} invisible`;
	elem.innerText = text;
	holder.appendChild(elem);
	checkVisibility()
	setTimeout(() => {
		elem.remove()
	}, duration)
}
const userApi = {
	get : (callback, target="") => {
		const link = `/api/user.php?token=${localStorage.getItem("token")}${target ? `&target=${target}` : ""}`;
		if(target=="profile")
			return link;
		const req = new XMLHttpRequest();
		req.open("GET", link);
		req.onload = () => {
			const data = JSON.parse(req.response) || "";
			if(data.id){
				data.profile = link + "&target=profile";
			}
			callback(data);
		}
		req.send();
	},
	signup : (data, clearOverlay) => {
		const req = new XMLHttpRequest();
		req.open("POST", "/api/user.php");
		req.onload = () => {
			const res = JSON.parse(req.response);
			if(res.token){
				localStorage.setItem("token", res.token);
				notify("signup completed successfully, please go to your email to verify your account.")
				clearOverlay();
			}
			else
				notify(res.error, false);
		}
		data.append("action", "signup");
		req.send(data);
	},
	login : (data, clearOverlay) => {
		const req = new XMLHttpRequest();
		req.open("POST", "/api/user.php");
		req.onload = () => {
			const res = JSON.parse(req.response);
			if(res.token){
				localStorage.setItem("token", res.token);
				notify("login completed successfully.")
				clearOverlay();
			}
			else
				notify(res.error, false);
		}
		data.append("action", "login");
		req.send(data);
	},
	edit : (data) => {
		const req = new XMLHttpRequest();
		req.open("POST", "/api/user.php");
		req.onload = () => {
			if(!req.response){
				notify("Data editted successfully.")
			}
			else
				notify(JSON.parse(req.response).error, false);
		}
		data.append("action", "edit");
		data.append("token", localStorage.getItem("token"));
		req.send(data);
	},
	logout : (callback, clearOverlay) => {
		const req = new XMLHttpRequest();
		req.open("LOGOUT", "/api/user.php");
		req.onload = () => {
			if(!req.response){
				localStorage.setItem("token", "");
				callback([]);
				notify("logout completed successfully.")
				clearOverlay();
			}
			else
				notify(JSON.parse(req.response).error, false);
		}
		req.send("token=" + localStorage.getItem("token"));
	},
	message : (message) => {
		const req = new XMLHttpRequest();
		req.open("MESSAGE", "/api/user.php");
		req.onload = () => {
			if(!req.response){
				notify("Message sent successfully.")
			}
			else
				notify(JSON.parse(req.response).error, false);
		}
		req.send(`message=${message}&token=${localStorage.getItem("token")}`);
	},
	history : (callback, target = "") => {
		const req = new XMLHttpRequest();
		req.open("HISTORY", "/api/user.php");
		req.onload = () => {
			const data = JSON.parse(req.response);
			if(!data.error){
				callback(data);
			}
			else
				notify(data.error, false);
		}
		req.send(`${target ? "target=" + target + "&" : ""}token=${localStorage.getItem("token")}`);
	},
	order : (data, clearOverlay) => {
		const req = new XMLHttpRequest();
		req.open("POST", "/api/user.php");
		req.onload = () => {
			if(!req.response){
				clearOverlay([]);
				notify("Order sent successfully, check your email for confirmation.")
			}
			else
				notify(JSON.parse(req.response).error);
		}
		data.append("token", localStorage.getItem("token"));
		data.append("action", "order");
		req.send(data);
	},
	get_design_photo : (id) => {
		return `/api/user.php?token=${localStorage.getItem("token")}&id=${id}&target=design_photo`;
	}
}
function App(){
	const firstRender = React.useRef(true);
	const [userData, setUserData] = React.useState({});
	const old_userData = React.useRef(userData);
	const navData = [
		{name:"user", type:"profile", icon: userData.profile ? userData.profile + "&r=" + genId() : "asset/icon/user.svg", onClick:() => {
			setOverlay([userData.id ? <Account key="account"/> : <Auth key="auth"/>]);
		}},
		{name:"order", icon:"asset/icon/order.svg", onClick:() => {
			setOverlay([<Order key="order"/>]);
		}},
		{name:"contact us", icon:"asset/icon/contact.svg", onClick:() => {
			document.getElementById("contact")?.scrollIntoView();
		}, noSelection:true}
	]
	const [overlay, setOverlayVal] = React.useState({"prev":[], "cur":[], "next":[], "head":[]});
	function setOverlay(val, tar="cur"){
		if(!["prev", "cur", "next", "head"].includes(tar)) return
		setOverlayVal((overlay) => {
			let tmp = {...overlay};
			if (tar != "prev" && tar != "head") tmp = {...overlay, "prev" : overlay.cur};
			tmp[tar] = val;
			return tmp;
		})
	} 
	React.useEffect(() => {
		userApi.get(setUserData);
	}, [overlay])
	React.useEffect(() => {
		setInterval(() => {
			userApi.get(setUserData);
		}, 5000)
	}, [])
	React.useEffect(() => {
		if(JSON.stringify(userData) == JSON.stringify(old_userData.current))
			return
		old_userData.current = userData;
		if(firstRender.current){
			firstRender.current = false;
			return;
		}
		if(userData.error)
			notify(userData.error);
		if(JSON.stringify(userData) == "{}"){
			notify("please login or signup to benefit from all the features.");
		}else{
			setOverlay([]);
		}
	}, [userData])
	return <MainContext.Provider value={{"setProgress":undefined,
										"setOverlay": setOverlay,
										"overlay":overlay,
										"onOverlayClear":[],
										"userData":userData,
										"setUserData":setUserData}}>
		<section className="head">
			<Progress/>
			<Logo icon="asset/icon/logo.svg" delay="600">EnterDev</Logo>
		</section>
		<Nav data={navData}/>
		<Main/>
		<div id="waves"/>
		<Overlay data={overlay}/>
	</MainContext.Provider>
}