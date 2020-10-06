import '@servicenow/now-button';

export default (state) => {

    const {name, todoID} = state.properties;

    return (
        <div>
            {name}&nbsp;
            <now-button-iconic 
                icon="check-fill" 
                tooltipContent="Complete" 
                size="md" 
                variant="primary" 
                configAria={{"aria-label":"Complete"}}
                append-to-payload={{type: 'complete'}}>
            </now-button-iconic>&nbsp;
            <now-button-iconic 
                icon="close-fill" 
                tooltipContent="Cancel" 
                size="md" 
                variant="secondary" 
                configAria={{"aria-label":"Cancel"}}
                append-to-payload={{type: 'cancelled'}}>
            </now-button-iconic>
		</div>
    )

}