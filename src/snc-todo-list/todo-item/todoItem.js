import {createCustomElement} from '@servicenow/ui-core';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';
import view from './view';

createCustomElement('todo-item', {
    initialState: {
        modalOpen: false
    },
	view,
    styles,
    properties: {
        todo: {
            default: {}
        },
        editItem: {
            default: function() {}
        },
        editMode: {
            default: false
        },
        updateTodo: {
            default: function() {}
        },
        deleteTodo: {
            default: function() {}
        },
        noTodos: {
            default: false
        }
    },
	...actionHandlers
});