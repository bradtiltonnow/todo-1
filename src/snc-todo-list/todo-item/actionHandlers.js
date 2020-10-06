import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

export default {
    actionHandlers: {
        'NOW_BUTTON_ICONIC#CLICKED': ({action, dispatch, state}) => {
            const {type} = action.payload;
            
            dispatch('COMPLETE_TODO', {
                data: {"state": type},
                todoID: state.properties.todoID
            });
            
        },
        'COMPLETE_TODO': createHttpEffect('api/now/table/x_snc_simple_todo_todo/:todoID', {
            method: 'PATCH',
            dataParam: 'data',
            pathParams: ['todoID'],
            successActionType: 'COMPLETE_TODO_SUCCEEDED',
            errorActionType: 'COMPLETE_TODO_ERROR'
        }),
        'COMPLETE_TODO_SUCCEEDED': ({action, dispatch, state}) => {
            dispatch('REMOVE_TODO', {
                todoID: state.properties.todoID
            })
        },
        'COMPLETE_TODO_ERROR': ({action, dispatch, state}) => {
            
        }
    }
}