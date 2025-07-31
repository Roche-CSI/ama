import model_details from "./details_mock_data.json";
import actions from "./actions.json";
import files from "./files.json";
import lineage from "./lineage.json";
import model_card from "./model_card.json";
import discussions from "./discussions.json";
import governance from "./governance.json";
import experiment_tracking from "./experiment_tracking.json";
import metadata from "./metadata.json";

export const ModelDetails = {
	...model_details,
	"actions": actions,
	"files": files,
	"lineage": lineage,
	"model_card": model_card["content"],
	"discussions": discussions,
	"governance": governance,
	"experiment_tracking": experiment_tracking,
	"metadata": metadata
}
