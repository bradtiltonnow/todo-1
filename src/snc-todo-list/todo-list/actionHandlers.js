import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

// mapping of state values with labels & colors (for now-highlighted-value)
const stateLookup = {
    'draft': { label: 'Draft', color: 'gray', value: 'draft' },
    'open': { label: 'Open', color: 'info', value: 'open' },
    'complete': { label: 'Complete', color: 'positive', value: 'complete' },
    'cancelled': { label: 'Cancelled', color: 'warning', value: 'cancelled' }
};

/** 
 * helper method to map todos' state labels/colors & parse date from due_date (datetime)
 * @param {Array} - todos. Todos array fetched from API
 */
function mapTodos(todos) {
    return todos.map(todo => {
        todo.state = stateLookup[todo.state];
        todo.due_date = todo.due_date ? todo.due_date.match(/\d{4}-\d{2}-\d{2}/)[0] : "";
        return todo;
    });
}

/** 
 * helper method to map todos' state labels/colors & parse date from due_date (datetime)
 * @param {Array} - fields. Required fields for the view
 * @param {Array} - todos. Todos array fetched from API
 * @param {object} - updatedTodo. Updated todo record fetched from API
 */
function mapUpdatedTodo(fields, todos, updatedTodo) {
    return todos.map(todo => {
        if (updatedTodo.sys_id === todo.sys_id) {
            fields.forEach(fieldName => {
                todo[fieldName] = updatedTodo[fieldName];
            });
            todo.state = stateLookup[todo.state];
            todo.due_date = todo.due_date ? todo.due_date.match(/\d{4}-\d{2}-\d{2}/)[0] : "";
        }
        return todo;
    });
}

/** 
 * helper method to map todos' state labels/colors & parse date from due_date (datetime)
 * @param {Array} - fields. Required fields for the view
 * @param {Array} - todos. Todos array fetched from API
 * @param {object} - createdTodo. Created todo record fetched from API
 */
function pushCreatedTodo(fields, todos, createdTodo) {
    let createdTodoRecord = {};
    fields.forEach(fieldName => {
        createdTodoRecord[fieldName] = createdTodo[fieldName];
    });
    createdTodoRecord.state = stateLookup[createdTodoRecord.state];
    createdTodoRecord.due_date = createdTodoRecord.due_date ? createdTodoRecord.due_date.match(/\d{4}-\d{2}-\d{2}/)[0] : "";
    todos.unshift(createdTodoRecord);
    return todos;
}

/** 
 * helper method to display now-alerts for specific duration
 * @param {string} - status. Type of message (positive/critical)
 * @param {string} - content. Content of message
 * @param {number} - delay. Alert duration in milliseconds
 */
function displayAlert(status, content, state, updateState, delay) {
    clearTimeout(state.timeout);
    updateState({
        loader: undefined,
        alert: { status, content },
        timeout: setTimeout(() => updateState({ alert: undefined }), delay || 5000)
    });
}

/** 
 * helper method to fetch todos using a filter
 * @param {string} - filter. Encoded query string
 */
function fetchTodos(coeffects, filter) {
    const { state, updateState, dispatch } = coeffects;
    updateState({ loader: 'Loading todos...' });
    dispatch('FETCH_TODOS', {
        sysparm_query: filter ? filter : state.defaultQueryStr,
        sysparm_fields: state.fields.join(','),
        sysparm_exclude_reference_link: true
    });
}

