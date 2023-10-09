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

const PatientModal = ( {patientInfo, setPatientInfo, openModal, setOpenModal} ) => {
	const {
    register,
    handleSubmit,
		clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
		defaultValues: {
			avatar: patientInfo.avatar,
			name: patientInfo.name,
			website: patientInfo.website,
			description: patientInfo.description,
		},
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

	const [image, setImage] = useState(patientInfo.avatar);
	const [open, setOpen] = useState(openModal);
	const [disableEdit, setDisableEdit] = useState(true);
	const [showSuccessMsg, setShowSuccessMsg] = useState(false);

	const closeModal = () => {
		setOpen(false);
		setOpenModal(false);
	}

	const onSubmit = (data) => {
		const createdAt = new Date().toISOString();

		setPatientInfo({...patientInfo, ...{
			avatar: image,
			createdAt: patientInfo.createdAt,
			description: data.description,
			id: patientInfo.id,
			name: data.name,
			website: data.website 
		}});

		setShowSuccessMsg(true);
		setTimeout(() => {
			setOpenModal(false);
		}, '1200');
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
						<form className='w-full max-w-lg' onSubmit={handleSubmit(onSubmit)} >
							<div className='flex'>
								<div className='px-3 my-4'>
									<p className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
										Avatar
									</p>
									<img alt='preview image' src={image} className='w-[100px] h-[100px] my-4' />
									<input
										type='file'
										name='file'
										id='file'
										accept='image/*'
										className='sr-only'
										disabled={disableEdit}
										{...register('avatar')}
										onChange={changeImage}
									/>
									<label
										htmlFor='file'
										className='relative flex items-center justify-center rounded-md w-28 text-center'
									>
										<div>
											<span className={`inline-flex rounded border border-black py-2 px-7 text-base font-medium ${!disableEdit && 'cursor-pointer hover:bg-gray-300'}`}>
												Browse
											</span>
										</div>
									</label>
									<p className='text-red-500 text-xs italic'>{errors.avatar?.message}</p>
								</div>
								<div className='mt-10 ml-12'>
									<div className='my-2 flex'>
										<p className='font-bold'>ID:</p>
										<p>{patientInfo.id}</p>
									</div>
									<div className='my-2'>
										<p className='font-bold'>Creation Date:</p>
										<p>{patientInfo.createdAt}</p>
									</div>
								</div>
							</div>
							<div className='w-full px-3 mb-4'>
								<label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='name'>
									Name
								</label>
								<input
								className={`appearance-none w-full bg-gray-200 text-gray-700 border ${errors.name?.message ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
									id='name'
									type='text'
									defaultValue={patientInfo.name}
									disabled={disableEdit}
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
									defaultValue={patientInfo.website}
									disabled={disableEdit}
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
									defaultValue={patientInfo.description}
									disabled={disableEdit}
									{...register('description')} ></textarea>
									<p className='text-red-500 text-xs italic'>{errors.description?.message}</p>
							</div>
							<div className='my-2 flex'>
								<button
									type='button'
									className={`my-2 ${disableEdit ? 'hover:bg-blue-500 hover:text-white hover:border-transparent' : 'opacity-50'} text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded ml-auto`}
									disabled={!disableEdit}
									onClick={e=>setDisableEdit(false)}>
									Edit
								</button>
								<button 
									type='submit'
									className={`bg-blue-500 ${!disableEdit ? 'hover:bg-blue-700' : 'opacity-50'} text-white font-bold py-2 px-4 rounded my-2 mx-4`}
									disabled={disableEdit}
								>
									Save
								</button>
							</div>
						</form>
					</div>
					<Dialog open={showSuccessMsg} onClose={e=>setOpenModal(false)}>
						<DialogContent>
							<Alert  severity='success' sx={{ width: '100%' }}>
								The patient was edited correctly!
							</Alert>
						</DialogContent>
					</Dialog>
				</>
			)}
		</>
	);
}

export default PatientModal;
