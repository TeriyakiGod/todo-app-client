<script lang="ts">
    import { token, loginStatus } from "../stores";
    import { get } from "svelte/store";
    import { type Todo } from "../models";
    let todos: Todo[] = [];
    let newTodo: Todo = {
        todo_id: "",
        user_id: "",
        title: "",
        description: "",
        status: false,
    };

    import axios from "axios";

    const getTodos = async () => {
        try {
            const response = await axios.get("http://localhost:8080/todo", {
                headers: {
                    Authorization: get(token),
                },
            });
            const data = response.data;
            if (Array.isArray(data)) {
                todos = data;
            } else if (data) {
                todos = [data];
            } else {
                todos = [];
            }
        } catch (error: any) {
            const message = error.response.data;
            alert(message);
            if (error.response.status === 403) {
                if (get(loginStatus) === 2) {
                    alert("Session expired. Please login again.");
                }
                loginStatus.set(0);
            }
        }
    };

    const addTodo = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/todo",
                newTodo,
                {
                    headers: {
                        Authorization: get(token),
                    },
                },
            );
            const message = response.data;
            alert(message);
            await getTodos();
        } catch (error: any) {
            const message = error.response.data;
            alert(message);
            if (error.response.status === 403) {
                if (get(loginStatus) === 2) {
                    alert("Session expired. Please login again.");
                }
                loginStatus.set(0);
            }
        }
    };

    const removeTodo = async (id: string) => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/todo/${id}`,
            );
            const message = response.data;
            alert(message);
            await getTodos();
        } catch (error) {
            console.error(error);
        }
    };
    //TODO: Add update todo
    //TODO: FIX remove todo
</script>

<div id="todo">
    <div id="todo-tools">
        <div id="todo-add">
            <input bind:value={newTodo.title} placeholder="New Todo" />
            <input bind:value={newTodo.description} placeholder="Description" />
            <button on:click={addTodo}>Add</button>
        </div>
        <div id="todo-get">
            <button on:click={getTodos}>Get</button>
        </div>
    </div>

    <div id="todo-list">
        <ul>
            {#each todos as todo (todo.todo_id)}
                <li class="todo-item">
                    <button on:click={() => removeTodo(todo.todo_id)}>
                        X
                    </button>
                    <input type="checkbox" bind:checked={todo.status} />
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    ul {
        padding: 0;
        list-style: none;
    }
    .todo-item {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
    }
    .todo-item h3 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        display: inline;
    }
    .todo-item p {
        margin: 5px 0;
        font-size: 14px;
    }
    .todo-item button {
        color: #fff;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        float: right;
        background-color: inherit;
    }
    .todo-item button:hover {
        color: red;
    }
    #todo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
    }
    #todo-tools {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
    }
</style>