export default {
    actionHandlers: {
        // fetch todos when component is about to be loaded
        [actionTypes.COMPONENT_BOOTSTRAPPED]: (coeffects) => {
            fetchTodos(coeffects);
        },
        // using table api now, ACL filters out current user's todos in case of non interactive sessions
        'FETCH_TODOS': createHttpEffect('/api/now/table/x_snc_simple_todo_todo', {
            method: 'GET',
            queryParams: ['sysparm_fields', 'sysparm_query', 'sysparm_exclude_reference_link'],
            successActionType: 'FETCH_TODOS_SUCCEEDED',
            errorActionType: 'FETCH_TODOS_ERROR'
        }),
        // success callback for todos fetch request
        'FETCH_TODOS_SUCCEEDED': ({ action, updateState }) => {
            const todos = mapTodos(action.payload.result);
            updateState({ loader: undefined, todos });
        },
        // error callback for todos fetch request
        'FETCH_TODOS_ERROR': ({ state, updateState }) => {
            displayAlert('critical', 'Fetching todos failed', state, updateState, 5000000);
        },
        // post request to create a todo
        'CREATE_TODO_REQUEST': createHttpEffect('api/now/table/x_snc_simple_todo_todo', {
            method: 'POST',
            dataParam: 'data',
            successActionType: 'CREATE_TODO_SUCCESS',
            errorActionType: 'CREATE_TODO_FAILURE'
        }),
        // success callback for todos create request
        'CREATE_TODO_SUCCESS': (coeffects) => {
            const { action, state, updateState } = coeffects;
            const { todos, fields } = state;

            if (state.selectedState === 'open') {
                const newTodos = pushCreatedTodo(fields, todos, action.payload.result)
                updateState({ todos: newTodos, modalOpen: false });

                displayAlert('positive', 'Create successful', state, updateState, 5000);
            } else {
                updateState({ selectedState: 'open', modalOpen: false });
                fetchTodos(coeffects, 'state=open^ORDERBYDESCdue_date');
            }
        },
        // error callback for todos create request
        'CREATE_TODO_FAILURE': () => {
            displayAlert('critical', 'Create failed', state, updateState, 5000);
            updateState({ modalOpen: false });
        },
        // patch request to update any todo
        'UPDATE_TODO': createHttpEffect('api/now/table/x_snc_simple_todo_todo/:sys_id', {
            method: 'PATCH',
            pathParams: ['sys_id'],
            dataParam: 'data',
            successActionType: 'UPDATE_TODO_SUCCEEDED',
            errorActionType: 'UPDATE_TODOS_ERROR'
        }),
        // success callback for todos update request
        'UPDATE_TODO_SUCCEEDED': ({ action, state, updateState }) => {
            const { todos, fields } = state;

            const updatedTodo = action.payload.result;

            if (state.selectedState === updatedTodo.state) {
                const updatedTodos = mapUpdatedTodo(fields, todos, updatedTodo);
                updateState({ todos: updatedTodos });

                displayAlert('positive', 'Update successful', state, updateState, 5000);
            } else {
                const todos = state.todos.filter(todo => todo.sys_id !== updatedTodo.sys_id);
                updateState({
                    loader: undefined,
                    todos
                });
            }
        },
        // error callback for todos update request
        'UPDATE_TODOS_ERROR': ({ state, updateState }) => {
            displayAlert('critical', 'Update failed', state, updateState, 5000);
        },
        // delete request to delete any todo
        'DELETE_TODO': createHttpEffect('api/now/table/x_snc_simple_todo_todo/:sys_id', {
            method: 'DELETE',
            dataParam: 'data',
            pathParams: ['sys_id'],
            successActionType: 'DELETE_TODO_SUCCEEDED',
            errorActionType: 'DELETE_TODOS_ERROR'
        }),
        // success callback for todos delete request
        'DELETE_TODO_SUCCEEDED': ({ action, state, updateState }) => {
            displayAlert('positive', 'Delete successful', state, updateState, 5000);
            const todos = state.todos.filter(todo => todo.sys_id !== action.meta.request.data.sys_id);
            updateState({
                loader: undefined,
                todos
            });
        },
        // error callback for todos delete request
        'DELETE_TODOS_ERROR': ({ state, updateState }) => {
            displayAlert('critical', 'Delete failed', state, updateState, 5000);
        },
        // handler to open create todo modal
        'OPEN_MODAL': ({ updateState }) => {
            updateState({ modalOpen: true });
        },
        // handler to close create todo modal
        'CLOSE_MODAL': ({ updateState }) => {
            updateState({ modalOpen: false });
        },
        // handler to show loader/transition for AJAX calls
        'SHOW_LOADING': ({ action, updateState }) => {
            updateState({ loader: action.payload.loader });
        },
        // handle dropdown value change
        'NOW_DROPDOWN#ITEM_CLICKED': (coeffects) => {
            const { action, updateState } = coeffects;
            const selectedState = action.payload.item.id;
            updateState({ selectedState });
            fetchTodos(coeffects, `state=${selectedState}^ORDERBYDESCdue_date`);
        }
    }
}