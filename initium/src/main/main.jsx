function Main(props){
	const main_id = React.useRef(genId());
	const mainContext = React.useContext(MainContext);
	React.useEffect(() => {
		document.getElementById(main_id.current).onscroll = checkVisibility;
		document.getElementById(mainContext.navId.current).onclick = checkVisibility;
		checkVisibility();
	}, [])
	function updateProgress(e){
		if(e.target.scrollTop == 0) return mainContext.setProgress(0);
		mainContext.setProgress(((e.target.scrollTop + e.target.clientHeight) / e.target.scrollHeight) * 100);
	}
	return <section className="main" id={main_id.current} onScroll={(e) => updateProgress(e)}>
		<section id="top-background-image"></section>
		<section className="fill" style={{paddingTop:"15vh"}}>
		<div>
			<Text type="featured">ignite a new flame into your project</Text>
			<Text type="normal-big">We provide you with the best and most customizable solutions, with flexible prices and consistent client support.</Text>
			<div className="flex-holder" style={{justifyContent:"flex-start"}}>
				<Input type="button" className="input-active" onClick={() => {
					document.getElementById("order").scrollIntoView()
				}}>order now!</Input>
				<Input type="button" className="input-passive" onClick={() => {
					document.getElementById("services").scrollIntoView()
				}}>services</Input>
			</div>
		</div>
		</section>
		<div className="space-max"/>
		<div className="space-max" id="services"/>
		<Text type="title">get any type of website you can immagine</Text>
		<section className="flex-holder">
			<Card title="bussiness" onClick={() => {
				mainContext.setOverlay([<Order key="order" target="website" type="bussiness"/>]);
			}}>get a website that defines your bussiness, attract more customers and make your workflow more efficient</Card>
			<Card title="e-Commerce" onClick={() => {
				mainContext.setOverlay([<Order key="order" target="website" type="e-commerce"/>]);
			}}>get an online shop that allows you to present your products for as many clients as possible as well as receive online payments.</Card>
			<Card title="personnal" onClick={() => {
				mainContext.setOverlay([<Order key="order" target="website" type="personal"/>]);
			}}>get a personnal portfolio or website which may fullfill any of your specific needs.</Card>
		</section>
		<div className="space-max"/>
		<Text type="title">get local / private solutions to automate tasks</Text>
		<section className="flex-holder">
			<Icon image="/initium/asset/icon/time_managment.svg" title="time managment" onClick={() => {
				mainContext.setOverlay([<Order key="order" main_function="time managment" target="local solution" type="bussiness"/>]);
			}}>a solution that helps you manage your or your clients' time.</Icon>
			<Icon image="/initium/asset/icon/product_managment.svg" title="product managment" onClick={() => {
				mainContext.setOverlay([<Order key="order" main_function="product_managment" target="local solution" type="bussiness"/>]);
			}}>a solution that helps you manage your or your clients' products / storage.</Icon>
			<Icon image="/initium/asset/icon/database.svg" title="local database (files, text...)" onClick={() => {
				mainContext.setOverlay([<Order key="order" main_function="local database" target="local solution" type="bussiness"/>]);
			}}>get a local database to store any type of data.</Icon>
		</section>
		<div className="space-max"/>
		<Text type="title">more services</Text>
		<section className="flex-holder">
			<Icon image="/initium/asset/icon/seo.svg" title="SEO" onClick={() => {
				mainContext.setOverlay([<Order key="order" target="SEO"/>]);
			}}>optimise the appearance and relevance of your website.</Icon>
			<Icon image="/initium/asset/icon/maintenance.svg" title="Maintenance" onClick={() => {
				mainContext.setOverlay([<Order key="order" target="Maintenance" type="bussiness"/>]);
			}}>fix problems in your solution or improve it's quality.</Icon>
			<Icon image="/initium/asset/icon/phone.svg" title="Android / ios app creation" onClick={() => {
				mainContext.setOverlay([<Order key="order" target="App" type="bussiness"/>]);
			}}>get an application for your bussiness.</Icon>
		</section>
		<div className="space-max" id="order"/>
		<Text type="title">how to order</Text>
		<Text type="normal-big" style={{textAlign:"center"}}>there are 2 simple and fast forward ways to order, please choose based on your preference</Text>
		<section className="flex-holder">
			<Card title="guided" onClick={() => {
				mainContext.setOverlay([<Order key="order" type="guided"/>]);
			}}>
				Simply fill a forum of questions about your desired solutions. 
				<div style={{color:"var(--color-a)"}}>click to continue</div>
			</Card>
			<Card title="attend a conference" onClick={() => {
				mainContext.setOverlay([<Order key="order" type="conference"/>]);
			}}>
				Either online or face-to-face depending on the area you live in. 
				<div style={{color:"var(--color-a)"}}>click to continue</div>
			</Card>
		</section>

		<Text type="title" style={{textAlign:"center", maxWidth:"100%"}}>about us</Text>
			<Text type="normal-big" style={{maxWidth:"100%"}}>- A startup specialised at creating the best and most customisable solutions that fit your specific neeeds.</Text>
			<div className="space-l"/>
			<Text type="normal-big" style={{maxWidth:"100%"}}>- We use the latest technologies available to ensure the best performance and looks.</Text>
			<div className="space-l"/>
			<Text type="normal-big" style={{maxWidth:"100%"}}>- Most of our solutions are cross-plateform meaning they could be used with any device available unless an exclusive solution is requested.</Text>
			<div className="space-l"/>
			<Text type="normal-big" style={{maxWidth:"100%"}}>- We make sure our designs are to the point and expressing of the specific task it is meant to service.</Text>
			<div className="space-l"/>
			<Text type="normal-big" style={{maxWidth:"100%"}}>- Data security matters a lot to us, and therefore we specify a whole section of the work to review and ensure all data is secure and private.</Text>
			<div className="space-l"/>
		<div className="space-l"/>

		<section id="contact" style={{paddingTop:"20%"}}>
			<Text type="title" style={{textAlign:"center", maxWidth:"100%"}}>Contact us</Text>
			<section className="flex-holder">
				<Icon style={{maxWidth:"fit-content"}} image="/initium/asset/icon/seo.svg" className="light" title="email">agni.ihab@gmail.com.</Icon>
				<Icon style={{maxWidth:"fit-content"}} image="/initium/asset/icon/seo.svg" className="light" title="instagram">enter_dev.</Icon>
				<Icon style={{maxWidth:"fit-content"}} image="/initium/asset/icon/seo.svg" className="light" title="facebook">enter_dev.</Icon>
				<Icon style={{maxWidth:"fit-content"}} image="/initium/asset/icon/seo.svg" className="light" title="Whatsapp">06xxxxxxxx.</Icon>
				{
				mainContext?.userData?.id ? 
				<>
					<Text type="title" style={{textAlign:"center", width:"100%", maxWidth:"unset"}}>Contact us throught our site</Text>
					<textarea id="message"className="input-light" placeholder="type your message here"/>
					<Input type="button" className="input-light" onClick={() => {
						userApi.message(document.getElementById("message").value);
					}}>send</Input>
				</>
				: ""
				}
			</section>
		</section>
	</section>
}