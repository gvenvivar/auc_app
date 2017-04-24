<Autocomplete
  value={
    capitalizeFirstLetter(this.props.server)
  /*this.state.serverAutocomplite*/}
  inputProps={{name: "server", className:'server', id:"server",  ref:"server", placeholder:"Realm"}}
  items={realmsList}
  getItemValue={(item) => item.name}
  onChange={
    this.props.updateInputServer
    /*(event, serverAutocomplite) =>{
    this.setState({ serverAutocomplite })}*/
  }
  onSelect={(serverAutocomplite, item) => {
    this.props.addSlug(item);

    //this.setState({ serverAutocomplite });
    document.getElementById('server').blur();
    document.getElementById('search').focus();
  }}
  sortItems={function sort (a, b, value) {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    const valueLower = value.toLowerCase();
    const queryPosA = aLower.indexOf(valueLower);
    const queryPosB = bLower.indexOf(valueLower);
    if (queryPosA !== queryPosB) {
      return queryPosA - queryPosB;
    }
    return aLower < bLower ? -1 : 1;
  }}
  shouldItemRender={function matchStateToTerm (item, value) {
    if(value.length >1){
      return (
        item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
    }
  }}
  renderItem={(item, isHighlighted) => (
    <div style={isHighlighted ? styles.highlightedItem : styles.item}>
      {item.name}
    </div>
  )}
  menuStyle={{
    borderRadius: '3px',
    boxShadow: '0 5px 12px rgba(0, 0, 0, 0.9)',
    background: 'rgba(255, 255, 255, 1)',
    padding:  '0',
    fontSize: '90%',
    position: 'absolute',
    top: '26px', // height of your input
    left: 0,
    overflow: 'auto',
    zIndex: 20,
    maxHeight: "300px",
    textAlign: 'left'
  }}
/>
