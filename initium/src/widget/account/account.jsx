function Account(props){
	const mainContext = React.useContext(MainContext);
	const [target, setTarget] = React.useState("");
	React.useEffect(() => {
		mainContext.setOverlay([<Text key="title" type="normal-big">{`# ${mainContext.userData.name || mainContext.userData.email}`}</Text>], "head");
	}, []);
	React.useEffect(() => {
		if(target != "")
			mainContext.setOverlay([<Input type="button" className="input-active" key="back" onClick={() => {
				setTarget("");
			}}>&#9668; back</Input>, <Text type="normal-big" key="title">~{target}</Text>], "head")
		else
			mainContext.setOverlay(props.head ?? [], "head");
		checkVisibility();
	}, [target]);
	return target == "" ?
		<section style={{display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-evenly"}}>
			<Card title="order history" key="account_history" onClick={() => {setTarget("history")}}>view all your previous orders and their status.</Card>
			<Card title="order a solution" key="account_order" onClick={() => {mainContext.setOverlay([<Order key="order"/>])}}>get your own custom solution now!</Card>
			<Card title="edit profile info" key="account_edit" onClick={() => {setTarget("edit")}}>change your account details.</Card>
			<Card title="logout" key="account_logout" onClick={() => {
				userApi.logout(mainContext.setUserData, () => mainContext.setOverlay([]))}}/>
		</section>
		: target == "history" ?
		<section style={{display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-evenly"}}>
			<History/>
		</section>
		: target == "edit" ?
		<section style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-evenly"}}>
			<Edit/>
		</section>
		: "unexpected error please report the error to us with a screenshot attached.";
}

function History(){
	const [data, setData] = React.useState("loading");
	const [expanded, setExpanded] = React.useState();
	const searchBar = React.useRef(genId());
	const filterTarget = React.useRef(genId());
	const searchTarget = React.useRef(genId());
	const curData = React.useRef([]);
	function filter(){
		setData((data) => {
			return data.map((elem) => {
				// to not change the original data
				const newElem = {...elem};
				if(RegExp(`${document.getElementById(searchBar.current).value}`).test(elem[document.getElementById(filterTarget.current).value]))
					newElem.show = true;
				else
					newElem.show = false;
				return newElem;
			});
		});
	}
	function changeTarget(){
		setData(userApi.history(setData, document.getElementById(searchTarget.current).value));
	}
	React.useEffect(() => {
		notify("Click an order to show more info", true, 5000);
		userApi.history((data) => {
			setExpanded((() => {
				const map = {};
				for(let elem of data){
					map[elem.id] = false;
				}
				return map;
			})());
			return setData(data);
		});
	}, []);
	React.useEffect(() => {
		checkVisibility();
	}, [data]);
	return data == "loading" ? "...loading..."
		: 
		<>
		<Input type="text" id={searchBar.current} style={{minWidth:"100%"}} placeholder="search for orders" onChange={filter}/>
		<Input type="select" style={{minWidth:"65%"}} id={filterTarget.current} onChange={filter} label="search by" data={[["name", "name"],["id", "id"],["service", "service"],["type", "type"]]}/>
		<Input type="select" style={{minWidth:"65%"}} id={searchTarget.current} onChange={changeTarget} label="search for" data={[["solution", "solutions"],["service", "services"]]}/>
		{
			curData.current = data?.map((elem) => {
			if(elem.show == false) return;
			return ["maintenance", "seo"].includes(elem.service?.toLowerCase()) ? 
				<section key={elem.id} className={`history-holder invisible`}>
					<section className="history-content">
						<section className="history-detail">
							<section className="history-title">service ID</section>
							<section className="history-detail-content">{elem.id}</section>
						</section>
						<section className="history-detail">
							<section className="history-title">solution ID</section>
							<section className="history-detail-content">{elem.solution_id || "N/A"}</section>
						</section>
						<section className="history-detail">
							<section className="history-title">time</section>
							<section className="history-detail-content">{elem.time || "N/A"}</section>
						</section>
						<section className="history-detail">
							<section className="history-title">service</section>
							<section className="history-detail-content">{elem.service || "N/A"}</section>
						</section>
					</section>
				</section>
			: <section key={elem.id} className={`history-holder invisible`}>
			<section className="history-content">
				<section className="history-detail">
					<section className="history-title">solution ID</section>
					<section className="history-detail-content">{elem.id}</section>
				</section>
				<section className="history-detail">
					<section className="history-title">name</section>
					<section className="history-detail-content">{elem.name || "N/A"}</section>
				</section>
				<section className="history-detail">
					<section className="history-title">time</section>
					<section className="history-detail-content">{elem.time || "N/A"}</section>
				</section>
				{
				expanded[elem.id] ? 
					<>
					<section className="history-detail">
						<section className="history-title">service</section>
						<section className="history-detail-content">{elem.service || "N/A"}</section>
					</section>
					<section className="history-detail">
						<section className="history-title">type</section>
						<section className="history-detail-content">{elem.type || "N/A"}</section>
					</section>
					<section className="history-detail">
						<section className="history-title">main function</section>
						<section className="history-detail-content">{elem.main_function || "N/A"}</section>
						</section>
					<section className="history-detail">
						<section className="history-title">features notes</section>
						<section className="history-detail-content">{elem.features_notes || "N/A"}</section>
						</section>
					<section className="history-detail">
						<section className="history-title">design notes</section>
						<section className="history-detail-content">{elem.design_notes || "N/A"}</section>
						</section>
					<section className="history-detail">
						<section className="history-title">logo requested</section>
						<section className="history-detail-content">{(elem.logo_requested ?? "N/A") != "N/A" ? elem.logo_requested == 1 ? "Yes" : "No" : ""}</section>
						</section>
					<section className="history-detail">
						<section className="history-title">design photo</section>
						<img className="history-detail-content" fullscreen="false" src={userApi.get_design_photo(elem.id)} style={{height:"var(--max)", zIndex:10}} onClick={(e) => {
							if(e.target.getAttribute("fullscreen") == "false")
								return e.target.setAttribute("fullscreen", "true");
							return e.target.setAttribute("fullscreen", "false");
						}}/>
						</section>
					<section className="history-detail">
						<section className="history-title">time</section>
						<section className="history-detail-content">{elem.time || "N/A"}</section>
					</section>
					</>
				: ""
				}
			</section>
			{
				!expanded[elem.id] ?
				<section className="history-status">{elem.status || "status N/A"}</section>
				: ""
			}
			<section style={{position:"relative", width:"var(--xxl)", alignSelf:"flex-start"}} onClick={() => {
				setExpanded((current) => {
					const map = {...current};
					map[elem.id] = !map[elem.id];
					return map;
				});
			}}><img src="/asset/icon/expand_toggle.svg" style={{width:"100%", height:"100%", transform: expanded[elem.id] ? "rotate(-0.5turn)" : "none"}}/>
			</section>
			</section>
		})
		}
		{curData.current?.filter((e) => e).length == 0 ? 
			<Text type="normal-big" style={{width:'100%', maxWidth:'100%', textAlign:"center", color:"var(--color-a)"}}>Oops... no orders found</Text> 
		: ""}
		</>
}
function Edit(){
	const mainContext = React.useContext(MainContext);
	return <form className="form" id="edit">
		<Input type="text" 
			name="name" 
			label="username" 
			placeholder={mainContext.userData.name || ""} 
			info="a unique name to identify you."
		/>
		<Input type="text" 
			name="email" 
			label="email" 
			placeholder={mainContext.userData.email || ""} 
			info="email to be used when we contact you."
		/>
		<Input type="text" 
			name="phone" 
			label="phone" 
			placeholder={mainContext.userData.phone || ""} 
			info="phone number to use in case email isn't sufficent."
		/>
		<Input type="text" 
			name="address" 
			label="address" 
			placeholder={mainContext.userData.address || ""} 
			info="to decide the possibility of in-person conferences."
		/>
		<Input type="file" 
			name="profile" 
			label="profile" 
			info="profile picture to identify you."
			src={mainContext.userData?.profile}
		/>
		<Input type="password" 
			name="old_password" 
			label="old password" 
			info="password to secure your account"
			placeholder="your old password"
		/>
		<Input type="password" 
			name="new_password" 
			label="new password" 
			info="password to secure your account"
			placeholder="your new password"
		/>
		<Input type="button" className="input-active" onClick={(e) => {
			e.preventDefault();
			userApi.edit(new FormData(document.getElementById("edit")), () => props.setOverlay([]));
		}}>edit</Input>
	</form>	
}