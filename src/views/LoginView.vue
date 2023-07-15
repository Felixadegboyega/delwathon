<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-5 text-sm">
		<div class="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
			<h2 class="text-2xl font-bold mb-4">Login</h2>
			<form @submit.prevent="handleSubmit">
				<div v-if="error" class="bg-red-100 text-red-700 p-2 rounded mb-4">{{ error }}</div>
				<div class="mb-4">
					<label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
					<input type="email" id="email" v-model="email"
						class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-green-500" />
				</div>
				<div class="mb-4">
					<label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
					<input type="password" id="password" v-model="password"
						class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-green-500" />
				</div>
				<div class="flex items-center justify-between">
					<button type="submit"
						class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
						<span v-if="loading">Loading...</span>
						<span v-else>Login</span>
					</button>
					<a href="#" class="text-gray-600 hover:underline">Forgot password?</a>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';
import {baseURL} from '../k';
import {useRouter} from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const router = useRouter();

const handleSubmit = async () => {
	try {
		loading.value = true;
		error.value = '';
		const response = await axios.post(`${baseURL}login`, {
			email: email.value,
			password: password.value,
		});
		localStorage.setItem('token', response.data.token);
		router.push('/branches');
	} catch (error) {
		error.value = 'An error occurred. Please try again.';
	} finally {
		loading.value = false;
	}
};

</script>

<style></style>
