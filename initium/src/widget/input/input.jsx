function Input(props){
	const main_id = React.useRef(genId());
	if(props.type == "select-radio"){
		main_id.current = [];
		for(let i of props.data){
			main_id.current.push(genId());
		}
	}
	return(
		<section className={`label-input ${["radio", "checkbox"].includes(props.type) ? "radio-checkbox" : ""} ${props.label ? "" : "no-label"} invisible`} style={props.style}>
			{props.label ? <label htmlFor={props.id || main_id.current}>{props.label}</label> : ""}
			{
				props.type == "textarea" ?
					<textarea onClick={props.onClick}
							className={props.className || "input"}
							name={props.name}
							placeholder={props.placeholder}></textarea>
				: props.type == "select" ?
					<select id={props.id || main_id.current}
							onClick={props.onClick} onChange={props.onChange}
							className={props.className || "input"}
							name={props.name}>
						{props?.data?.map((opt)=><option key={opt[0]} value={opt[0]}>{opt[1]}</option>)}
					</select>
				: props.type == "select-radio" ?
					<section onClick={props.onClick}
							style={{
									display:"flex",
									flexWrap:"wrap",
									alignItems:"center",
									justifyContent:"space-evenly"}}>
						{props.data?.map((opt, i)=><Input id={main_id.current[i]}
										type="radio"
										name={props.name}
										key={opt[0]}
										postLabel={opt[1]}
										defaultChecked={opt[0] == props.selected ? true : false}>
											{opt[0]}
										</Input>)}
					</section>
				: props.type == "password" ?
					<>
					<input onClick={props.onClick}
							onChange={props.onChange}
							id={props.id || main_id.current}
							className={props.className || "input"}
							type={props.type || "text"}
							name={props.name}
							placeholder={props.placeholder}
							value={props.children}/>
					<section className="toggle-password" style={{right: props.info ? "var(--xxxl)" : "var(--l)"}} onClick={(e) => {
						e.preventDefault();
						const target = document.getElementById(props.id || main_id.current);
						target.type = target.type == "password" ? "text" : "password";
						e.target.style.backgroundImage = `url(/asset/icon/${target.type == "password" ? "show" : "hide"}.svg)`;
					}}/>
					</>
				: props.type == "file" ?
					<>
						<input id={props.id || main_id.current}
								type="file"
								style={{display:"none"}}
								name={props.name}
								onChange={(input) => {
									if (input.target.files && input.target.files[0]){
										let reader = new FileReader();
										reader.onload = function (e) { 
											document.getElementById(main_id.current + "-target").style.backgroundImage = "url(" + e.target.result + ")";
										};
										reader.readAsDataURL(input.target.files[0]); 
									}
								}}/>
						<section style={{width:"70%", padding:"var(--xxl) 0"}}>
						<label id={main_id.current + "-target"} className="file" style={{backgroundImage:`url(${props.src || "/asset/icon/upload.svg"})`,
										backgroundSize:"contain",
										backgroundPosition:"center left",
										backgroundRepeat:"no-repeat",
										padding:"var(--xxl)"}}
								htmlFor={props.id || main_id.current}></label>
						</section>
					</>
				: <input defaultChecked={props.defaultChecked}
						onClick={props.onClick}
						onChange={props.onChange}
						id={props.id || main_id.current}
						className={props.className || "input"}
						type={props.type || "text"} name={props.name}
						placeholder={props.placeholder}
						defaultValue={props.children}
						required={props.required}/>

			}
			{props.postLabel ? <label htmlFor={props.id || main_id.current}>{props.postLabel}</label> : ""}
			{props.info ? <Info>{props.info}</Info> : ""}
		</section>
		)
}