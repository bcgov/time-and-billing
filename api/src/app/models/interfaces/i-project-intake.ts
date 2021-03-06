import { IClient } from './i-client';
import { IContact } from './i-contact';
import { IProjectSector } from './i-project-sector';
import { IProjectIntakeCategory } from './i-project-intake-category';
import { IProjectIntakeServices } from './i-project-intake-services';
import { IProjectRiskAnalysis } from './i-project-risk-analysis';
import { IntakeStatus } from '../entities/projectIntake.entity';

export interface IProjectIntake {
  id: string;
  projectName: string;
  client: IClient;
  projectSector: IProjectSector;
  projectIntakeCategory: IProjectIntakeCategory;
  projectIntakeServices: IProjectIntakeServices;
  risk: IProjectRiskAnalysis[];
  commodityCode: string;
  estimatedCompletionDate: Date;
  estimatedContractValue: number;
  mouAmount: number;
  description: string;
  status: IntakeStatus;
  contacts: IContact[];
  createdUserId: string;
  isReprocurement: boolean;
  dateOfReprocurement: Date;
  previousContractBackground: string;
  projectFailImpact: string;
  projectSuccess: string;
  otherProjectSectorName: string;
  isNonMinistry: boolean;
  intakeRiskLevel: number;
  riskScore: number;
  isSPOEngagement: boolean;
  IntakeriskScore: number;
  psbRiskScore: number;
}
