<template>
	<div class="container mx-auto text-sm">
		<h3 class="text-2xl mb-4 font-bold">All Branches</h3>
		<div v-if="loading" class="flex items-center justify-center h-screen">
			<svg class="animate-spin h-10 w-10 text-primary-color" xmlns="http://www.w3.org/2000/svg" fill="none"
				viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			</svg>
		</div>
		<div v-else>
			<div class="grid md:hidden grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="branch in branches" :key="branch.id">
					<div class="bg-white rounded-lg shadow-lg">
						<div class="p-4 flex flex-col space-y-2">
							<h3 class="text-xl font-semibold">{{ branch.name }} ({{ branch.short_name }})</h3>
							<p class="text-gray-600">{{ branch.email }}</p>
							<p class="text-gray-600">{{ branch.phone }}</p>
						</div>
						<div class="flex justify-end items-center p-4">
							<button @click="openForm(branch)" class="bg-green-600 text-white px-4 py-2 rounded-md mr-2">
								Edit
							</button>
							<button @click="deletebranch(branch.id)" :disabled="deletingbranch"
								class="bg-red-700 w-28 text-white px-4 py-2 rounded-md">
								<span v-if="deletingbranch === branch.id">Deleting...</span>
								<span v-else>Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<table class="min-w-full hidden md:table bg-white border border-gray-200">
				<thead>
					<tr>
						<th class="px-6 py-4 text-left font-semibold bg-gray-100 border-b">
							Name
						</th>
						<th class="px-6 py-4 text-left font-semibold bg-gray-100 border-b">
							Email
						</th>
						<th class="px-6 py-4 text-left font-semibold bg-gray-100 border-b">
							Phone
						</th>
						<th class="px-6 py-4 text-left font-semibold bg-gray-100 border-b">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="branch in branches" :key="branch.id">
						<td class="px-6 py-4 whitespace-nowrap border-b">
							{{ branch.name }} ({{ branch.short_name }})
						</td>
						<td class="px-6 py-4 whitespace-nowrap border-b">
							{{ branch.email }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap border-b">
							{{ branch.phone }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap border-b">
							<button @click="openForm(branch)" class="bg-green-600 text-white px-4 py-2 rounded-md mr-2">
								Edit
							</button>
							<button @click="deletebranch(branch.id)" :disabled="deletingbranch"
								class="bg-red-700 w-28 text-white px-4 py-2 rounded-md">
								<span v-if="deletingbranch === branch.id">Deleting...</span>
								<span v-else>Delete</span>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- Edit Detail Modal -->
		<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="bg-white rounded-lg p-4 w-96 md:w-full max-w-md">
				<h2 class="text-lg font-bold mb-4 mx-4 mt-4">Edit Details ({{ selectedDetail?.name }})</h2>
				<DetailsForm :initialValues="selectedDetail" @submit="saveDetail" @cancel="closeModal">
				</DetailsForm>
			</div>
		</div>
		<RouterLink to="/new" class="p-2 bg-green-700 shadow text-white fixed bottom-5 right-5 rounded">Add
			New</RouterLink>
	</div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {RouterLink} from 'vue-router';
import {useRouter} from 'vue-router';
import axios from 'axios';
import {baseURL} from '../k';
import DetailsForm from '../components/DetailsForm.vue'

const showModal = ref(false);
const selectedDetail = ref(null);
const branches = ref([]);
const loading = ref(false);
const deletingbranch = ref(null);
const token = localStorage.getItem('token')
const config = {
	headers: {
		Authorization: `Bearer ${token}`
	}
}
const router = useRouter();

const openForm = (detail) => {
	selectedDetail.value = detail ? {...detail} : null;
	showModal.value = true;
};

const closeModal = () => {
	selectedDetail.value = null;
	showModal.value = false;
};

const saveDetail = async (res) => {
	console.log(branches.value);
	await axios.put(`${baseURL}branches/edit/${res.id}`, res, config).then(() => {

		branches.value = branches.value.map((detail) => detail.id === res.id ? ({...detail, ...res}) : detail);
	})
	console.log(branches.value);
	await fetchData();
	closeModal();
};

const fetchData = async () => {
	try {
		loading.value = true;
		const response = await axios.get(`${baseURL}branches`, config);
		branches.value = response.data.branches;
		loading.value = false;
	} catch (error) {
		router.push('/');
		console.error(error);
		loading.value = false;
	}
};

const deletebranch = async (id) => {
	try {
		deletingbranch.value = id;
		await axios.delete(`${baseURL}branhches/delete/${id}`, config);
		// branches.value = branches.value.filter((branch) => branch.id !== id);
	} catch (error) {
		console.error(error);
	} finally {
		deletingbranch.value = null;
	}
};

onMounted(fetchData);
</script>

<style>
.container {
	padding: 2rem;
}

.text-primary-color {
	color: #00A859;
}
</style>
