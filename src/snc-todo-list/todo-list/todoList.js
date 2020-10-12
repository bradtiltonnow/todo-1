import { createCustomElement } from '@servicenow/ui-core';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';
import view from './view';

createCustomElement('snc-todo-list', {
    view,
    styles,
    initialState: {
        selectedState: 'open',
        defaultQueryStr: 'state=open^ORDERBYDESCdue_date',
        fields: ['sys_id', 'number', 'name', 'due_date', 'state'],
        loader: 'Loading todos...',
        todos: [],
        modalOpen: false,
        editingTodoItemId: undefined
    },
    ...actionHandlers
});