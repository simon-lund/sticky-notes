import y, { type InferType } from 'yup';
import { COLORS } from '$lib/constants';

export const Note = y.object({
	id: y.string().required(),
	content: y.string().nonNullable(),
	x: y.number().min(0).max(1).required(),
	y: y.number().min(0).max(1).required(),
	zIndex: y.number().integer().min(0).required(),
	color: y.string().oneOf(COLORS).required(),
	isMinimized: y.boolean().required()
});
export type TNote = InferType<typeof Note>;


export type EventElements<T extends HTMLElement = HTMLElement> = Event & {
	currentTarget: EventTarget & T
}