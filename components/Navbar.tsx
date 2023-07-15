import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineLogout } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import { GoogleLogin, googleLogout  } from '@react-oauth/google';

import useAuthStore from '../store/authStore';
import { IUser } from '../types';
import { createOrGetUser } from '../utils';
import Logo from '../utils/btc-lg-logo.png';

const Navbar = () => {
  const [user, setUser] = useState<IUser | null>();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { userProfile, addUser, removeUser } = useAuthStore();
  
  const DOMAIN_URL = 'https://legend.lnbits.com/';

  const ADMIN_URL = DOMAIN_URL + 'api/v1/';
  const ADMIN_KEY = 'eb8d3f250f0340feb18affd60baf4757';
  const ADMIN_ID_FOR_USR_MNG = '031e0e39187846c5b4253b7c71ec8ed6';

  const USR_MNG_URL = DOMAIN_URL + 'usermanager/api/v1/';
  const USR_MNG_KEY = '4dfeea8d9ecf4611ace81e5cf929a6a9';

  const LNURLP_URL = DOMAIN_URL + 'lnurlp/api/v1/links';

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if(searchValue) {
      router.push(`/search/${searchValue}`);
    }
  };

  const apiRequestGet = async (action, usr, paramKey) => {
    let key = '';
    let url = '';

    switch (usr) {
      case 1:
        key = ADMIN_KEY;
        url = ADMIN_URL;
        break;
      case 2:
        key = USR_MNG_KEY;
        url = USR_MNG_URL;
        break;
      case 3:
        key = paramKey;
        url = LNURLP_URL;
        break;
      default:
        console.log('Specify an announced kind of user')
        break;
    }

    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': key
      }
    }

    const response = await fetch(url + action, options);
    const json = await response.json();

    if (json.error) {
      console.log(json.error);
    }

    return json;
  };

  const SignIn = async (usrId) => {
    let data = await apiRequestGet('wallets', 2, '');
    let json;

    for (var i = 0; i < data.length; i++) {
        if (data[i].user == usrId) {
            json = {
                admin: data[i].admin,
                adminkey: data[i].adminkey,
                id: data[i].id,
                inkey: data[i].inkey,
                name: data[i].name,
                user: data[i].user
            }
        }
    }

    return json;
  };
  
  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
      <Link href='/'>
        <div className='w-[100px] md:w-[129px] md:h-[30px] h-[38px] mb-10'>
          <Image 
            className='cursor-pointer'
            src={Logo}
            alt='logo'
            layout='responsive'
          />
        </div>
      </Link>

      <div className='relative hidden md:block'>
        <form
          onSubmit={handleSearch}
          className='absolute md:static top-10 -left-20 bg-white'
        >
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full  md:top-0'
            placeholder='Search posts'
          />
          <button
            onClick={handleSearch}
            className='absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400'
          >
            <BiSearch />
          </button>
        </form>
      </div>
      <div>
        {user ? (
          <div className='flex gap-5 md:gap-10 cursor-pointer'>
            <Link href='/upload'>
              <button className='border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2'>
                <IoMdAdd className='text-xl' />{' '}
                <span className='hidden md:block'>Upload </span>
              </button>
            </Link>
            
          </div> 
        ) : (
          <div className='flex gap-5 md:gap-10 cursor-pointer'>
            <Link href='/login'>
              <button className='border-5 px-2 md:px-4 text-md font-semibold flex items-center gap-2'>
                <span className='hidden md:block'>Login </span>
              </button>
              </Link>
              <Link href='/signup'>
              <button className='border-5 px-2 md:px-4 text-md font-semibold flex items-center gap-2'>
                <span className='hidden md:block'>Sign up</span>
              </button>
            </Link>
          </div>  
            
        )}
      </div>
    </div>
  );
};

export default Navbar;
