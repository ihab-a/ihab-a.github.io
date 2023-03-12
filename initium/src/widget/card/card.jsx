function Card(props){
	return <section className="card invisible" onClick={props.onClick}>
		{
			props.title && <section className="card-title">{props.title}</section>
		}
		{
			props.title && props.children && <div className="card-sep"/>
		}
		{
			props.children &&
				<>
					<section className="card-content">{props.children}</section>
				</>
		}
	</section>
}