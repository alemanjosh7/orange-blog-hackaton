import React, { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

import useAuthStore from '../store/authStore';
import { BASE_URL } from '../utils';
import { client } from '../utils/client';
import { topics } from '../utils/constants';

const DOMAIN_URL = 'https://legend.lnbits.com/';
const ADMIN_URL = DOMAIN_URL + 'api/v1/';
const QR_CODE = ADMIN_URL + './lib/qr'

const ADMIN_KEY = 'eb8d3f250f0340feb18affd60baf4757';
const ADMIN_ID_FOR_USR_MNG = '031e0e39187846c5b4253b7c71ec8ed6';

const USR_MNG_URL = DOMAIN_URL + 'usermanager/api/v1/';
const USR_MNG_KEY = '4dfeea8d9ecf4611ace81e5cf929a6a9';

const LNURLP_URL = DOMAIN_URL + 'lnurlp/api/v1/links';

const Login = () => {
  const [privateId, setPrivateId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handlePrivateIdChange = (e) => {
    setPrivateId(e.target.value);
  };

  const handleIsRegistered = () => {
    setIsRegistered(true);
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
    }

  const handleLogin = async () => {
    let datax = await apiRequestGet('wallets', 2, '');
    for (var i = 0; i < datax.length; i++) {
      if (datax[i].user == privateId) {
        console.log(datax[i])
        setIsRegistered;
      }
    }
    console.log(isRegistered)
  }; 

  

  return (
    <div className="flex mt-10 justify-center min-h-screen">
      <div className="bg-white rounded">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to Orange Blog</h1>
        <form >
          <div className="mb-4">
            <label htmlFor="privateId" className="block text-gray-800 font-medium mb-2">
              Enter your private ID to Login:
            </label>
            <input
              type="text"
              id="privateId"
              className="w-full px-4 py-2 border border-orange-400 rounded focus:outline-none"
              value={privateId}
                          onChange={handlePrivateIdChange}
                          placeholder='User private ID'
            />
          </div>
          <button
            type="button"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-purple-white focus:outline-none focus:bg-orange-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
