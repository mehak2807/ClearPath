import avatarFarmer from "@/assets/avatar-farmer.jpg";
import avatarCollector from "@/assets/avatar-collector.jpg";
import avatarProcessor from "@/assets/avatar-processor.jpg";
import avatarTransit from "@/assets/avatar-transit.jpg";
import avatarCustoms from "@/assets/avatar-customs.jpg";
import avatarLab from "@/assets/avatar-lab.jpg";
import avatarRetail from "@/assets/avatar-retail.jpg";

// Maps actor IDs to their avatar image imports
const avatarMap: Record<string, string> = {
  "ACT-001": avatarFarmer,
  "ACT-002": avatarCollector,
  "ACT-003": avatarProcessor,
  "ACT-004": avatarTransit,
  "ACT-005": avatarCustoms,
  "ACT-006": avatarTransit,
  "ACT-007": avatarCustoms,
  "ACT-008": avatarLab,
  "ACT-009": avatarProcessor,
  "ACT-010": avatarTransit,
  "ACT-011": avatarTransit,
  "ACT-012": avatarRetail,
};

export default avatarMap;
