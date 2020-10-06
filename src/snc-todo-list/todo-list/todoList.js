import {createCustomElement} from '@servicenow/ui-core';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';
import view from './view';

createCustomElement('snc-todo-list', {
	view,
    styles,
    initialState: {
        todos: [],
        newTodo: ''
    },
	...actionHandlers
});