import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  FARMER = 'farmer',
  VERIFIER = 'verifier',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.FARMER,
  })
  role: UserRole;

  @Column({ nullable: true })
  company?: string;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    try {
      if (this.password) {
        this.password = await (bcrypt as any).hash(this.password, 10);
      }
    } catch (e) {
      throw new Error('Failed to hash password');
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    try {
      if (this.password && password) {
        return await bcrypt.compare(
          password,
          this.password,
        );
      }
      return false;
    } catch (e) {
      throw new Error('Failed to validate password');
    }
  }
}
