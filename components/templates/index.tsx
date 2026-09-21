import { RestaurantTemplate } from "./restaurant/RestaurantTemplate";
import { SalonTemplate } from "./salon/SalonTemplate";
import { FashionTemplate } from "./fashion/FashionTemplate";
import { MechanicTemplate } from "./mechanic/MechanicTemplate";
import { SchoolTemplate } from "./school/SchoolTemplate";
import { ConstructionTemplate } from "./construction/ConstructionTemplate";
import { RetailTemplate } from "./retail/RetailTemplate";
import { ProfessionalServicesTemplate } from "./professional-services/ProfessionalServicesTemplate";

import type { BusinessWithRelations } from "./types";

export type TemplateComponent = (props: {
  business: BusinessWithRelations;
}) => JSX.Element;

// This map is the ONLY place that connects a templateId (from the DB)
// to a React component. Every template accepts the same `business`
// prop shape (see types.ts) — that contract is what makes
// "one codebase, thousands of businesses" possible. All 8 templates
// from the plan are wired in below.
const TEMPLATE_REGISTRY: Record<string, TemplateComponent> = {
  RESTAURANT: RestaurantTemplate,
  SALON: SalonTemplate,
  FASHION: FashionTemplate,
  MECHANIC: MechanicTemplate,
  SCHOOL: SchoolTemplate,
  CONSTRUCTION: ConstructionTemplate,
  RETAIL: RetailTemplate,
  PROFESSIONAL_SERVICES: ProfessionalServicesTemplate,
};

export function getTemplate(templateId: string): TemplateComponent {
  return TEMPLATE_REGISTRY[templateId] ?? RetailTemplate; // safe fallback
}
