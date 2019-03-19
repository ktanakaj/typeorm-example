/**
 * タグエンティティクラスのモジュール。
 * @module ./entities/tag
 */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

/**
 * タグエンティティクラス。
 */
@Entity()
export class Tag {
	/** タグID */
	@PrimaryGeneratedColumn()
	id: number;

	/** タグ名 */
	@Column({ unique: true })
	@IsNotEmpty()
	tag: string;

	/** 開設日時 */
	@CreateDateColumn()
	createdAt: Date;
}