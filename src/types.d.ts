import type { User } from 'express';

export interface IUser extends User {
	name: string,
	oid: string,
	scp: string
}