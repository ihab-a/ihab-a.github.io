function Overlay(props){
	const mainContext = React.useContext(MainContext);
	const clearOverlay = () => {
		mainContext.setOverlay([]);
	}
	if(props.data.cur.length == 0)
		mainContext.onOverlayClear.forEach((fun)=>fun());
	React.useEffect(() => {
		checkVisibility();
	}, [props.data])
	return <section className="overlay" style={props.data.cur.length == 0 ? {transform:"translate(100vw)"} : {}}>
		<section className="overlay-background" style={{zIndex:20}} onClick={() => {
			clearOverlay();
		}}/>
		<section className="overlay-content" style={{zIndex:20}}>
			<section className="overlay-head" style={{justifyContent: props.data.head.length != 0 ? "" : "flex-end"}}>
				{props.data.head}
				<Input type="button" className="input-active" key="back" onClick={() => {
					mainContext.setOverlay([]);
				}}>&times;</Input>
			</section>
			<section className="overlay-overflow" onScroll={checkVisibility}>
				{props.data.cur}
			</section>
		</section>
	</section>
}