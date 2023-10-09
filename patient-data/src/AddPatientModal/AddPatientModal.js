import React from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const url = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

const schema = yup
  .object({
		avatar: yup.mixed().test('file', 'You need to provide a file', (value) => {
			if (value.length > 0) {  
				return true;
			}
			return false;
			}),
    name: yup.string().required(),
    website: yup.string().required().matches(url,'URL is not valid'),
		description: yup.string().required(),
		
  })
  .required();

const AddPatientModal = ( {patients, setPatients, openModal, setOpenModal} ) => {
	const {
    register,
    handleSubmit,
		clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

	useEffect(() => {
		const close = (e) => {
			if(e.key === 'Escape'){
				setOpenModal(false);
			}
		}
		window.addEventListener('keydown', close)
		return () => window.removeEventListener('keydown', close)
	},[])

  const onSubmit = (data) => {
		const createdAt = new Date().toISOString();

		const newPatient = {
			avatar: image,
			createdAt: createdAt,
			description: data.description,
			id: patients.length + 1,
			name: data.name,
			website: data.website 
		};

		setPatients([...patients, newPatient]);

		setShowSuccessMsg(true);
		setTimeout(() => {
			setOpenModal(false);
		}, '1200');
	} 

	const [showSuccessMsg, setShowSuccessMsg] = useState(false);
	const [open, setOpen] = useState(openModal);
	const [image, setImage] = useState(null);

	const closeModal = () => {
		setOpen(false);
		setOpenModal(false);
	}

	const changeImage = (event) => {
		if (event.target.files && event.target.files[0]) {
			setImage(URL.createObjectURL(event.target.files[0]));
			clearErrors('avatar');
		}
	}

  return (
		<>
			{open && (
				<>
					<div className='fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity z-10' onClick={closeModal}></div>
					<div className='sm:w-[32rem] sm:h-[43rem] p-6 bg-white sm:rounded-lg shadow-xl transition-all text-left fixed inset-0 m-auto z-20'>
						<svg
							className='h-6 w-6 ml-auto cursor-pointer'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							aria-hidden='true'
							onClick={closeModal}>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
						</svg>
						<form className='w-full max-w-lg' onSubmit={handleSubmit(onSubmit)}>
							<div className='w-full px-3 my-4'>
								<p className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
									Avatar
								</p>
								{image &&(
									<img alt='preview image' src={image} className='w-[100px] h-[100px] my-4' />
								)}
								<input
									type='file'
									name='file'
									id='file'
									accept='image/*'
									className='sr-only'
									{...register('avatar')}
									onChange={changeImage} />
								<label
									htmlFor='file'
									className='relative flex items-center justify-center rounded-md w-28 text-center'
								>
									<div>
										<span className='inline-flex rounded border border-gray-500 py-2 px-7 text-gray-800 font-medium cursor-pointer hover:bg-gray-300'>
											Browse
										</span>
									</div>
								</label>
								<p className='text-red-500 text-xs italic'>{errors.avatar?.message}</p>
							</div>
							<div className='w-full px-3 mb-4'>
								<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='name'>
									Name
								</label>
								<input
								className={`appearance-none w-full bg-gray-200 text-gray-700 border ${errors.name?.message ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
									id='name'
									type='text'
									placeholder='Name'
									onKeyDown={e => {(isNaN(Number(e.key)))}}
									{...register('name')} />
									<p className='text-red-500 text-xs italic'>{errors.name?.message}</p>
							</div>
							<div className='w-full px-3 mb-4'>
								<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='website'>
									Website
								</label>
								<input
									className={`appearance-none w-full bg-gray-200 text-gray-700 border ${errors.name?.message ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
									id='website'
									type='text'
									placeholder='Doe'
									{...register('website')} />
									<p className='text-red-500 text-xs italic'>{errors.website?.message}</p>
							</div>
							<div className='w-full px-3 mb-4'>
								<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='description'>
									Description
								</label>
								<textarea
									className={`min-h-[auto] appearance-none w-full bg-gray-200 text-gray-700 border ${errors.name?.message ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
									id='description'
									rows='2'
									placeholder='Your message'
									{...register('description')} ></textarea>
									<p className='text-red-500 text-xs italic'>{errors.description?.message}</p>
							</div>
							<div className='my-2 flex absolute right-4 bottom-4'>
								<button className='ml-auto bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded my-2' onClick={closeModal}>Cancel</button>
								<button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2 mx-4'>Save</button>
							</div>
						</form>
					</div>
					<Dialog open={showSuccessMsg} onClose={e=>setOpenModal(false)}>
						<DialogContent>
							<Alert  severity='success' sx={{ width: '100%' }}>
								The patient was created correctly!
							</Alert>
						</DialogContent>
					</Dialog>
				</>
			)}
		</>
	);
}

export default AddPatientModal;
