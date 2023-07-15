<template>
	<div class="flex justify-center items-center h-screen w-screen">
		<form @submit.prevent="submitForm" class="shadow-md rounded w-full max-w-md p-3">
			<h3 class="text-2xl mb-3">New Branch</h3>
			<div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
			<div class="mb-4">
				<label for="name" class="block mb-1">Name:</label>
				<input v-model="form.name" type="text" id="name" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="short_name" class="block mb-1">Short Name:</label>
				<input v-model="form.short_name" type="short_name" id="short_name" class="border rounded p-2 w-full"
					required>
			</div>
			<div class="flex justify-end">
				<button :disabled="loading" type="submit" class="bg-green-600 text-white px-4 py-2 flex rounded-md">
					<template v-if="loading">
						<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
							</circle>
							<path class="opacity-75" fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-2c0 3.309-2.691 6-6 6-3.309 0-6-2.691-6-6H6c0 4.411 3.589 8 8 8z">
							</path>
						</svg>
						Saving...
					</template>
					<template v-else>
						Save
					</template>
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {baseURL} from '../k';
import axios from 'axios';

const form = ref({
	name: '',
	short_name: '',
});
const token = localStorage.getItem('token')
const config = {
	headers: {
		Authorization: `Bearer ${token}`
	}
}
const loading = ref(false);
const error = ref(null);
const router = useRouter();

const submitForm = async () => {
	// Reset error message
	error.value = null;

	// Perform form validation
	if (!form.value.name || !form.value.short_name) {
		error.value = 'Please fill in all fields.';
		return;
	}

	try {
		loading.value = true;
		const response = await axios.post(`${baseURL}branches`, form.value, config);
		console.log(response.data);
		router.push('/branches')
	} catch (e) {
		// Handle API request error
		error.value = 'An error occurred. Please try again later.';
		console.error(e);
	} finally {
		loading.value = false;
	}
};

</script>

<style>
.animate-spin {
	-webkit-animation: spin 1s linear infinite;
	animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
	0% {
		-webkit-transform: rotate(0deg);
	}

	100% {
		-webkit-transform: rotate(360deg);
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
