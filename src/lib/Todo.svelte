<script lang="ts">
    import { onMount } from "svelte";
    import { type Todo } from "../models";
    let todos: Todo[] = [];
    let newTodo: Todo = {
        todo_id: "",
        user_id: "",
        title: "",
        description: "",
        status: 0,
    };

    const fetchTodos = async () => {
        const response = await fetch("http://localhost:8080/todo");
        todos = await response.json();
    };

    const addTodo = async () => {
        const response = await fetch("http://localhost:8080/todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
        });

        const todo = await response.json();
        todos = [...todos, todo];
        newTodo = {
            todo_id: "",
            user_id: "",
            title: "",
            description: "",
            status: 0,
        };
    };

    const removeTodo = async (id: string) => {
        await fetch(`http://localhost:8080/todo/${id}`, {
            method: "DELETE",
        });
        await fetchTodos();
    };

    onMount(fetchTodos);
</script>

<main>
    <ul>
        {#each todos as todo (todo.todo_id)}
            <li>
                {todo.title}
                <button on:click={() => removeTodo(todo.todo_id)}> X </button>
            </li>
        {/each}
    </ul>
    <div>
        <input bind:value={newTodo.title} placeholder="New Todo" />
        <input bind:value={newTodo.description} placeholder="Description" />
        <button on:click={addTodo}>Add</button>
    </div>
</main>

<style>
    /* Add your styles here */
</style>
