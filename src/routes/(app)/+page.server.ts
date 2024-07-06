export async function load({ fetch }) {
	const response = await fetch('/api/notes');
	const notes = await response.json();

	return { notes };
}
