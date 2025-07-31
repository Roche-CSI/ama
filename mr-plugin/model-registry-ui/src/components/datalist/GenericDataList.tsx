/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {DataCardProps, DataGrid, RouteGenerator} from '../datagrid';
import {SortAndFilterBar} from '../sortandfilterbar';
import {SortIcon} from "../icons";

interface GenericDataListPageProps<T, F> {
	data: T[];
	dataCardComponent: React.FC<DataCardProps<T>>;
	filterBarIcon: React.ReactNode;
	filterBarLabel: string;
	onRightButtonClick: () => void;
	onFilter: (query: F) => void;
	routeGenerator: RouteGenerator;
	rightButtonLabel?: string;
	rightButtonIcon?: React.ReactNode;
}

export const GenericDataList = <T, F>({
	                                      data,
	                                      filterBarIcon,
	                                      filterBarLabel,
	                                      dataCardComponent,
	                                      routeGenerator,
	                                      onRightButtonClick,
	                                      onFilter,
	                                      rightButtonLabel,
	                                      rightButtonIcon
                                      }: GenericDataListPageProps<T, F>) => {
	
	return (
		<React.Fragment>
			{/*<SortAndFilterBar*/}
			{/*	itemIcon={filterBarIcon}*/}
			{/*	itemLabel={filterBarLabel}*/}
			{/*	itemCount={data ? data.length : 0}*/}
			{/*	onSearch={onFilter}*/}
			{/*	onRightButtonClick={onRightButtonClick}*/}
			{/*	placeholder={`Filter by name`}*/}
			{/*	rightButtonLabel={rightButtonLabel ? rightButtonLabel : "Sort: Trending"}*/}
			{/*	rightButtonIcon={rightButtonIcon ? rightButtonIcon : <SortIcon className={"size-5"}/>}*/}
			{/*/>*/}
			{/*<article className="prose mb-4">*/}
			{/*	<p className="font-light text-sm">*/}
			{/*		Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi*/}
			{/*		exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.*/}
			{/*	</p>*/}
			{/*</article>*/}
			<DataGrid<T> items={data} itemCard={dataCardComponent} routeGenerator={routeGenerator}/>
		</React.Fragment>
	);
};
