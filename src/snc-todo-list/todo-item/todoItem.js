import {createCustomElement} from '@servicenow/ui-core';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';
import view from './view';

createCustomElement('todo-item', {
	view,
    styles,
    properties: {
        name: {default: ''},
        todoID: {default: ''}
    },
	...actionHandlers
});