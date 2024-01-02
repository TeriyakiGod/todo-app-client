<script lang="ts">
    import { loginStatus, token } from "../stores";
    let status: number;
    loginStatus.subscribe((value) => {
        status = value;
    });
    let name = "";
    let email = "";
    let password = "";

    import axios from "axios";

    const signIn = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/auth/signin",
                {
                    email,
                    password,
                },
            );
            const message = response.data;
            alert(message);
            token.set(response.headers.authorization);
            loginStatus.set(2);
        } catch (error: any) {
            const message = error.response.data;
            alert(message);
        }
    };

    const signUp = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/auth/signup",
                {
                    name,
                    email,
                    password,
                },
            );
            const message = response.data;
            loginStatus.set(0);
            alert(message);
        } catch (error: any) {
            const message = error.response.data;
            alert(message);
        }
    };

    function logout() {
        token.set("");
        name = "";
        email = "";
        password = "";
        loginStatus.set(0);
    }
</script>

<div id="account-window">
    {#if status === 0}
        <div id="signin">
            <h3>Sign In</h3>
            <label for="email">Email:</label>
            <input type="email" id="email" bind:value={email} />

            <label for="password">Password:</label>
            <input type="password" id="password" bind:value={password} />

            <button on:click={signIn}>Sign In</button>
            <a href="##" on:click={() => (status = 1)}>SignUp</a>
        </div>
    {:else if status === 1}
        <div id="signup">
            <h3>Sign Up</h3>
            <label for="name">Name:</label>
            <input type="name" id="name" bind:value={name} />

            <label for="email">Email:</label>
            <input type="email" id="email" bind:value={email} />

            <label for="password">Password:</label>
            <input type="password" id="password" bind:value={password} />

            <button on:click={signUp}>Sign Up</button>
            <a href="##" on:click={() => (status = 0)}>back</a>
        </div>
    {:else}
        <div id="account">
            <h3>Signed In</h3>
            <button on:click={logout}>Logout</button>
        </div>
    {/if}
</div>

<style>
    #account-window {
        display: flex;
        flex-direction: row;
        justify-content: flex-end; /* Align to the right */
        align-items: flex-start; /* Align to the top */
        position: absolute;
        top: 0;
        right: 0;
        padding: 20px;
        border: 1px solid white;
    }

    #signin {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
    }

    #signup {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
    }

    #account {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
</style>
