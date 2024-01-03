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
        editable: false,
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
                {
                    headers: {
                        Authorization: get(token),
                    },
                },
            );
            const message = response.data;
            alert(message);
            await getTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const updateTodo = async (todo: Todo) => {
        todo.editable = false;
        try {
            const response = await axios.put(
                `http://localhost:8080/todo`,
                todo,
                {
                    headers: {
                        Authorization: get(token),
                    },
                },
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
                    <button
                        class="button-delete"
                        on:click={() => removeTodo(todo.todo_id)}
                    >
                        X
                    </button>
                    <input
                        type="checkbox"
                        bind:checked={todo.status}
                        on:change={() => updateTodo(todo)}
                    />
                    {#if todo.editable}
                        <input type="text" bind:value={todo.title} />
                        <input type="text" bind:value={todo.description} />
                        <button on:click={() => updateTodo(todo)}>OK</button>
                    {:else}
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <button on:click={() => (todo.editable = true)}
                            >Edit</button
                        >
                    {/if}
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
        position: relative; /* Add this line */
        min-width: 600px;
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
    .todo-item button:first-child {
        color: #fff;
        border: none;
        cursor: pointer;
        background-color: inherit;
        position: absolute; /* Add this line */
        top: 5px; /* Add this line */
        right: 5px; /* Add this line */
    }
    .todo-item button {
        color: #fff;
        border: none;
        cursor: pointer;
        background-color: inherit;
        position: absolute; /* Add this line */
        top: 5px; /* Add this line */
        right: 35px; /* Add this line */
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
