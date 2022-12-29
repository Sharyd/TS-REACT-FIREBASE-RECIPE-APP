import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner = () => {
	return (
		<div>
			<TailSpin
				height="80"
				width="80"
				color="#f2d45c"
				ariaLabel="tail-spin-loading"
				radius="1"
				wrapperStyle={{}}
				wrapperClass=""
				visible={true}
			/>
		</div>
	);
};

export default LoadingSpinner;
