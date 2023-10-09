import React from 'react';
import { useEffect, useState } from 'react';
import Card from '../Card/Card';
import AddPatientModal from '../AddPatientModal/AddPatientModal';

const CardList = () => {
	const [patients, setPatients] = useState([]);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		 fetch('https://63bedcf7f5cfc0949b634fc8.mockapi.io/users')
				.then((response) => response.json())
				.then((data) => {
					 setPatients(data);
				})
				.catch((err) => {
					 console.log(err.message);
				});
	}, []);

	const addPatient = () => {
		setOpenModal(true);
	}

  return (
		<div className='m-8'>
			<button
				type='button'
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-8 focus-visible:outline-none'
				onClick={addPatient}>
				Add Patient
			</button>
			<div className='flex flex-wrap justify-center'>
				{patients && patients.map((patient, i) => {
					return (
						<Card key={i} patient={patient} />
					);
				})}
			</div>
			{openModal && (
				<AddPatientModal patients={patients} setPatients={setPatients} openModal={openModal} setOpenModal={setOpenModal} />
			)}
		</div>
  );
}

export default CardList;
