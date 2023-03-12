function Icon(props){
	return <section className="icon invisible" style={props.style} onClick={props.onClick}>
		<section className="icon-image" style={{backgroundImage:`url(${props.image || ""})`}}/>
		<section className="icon-content">
			<section className={`icon${props.className=="light" ? "-light" : ""}-title`}>{props.title}</section>
			<section className={`icon${props.className=="light" ? "-light" : ""}-text`}>{props.children}</section>
		</section>
	</section>
}