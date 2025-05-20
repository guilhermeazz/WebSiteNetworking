import { Skill } from './Skill';

export interface ProjectGroup {
  id: string;
  name: string;
  description: string;

  requiredSkills?: Skill[];
  members?: string[]; // opcional se quiser manter controle em memória/local
}
