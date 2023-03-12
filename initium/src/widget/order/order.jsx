function Order(props){
	const mainContext = React.useContext(MainContext);
	const [type, setType] = React.useState(props.type || "");
	React.useEffect(() => {
		if(type != "")
			mainContext.setOverlay([<Input type="button" className="input-active" key="back" onClick={() => {
				setType("");
			}}>&#9668; back</Input>, <Text type="normal-big" key="title">~{type}</Text>], "head")
		else
			mainContext.setOverlay(props.head ?? [], "head");
		checkVisibility();
	}, [type]);
	return type == "" ?
		<section style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
			<Card title="Guided" onClick={() => {setType("guided")}}/>
			<Card title="Conference" onClick={() => {setType("conference")}}/>
		</section>
	: type == "conference" ? <Conference {...props}/> : <Guided {...props}/>;
}

function Guided(props){
	const form_id = React.useRef(genId());
	const checkbox_id = React.useRef(genId());
	const mainContext = React.useContext(MainContext);
	const solution_list_id = React.useRef(genId());
	const solution_list = [
		["website", "website"],
		["App", "App"],
		["website and App", "website and App"],
		["local solution", "local solution"],
		["SEO", "SEO"],
		["Maintenance", "Maintenance"]
	];
	const [target, setTarget] = React.useState(solution_list[0][0]);
	React.useEffect(() => {
		if(props.target){
			document.getElementById(solution_list_id.current).value = props.target;
			setTarget(props.target);
		}
		if(!mainContext.userData.id){
			notify("Please login or signup first!", false);
			return mainContext.setOverlay([<Auth key="Auth"/>]);
		}
		mainContext.setOverlay([<Text type="normal-big" key="head">order your own solution!</Text>], "head")
	}, [])
	React.useEffect(() => {
		checkVisibility();
	}, [target])
	return <form className="form" id={form_id.current}>
		<Input id={solution_list_id.current} label="Service" name="service" type="select" data={solution_list} onChange={(e) => {
			setTarget(e.target.value);
		}}/>
		{ ["SEO", "Maintenance"].includes(target) ?
			<>
				<Input label="solution ID" name="solution_id" placeholder="your solution id"/>
				<Text>* The solution ID is emailed to you after finishing the order of your solution.</Text>
				<Text>If you have trouble finding your solution id please contact us.</Text>
			</>
		: <>
			<Input type="select-radio" name="type" data={[["bussiness", "Bussiness"], ["e-commerce", "e-Commerce"], ["personal", "Personal"]]} selected={props.type}/>
			<Input label="solution name" name="name" placeholder="Ex: EnterDev"/>
			<Input label="solution main function" name="main_function" placeholder="Ex: sell clothes">{props.main_function ?? undefined}</Input>
			<Input label="additional notes and features" name="features_notes" type="textarea" placeholder="additional notes about what you want to see in the solution"/>
			<input id={checkbox_id.current} type="hidden" name="logo_requested" value="0"/>
			<Input type="checkbox" postLabel="I want a logo" onClick={() => {
				const target = document.getElementById(checkbox_id.current);
				target.value = target.value == "0" ? "1" : "0";
			}}/>
			<Input label="your design propositions (optionnal)" name="design_notes" type="textarea" placeholder="design ideas"/>
			<Input type="file" name="design_photo" label="design idea photo example (optionnal)"/>
			<Text>prices start from 40$ depending on the type of service <Text type="link">click here for more information about pricing</Text></Text>
		</>
		}
		<Input type="submit" className="input-active" onClick={(e) => {
			e.preventDefault();
			userApi.order(new FormData(document.getElementById(form_id.current)), mainContext.setOverlay);
		}}>order</Input>
	</form>
}

function Conference(props){
	return <form>
		<Text type="normal-big">book a conference by sending us an email (using the login email or mentionning it).</Text>
		<Text type="normal-big">* in website conference booking isn't available yet.</Text>
	</form>
}