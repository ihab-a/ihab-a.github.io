function Nav(props){
	const main_id = React.useRef(genId());
	const mainContext = React.useContext(MainContext);
	mainContext.navId = main_id;
	function clearNavSelection(){
		[...document.querySelectorAll("nav>*")].map((navItem) => {
			navItem.className = navItem.className.split(" ").filter((className) => className != "nav-selected").join(" ");
		})
	}
	mainContext.onOverlayClear.push(clearNavSelection);
	return <nav className="nav" id={main_id.current}>
	{
	props.data.map((elem) => {
		return <section className="navItem" key={elem.name} title={elem.name} onClick={(e) => {
			elem.onClick();
			clearNavSelection();
			if(!elem?.noSelection)
				e.target.className += " nav-selected";
		}}>
			<img src={elem.icon}/>
		</section>
	})
	}</nav>
}