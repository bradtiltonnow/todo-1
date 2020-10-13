import '@servicenow/now-textarea';
import '@servicenow/now-modal';
import '@servicenow/now-loader';

export default (state, { dispatch }) => {

    const { newTodo } = state;

    return (
        <now-modal
            manageOpened={true}
            opened={true}
            size="md"
            headerLabel={state.requestInProcess ? "" : "Create todo item"}
            footerActions={state.requestInProcess ? [] : [{ "label": "Create", "variant": "primary", "intent": "create" }]}>
            <div className="modal-content">
                <now-loader label="Creating todo..." size="lg" style={{ display: state.requestInProcess ? 'block' : 'none' }}></now-loader>
                <div style={{ visibility: state.requestInProcess ? 'hidden' : 'visible' }}>
                    <now-textarea
                        append-to-payload={{ fieldName: 'name' }}
                        className="w-100"
                        value={newTodo.name}
                        autoresize={true}
                        label="Enter todo item"
                        maxlength={100}
                        resize="vertical"
                        showBorders={true}
                        showCounter={true}>
                    </now-textarea>
                    <div className="date-picker">
                        <label for="todo-due-date" className="date-picker-label">Due date</label>
                        <input id="todo-due-date"
                            className="w-100"
                            type="date"
                            value={newTodo.due_date}
                            on-change={(event) => dispatch('DATE_PICKER_ON_CHANGE', { fieldName: 'due_date', value: event.path[0].value })} />
                    </div>
                </div>
            </div>
        </now-modal>
    )

}