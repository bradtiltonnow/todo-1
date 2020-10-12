import '@servicenow/now-button';
import '@servicenow/now-card';
import '@servicenow/now-textarea';
import '@servicenow/now-heading';
import '@servicenow/now-highlighted-value';

export default (state, { dispatch }) => {

    const { todo, editMode, noTodos } = state.properties;

    return (
        <div>
            { noTodos ?

                <now-card size="lg" interaction="none">
                    <now-card-header heading={{ "label": `No ${noTodos} todos` }} />
                </now-card> :

                <now-card size="lg" interaction="none">

                    <now-card-header
                        tagline={{ "label": todo.number }}
                        actions={[
                            { "id": "edit-todo", "icon": editMode ? "save-outline" : "pencil-outline", "label": editMode ? "Save" : "Edit", "intent": editMode ? "save" : "edit" },
                            { "id": "delete-todo", "icon": "trash-outline", "label": "Delete", "intent": "delete" }]}
                        caption={{ "label": todo.due_date ? `Due by ${todo.due_date}` : "", "lines": 2 }}>
                    </now-card-header>

                    <div className="card-body">
                        {editMode ?
                            <div>
                                <now-textarea
                                    className="w-100"
                                    value={todo.name}
                                    autoresize={true}
                                    label="Editing todo"
                                    maxlength={100}
                                    resize="vertical"
                                    showBorders={true}
                                    showCounter={true}>
                                </now-textarea>
                                <div className="date-picker">
                                    <label for="todo-due-date" className="date-picker-label">Due date</label>
                                    <input id="todo-due-date" className="w-100" type="date" value={todo.due_date} on-change={(event) => dispatch('DUE_DATE_CHANGED', { value: event.path[0].value })} />
                                </div>
                            </div> :
                            <div>
                                <now-textarea
                                    readonly={true}
                                    className="w-100"
                                    value={todo.name}
                                    autoresize={true}
                                    maxlength={100}
                                    resize="none"
                                    showBorders={false}
                                    showCounter={false}>
                                </now-textarea>
                                <div className="todo-detail">
                                    <now-heading
                                        label={todo.due_date ? `Due by ${todo.due_date}` : "Due anytime"}
                                        level="4"
                                        variant="title-tertiary">
                                    </now-heading>
                                    <now-highlighted-value label={todo.state.label} color={todo.state.color} variant="tertiary" showIcon={true}></now-highlighted-value>
                                </div>
                            </div>
                        }
                    </div>

                    <now-card-actions
                        items={editMode ? [] : [
                            { "label": todo.state.value === 'complete' ? "Completed" : "Mark as complete", "icon": "check-fill", "intent": "complete", "disabled": todo.state.value === 'complete' },
                            { "label": todo.state.value === 'cancelled' ? "Cancelled" : "Mark as cancelled", "icon": "close-fill", "intent": "cancel", "disabled": todo.state.value === 'cancelled' }]}>
                    </now-card-actions>

                    <now-modal
                        manageOpened={true}
                        opened={state.modalOpen}
                        size="sm"
                        headerLabel="Alert"
                        content={`Delete todo ${todo.number}?`}
                        footerActions={[{ "label": "Cancel", "variant": "secondary", "intent": "cancel" }, { "label": "Delete", "variant": "primary-negative", "intent": "delete" }]}>
                    </now-modal>

                </now-card>
            }
        </div>
    )

}