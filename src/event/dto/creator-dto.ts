import { Expose, Exclude } from 'class-transformer';

export class CreatorDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  roles: string[];

  @Expose()
  isActive: boolean;

  @Exclude() 
  password: string;
}
