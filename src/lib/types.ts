import { type InferType, object, string, number, boolean } from 'yup';
import { COLORS } from '$lib/constants';

export const Note = object({
	id: string(),
	content: string().nonNullable(),
	x: number().required(),
	y: number().required(),
	zIndex: number().integer().min(0).required(),
	color: string().oneOf(COLORS).required(),
	isMinimized: boolean().required()
});
export type TNote = InferType<typeof Note>;


export type EventElements<T extends HTMLElement = HTMLElement> = Event & {
	target: EventTarget & T
}