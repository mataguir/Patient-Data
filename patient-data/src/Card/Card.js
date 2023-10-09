import React, { useState, useEffect } from 'react';
import PatientModal from '../PatientModal/PatientModal';

const Card = ( {patient} ) => {
	const [refreshModal, setRefreshModal] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [patientInfo, setPatientInfo] = useState(patient);
	
	useEffect(() => {
		setRefreshModal(true);
 }, []);

	const moreInfoHandler = () => {
		setOpenModal(true);
	}

  return (
    <div className='m-2 p-4 border-2 border-solid border-gray-500 rounded'>
			{patientInfo !== undefined && (
			<div className='opacity-90 hover:opacity-100' key={patientInfo.id}>
				<img src={patientInfo.avatar} className='w-48 h-48 mb-4' alt='avatar' />
				<h2 className='font-bold my-2'>{patientInfo.name}</h2>
				<button
					type='button'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2 focus-visible:outline-none'
					onClick={moreInfoHandler}>
					More info
				</button><br/>
			</div>
			)}
			{openModal && (
				<PatientModal patientInfo={patientInfo} setPatientInfo={setPatientInfo} openModal={openModal} setOpenModal={setOpenModal} />
			)}
		</div>
  );
}

export default Card;
