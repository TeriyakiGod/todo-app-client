<script lang="ts">
    import { token } from "../stores";
    import { get } from "svelte/store";
    import { type Todo } from "../models";
    let todos: Todo[] = [];
    let newTodo: Todo = {
        todo_id: "",
        user_id: "",
        title: "",
        description: "",
        status: 0,
    };

    import axios from "axios";

    const getTodos = async () => {
        try {
            const response = await axios.get("http://localhost:8080/todo", {
                headers: {
                    Authorization: get(token),
                },
            });
            const message = response.data;
            alert(message);
        } catch (error: any) {
            const message = error.response.data;
            alert(message);
        }
    };

    const addTodo = async () => {};

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
                <li>
                    {todo.title}
                    <button on:click={() => removeTodo(todo.todo_id)}>
                        X
                    </button>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
</style>
