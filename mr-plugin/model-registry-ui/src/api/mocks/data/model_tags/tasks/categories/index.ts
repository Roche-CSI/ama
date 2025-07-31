// splitting the data into separate files since its a lot of data
import clinical_data_analysis from './clinical-data-analysis.json';
import crispr from './crispr.json';
import genomics from './genomics.json';
import immunology from './immunology.json';
import metabolomics from './metabolomics.json';
import microbiomics from './microbiomics.json';
import pathology from './pathology.json';
import pharmacogenomics from './pharmacogenomics.json';
import proteomics from './proteomics.json';
import transcriptomics from './transcriptomics.json';
import {TaggableCategory} from "../../../../../data_types";

const ModelTaskTags: TaggableCategory[] = [
	clinical_data_analysis,
	crispr,
	genomics,
	immunology,
	metabolomics,
	microbiomics,
	pathology,
	pharmacogenomics,
	proteomics,
	transcriptomics
]

export default ModelTaskTags;



