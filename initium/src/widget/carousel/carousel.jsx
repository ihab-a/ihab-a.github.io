function Carousel(props){
	const images_id = React.useRef(genId());
	const [current, setCurrent] = React.useState(0);
	function sc(dir=1){
		let targetScroll;
		if(current + dir < 0)
			targetScroll = (props?.data?.length - current + dir) % props?.data?.length;
		else
			targetScroll = (current + dir) % props?.data?.length;
		const target = document.getElementById(images_id.current);
		requestAnimationFrame(() => {
			target.scroll(target.getBoundingClientRect().width * targetScroll, 0);
		});
		setCurrent((current) => targetScroll);
	}
	const autoScroll = setTimeout(() => sc(), 6000);
	return <section className="carousel invisible">
		<section className="carousel-main">
			<section id={images_id.current} className="carousel-images">
			{
				props?.data?.map((elem) => {
					return <a key={elem.image} className="carousel-image" 
						href={elem.link || ""} 
						onClick={elem.link ? "" : (e) => e.preventDefault()}>
						<img src={elem.image}/>
					</a>
				})
			}
			</section>
		</section>
		<section className="carousel-ind">
			{
				props?.data?.map((elem, i) => {
					return <span key={i} 
							className={`carousel-ind-item ${i == current ? "carousel-selected" : ""}`}
							onClick={() => {
								clearTimeout(autoScroll);sc(i - current)
							}}/>
				})	
			}
		</section>
	</section>
}