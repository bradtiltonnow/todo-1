import '../todo-item';
import '../new-todo-item';
import '@servicenow/now-button';
import '@servicenow/now-input';
import '@servicenow/now-loader';
import '@servicenow/now-heading';
import '@servicenow/now-modal';
import '@servicenow/now-alert';
import '@servicenow/now-dropdown';

export default (state, { dispatch, updateState }) => {

    return (
        <div className="todos-container">

            {state.alert ?
                <now-alert
                    status={state.alert.status}
                    icon="info-circle-outline"
                    content={state.alert.content}>
                </now-alert> : null}

            <div className="todos-header">
                <now-heading label="My todos" level="1" variant="header-primary"></now-heading>

                <div className="actions">
                    <now-button
                        style={{ width: '99%' }}
                        label="Create todo item"
                        variant="primary"
                        size="md"
                        on-click={() => dispatch('OPEN_MODAL')}>
                    </now-button>

                    <now-dropdown
                        items={[
                            { "id": "open", "label": "Open" },
                            { "id": "complete", "label": "Complete" },
                            { "id": "cancelled", "label": "Cancelled" }]}
                        selectedItems={[state.selectedState]}
                        select="single"
                        variant="tertiary-selected"
                        size="md"
                        tooltipContent="Filter by state">
                    </now-dropdown>
                </div>
            </div>

            <div className="todos-body">
                {state.loader ?
                    <now-loader label={state.loader || 'Loading...'} size="lg"></now-loader> :
                    state.todos.length > 0 ?
                        state.todos.map(todo => (
                            <todo-item
                                key={todo.sys_id}
                                todo={todo}
                                editItem={(sys_id) => updateState({ editingTodoItemId: sys_id })}
                                editMode={todo.sys_id === state.editingTodoItemId} />
                        )) :
                        <todo-item noTodos={state.selectedState} />
                }
            </div>
            {state.modalOpen ? <new-todo-item /> : null}
        </div>
    )

}