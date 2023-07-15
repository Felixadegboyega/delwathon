<template>
	<form @submit.prevent="submitForm" class="w-full">
		<div class="overflow-y-auto p-4 mb-4" style="max-height: 60vh;">
			<div class="mb-4">
				<label for="name" class="block mb-1">Name:</label>
				<input v-model="form.name" type="text" id="name" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="short_name" class="block mb-1">Short name:</label>
				<input v-model="form.short_name" id="short_name" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="email" class="block mb-1">Email:</label>
				<input v-model="form.email" id="emaik" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="email_mask" class="block mb-1">Email Mask:</label>
				<input v-model="form.email_mask" id="email_mask" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="state" class="block mb-1">State:</label>
				<select v-model="form.state_id" id="state" class="border rounded p-2 w-full" required>
					<option v-if="StatesLoading">Loading...</option>
					<option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
				</select>
			</div>
			<div class="mb-4">
				<label for="state" class="block mb-1">Local Government:</label>
				<select v-model="form.local_government_id" id="state" class="border rounded p-2 w-full" required>
					<option v-if="lgsLoading">Loading...</option>
					<option v-else-if="form.state_id == ''">Select a state</option>
					<option v-for="lg in local_governments" :key="lg.id" :value="lg.id">{{ lg.name }}</option>
				</select>
			</div>
			<div class="mb-4">
				<label for="phone" class="block mb-1">Phone:</label>
				<input v-model="form.phone" id="phone" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="city" class="block mb-1">City:</label>
				<input v-model="form.city" id="city" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="address" class="block mb-1">Address:</label>
				<input v-model="form.address" id="address" class="border rounded p-2 w-full" required>
			</div>
			<div class="mb-4">
				<label for="password_mask" class="block mb-1">Password:</label>
				<input v-model="form.password_mask" id="password_mask" type="password" class="border rounded p-2 w-full"
					required>
			</div>
		</div>
		<div class="flex justify-end">
			<button :disabled="loading" type="submit" class="bg-green-600 text-white px-4 py-2 rounded-md">
				<template v-if="loading">
					Saving...
				</template>
				<template v-else>
					Save
				</template>
			</button>
			<button @click="cancelForm" type="button"
				class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2">Cancel</button>
		</div>
		<div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
	</form>
</template>

<script>
import axios from 'axios';
import {onMounted, ref, watch} from 'vue';
import {baseURL} from '../k';

export default {
	name: 'DetailForm',
	props: {
		initialValues: {
			type: Object,
			default: null,
		},
	},
	setup(props, {emit}) {
		const token = localStorage.getItem('token')
		const config = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
		const form = ref({
			name: '',
			short_name: '',
			city: '',
			address: '',
			email: '',
			email_mask: '',
			password_mask: '',
			phone: '',
			state_id: '',
			local_government_id: ''
		});
		const loading = ref(false);
		const StatesLoading = ref(false);
		const lgsLoading = ref(false);
		const error = ref(null);
		const states = ref([]);
		const local_governments = ref([]);

		const submitForm = async () => {
			error.value = null;
			try {
				loading.value = true;
				emit('submit', JSON.parse(JSON.stringify(form.value)));
			} catch (e) {
				error.value = 'An error occurred. Please try again later.';
				console.error(e);
			} finally {
				loading.value = false;
			}
		};

		const cancelForm = () => {
			emit('cancel');
		};

		if (props.initialValues) {
			form.value = {...props.initialValues};
		}

		const getStates = async () => {
			try {
				StatesLoading.value = true;
				const response = await axios.get(`${baseURL}states`, config);
				states.value = response.data.states;
			} catch (error) {
				console.error(error);
			} finally {
				StatesLoading.value = false;
			}
		}

		const getLgs = async (state_id) => {
			try {
				lgsLoading.value = true;
				const response = await axios.get(`${baseURL}lg_for_a_state/${state_id}`, config);
				local_governments.value = response.data.local_governments;
			} catch (error) {
				console.error(error);
			} finally {
				lgsLoading.value = false;
			}
		}

		watch(() => form.value.state_id, (state_id) => {
			form.value.local_government_id = '';
			getLgs(state_id)
		})

		onMounted(() => {
			getStates();
			if (props.initialValues.state_id) {
				getLgs(props.initialValues.state_id)
			}
		})

		return {
			form,
			loading,
			error,
			submitForm,
			cancelForm,
			states,
			local_governments,
			lgsLoading,
			StatesLoading,
		};
	},
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
