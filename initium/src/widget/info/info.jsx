function Info(props){
	if(typeof(props.children) != "string") return
	return <section className="info" tabIndex="0" title="click for info" style={props.style}>
		<div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>?</div>
		<section className="info-content">{props.children}</section>
	</section>
}