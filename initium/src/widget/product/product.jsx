function Product(props){
	return <section className="product invisible">
		<section className="product-image">
			<img src={props?.data?.image}/>
		</section>
		<section className="product-info">
			<section style={{fontWeight:"bold"}}>{props?.data?.name}</section>
			<section style={{fontStyle:"italic"}}>{props?.data?.description}</section>
			<section>{props?.data?.price} dh</section>
		</section>
	</section>
}