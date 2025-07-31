// PageLayout.jsx
import React from 'react';

interface PageLayoutProps {
	left: React.ReactNode;
	right: React.ReactNode;
}


export const PageLayout = ({ left, right }: PageLayoutProps) => {
	return (
		<div className="container justify-center px-6 py-8">
			{/*PAGE INNER CONTAINER*/}
			<div className="flex flex-row gap-4">
				{/*LEFT SECTION*/}
				<div className="left basis-3/4 gap-2 self-start">
					{left}
				</div>
				{/*LEFT SECTION END*/}
				{/*RIGHT SECTION*/}
				<div className="right basis-1/4">
					{right}
				</div>
				{/*RIGHT SECTION END*/}
			</div>
			{/*PAGE INNER CONTAINER END*/}
		</div>
	);
};

export default PageLayout;
