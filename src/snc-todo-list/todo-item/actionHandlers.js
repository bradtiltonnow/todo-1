/** 
 * helper method to initiate todo record update
 * @param {string} - sys_id. sys_id of todo record
 * @param {object} - data. Request body for record update
 */
function updateTodo(dispatch, sys_id, data) {
    dispatch('SHOW_LOADING', { loader: 'Updating...' });
    dispatch('UPDATE_TODO', {
        sys_id,
        data
    });
}

/** 
 * helper method to initiate todo record deletion
 * @param {string} - sys_id. sys_id of todo record
 */
function deleteTodo(dispatch, sys_id) {
    dispatch('SHOW_LOADING', { loader: 'Deleting...' });
    dispatch('DELETE_TODO', {
        sys_id,
        data: { sys_id }
    });
}

export default {
    actionHandlers: {
        // handle todo card header actions (edit/save/delete)
        'NOW_CARD_HEADER#ACTION_CLICKED': ({ action, updateState, properties, dispatch }) => {
            const intent = action.payload.action.intent;
            const { todo } = properties;
            const sys_id = todo.sys_id;

            if (intent === 'edit') {
                properties.editItem(sys_id);
            } else if (intent === 'save') {
                properties.editItem();
                updateTodo(dispatch, sys_id, {
                    name: todo.name,
                    due_date: todo.due_date
                });
            } else if (intent === 'delete') {
                updateState({ modalOpen: true });
            }
        },
        // handle todo card footer actions (mark as complete/mark as cancelled)
        'NOW_CARD_ACTIONS#ACTION_CLICKED': ({ action, properties, dispatch }) => {
            const intent = action.payload.action.intent;
            const { todo } = properties;
            const sys_id = todo.sys_id;

            if (intent === 'complete') {
                updateTodo(dispatch, sys_id, { state: 'complete' });
            } else if (intent === 'cancel') {
                updateTodo(dispatch, sys_id, { state: 'cancelled' });
            }
        },
        // set todo name from textarea on focus out
        'NOW_TEXTAREA#VALUE_SET': ({ action, properties, updateProperties }) => {
            let { todo } = properties;
            todo.name = action.payload.value;
            updateProperties({ todo });
        },
        // set todo due_date from datepicker on change
        'DUE_DATE_CHANGED': ({ action, properties, updateProperties }) => {
            let { todo } = properties;
            todo.due_date = action.payload.value;
            updateProperties({ todo });
        },
        // close modal for delete on user input
        'NOW_MODAL#OPENED_SET': ({ updateState }) => {
            updateState({ modalOpen: false });
        },
        // request todo deletion on user input from modal
        'NOW_MODAL#FOOTER_ACTION_CLICKED': ({ action, properties, updateState, dispatch }) => {
            const sys_id = properties.todo.sys_id;
            if (action.payload.action.intent === 'delete') {
                deleteTodo(dispatch, sys_id);
            }
            updateState({ modalOpen: false });
        }
    }
}