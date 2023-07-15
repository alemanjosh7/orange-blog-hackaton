import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import { BsPlay } from 'react-icons/bs';

import { Video } from './../types';

const DOMAIN_URL = 'https://legend.lnbits.com/';

const ADMIN_URL = DOMAIN_URL + 'api/v1/';
const QR_CODE = ADMIN_URL + 'qrcode/'
const ADMIN_KEY = 'eb8d3f250f0340feb18affd60baf4757';
const ADMIN_ID_FOR_USR_MNG = '031e0e39187846c5b4253b7c71ec8ed6';

const USR_MNG_URL = DOMAIN_URL + 'usermanager/api/v1/';
const USR_MNG_KEY = '4dfeea8d9ecf4611ace81e5cf929a6a9';

const LNURLP_URL = DOMAIN_URL + 'lnurlp/api/v1/links';

interface IProps {
  post: Video;
  isShowingOnHome?: boolean;
}

const IdWallet: NextPage = (value) => {
    return (
        <div>
            {value.myprop}
        </div>
    );
};

export default IdWallet;
