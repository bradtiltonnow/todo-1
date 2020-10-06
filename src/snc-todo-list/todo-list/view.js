import '../todo-item';
import '@servicenow/now-button';
import '@servicenow/now-input';

export default (state, {dispatch, updateState}) => {

    return (
        <div>
            <h1>Todo List</h1>
            <p>
                <now-input type="text" value={state.newTodo} label="New Todo" messages={[]}></now-input>&nbsp;&nbsp;
                <now-button label="Create todo" icon="" tooltipContent="" variant="primary" size="md" configAria={{}}></now-button>
            </p>
            <ul>
                {state.todos.map(todo => (
                    <li>
                        <p><todo-item name={todo.name} todoID={todo.sys_id} /></p>
                    </li>
                ))}
            </ul>
		</div>
    )

}