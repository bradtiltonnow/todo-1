import { actionTypes } from '@servicenow/ui-core';
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import { createHttpEffect } from '@servicenow/ui-effect-http';

export default {
    actionHandlers: {
        [COMPONENT_BOOTSTRAPPED]: (coeffects) => {
            const { dispatch } = coeffects;
            dispatch('FETCH_TODOS', {
                state: 'open'
            });
        },
        //would normally use the table api for this but I couldn't figure out how to get the logged in user's sys_id in the component
        'FETCH_TODOS': createHttpEffect('/api/x_snc_simple_todo/simple_todo/getmytodos', {
            method: 'GET',
            queryParams: ['state'],
            successActionType: 'FETCH_TODOS_SUCCEEDED',
            errorActionType: 'FETCH_TODOS_ERROR'
        }),
        'FETCH_TODOS_SUCCEEDED': ({ action, updateState }) => {
            const todos = action.payload.result;
            updateState({todos});
        },
        'FETCH_TODOS_ERROR': ({action}) => {
            console.log('Error fetching todos:\n' + JSON.stringify(action.payload));
        },
        'NOW_INPUT#VALUE_SET': ({action, updateState}) => {
            const {value} = action.payload;
            const newTodo = value;
            updateState({newTodo});
        },
        'NOW_BUTTON#CLICKED': ({state, dispatch, action}) => {
            const {type} = action.payload;
            if (type == 'create') {
                dispatch('CREATE_TODO', {
                    data: {"name": state.newTodo}
                });
            }
        },
        'CREATE_TODO': createHttpEffect('api/now/table/x_snc_simple_todo_todo', {
            method: 'POST',
            dataParam: 'data',
            successActionType: 'CREATE_TODO_SUCCEEDED'
        }),
        'CREATE_TODO_SUCCEEDED': ({state, updateState, action}) => {
            const {todos} = state;
            const newTodoRecord = action.payload.result;
            const todoObj = {
                'name': newTodoRecord.name,
                'sys_id': newTodoRecord.sys_id,
                'state': newTodoRecord.state
            }
            todos.push(todoObj);
            const newTodo = '';
            updateState({todos, newTodo});
        },
        'CREATE_TODO_ERROR': ({action}) => {
            console.log('Error creating todo:\n' + JSON.stringify(action.payload));
        },
        'REMOVE_TODO': ({action, state, updateState}) => {
            const oldTodos = state.todos;
            const todos = oldTodos.filter(todo => todo.sys_id != action.payload.todoID);
            updateState({todos});
        }
    }
}