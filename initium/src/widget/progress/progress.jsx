function Progress(props){
	const target = props.target || "main";
	const [progress, setProgress] = React.useState(0);
	React.useContext(MainContext).setProgress = setProgress;
	return <section className="progress">
		<section className="progress-bar" style={{width:`${progress}%`}}></section>
	</section>
}