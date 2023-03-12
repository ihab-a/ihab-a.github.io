function Logo(props){
	if(typeof(props.children) != "string") return;
	const main_id = React.useRef(genId());
	const text_id = React.useRef(genId());
	React.useEffect(() => {
		setTimeout(() => {
				const temp = document.createElement("section");
				temp.innerText = props.children;
				temp.className = "logo-text";
				document.getElementById(main_id.current).appendChild(temp);
				document.getElementById(text_id.current).style = `width:${getComputedStyle(temp).width}`;
				document.getElementById(main_id.current).removeChild(temp);
			}, (props?.delay || 500))
	}, [])
	return <section id={main_id.current} className="logo">
		<section id={text_id.current} className="logo-text" style={{width:"0"}}>
			{props.children}
		</section>
		<img src={props.icon} className="logo-icon"/>
	</section>
}