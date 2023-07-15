import React, { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import QRCode from 'qrcode.react';

import useAuthStore from '../store/authStore';
import { BASE_URL } from '../utils';
import { client } from '../utils/client';
import { topics } from '../utils/constants';
import IdWallet from '../components/IdWallet';
const DOMAIN_URL = 'https://legend.lnbits.com/';
const ADMIN_URL = DOMAIN_URL + 'api/v1/';
const QR_CODE = ADMIN_URL + './lib/qr'

const ADMIN_KEY = 'eb8d3f250f0340feb18affd60baf4757';
const ADMIN_ID_FOR_USR_MNG = '031e0e39187846c5b4253b7c71ec8ed6';

const USR_MNG_URL = DOMAIN_URL + 'usermanager/api/v1/';
const USR_MNG_KEY = '4dfeea8d9ecf4611ace81e5cf929a6a9';

const LNURLP_URL = DOMAIN_URL + 'lnurlp/api/v1/links';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [walletName, setWalletName] = useState('');
    const [estado, setEstado] = useState('negativo');
    const [dataUser, setDataUser] = useState('xd');
    const [Url, setUrl] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleDataUser = (valor) => {
        setDataUser(valor)
    }

    const handleUrl = (valor) => {
        setUrl(valor)
    }

    const handleWalletName = (e) => {
        setWalletName(e.target.value);
        // console.log(e.target.value)
    };

    const handleEstadoSignUpPositivo = (e) => {
        setEstado('positivo');
        // console.log(e.target.value)
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



    const apiRequestPost = async (action, usr, body, paramKey) => {
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
                key = ADMIN_KEY;
                url = USR_MNG_URL;
                break;
            case 4:
                key = paramKey;
                url = LNURLP_URL;
                break;
            default:
                console.log('Specify an announced kind of user')
                break;
        }

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': key
            },
            body: JSON.stringify(body)
        }

        const response = await fetch(url + action, options);
        const json = await response.json();

        if (json.error) {
            console.log(json.error);
        }

        return json;
    }

    const getLastUsrData = async () => {
        let data = await apiRequestGet('wallets', 2);
        let json = '';

        for (var i = 0; i < data.length; i++) {
            if (i == data.length - 1) {
                json = {
                    usr: data[i].user,
                    invKey: data[i].inkey,
                    admKey: data[i].adminkey
                }

            }
        }

        return json;
    }

    const addLnurlp = async (description, min, max, admKey) => {
        let response = await apiRequestPost('', 4, { 'description': description, 'max': max, 'min': min, 'zaps': 'false', 'comment_chars': 0 }, admKey);

        return response;
    }

    const createBody = (username, walletname, email, password) => {
        let body = {
            'admin_id': ADMIN_ID_FOR_USR_MNG,
            'user_name': username,
            'wallet_name': walletname,
            'email': email,
            'password': password
        }
        return body;
    }

    const handleLogin = async () => {
        console.log(username, walletName);
        await apiRequestPost('users', 2, createBody(username, walletName, '', ''));
        let data = await getLastUsrData();
        await apiRequestPost('extensions?extension=lnurlp&userid=' + data.usr + '&active=true', 3);
        addLnurlp('tips!', 10, 10000, data.admKey);
        handleDataUser(data.usr);
        createQrWallet('qr_wallet', data.usr)
        let datax = await apiRequestGet('wallets', 2);
        let url = '';
        for (var i = 0; i < datax.length; i++) {
            if (datax[i].user == data.usr) {
                url = DOMAIN_URL + 'wallet?usr=' + datax[i].user + '&' + 'wal=' + datax[i].id;
            }
        }
        handleUrl(url);
        console.log(url);
        return data.usr;
    };


    const setQrCode = (idElement, text) => {
        console.log("text:")
        console.log(text)
        new QRCode(idElement, text);
    }

    const createQrWallet = async (idElement, datausr) => {
        let data = await apiRequestGet('wallets', 2);
        let url = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].user == datausr) {
                url = DOMAIN_URL + 'wallet?usr=' + data[i].user + '&' + 'wal=' + data[i].id;
            }
        }
    }

    return (



        <div className="flex mt-10 justify-center min-h-screen">

            {dataUser != 'xd' ? (
                <div>
                    <h2>No pierdas esta llave, la usaras para loguearte: {dataUser}</h2>
                    <h1>Escanea este QR</h1>
                    <QRCode value={Url} />
                </div>
            ) : (
                <div className="bg-white rounded">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Want to join our community?</h1>
                    <form action="createUser" id="create-user-form">
                        <div className="mb-4">
                            <label htmlFor="privateId" className="block text-gray-800 font-medium mb-2">
                                Create new user
                            </label>
                            <input
                                type="text"
                                id="privateId"
                                className="w-full px-4 py-2 border border-orange-400 rounded focus:outline-none"
                                value={username}
                                onChange={handleUsername}
                                placeholder='Username'
                            />
                            <input
                                type="text"
                                id="privateId"
                                className="w-full px-4 mt-4 py-2 border border-orange-400 rounded focus:outline-none"
                                value={walletName}
                                onChange={handleWalletName}
                                placeholder='Wallet Name'
                            />
                        </div>
                        <button
                            type="button"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-purple-white focus:outline-none focus:bg-orange-600"
                            onClick={handleLogin}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>

            )}
            <div id='qr_wallet'></div>
        </div>
    );
};

export default SignUp;
