import { COLORS } from '$lib/constants';

export async function load({ fetch }) {
	const response = await fetch('/api/notes');
	const notes = await response.json();

	return { notes };
}

export const actions = {
	async create({fetch}) {
		const data = {
			content: '',
			x: Math.random() / 2,
			y: Math.random() / 2,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			isMinimized: false
		}

		// Create a new note
		await fetch('/api/notes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
	},
	async delete({fetch, request}) {
			const data = await request.formData();
			const noteId = data.get('id');

			await fetch(`/api/notes/${noteId}`, {
				method: 'DELETE'
			});
	}
};
