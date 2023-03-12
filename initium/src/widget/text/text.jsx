function Text(props){
	return <section onClick={props.onClick} id={props.id} style={props.style} className={`invisible text${props.type == "featured" ? "-f" : ""}`}>{
		props.type == "link" ? 
			<a className={`text-${props.type || "link"}`}
				href={props.href}>{props.children}</a>
		: <>
			{["title", "featured"].includes(props.type) ? <div className="space-xl"/> : ""}
			<span className={`text-${props.type || "normal"}`}>
				{props.children}
			</span>
			{["title", "featured"].includes(props.type) ? <div className="space-xl"/> : ""}
		</>
	}</section>
}