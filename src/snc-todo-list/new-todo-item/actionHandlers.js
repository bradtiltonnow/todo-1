import { actionTypes } from '@servicenow/ui-core';

/** 
 * set state on field value change
 */
function handleChange({ action, state, updateState }) {
    const fieldName = action.payload.fieldName;
    const fieldValue = action.payload.value;
    let newTodo = state.newTodo;
    newTodo[fieldName] = fieldValue;
    updateState({ newTodo });
}

export default {
    actionHandlers: {
        // clear state on component bootstrap
        [actionTypes.COMPONENT_BOOTSTRAPPED]: ({ updateState }) => {
            updateState({
                newTodo: {
                    name: '',
                    due_date: ''
                }
            });
        },
        // create todo modal footer action handler (initializes todo create request)
        'NOW_MODAL#FOOTER_ACTION_CLICKED': ({ state, dispatch, action, updateState }) => {
            const { intent } = action.payload.action;
            if (intent === 'create') {
                updateState({ requestInProcess: true });
                dispatch('CREATE_TODO_REQUEST', { data: state.newTodo });
            }
        },
        // close modal for create on user input
        'NOW_MODAL#OPENED_SET': ({ dispatch }) => {
            dispatch('CLOSE_MODAL');
        },
        // set todo name from textarea on focus out
        'NOW_TEXTAREA#VALUE_SET': handleChange,
        // set todo due_date from datepicker on change
        'DATE_PICKER_ON_CHANGE': handleChange
    }
}