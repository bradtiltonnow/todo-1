import { createCustomElement } from '@servicenow/ui-core';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';
import view from './view';

createCustomElement('new-todo-item', {
    initialState: {
        requestInProcess: false,
        newTodo: {
            name: '',
            due_date: ''
        }
    },
    view,
    styles,
    properties: {
        createSuccess: {
            default: function() {}
        },
        createFailure: {
            default: function() {}
        },
        close:  {
            default: function() {}
        }
    },
    ...actionHandlers
});