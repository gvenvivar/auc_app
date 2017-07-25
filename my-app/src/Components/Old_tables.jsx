//resultList

<div className="col-right">
	      <table>
	         <thead>
	          <tr>
	            <th>Icon</th>
	            <th>Name</th>
	           	<th className='center'>Qty</th>
	            <th className='center'>Regional avg</th>
	            <th >Price</th>
	          </tr>
	        </thead>

	          {desc_list}
	        
	      </table>
	      <div className="black_stripe"></div>
				<div className='no-items-wrap'>
					<div className='no-results'>Add items add press search button</div>
				</div>
	    </div>

//resultListRow

if(this.props.item.components){
			let list = [];
			let price= 0 ;
			this.props.item.components.map((items) => {
				list.push(<ResultListRowExpanded item={items}  key={items.id} />)
				price +=items.amount * items.price;
				return false;
			})

			return(
				<tbody>
				<tr>
		      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
		      <th><a href='#' rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a> <span className='potion' onClick={this.handleClick.bind(this)}><img src={potion} alt='toogle'/></span></th>
		      <th className='center'>{this.props.item.quantity}</th>
		      <th className='center'><span>{modifiedAverage}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
		      <th><span>{modifiedPrice}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
		    </tr>
		    <tr>
		    	<th colSpan='5' className='expand-potion'>
		    	<div  className={this.contentClass(this.state.isShow)}>
		    		<table className='expanded'>
		    			<tbody>
		    				{list}
		    				<tr>
		    					<th></th>
		    					<th>Total rank 3 craft cost</th>
		    					<th></th>
		    					<th></th>
		    					<th><span>{transformPrice(price/1.5)}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
		    				</tr>
		    			</tbody>
		    		</table>
		    		</div>
		    	</th>
		    </tr>
				</tbody>
		)}
    return (
			<tbody>
	    <tr>
	      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
	      <th><a href='#' rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a></th>
	      <th className='center'>{this.props.item.quantity}</th>
	      <th className='center'><span>{modifiedAverage}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	      <th><span>{modifiedPrice}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	    </tr>
			</tbody>

    );

// ResultListRowExpanded
<tr>
	<th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
	<th><a href='#' rel={'item=' + this.props.item.id}>{this.props.item.name}</a></th>
	<th><span>{transformPrice(this.props.item.price)}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	<th>x{this.props.item.amount}</th>
	<th><span>{transformPrice(this.props.item.price * this.props.item.amount)}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
</tr>