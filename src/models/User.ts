import { Skill } from './Skill';
import { Interest } from './Interest';
import { FieldOfWork } from './FieldOfWork';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;

  skills?: Skill[];
  interests?: Interest[];
  fieldsOfWork?: FieldOfWork[];
}
